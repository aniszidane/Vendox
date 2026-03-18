// VendoX Backend — stores.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StoreStatus, StoreVerificationStatus } from '@prisma/client';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  // ── Create Store ──────────────────────────────────────────────────
  async create(userId: string, dto: {
    name: string;
    description?: string;
    categoryId?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    tiktokUrl?: string;
    website?: string;
    location?: { address?: string; city?: string; wilaya?: string; latitude?: number; longitude?: number };
  }) {
    const existing = await this.prisma.store.findUnique({ where: { ownerId: userId } });
    if (existing) throw new ConflictException('You already have a store');

    const slug = this.generateSlug(dto.name);

    return this.prisma.store.create({
      data: {
        ownerId: userId,
        name: dto.name,
        slug,
        description: dto.description,
        categoryId: dto.categoryId,
        phone: dto.phone,
        whatsapp: dto.whatsapp,
        email: dto.email,
        instagramUrl: dto.instagramUrl,
        facebookUrl: dto.facebookUrl,
        tiktokUrl: dto.tiktokUrl,
        website: dto.website,
        ...(dto.location && {
          location: { create: dto.location },
        }),
      },
      include: this.storeInclude(),
    });
  }

  // ── List Stores ───────────────────────────────────────────────────
  async findAll(query: {
    page?: number;
    limit?: number;
    categoryId?: string;
    city?: string;
    wilaya?: string;
    search?: string;
    verifiedOnly?: boolean;
    featured?: boolean;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.verifiedOnly) where.verificationStatus = StoreVerificationStatus.VERIFIED;
    if (query.featured) where.isFeatured = true;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.city || query.wilaya) {
      where.location = {};
      if (query.city) where.location.city = { contains: query.city, mode: 'insensitive' };
      if (query.wilaya) where.location.wilaya = query.wilaya;
    }

    const [stores, total] = await Promise.all([
      this.prisma.store.findMany({
        where,
        include: this.storeInclude(),
        orderBy: [{ isFeatured: 'desc' }, { followerCount: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.store.count({ where }),
    ]);

    return {
      data: stores,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Get Single Store ──────────────────────────────────────────────
  async findBySlug(slug: string, userId?: string) {
    const store = await this.prisma.store.findUnique({
      where: { slug },
      include: {
        ...this.storeInclude(),
        location: true,
        ...(userId && {
          followers: { where: { userId }, select: { id: true } },
        }),
      },
    });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async findById(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: { ...this.storeInclude(), location: true },
    });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  // ── Get My Store ──────────────────────────────────────────────────
  async getMyStore(userId: string) {
    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId },
      include: { ...this.storeInclude(), location: true },
    });
    if (!store) throw new NotFoundException('You do not have a store yet');
    return store;
  }

  // ── Update Store ──────────────────────────────────────────────────
  async update(id: string, userId: string, dto: Partial<{
    name: string;
    description: string;
    categoryId: string;
    phone: string;
    whatsapp: string;
    logoUrl: string;
    coverUrl: string;
    instagramUrl: string;
    facebookUrl: string;
    tiktokUrl: string;
    website: string;
    status: StoreStatus;
  }>) {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');
    if (store.ownerId !== userId) throw new ForbiddenException('Not authorized');

    return this.prisma.store.update({
      where: { id },
      data: dto,
      include: this.storeInclude(),
    });
  }

  // ── Update Location ───────────────────────────────────────────────
  async updateLocation(storeId: string, userId: string, dto: {
    address?: string;
    city?: string;
    wilaya?: string;
    latitude?: number;
    longitude?: number;
  }) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException('Store not found');
    if (store.ownerId !== userId) throw new ForbiddenException('Not authorized');

    return this.prisma.location.upsert({
      where: { storeId },
      create: { storeId, ...dto },
      update: dto,
    });
  }

  // ── Get Store Followers ───────────────────────────────────────────
  async getFollowers(storeId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [followers, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { storeId },
        include: { user: { select: { id: true, fullName: true, avatarUrl: true, username: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.follow.count({ where: { storeId } }),
    ]);
    return { data: followers.map(f => f.user), meta: { page, limit, total } };
  }

  // ── Admin: Verify Store ───────────────────────────────────────────
  async verifyStore(id: string, status: StoreVerificationStatus, adminNotes?: string) {
    const store = await this.prisma.store.update({
      where: { id },
      data: {
        verificationStatus: status,
        verifiedAt: status === StoreVerificationStatus.VERIFIED ? new Date() : null,
      },
    });

    // Notify store owner
    if (status === StoreVerificationStatus.VERIFIED) {
      await this.prisma.notification.create({
        data: {
          userId: store.ownerId,
          type: 'STORE_VERIFIED',
          title: '🎉 Store Verified!',
          message: 'Your store has been officially verified by VendoX.',
          storeId: store.id,
        },
      });
    }

    return store;
  }

  // ── Slug helper ───────────────────────────────────────────────────
  private generateSlug(name: string): string {
    const base = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `${base}-${Date.now().toString(36)}`;
  }

  private storeInclude() {
    return {
      category: { select: { id: true, name: true, slug: true, emoji: true, color: true } },
      _count: { select: { posts: true, followers: true, reviews: true, products: true, services: true } },
    };
  }
}

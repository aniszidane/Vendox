// VendoX Backend — khasni.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KhasniStatus } from '@prisma/client';

@Injectable()
export class KhasniService {
  constructor(private prisma: PrismaService) {}

  // ── Create Request ────────────────────────────────────────────────
  async createRequest(userId: string, dto: {
    title: string;
    description?: string;
    categoryId?: string;
    imageUrl?: string;
    city?: string;
    wilaya?: string;
    budget?: number;
  }) {
    return this.prisma.khasniRequest.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        categoryId: dto.categoryId,
        imageUrl: dto.imageUrl,
        city: dto.city,
        wilaya: dto.wilaya,
        budget: dto.budget,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      include: this.requestInclude(),
    });
  }

  // ── List Requests ─────────────────────────────────────────────────
  async findAll(query: {
    page?: number;
    limit?: number;
    categoryId?: string;
    city?: string;
    wilaya?: string;
    status?: KhasniStatus;
    userId?: string; // filter by author
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };
    if (query.wilaya) where.wilaya = query.wilaya;
    if (query.status) where.status = query.status;
    if (query.userId) where.userId = query.userId;
    if (!query.status) where.status = KhasniStatus.OPEN; // Default: only open

    const [requests, total] = await Promise.all([
      this.prisma.khasniRequest.findMany({
        where,
        include: this.requestInclude(),
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.khasniRequest.count({ where }),
    ]);

    return {
      data: requests,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Get Single Request ────────────────────────────────────────────
  async findOne(id: string) {
    const request = await this.prisma.khasniRequest.findUnique({
      where: { id },
      include: {
        ...this.requestInclude(),
        responses: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                verificationStatus: true,
                phone: true,
                whatsapp: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!request) throw new NotFoundException('Khasni request not found');
    return request;
  }

  // ── Respond to Request (Store) ────────────────────────────────────
  async respond(requestId: string, storeOwnerId: string, dto: {
    message: string;
    price?: number;
    imageUrl?: string;
  }) {
    const request = await this.prisma.khasniRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Request not found');
    if (request.status !== KhasniStatus.OPEN) throw new BadRequestException('This request is no longer open');

    const store = await this.prisma.store.findUnique({ where: { ownerId: storeOwnerId } });
    if (!store) throw new ForbiddenException('You must have a store to respond');

    // Check if already responded
    const existing = await this.prisma.khasniResponse.findUnique({
      where: { requestId_storeId: { requestId, storeId: store.id } },
    });
    if (existing) throw new BadRequestException('You have already responded to this request');

    const response = await this.prisma.khasniResponse.create({
      data: {
        requestId,
        storeId: store.id,
        message: dto.message,
        price: dto.price,
        imageUrl: dto.imageUrl,
      },
      include: {
        store: { select: { id: true, name: true, slug: true, logoUrl: true } },
      },
    });

    await this.prisma.khasniRequest.update({
      where: { id: requestId },
      data: { responseCount: { increment: 1 } },
    });

    // Notify request author
    await this.prisma.notification.create({
      data: {
        userId: request.userId,
        type: 'KHASNI_RESPONSE',
        title: 'New response to your Khasni',
        message: `${store.name} responded to your request: "${request.title}"`,
        storeId: store.id,
        khasniId: requestId,
        actionUrl: `/khasni/${requestId}`,
      },
    });

    return response;
  }

  // ── Close Request ─────────────────────────────────────────────────
  async closeRequest(id: string, userId: string, fulfilled = false) {
    const request = await this.prisma.khasniRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Request not found');
    if (request.userId !== userId) throw new ForbiddenException('Not authorized');

    return this.prisma.khasniRequest.update({
      where: { id },
      data: {
        status: fulfilled ? KhasniStatus.FULFILLED : KhasniStatus.CLOSED,
        closedAt: new Date(),
      },
    });
  }

  // ── Delete Request ────────────────────────────────────────────────
  async remove(id: string, userId: string) {
    const request = await this.prisma.khasniRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Request not found');
    if (request.userId !== userId) throw new ForbiddenException('Not authorized');

    await this.prisma.khasniRequest.delete({ where: { id } });
    return { message: 'Request deleted' };
  }

  // ── Include helper ────────────────────────────────────────────────
  private requestInclude() {
    return {
      user: { select: { id: true, fullName: true, avatarUrl: true } },
      category: { select: { name: true, slug: true, emoji: true } },
    };
  }
}

// VendoX Backend — admin.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StoreVerificationStatus, ReportStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ── Dashboard Stats ───────────────────────────────────────────────
  async getStats() {
    const [
      totalUsers,
      totalStores,
      totalPosts,
      totalProducts,
      openReports,
      pendingVerifications,
      khasniRequests,
      newUsersToday,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.store.count({ where: { isActive: true } }),
      this.prisma.post.count(),
      this.prisma.product.count(),
      this.prisma.report.count({ where: { status: ReportStatus.PENDING } }),
      this.prisma.store.count({ where: { verificationStatus: StoreVerificationStatus.PENDING } }),
      this.prisma.khasniRequest.count(),
      this.prisma.user.count({
        where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
    ]);

    return {
      totalUsers,
      totalStores,
      totalPosts,
      totalProducts,
      openReports,
      pendingVerifications,
      khasniRequests,
      newUsersToday,
    };
  }

  // ── Users ──────────────────────────────────────────────────────────
  async getUsers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true, fullName: true, email: true, username: true,
          role: true, isActive: true, isBanned: true, emailVerified: true, createdAt: true,
          _count: { select: { follows: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);
    return { data: users, meta: { page, limit, total } };
  }

  async banUser(id: string, banned: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({ where: { id }, data: { isBanned: banned, isActive: !banned } });
  }

  // ── Stores ─────────────────────────────────────────────────────────
  async getPendingStores(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [stores, total] = await Promise.all([
      this.prisma.store.findMany({
        where: { verificationStatus: StoreVerificationStatus.PENDING },
        include: {
          owner: { select: { fullName: true, email: true } },
          category: { select: { name: true, emoji: true } },
          location: true,
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.store.count({ where: { verificationStatus: StoreVerificationStatus.PENDING } }),
    ]);
    return { data: stores, meta: { page, limit, total } };
  }

  async verifyStore(id: string, status: StoreVerificationStatus) {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');

    const updated = await this.prisma.store.update({
      where: { id },
      data: {
        verificationStatus: status,
        verifiedAt: status === StoreVerificationStatus.VERIFIED ? new Date() : null,
      },
    });

    if (status === StoreVerificationStatus.VERIFIED) {
      await this.prisma.notification.create({
        data: {
          userId: store.ownerId,
          type: 'STORE_VERIFIED',
          title: '🎉 Your store has been verified!',
          message: 'Congratulations! Your store is now verified on VendoX.',
          storeId: store.id,
        },
      });
    }

    return updated;
  }

  // ── Reports ────────────────────────────────────────────────────────
  async getReports(page = 1, limit = 20, status?: ReportStatus) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        include: {
          reportedBy: { select: { fullName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.report.count({ where }),
    ]);
    return { data: reports, meta: { page, limit, total } };
  }

  async resolveReport(id: string, status: ReportStatus, adminNotes?: string, reviewedById?: string) {
    return this.prisma.report.update({
      where: { id },
      data: { status, adminNotes, reviewedById, reviewedAt: new Date() },
    });
  }

  // ── Categories ─────────────────────────────────────────────────────
  async getCategories() {
    return this.prisma.storeCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async createCategory(dto: {
    name: string; slug: string; nameAr?: string; nameFr?: string;
    emoji?: string; color?: string; sortOrder?: number;
  }) {
    return this.prisma.storeCategory.create({ data: dto });
  }

  async updateCategory(id: string, dto: Partial<{ name: string; nameAr: string; nameFr: string; emoji: string; color: string; isActive: boolean; sortOrder: number }>) {
    return this.prisma.storeCategory.update({ where: { id }, data: dto });
  }

  async deleteCategory(id: string) {
    await this.prisma.storeCategory.update({ where: { id }, data: { isActive: false } });
    return { message: 'Category deactivated' };
  }
}

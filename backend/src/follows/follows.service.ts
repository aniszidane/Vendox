// VendoX Backend — follows.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}

  async follow(userId: string, storeId: string) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException('Store not found');

    const existing = await this.prisma.follow.findUnique({
      where: { userId_storeId: { userId, storeId } },
    });
    if (existing) throw new ConflictException('Already following');

    const [follow] = await this.prisma.$transaction([
      this.prisma.follow.create({ data: { userId, storeId } }),
      this.prisma.store.update({ where: { id: storeId }, data: { followerCount: { increment: 1 } } }),
    ]);

    // Notify store owner
    await this.prisma.notification.create({
      data: {
        userId: store.ownerId,
        type: 'NEW_FOLLOWER',
        title: 'New follower',
        message: 'Someone started following your store',
        actorId: userId,
        storeId,
        actionUrl: `/store/${store.slug}`,
      },
    });

    return { following: true, followerCount: store.followerCount + 1 };
  }

  async unfollow(userId: string, storeId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: { userId_storeId: { userId, storeId } },
    });
    if (!follow) throw new NotFoundException('Not following');

    await this.prisma.$transaction([
      this.prisma.follow.delete({ where: { userId_storeId: { userId, storeId } } }),
      this.prisma.store.update({ where: { id: storeId }, data: { followerCount: { decrement: 1 } } }),
    ]);

    return { following: false };
  }

  async getFollowedStores(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [follows, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { userId },
        include: {
          store: {
            include: {
              category: { select: { name: true, emoji: true, color: true } },
              location: { select: { city: true, wilaya: true } },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.follow.count({ where: { userId } }),
    ]);
    return {
      data: follows.map(f => f.store),
      meta: { page, limit, total },
    };
  }

  async isFollowing(userId: string, storeId: string): Promise<boolean> {
    const follow = await this.prisma.follow.findUnique({
      where: { userId_storeId: { userId, storeId } },
    });
    return !!follow;
  }
}

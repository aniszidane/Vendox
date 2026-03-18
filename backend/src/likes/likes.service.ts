// VendoX Backend — likes.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LikeTargetType } from '@prisma/client';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: string, targetType: LikeTargetType, targetId: string) {
    const key = this.getTargetKey(targetType);

    const existing = await this.prisma.like.findFirst({
      where: { userId, targetType, [key]: targetId },
    });

    if (existing) {
      // Unlike
      await this.prisma.like.delete({ where: { id: existing.id } });
      await this.decrementCount(targetType, targetId);
      return { liked: false };
    } else {
      // Like
      await this.prisma.like.create({
        data: { userId, targetType, [key]: targetId },
      });
      await this.incrementCount(targetType, targetId);
      return { liked: true };
    }
  }

  async isLiked(userId: string, targetType: LikeTargetType, targetId: string): Promise<boolean> {
    const key = this.getTargetKey(targetType);
    const like = await this.prisma.like.findFirst({
      where: { userId, targetType, [key]: targetId },
    });
    return !!like;
  }

  private getTargetKey(type: LikeTargetType): string {
    switch (type) {
      case LikeTargetType.POST:    return 'postId';
      case LikeTargetType.PRODUCT: return 'productId';
      case LikeTargetType.SERVICE: return 'serviceId';
      default: throw new BadRequestException('Invalid target type');
    }
  }

  private async incrementCount(type: LikeTargetType, id: string) {
    if (type === LikeTargetType.POST)    return this.prisma.post.update({ where: { id }, data: { likeCount: { increment: 1 } } });
    if (type === LikeTargetType.PRODUCT) return this.prisma.product.update({ where: { id }, data: { likeCount: { increment: 1 } } });
  }

  private async decrementCount(type: LikeTargetType, id: string) {
    if (type === LikeTargetType.POST)    return this.prisma.post.update({ where: { id }, data: { likeCount: { decrement: 1 } } });
    if (type === LikeTargetType.PRODUCT) return this.prisma.product.update({ where: { id }, data: { likeCount: { decrement: 1 } } });
  }
}

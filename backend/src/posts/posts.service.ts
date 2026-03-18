// VendoX Backend — posts.service.ts

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  // ── Create Post ───────────────────────────────────────────────────
  async create(userId: string, dto: CreatePostDto) {
    const store = await this.prisma.store.findUnique({ where: { ownerId: userId } });
    if (!store) throw new ForbiddenException('You must have a store to create posts');

    const post = await this.prisma.post.create({
      data: {
        storeId: store.id,
        caption: dto.caption,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        images: {
          create: dto.images.map((img, idx) => ({
            url: img.url,
            publicId: img.publicId,
            altText: img.altText,
            sortOrder: idx,
          })),
        },
      },
      include: this.postInclude(),
    });

    await this.prisma.store.update({
      where: { id: store.id },
      data: { postCount: { increment: 1 } },
    });

    // TODO: Notify followers
    return post;
  }

  // ── Get Feed ──────────────────────────────────────────────────────
  async getFeed(userId: string | null, page = 1, limit = 20, sortBy: 'latest' | 'trending' = 'latest') {
    const skip = (page - 1) * limit;

    let orderBy: any = { publishedAt: 'desc' };
    if (sortBy === 'trending') {
      orderBy = [{ likeCount: 'desc' }, { commentCount: 'desc' }, { publishedAt: 'desc' }];
    }

    // If logged in, show followed stores first, then others
    let storeFilter = {};
    if (userId && sortBy === 'latest') {
      const follows = await this.prisma.follow.findMany({
        where: { userId },
        select: { storeId: true },
      });
      // No filter — show all, but we could prioritize followed stores
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { status: PostStatus.PUBLISHED },
        include: this.postInclude(userId),
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
    ]);

    return {
      data: posts,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Get Trending ──────────────────────────────────────────────────
  async getTrending(period: 'today' | 'week' = 'week', categoryId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const dateFilter = period === 'today'
      ? new Date(Date.now() - 24 * 60 * 60 * 1000)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const where: any = {
      status: PostStatus.PUBLISHED,
      publishedAt: { gte: dateFilter },
    };

    if (categoryId) {
      where.store = { categoryId };
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: this.postInclude(),
        orderBy: [{ likeCount: 'desc' }, { commentCount: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data: posts,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Get Single Post ───────────────────────────────────────────────
  async findOne(id: string, userId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: this.postInclude(userId),
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  // ── Update Post ───────────────────────────────────────────────────
  async update(id: string, userId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id }, include: { store: true } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.store.ownerId !== userId) throw new ForbiddenException('Not authorized');

    return this.prisma.post.update({
      where: { id },
      data: { caption: dto.caption, status: dto.status },
      include: this.postInclude(),
    });
  }

  // ── Delete Post ───────────────────────────────────────────────────
  async remove(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id }, include: { store: true } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.store.ownerId !== userId) throw new ForbiddenException('Not authorized');

    await this.prisma.post.delete({ where: { id } });
    await this.prisma.store.update({
      where: { id: post.storeId },
      data: { postCount: { decrement: 1 } },
    });

    return { message: 'Post deleted' };
  }

  // ── Include helper ────────────────────────────────────────────────
  private postInclude(userId?: string | null) {
    return {
      images: { orderBy: { sortOrder: 'asc' as const } },
      store: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          verificationStatus: true,
          category: { select: { name: true, slug: true, emoji: true, color: true } },
        },
      },
      ...(userId && {
        likes: { where: { userId }, select: { id: true } },
        savedBy: { where: { userId }, select: { id: true } },
      }),
    };
  }
}

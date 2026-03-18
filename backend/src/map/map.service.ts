// VendoX Backend — map.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MapService {
  constructor(private prisma: PrismaService) {}

  // ── Get Stores on Map ─────────────────────────────────────────────
  async getStoresForMap(query: {
    lat?: number;
    lng?: number;
    radius?: number; // km
    categoryId?: string;
    city?: string;
    wilaya?: string;
    search?: string;
    verifiedOnly?: boolean;
  }) {
    const where: any = { isActive: true };

    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.verifiedOnly) where.verificationStatus = 'VERIFIED';

    if (query.city || query.wilaya || query.search) {
      where.location = {};
      if (query.city) where.location.city = { contains: query.city, mode: 'insensitive' };
      if (query.wilaya) where.location.wilaya = query.wilaya;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const stores = await this.prisma.store.findMany({
      where,
      include: {
        location: true,
        category: { select: { name: true, slug: true, emoji: true, color: true } },
        _count: { select: { followers: true, posts: true } },
      },
      take: 200, // Max markers for performance
    });

    // If lat/lng provided, filter by radius and sort by distance
    if (query.lat && query.lng) {
      const radius = query.radius || 10;
      return stores
        .filter((store) => {
          if (!store.location?.latitude || !store.location?.longitude) return false;
          const distance = this.haversineDistance(
            query.lat!,
            query.lng!,
            store.location.latitude,
            store.location.longitude,
          );
          return distance <= radius;
        })
        .map((store) => ({
          ...store,
          distance: store.location?.latitude
            ? this.haversineDistance(
                query.lat!,
                query.lng!,
                store.location.latitude,
                store.location.longitude,
              )
            : null,
        }))
        .sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    return stores.map((store) => ({ ...store, distance: null }));
  }

  // ── Get Nearby Stores ─────────────────────────────────────────────
  async getNearbyStores(lat: number, lng: number, radius = 5, limit = 20) {
    const stores = await this.prisma.store.findMany({
      where: { isActive: true, location: { latitude: { not: null }, longitude: { not: null } } },
      include: {
        location: true,
        category: { select: { name: true, emoji: true, color: true } },
      },
    });

    return stores
      .map((store) => ({
        ...store,
        distance: store.location?.latitude
          ? this.haversineDistance(lat, lng, store.location.latitude, store.location.longitude)
          : null,
      }))
      .filter((s) => s.distance !== null && s.distance <= radius)
      .sort((a, b) => (a.distance || 999) - (b.distance || 999))
      .slice(0, limit);
  }

  // ── Haversine Distance (km) ───────────────────────────────────────
  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number) {
    return (deg * Math.PI) / 180;
  }
}

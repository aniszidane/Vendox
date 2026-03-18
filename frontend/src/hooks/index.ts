// VendoX Frontend — hooks/index.ts

import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { feedApi, storesApi, khasniApi, socialApi, notificationsApi } from '@/lib/api';
import { toast } from 'sonner';

// ── Feed ──────────────────────────────────────────────────────────
export function useFeed(sortBy: 'latest' | 'trending' = 'latest') {
  return useInfiniteQuery({
    queryKey: ['feed', sortBy],
    queryFn: ({ pageParam = 1 }) => feedApi.getFeed({ page: pageParam as number, sortBy }),
    getNextPageParam: (last: any) =>
      last?.data?.meta?.page < last?.data?.meta?.totalPages ? last?.data?.meta?.page + 1 : undefined,
    initialPageParam: 1,
  });
}

export function useTrending(period: 'today' | 'week' = 'week', categoryId?: string) {
  return useQuery({
    queryKey: ['trending', period, categoryId],
    queryFn: () => feedApi.getTrending({ period, categoryId }),
  });
}

// ── Stores ────────────────────────────────────────────────────────
export function useStore(slug: string) {
  return useQuery({
    queryKey: ['store', slug],
    queryFn: () => storesApi.getStore(slug),
    enabled: !!slug,
  });
}

export function useMapStores(params: { lat?: number; lng?: number; radius?: number; categoryId?: string }) {
  return useQuery({
    queryKey: ['map-stores', params],
    queryFn: () => storesApi.getMapStores(params),
    enabled: !!(params.lat && params.lng),
    staleTime: 30 * 1000,
  });
}

// ── Khasni ────────────────────────────────────────────────────────
export function useKhasniRequests(params?: { status?: string; categoryId?: string; page?: number }) {
  return useQuery({
    queryKey: ['khasni-requests', params],
    queryFn: () => khasniApi.getRequests(params),
  });
}

export function useKhasniRequest(id: string) {
  return useQuery({
    queryKey: ['khasni-request', id],
    queryFn: () => khasniApi.getRequest(id),
    enabled: !!id,
  });
}

export function useCreateKhasniRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: khasniApi.createRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['khasni-requests'] });
      toast.success('Khasni request posted! 🎉');
    },
    onError: (err: any) => toast.error(err?.message || 'Failed to create request'),
  });
}

// ── Social ────────────────────────────────────────────────────────
export function useToggleLike(targetType: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (targetId: string) => socialApi.toggleLike(targetType, targetId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feed'] }),
  });
}

export function useFollowStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (storeId: string) => socialApi.followStore(storeId),
    onSuccess: (_, storeId) => {
      qc.invalidateQueries({ queryKey: ['store'] });
      toast.success('Following!');
    },
  });
}

export function useUnfollowStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (storeId: string) => socialApi.unfollow(storeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['store'] });
      toast.success('Unfollowed');
    },
  });
}

// ── Notifications ─────────────────────────────────────────────────
export function useNotifications(page = 1) {
  return useQuery({
    queryKey: ['notifications', page],
    queryFn: () => notificationsApi.getAll(page),
    refetchInterval: 30 * 1000, // poll every 30s
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['unread-count'],
    queryFn: () => notificationsApi.unreadCount(),
    refetchInterval: 15 * 1000,
  });
}

// ── Utility ───────────────────────────────────────────────────────
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

import { useState, useEffect } from 'react';

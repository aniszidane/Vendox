// VendoX Frontend — app/trending/page.tsx
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PostCard } from '@/components/feed/PostCard';
import { PostCardSkeleton } from '@/components/feed/PostCardSkeleton';
import { Flame, Calendar, MapPin } from 'lucide-react';

const PERIODS = [
  { key: 'today', label: 'Today', icon: Flame },
  { key: 'week', label: 'This Week', icon: Calendar },
  { key: 'nearby', label: 'Nearby', icon: MapPin },
];

const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'food-drink', label: '🍔 Food' },
  { id: 'fashion', label: '👗 Fashion' },
  { id: 'electronics', label: '📱 Tech' },
  { id: 'beauty-health', label: '💄 Beauty' },
];

const TRENDING_POSTS = [
  {
    id: 't1', caption: '✨ Nouvelle collection Ramadan 2025! Des abaya et robes magnifiques! 🌙 On stock maintenant.',
    likeCount: 891, commentCount: 123, saveCount: 456,
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString(),
    images: [{ url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600' }],
    store: { id: 's2', name: 'Amira Fashion', slug: 'amira-fashion-bab-ezzouar', logoUrl: null, verificationStatus: 'VERIFIED', category: { name: 'Fashion', emoji: '👗', color: '#E91E8C' } },
  },
  {
    id: 't2', caption: '📱 iPhone 15 Pro Max disponible en stock! Toutes les couleurs. Prix compétitifs.',
    likeCount: 567, commentCount: 89, saveCount: 234,
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString(),
    images: [{ url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600' }],
    store: { id: 's3', name: 'TechWorld', slug: 'tech-world-oran', logoUrl: null, verificationStatus: 'VERIFIED', category: { name: 'Electronics', emoji: '📱', color: '#0D47A1' } },
  },
  {
    id: 't3', caption: '🔥 Nouveau menu été! Kebab Spécial sauce harissa maison. 350 DZD seulement!',
    likeCount: 234, commentCount: 45, saveCount: 67,
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString(),
    images: [{ url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600' }],
    store: { id: 's1', name: 'Kebab King', slug: 'kebab-king-alger', logoUrl: null, verificationStatus: 'VERIFIED', category: { name: 'Food & Drink', emoji: '🍔', color: '#FF6B35' } },
  },
];

export default function TrendingPage() {
  const [period, setPeriod] = useState('week');
  const [category, setCategory] = useState('');
  const [isLoading] = useState(false);

  return (
    <AppLayout title="Trending">
      {/* Hero */}
      <div className="px-4 pt-4 pb-3">
        <div className="bg-gradient-to-r from-rose-500 to-orange-400 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Flame className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h2 className="font-outfit font-bold text-white text-base">What's Hot in Your City</h2>
            <p className="text-white/80 text-xs mt-0.5">Top posts by engagement</p>
          </div>
        </div>
      </div>

      {/* Period filter */}
      <div className="px-4 mb-3">
        <div className="flex gap-2">
          {PERIODS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                period === key
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
              category === cat.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="px-3 pb-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
        ) : (
          <>
            {/* Rank labels */}
            {TRENDING_POSTS.map((post, i) => (
              <div key={post.id} className="relative animate-fade-in-up" style={{ animationDelay: `${i * 0.07}s` }}>
                {/* Rank badge */}
                <div className={`absolute -left-1 top-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md ${
                  i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : 'bg-orange-400'
                }`}>
                  #{i + 1}
                </div>
                <div className="ml-3">
                  <PostCard post={post as any} />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </AppLayout>
  );
}

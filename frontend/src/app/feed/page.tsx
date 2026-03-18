// VendoX Frontend — app/feed/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PostCard } from '@/components/feed/PostCard';
import { PostCardSkeleton } from '@/components/feed/PostCardSkeleton';
import { Flame, Clock, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { id: '', label: 'All', emoji: '✨' },
  { id: 'food-drink', label: 'Food', emoji: '🍔' },
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'electronics', label: 'Tech', emoji: '📱' },
  { id: 'beauty-health', label: 'Beauty', emoji: '💄' },
  { id: 'home-decor', label: 'Home', emoji: '🏡' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
];

// Mock data for demo
const MOCK_POSTS = [
  {
    id: '1',
    caption: '🔥 Nouveau menu été! Notre Kebab Spécial avec sauce harissa maison et légumes frais. Prix spécial: 350 DZD seulement aujourd\'hui! 🌶️',
    likeCount: 234, commentCount: 45, saveCount: 67,
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    images: [{ url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600' }],
    store: { id: 's1', name: 'Kebab King', slug: 'kebab-king-alger', logoUrl: null, verificationStatus: 'VERIFIED', category: { name: 'Food & Drink', emoji: '🍔', color: '#FF6B35' } },
  },
  {
    id: '2',
    caption: '✨ Nouvelle collection Ramadan 2025! Des abaya et robes de soirée magnifiques pour toutes les occasions. En stock maintenant! 🌙',
    likeCount: 891, commentCount: 123, saveCount: 456,
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    images: [
      { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600' },
      { url: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600' },
    ],
    store: { id: 's2', name: 'Amira Fashion', slug: 'amira-fashion-bab-ezzouar', logoUrl: null, verificationStatus: 'VERIFIED', category: { name: 'Fashion', emoji: '👗', color: '#E91E8C' } },
  },
  {
    id: '3',
    caption: '📱 iPhone 15 Pro Max disponible en stock! Toutes les couleurs. Prix compétitifs et garantie officielle. DM pour infos!',
    likeCount: 567, commentCount: 89, saveCount: 234,
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    images: [{ url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600' }],
    store: { id: 's3', name: 'TechWorld', slug: 'tech-world-oran', logoUrl: null, verificationStatus: 'VERIFIED', category: { name: 'Electronics', emoji: '📱', color: '#0D47A1' } },
  },
  {
    id: '4',
    caption: '🎉 Spécial vendredi! Commandez 2 kebabs et obtenez une boisson gratuite. Valable aujourd\'hui de 12h à 15h seulement.',
    likeCount: 156, commentCount: 23, saveCount: 34,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    images: [{ url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600' }],
    store: { id: 's1', name: 'Kebab King', slug: 'kebab-king-alger', logoUrl: null, verificationStatus: 'VERIFIED', category: { name: 'Food & Drink', emoji: '🍔', color: '#FF6B35' } },
  },
];

export default function FeedPage() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'trending'>('latest');
  const [activeCategory, setActiveCategory] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver>();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1200);
  }, []);

  const handleLike = async (postId: string) => {
    // API call here
  };

  const handleSave = async (postId: string) => {
    // API call here
  };

  return (
    <AppLayout>
      {/* Category Filter - horizontal scroll */}
      <div className="sticky top-[60px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 px-4 pb-3">
          {[
            { key: 'latest' as const, icon: Clock, label: 'Latest' },
            { key: 'trending' as const, icon: Flame, label: 'Trending' },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sortBy === key
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stories/Quick highlights */}
      <div className="px-4 py-3 flex gap-3 overflow-x-auto scrollbar-hide">
        {[
          { name: 'Kebab King', color: 'from-orange-400 to-amber-300', emoji: '🍔' },
          { name: 'Amira Fashion', color: 'from-pink-400 to-rose-300', emoji: '👗' },
          { name: 'TechWorld', color: 'from-blue-400 to-indigo-300', emoji: '📱' },
          { name: 'BioVerde', color: 'from-green-400 to-emerald-300', emoji: '🥗' },
          { name: 'SportZone', color: 'from-purple-400 to-violet-300', emoji: '⚽' },
        ].map((store) => (
          <div key={store.name} className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${store.color} flex items-center justify-center text-xl ring-2 ring-teal-500 ring-offset-2`}>
              {store.emoji}
            </div>
            <span className="text-[10px] text-slate-500 font-medium max-w-[56px] text-center truncate">{store.name}</span>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div className="px-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <div className="text-5xl mb-4">🏪</div>
            <h3 className="font-outfit font-bold text-slate-900 text-lg mb-2">No posts yet</h3>
            <p className="text-slate-500 text-sm">Follow some stores to see their posts here.</p>
          </div>
        ) : (
          <>
            {posts.map((post, i) => (
              <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <PostCard
                  post={post as any}
                  onLike={handleLike}
                  onSave={handleSave}
                />
              </div>
            ))}

            {isFetching && <PostCardSkeleton />}

            {!hasMore && (
              <div className="text-center py-8 text-sm text-slate-400">
                You're all caught up! 🎉
              </div>
            )}

            <div ref={sentinelRef} className="h-4" />
          </>
        )}
      </div>
    </AppLayout>
  );
}

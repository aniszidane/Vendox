// VendoX Frontend — app/store/[slug]/page.tsx
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PostCard } from '@/components/feed/PostCard';
import { BadgeCheck, MapPin, Phone, Instagram, Facebook, Star, Heart, Package, Wrench, Share2, Flag, ChevronRight } from 'lucide-react';

// Mock store data
const MOCK_STORE = {
  id: 's2',
  name: 'Amira Fashion',
  slug: 'amira-fashion-bab-ezzouar',
  description: 'Trendy fashion boutique. Latest collections from European and local designers. Hijab fashion specialists. Shop now!',
  logoUrl: null,
  coverUrl: null,
  verificationStatus: 'VERIFIED',
  status: 'OPEN',
  followerCount: 3200,
  postCount: 89,
  reviewCount: 215,
  averageRating: 4.9,
  phone: '+213 555 234 567',
  instagramUrl: 'https://instagram.com/amira_fashion_dz',
  facebookUrl: 'https://facebook.com/amirafashiondz',
  category: { name: 'Fashion', emoji: '👗', color: '#E91E8C' },
  location: { city: 'Bab Ezzouar', wilaya: 'Alger', address: 'Centre Commercial Bab Ezzouar' },
};

const MOCK_POSTS = [
  {
    id: '2', caption: '✨ Nouvelle collection Ramadan 2025!', likeCount: 891, commentCount: 123, saveCount: 456,
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString(),
    images: [{ url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600' }],
    store: MOCK_STORE,
  },
];

const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Abaya Premium - Collection 2025', price: 8500, imageUrl: 'https://images.unsplash.com/photo-1549140600-78c9b8275e9d?w=400', likeCount: 456, status: 'AVAILABLE' },
  { id: 'p2', name: 'Robe Soirée Orientale', price: 12000, imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400', likeCount: 234, status: 'AVAILABLE' },
  { id: 'p3', name: 'Hijab Soie Premium', price: 1500, imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400', likeCount: 189, status: 'AVAILABLE' },
];

export default function StoreProfilePage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState<'posts' | 'products' | 'services'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(MOCK_STORE.followerCount);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowerCount(f => isFollowing ? f - 1 : f + 1);
  };

  return (
    <AppLayout showBackButton showTopBar title="" rightAction={
      <div className="flex gap-2">
        <button className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
          <Share2 className="w-4 h-4 text-slate-600" />
        </button>
        <button className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
          <Flag className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    }>
      {/* Cover */}
      <div className="h-44 bg-gradient-to-br from-pink-400 to-rose-500 relative">
        {MOCK_STORE.coverUrl && <img src={MOCK_STORE.coverUrl} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Profile header */}
      <div className="px-4 pb-0 -mt-10 relative">
        <div className="flex items-end gap-4 mb-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center text-4xl border-4 border-white relative">
            {MOCK_STORE.logoUrl ? <img src={MOCK_STORE.logoUrl} className="w-full h-full rounded-2xl object-cover" /> : MOCK_STORE.category.emoji}
            {MOCK_STORE.verificationStatus === 'VERIFIED' && (
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center">
                <BadgeCheck className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>

          <div className="flex gap-2 ml-auto pb-1">
            <button onClick={handleFollow}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 ${
                isFollowing ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'vendox-btn-primary'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            {MOCK_STORE.phone && (
              <a href={`tel:${MOCK_STORE.phone}`} className="vendox-btn-outline px-4 py-2.5 rounded-full text-sm">
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-outfit font-bold text-xl text-slate-900">{MOCK_STORE.name}</h1>
            {MOCK_STORE.verificationStatus === 'VERIFIED' && (
              <BadgeCheck className="w-5 h-5 text-teal-500 fill-teal-50" />
            )}
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border"
              style={{ background: `${MOCK_STORE.category.color}15`, color: MOCK_STORE.category.color, borderColor: `${MOCK_STORE.category.color}30` }}
            >
              {MOCK_STORE.category.emoji} {MOCK_STORE.category.name}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              MOCK_STORE.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {MOCK_STORE.status === 'OPEN' ? '🟢 Open Now' : '🔴 Closed'}
            </span>
            {MOCK_STORE.location && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="w-3 h-3" />
                {MOCK_STORE.location.city}, {MOCK_STORE.location.wilaya}
              </span>
            )}
          </div>

          {MOCK_STORE.description && (
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{MOCK_STORE.description}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 py-4 border-y border-slate-100">
          {[
            { value: followerCount.toLocaleString(), label: 'Followers' },
            { value: MOCK_STORE.postCount.toString(), label: 'Posts' },
            { value: `${MOCK_STORE.averageRating} ⭐`, label: 'Rating' },
            { value: MOCK_STORE.reviewCount.toString(), label: 'Reviews' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="font-outfit font-bold text-slate-900 text-base">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Social links */}
        <div className="flex items-center gap-3 py-3 border-b border-slate-100">
          {MOCK_STORE.phone && (
            <a href={`tel:${MOCK_STORE.phone}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 transition-colors">
              <Phone className="w-3.5 h-3.5" /> {MOCK_STORE.phone}
            </a>
          )}
          {MOCK_STORE.instagramUrl && (
            <a href={MOCK_STORE.instagramUrl} target="_blank" rel="noreferrer" className="text-pink-500 hover:text-pink-600">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {MOCK_STORE.facebookUrl && (
            <a href={MOCK_STORE.facebookUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700">
              <Facebook className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 pt-3 pb-0">
          {[
            { key: 'posts' as const, icon: Heart, label: 'Posts', count: MOCK_STORE.postCount },
            { key: 'products' as const, icon: Package, label: 'Products', count: MOCK_PRODUCTS.length },
            { key: 'services' as const, icon: Wrench, label: 'Services', count: 3 },
          ].map(({ key, icon: Icon, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === key ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label} <span className="text-slate-400 font-normal">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-3 pt-3 pb-6">
        {activeTab === 'posts' && (
          MOCK_POSTS.map(post => <PostCard key={post.id} post={post as any} />)
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-2 gap-3">
            {MOCK_PRODUCTS.map(product => (
              <div key={product.id} className="vendox-card overflow-hidden">
                <div className="aspect-square overflow-hidden bg-slate-100">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight">{product.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-outfit font-bold text-teal-700 text-sm">
                      {product.price.toLocaleString()} DZD
                    </span>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Heart className="w-3 h-3" />
                      {product.likeCount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-3">
            {[
              { name: 'Custom Dress Design', price: '15,000 - 40,000', icon: '✂️' },
              { name: 'Hijab Styling Session', price: '2,000 - 5,000', icon: '🧣' },
              { name: 'Wedding Outfit Consultation', price: '3,000', icon: '💍' },
            ].map((service) => (
              <div key={service.name} className="vendox-card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-2xl flex-shrink-0">{service.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-slate-900">{service.name}</h3>
                  <p className="text-xs text-teal-600 font-medium mt-0.5">{service.price} DZD</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

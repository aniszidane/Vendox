// VendoX Frontend — app/map/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { AppLayout } from '@/components/layout/AppLayout';
import { Search, SlidersHorizontal, MapPin, X, BadgeCheck, Star } from 'lucide-react';

// Dynamic import for SSR safety
const MapComponent = dynamic(() => import('@/components/map/MapView'), { ssr: false, loading: () => <MapFallback /> });

function MapFallback() {
  return (
    <div className="flex-1 bg-slate-200 animate-pulse flex items-center justify-center">
      <MapPin className="w-8 h-8 text-slate-400" />
    </div>
  );
}

const MOCK_STORES = [
  { id: 's1', name: 'Kebab King', slug: 'kebab-king-alger', lat: 36.7538, lng: 3.0588, category: { name: 'Food', emoji: '🍔', color: '#FF6B35' }, verificationStatus: 'VERIFIED', averageRating: 4.7, status: 'OPEN', followerCount: 1240 },
  { id: 's2', name: 'Amira Fashion', slug: 'amira-fashion-bab-ezzouar', lat: 36.731, lng: 3.183, category: { name: 'Fashion', emoji: '👗', color: '#E91E8C' }, verificationStatus: 'VERIFIED', averageRating: 4.9, status: 'OPEN', followerCount: 3200 },
  { id: 's3', name: 'TechWorld', slug: 'tech-world-oran', lat: 35.6971, lng: -0.6308, category: { name: 'Electronics', emoji: '📱', color: '#0D47A1' }, verificationStatus: 'VERIFIED', averageRating: 4.5, status: 'OPEN', followerCount: 5800 },
];

const CATEGORIES = [
  { id: '', label: 'All', emoji: '✨' },
  { id: 'food-drink', label: 'Food', emoji: '🍔' },
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'electronics', label: 'Tech', emoji: '📱' },
  { id: 'beauty-health', label: 'Beauty', emoji: '💄' },
];

export default function MapPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => setUserLocation([36.7538, 3.0588]), // Default: Algiers
      );
    }
  }, []);

  return (
    <AppLayout title="Discover" showTopBar={false}>
      <div className="h-screen flex flex-col pt-0 pb-[56px]">
        {/* Floating Top Controls */}
        <div className="absolute top-4 left-4 right-4 z-[1000] space-y-2" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search stores, areas..."
                className="w-full pl-10 pr-4 py-3 bg-white/95 backdrop-blur-md rounded-2xl text-sm shadow-lg shadow-black/10 border border-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center transition-all ${showFilters ? 'bg-teal-600 text-white' : 'bg-white/95 backdrop-blur-md text-slate-600'}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold shadow-md transition-all ${
                  activeCategory === cat.id
                    ? 'bg-teal-600 text-white shadow-teal-200'
                    : 'bg-white/95 backdrop-blur-md text-slate-600'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {userLocation && (
            <MapComponent
              center={userLocation}
              stores={MOCK_STORES}
              onStoreSelect={setSelectedStore}
            />
          )}
        </div>

        {/* Store Preview Sheet */}
        {selectedStore && (
          <div className="absolute bottom-[56px] left-0 right-0 z-[1000] animate-slide-up">
            <div className="mx-4 mb-4 vendox-card p-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {selectedStore.category?.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-outfit font-bold text-slate-900 truncate">{selectedStore.name}</h3>
                    {selectedStore.verificationStatus === 'VERIFIED' && (
                      <BadgeCheck className="w-4 h-4 text-teal-500 fill-teal-50 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-slate-700">{selectedStore.averageRating}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      selectedStore.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedStore.status}
                    </span>
                    <span className="text-xs text-slate-400">{selectedStore.followerCount?.toLocaleString()} followers</span>
                  </div>
                </div>
                <button onClick={() => setSelectedStore(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="flex gap-3 mt-4">
                <a href={`/store/${selectedStore.slug}`} className="vendox-btn-primary flex-1 py-2.5 text-sm">
                  View Store
                </a>
                <button className="vendox-btn-outline flex-1 py-2.5 text-sm">
                  Follow
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats bubble */}
        <div className="absolute bottom-[72px] right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg px-4 py-2.5 z-[999]">
          <div className="text-xs text-slate-500 font-medium">{MOCK_STORES.length} stores nearby</div>
        </div>
      </div>
    </AppLayout>
  );
}

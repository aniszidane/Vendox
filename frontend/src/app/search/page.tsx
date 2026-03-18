// VendoX Frontend — app/search/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import Link from 'next/link';
import { Search, X, Store, Package, Wrench, TrendingUp, BadgeCheck } from 'lucide-react';

const RECENT_SEARCHES = ['Kebab', 'iPhone', 'Fashion Algiers', 'Plombier'];
const TRENDING_SEARCHES = ['Nike shoes', 'Abaya', 'iPhone 15', 'Pizza delivery', 'Gym Oran'];

const MOCK_RESULTS = {
  stores: [
    { id: 's1', name: 'Kebab King', slug: 'kebab-king-alger', category: { name: 'Food', emoji: '🍔' }, verificationStatus: 'VERIFIED', followerCount: 1240, city: 'Alger' },
    { id: 's2', name: 'Amira Fashion', slug: 'amira-fashion', category: { name: 'Fashion', emoji: '👗' }, verificationStatus: 'VERIFIED', followerCount: 3200, city: 'Bab Ezzouar' },
    { id: 's3', name: 'TechWorld', slug: 'tech-world-oran', category: { name: 'Electronics', emoji: '📱' }, verificationStatus: 'VERIFIED', followerCount: 5800, city: 'Oran' },
  ],
  products: [
    { id: 'p1', name: 'iPhone 15 Pro Max', price: 245000, store: 'TechWorld', imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200' },
    { id: 'p2', name: 'Abaya Premium 2025', price: 8500, store: 'Amira Fashion', imageUrl: 'https://images.unsplash.com/photo-1549140600-78c9b8275e9d?w=200' },
  ],
};

type FilterType = 'all' | 'stores' | 'products' | 'services';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [results, setResults] = useState<typeof MOCK_RESULTS | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults(null); return; }
    setIsSearching(true);
    const timer = setTimeout(() => {
      setResults(MOCK_RESULTS);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const filterTabs: { key: FilterType; icon: any; label: string }[] = [
    { key: 'all', icon: Search, label: 'All' },
    { key: 'stores', icon: Store, label: 'Stores' },
    { key: 'products', icon: Package, label: 'Products' },
    { key: 'services', icon: Wrench, label: 'Services' },
  ];

  return (
    <AppLayout showTopBar={false}>
      <div className="px-4 pt-14 pb-4" style={{ paddingTop: `calc(56px + env(safe-area-inset-top, 0px))` }}>
        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search stores, products, services..."
            className="w-full pl-12 pr-12 py-3.5 bg-white rounded-2xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 shadow-sm"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
              <X className="w-3.5 h-3.5 text-slate-500" />
            </button>
          )}
        </div>

        {/* Filter tabs */}
        {results && (
          <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
            {filterTabs.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                  filter === key ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Empty state / suggestions */}
        {!query && (
          <div className="space-y-6">
            {/* Recent */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {RECENT_SEARCHES.map(s => (
                  <button key={s} onClick={() => setQuery(s)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-full text-sm text-slate-600 border border-slate-200 hover:border-teal-400 hover:text-teal-600 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Trending Now</h3>
              <div className="space-y-1">
                {TRENDING_SEARCHES.map((s, i) => (
                  <button key={s} onClick={() => setQuery(s)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white transition-colors text-left group">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="flex-1 text-sm text-slate-700 group-hover:text-teal-700 transition-colors">{s}</span>
                    <span className="text-xs text-slate-300">#{i + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isSearching && (
          <div className="space-y-3 mt-2">
            {[1,2,3].map(i => (
              <div key={i} className="flex gap-3 p-3 bg-white rounded-2xl animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {results && !isSearching && (
          <div className="space-y-6">
            {/* Stores */}
            {(filter === 'all' || filter === 'stores') && results.stores.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Stores</h3>
                <div className="space-y-2">
                  {results.stores.map(store => (
                    <Link key={store.id} href={`/store/${store.slug}`}
                      className="flex items-center gap-3 p-3 bg-white rounded-2xl hover:shadow-md transition-all active:scale-[0.99]">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center text-xl flex-shrink-0">
                        {store.category.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-slate-900">{store.name}</span>
                          {store.verificationStatus === 'VERIFIED' && <BadgeCheck className="w-3.5 h-3.5 text-teal-500 fill-teal-50" />}
                        </div>
                        <span className="text-xs text-slate-400">{store.category.name} · {store.city} · {store.followerCount.toLocaleString()} followers</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {(filter === 'all' || filter === 'products') && results.products.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Products</h3>
                <div className="grid grid-cols-2 gap-3">
                  {results.products.map(product => (
                    <div key={product.id} className="vendox-card overflow-hidden">
                      <div className="aspect-square bg-slate-100 overflow-hidden">
                        <img src={product.imageUrl} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-2">{product.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{product.store}</p>
                        <p className="font-outfit font-bold text-teal-700 text-sm mt-1">{product.price.toLocaleString()} DZD</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty results */}
            {results.stores.length === 0 && results.products.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-outfit font-bold text-slate-900 mb-1">No results found</h3>
                <p className="text-slate-500 text-sm">Try a different search or browse categories</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// VendoX Frontend — app/khasni/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Plus, Zap, MessageCircle, Clock, CheckCircle2, ChevronRight, Search, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const MOCK_REQUESTS = [
  {
    id: 'k1',
    title: 'Looking for iPhone 14 reconditioned',
    description: 'Looking for a refurbished iPhone 14 128GB in good condition. Max budget 120,000 DZD. Algiers preferred.',
    budget: 120000,
    city: 'Algiers',
    status: 'OPEN',
    responseCount: 3,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: { name: 'Electronics', emoji: '📱' },
    user: { fullName: 'Anis B.', avatarUrl: null },
  },
  {
    id: 'k2',
    title: 'Looking for wedding dress size 38',
    description: 'White or ivory wedding dress, size 38, modern style. Budget 15,000-25,000 DZD.',
    budget: 25000,
    city: 'Algiers',
    status: 'OPEN',
    responseCount: 2,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    category: { name: 'Fashion', emoji: '👗' },
    user: { fullName: 'Sarah M.', avatarUrl: null },
  },
  {
    id: 'k3',
    title: 'Catering for 50 people',
    description: 'Need catering for family event, 50 guests. Traditional Algerian cuisine preferred.',
    budget: 50000,
    city: 'Oran',
    status: 'FULFILLED',
    responseCount: 5,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: { name: 'Food', emoji: '🍔' },
    user: { fullName: 'Karim T.', avatarUrl: null },
  },
  {
    id: 'k4',
    title: 'Looking for Nike Air Max size 42',
    description: 'Any color. Authentic only. Can go up to 18,000 DZD.',
    budget: 18000,
    city: 'Algiers',
    status: 'OPEN',
    responseCount: 1,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    category: { name: 'Sports', emoji: '⚽' },
    user: { fullName: 'Omar K.', avatarUrl: null },
  },
];

const STATUS_CONFIG = {
  OPEN:      { color: 'bg-green-100 text-green-700 border-green-200',   icon: Clock,       label: 'Open' },
  CLOSED:    { color: 'bg-slate-100 text-slate-600 border-slate-200',   icon: CheckCircle2, label: 'Closed' },
  FULFILLED: { color: 'bg-teal-100 text-teal-700 border-teal-200',      icon: CheckCircle2, label: 'Fulfilled' },
};

export default function KhasniPage() {
  const [filter, setFilter] = useState<'all' | 'open' | 'mine'>('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_REQUESTS.filter(r => {
    if (filter === 'open') return r.status === 'OPEN';
    if (search) return r.title.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  return (
    <AppLayout title="Khasni">
      {/* Hero banner */}
      <div className="mx-4 mt-4 mb-5 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-500 p-5 overflow-hidden relative">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -right-2 -bottom-8 w-24 h-24 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            <span className="font-outfit font-bold text-white text-lg">Khasni</span>
            <span className="text-teal-200 text-sm">/ "I Need"</span>
          </div>
          <p className="text-teal-100 text-sm mb-4 leading-relaxed">
            Can't find what you're looking for? Post a request and let local stores come to you.
          </p>
          <Link href="/khasni/create" className="inline-flex items-center gap-2 bg-white text-teal-700 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-teal-700/20 hover:bg-teal-50 transition-colors active:scale-95">
            <Plus className="w-4 h-4" />
            Post a Request
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-4 relative">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search requests..."
          className="vendox-input pl-10"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 mb-4">
        {[
          { key: 'all' as const, label: 'All' },
          { key: 'open' as const, label: '🟢 Open' },
          { key: 'mine' as const, label: 'My Requests' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              filter === key ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Requests */}
      <div className="px-4 space-y-3 pb-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-outfit font-bold text-slate-900 text-lg mb-2">No requests found</h3>
            <p className="text-slate-500 text-sm mb-6">Be the first to post a Khasni request!</p>
            <Link href="/khasni/create" className="vendox-btn-primary px-8">Post Request</Link>
          </div>
        ) : (
          filtered.map((req, i) => {
            const StatusIcon = STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG]?.icon || Clock;
            const statusConfig = STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG];
            return (
              <Link key={req.id} href={`/khasni/${req.id}`}
                className="vendox-card p-4 block animate-fade-in-up active:scale-[0.99] transition-transform"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-base flex-shrink-0">
                    {req.category.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm text-slate-900 leading-snug">{req.title}</h3>
                      <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                    </div>
                    {req.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{req.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      {/* Status */}
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusConfig.color}`}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {statusConfig.label}
                      </span>

                      {/* Responses */}
                      {req.responseCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                          <MessageCircle className="w-2.5 h-2.5" />
                          {req.responseCount} {req.responseCount === 1 ? 'response' : 'responses'}
                        </span>
                      )}

                      {/* Budget */}
                      {req.budget && (
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                          💰 {req.budget.toLocaleString()} DZD
                        </span>
                      )}

                      {/* City */}
                      {req.city && (
                        <span className="text-[10px] text-slate-400">📍 {req.city}</span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center text-[8px] text-white font-bold">
                      {req.user.fullName[0]}
                    </div>
                    <span className="text-xs text-slate-400">{req.user.fullName}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* FAB */}
      <Link href="/khasni/create"
        className="fixed bottom-[76px] right-4 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-teal-300 active:scale-95 transition-transform z-40">
        <Plus className="w-6 h-6 text-white" />
      </Link>
    </AppLayout>
  );
}

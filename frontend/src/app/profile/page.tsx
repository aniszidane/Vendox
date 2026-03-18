// VendoX Frontend — app/profile/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Settings, Bookmark, Heart, Store, Edit3, BadgeCheck, LogOut, ChevronRight, Bell, HelpCircle, Flag, Trash2, ShieldCheck } from 'lucide-react';

const MOCK_USER = {
  id: 'u1',
  fullName: 'Anis Beloufa',
  email: 'anis@example.dz',
  username: 'anis_belo',
  avatarUrl: null,
  bio: 'Tech enthusiast & local shopper 🛍️ Based in Algiers 🇩🇿',
  role: 'USER',
  followedStores: 12,
  savedPosts: 34,
  likedPosts: 128,
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'saved' | 'liked' | 'stores'>('saved');

  return (
    <AppLayout title="My Profile" rightAction={
      <Link href="/settings" className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
        <Settings className="w-4 h-4 text-slate-600" />
      </Link>
    }>
      {/* Profile header */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {MOCK_USER.avatarUrl
                ? <img src={MOCK_USER.avatarUrl} className="w-full h-full rounded-2xl object-cover" />
                : MOCK_USER.fullName[0]
              }
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-outfit font-bold text-xl text-slate-900">{MOCK_USER.fullName}</h1>
            </div>
            {MOCK_USER.username && (
              <p className="text-sm text-slate-400">@{MOCK_USER.username}</p>
            )}
            {MOCK_USER.bio && (
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{MOCK_USER.bio}</p>
            )}
          </div>
        </div>

        <Link href="/profile/edit" className="vendox-btn-outline w-full py-2.5 text-sm">
          <Edit3 className="w-4 h-4" />
          Edit Profile
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { value: MOCK_USER.followedStores, label: 'Following', icon: '🏪' },
            { value: MOCK_USER.savedPosts, label: 'Saved', icon: '🔖' },
            { value: MOCK_USER.likedPosts, label: 'Liked', icon: '❤️' },
          ].map(stat => (
            <div key={stat.label} className="vendox-card p-3 text-center">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="font-outfit font-bold text-slate-900 text-lg">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-4 mb-4">
        {[
          { key: 'saved' as const, icon: Bookmark, label: 'Saved' },
          { key: 'liked' as const, icon: Heart, label: 'Liked' },
          { key: 'stores' as const, icon: Store, label: 'Following' },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === key ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content placeholders */}
      <div className="px-4 pb-6">
        {activeTab === 'saved' && (
          <div className="grid grid-cols-2 gap-2">
            {[
              'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
              'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
              'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
              'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
            ].map((url, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                <img src={url} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="text-center py-12">
            <Heart className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Posts you liked will appear here</p>
          </div>
        )}

        {activeTab === 'stores' && (
          <div className="space-y-3">
            {[
              { name: 'Amira Fashion', cat: '👗 Fashion', followers: '3.2K', verified: true },
              { name: 'TechWorld', cat: '📱 Electronics', followers: '5.8K', verified: true },
              { name: 'Kebab King', cat: '🍔 Food', followers: '1.2K', verified: true },
            ].map(store => (
              <div key={store.name} className="vendox-card p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-xl">
                  {store.cat.split(' ')[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-slate-900">{store.name}</span>
                    {store.verified && <BadgeCheck className="w-3.5 h-3.5 text-teal-500 fill-teal-50" />}
                  </div>
                  <span className="text-xs text-slate-400">{store.cat} · {store.followers} followers</span>
                </div>
                <button className="text-xs font-semibold text-teal-600 border border-teal-200 px-3 py-1.5 rounded-full bg-teal-50">
                  Following
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick menu */}
      <div className="mx-4 mb-6 vendox-card divide-y divide-slate-50 overflow-hidden">
        {[
          { icon: Bell, label: 'Notification Preferences', href: '/settings/notifications' },
          { icon: ShieldCheck, label: 'Privacy & Security', href: '/settings/privacy' },
          { icon: HelpCircle, label: 'Help & Support', href: '/help' },
          { icon: Flag, label: 'Report a Problem', href: '/report' },
        ].map(({ icon: Icon, label, href }) => (
          <Link key={label} href={href} className="flex items-center gap-4 px-4 py-4 hover:bg-slate-50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <Icon className="w-4 h-4 text-slate-500" />
            </div>
            <span className="flex-1 text-sm font-medium text-slate-700">{label}</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="px-4 pb-8">
        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors active:scale-[0.98]">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </AppLayout>
  );
}

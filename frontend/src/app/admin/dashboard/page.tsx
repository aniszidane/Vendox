// VendoX Frontend — app/admin/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Store, FileText, Flag, TrendingUp, BadgeCheck, XCircle, Eye, Ban, MapPin, ShieldCheck, BarChart3, Bell } from 'lucide-react';

const STATS = [
  { label: 'Total Users', value: '12,483', change: '+14%', icon: Users, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { label: 'Active Stores', value: '2,341', change: '+8%', icon: Store, color: 'bg-teal-50 text-teal-600 border-teal-200' },
  { label: 'Total Posts', value: '48,902', change: '+23%', icon: FileText, color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { label: 'Open Reports', value: '47', change: '-12%', icon: Flag, color: 'bg-rose-50 text-rose-600 border-rose-200' },
];

const RECENT_STORES = [
  { id: 's1', name: 'Kebab King', owner: 'Hassan Bouzid', category: '🍔 Food', city: 'Alger', status: 'PENDING', createdAt: '2025-01-15' },
  { id: 's2', name: 'TechVision', owner: 'Samir B.', category: '📱 Electronics', city: 'Oran', status: 'PENDING', createdAt: '2025-01-14' },
  { id: 's3', name: 'BioVerde', owner: 'Fatima Z.', category: '🥗 Food', city: 'Constantine', status: 'PENDING', createdAt: '2025-01-13' },
];

const RECENT_REPORTS = [
  { id: 'r1', type: 'POST', reason: 'Spam/Misleading', reportedBy: 'User_2341', status: 'PENDING', date: '2025-01-15' },
  { id: 'r2', type: 'STORE', reason: 'Fake Store', reportedBy: 'User_8923', status: 'PENDING', date: '2025-01-14' },
  { id: 'r3', type: 'USER', reason: 'Harassment', reportedBy: 'User_5621', status: 'REVIEWED', date: '2025-01-13' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'stores' | 'users' | 'reports' | 'categories'>('stores');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-outfit font-bold text-lg text-slate-900">VendoX</span>
            <span className="text-slate-400 text-sm ml-2">Admin Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">A</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="font-outfit font-bold text-2xl text-slate-900">Overview</h1>
          <p className="text-slate-500 text-sm mt-1">VendoX platform health at a glance</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.change.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="font-outfit font-bold text-2xl text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-outfit font-bold text-slate-900">Activity Overview</h3>
              <div className="flex gap-2">
                {['7d', '30d', '90d'].map(p => (
                  <button key={p} className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors font-medium">
                    {p}
                  </button>
                ))}
              </div>
            </div>
            {/* Simple bar chart representation */}
            <div className="flex items-end gap-2 h-32">
              {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-teal-500 to-cyan-400 transition-all duration-500" style={{ height: `${h}%` }} />
                  <span className="text-[10px] text-slate-400">{['M','T','W','T','F','S','S'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-outfit font-bold text-slate-900 mb-4">Categories</h3>
            <div className="space-y-3">
              {[
                { name: 'Food & Drink', count: 892, color: '#FF6B35', pct: 38 },
                { name: 'Fashion', count: 634, color: '#E91E8C', pct: 27 },
                { name: 'Electronics', count: 412, color: '#0D47A1', pct: 18 },
                { name: 'Beauty', count: 203, color: '#AD1457', pct: 9 },
                { name: 'Other', count: 200, color: '#94A3B8', pct: 8 },
              ].map(cat => (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">{cat.name}</span>
                    <span className="text-slate-400">{cat.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, background: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Management tabs */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-100">
            {[
              { key: 'stores', label: 'Pending Stores', count: 3 },
              { key: 'users', label: 'Users', count: null },
              { key: 'reports', label: 'Reports', count: 2 },
              { key: 'categories', label: 'Categories', count: null },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === key ? 'border-teal-600 text-teal-700 bg-teal-50/30' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
                {count && <span className="bg-rose-100 text-rose-600 text-xs font-bold px-1.5 py-0.5 rounded-full">{count}</span>}
              </button>
            ))}
          </div>

          {/* Stores tab */}
          {activeTab === 'stores' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    {['Store', 'Owner', 'Category', 'City', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_STORES.map(store => (
                    <tr key={store.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-sm text-slate-900">{store.name}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{store.owner}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{store.category}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">{store.city}</td>
                      <td className="px-5 py-4 text-xs text-slate-400">{store.createdAt}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                            <BadgeCheck className="w-3.5 h-3.5" /> Verify
                          </button>
                          <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium">
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                          <button className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Reports tab */}
          {activeTab === 'reports' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    {['Type', 'Reason', 'Reported By', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_REPORTS.map(report => (
                    <tr key={report.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">{report.type}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{report.reason}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">{report.reportedBy}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          report.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400">{report.date}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button className="text-xs px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg font-medium">Review</button>
                          <button className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-medium">Dismiss</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Users tab */}
          {activeTab === 'users' && (
            <div className="p-8 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">User management table would appear here with search, filter, and ban controls.</p>
            </div>
          )}

          {/* Categories tab */}
          {activeTab === 'categories' && (
            <div className="p-6">
              <div className="flex justify-end mb-4">
                <button className="vendox-btn-primary py-2.5 px-5 text-sm">+ Add Category</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'Food & Drink', emoji: '🍔', count: 892, color: '#FF6B35' },
                  { name: 'Fashion', emoji: '👗', count: 634, color: '#E91E8C' },
                  { name: 'Electronics', emoji: '📱', count: 412, color: '#0D47A1' },
                  { name: 'Beauty', emoji: '💄', count: 203, color: '#AD1457' },
                  { name: 'Home', emoji: '🏡', count: 156, color: '#2E7D32' },
                  { name: 'Sports', emoji: '⚽', count: 134, color: '#1565C0' },
                  { name: 'Automotive', emoji: '🚗', count: 89, color: '#BF360C' },
                  { name: 'Services', emoji: '🛠️', count: 221, color: '#4527A0' },
                ].map(cat => (
                  <div key={cat.name} className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors cursor-pointer group">
                    <div className="text-2xl mb-2">{cat.emoji}</div>
                    <div className="font-semibold text-sm text-slate-900">{cat.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{cat.count} stores</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// VendoX Frontend — app/page.tsx (Landing Page)
'use client';

import Link from 'next/link';
import { MapPin, ShoppingBag, Zap, Star, ArrowRight, Search, Bell, TrendingUp, MessageCircle } from 'lucide-react';

export default function LandingPage() {
  const features = [
    { icon: MapPin, title: 'Discover Nearby', description: 'Find stores and businesses on an interactive map around you.', color: 'bg-teal-50 text-teal-600' },
    { icon: ShoppingBag, title: 'Local Marketplace', description: 'Browse products and services from verified local stores.', color: 'bg-indigo-50 text-indigo-600' },
    { icon: Zap, title: 'Khasni Requests', description: "Can't find it? Post a request and let stores come to you.", color: 'bg-amber-50 text-amber-600' },
    { icon: TrendingUp, title: 'Trending Posts', description: 'See what\'s hot in your city — deals, new arrivals, events.', color: 'bg-rose-50 text-rose-600' },
    { icon: Bell, title: 'Smart Notifications', description: 'Get notified when followed stores post or respond to you.', color: 'bg-purple-50 text-purple-600' },
    { icon: Star, title: 'Verified Stores', description: 'Shop with confidence from badge-verified local businesses.', color: 'bg-green-50 text-green-600' },
  ];

  const categories = [
    { emoji: '🍔', name: 'Food & Drink' },
    { emoji: '👗', name: 'Fashion' },
    { emoji: '📱', name: 'Electronics' },
    { emoji: '💄', name: 'Beauty' },
    { emoji: '🏡', name: 'Home' },
    { emoji: '⚽', name: 'Sports' },
    { emoji: '🚗', name: 'Auto' },
    { emoji: '🛠️', name: 'Services' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-outfit font-bold text-xl text-slate-900">VendoX</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link href="/register" className="vendox-btn-primary text-sm px-5 py-2.5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 relative">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-50 to-cyan-50 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Now available in Algeria 🇩🇿
          </div>

          <h1 className="font-outfit text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6 animate-fade-in-up">
            Your Local Market,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">
              Reimagined
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up stagger-1">
            Discover stores, products, and services right around you. Follow your favorite local businesses, post requests, and shop with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up stagger-2">
            <Link href="/register" className="vendox-btn-primary text-base px-8 py-4 gap-2 w-full sm:w-auto justify-center">
              Start Discovering
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/feed" className="vendox-btn-outline text-base px-8 py-4 w-full sm:w-auto justify-center">
              Browse as Guest
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto mt-14 animate-fade-in-up stagger-3">
            {[
              { value: '500+', label: 'Stores' },
              { value: '10K+', label: 'Products' },
              { value: '50K+', label: 'Users' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-outfit text-2xl font-bold text-teal-600">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Phone mockup */}
        <div className="max-w-xs mx-auto mt-14 relative animate-fade-in-up stagger-4">
          <div className="bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
            <div className="bg-gradient-to-b from-teal-50 to-white rounded-[2.5rem] overflow-hidden" style={{ minHeight: 480 }}>
              {/* Mock UI inside phone */}
              <div className="bg-white p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-outfit font-bold text-slate-900">VendoX</span>
                  <div className="ml-auto w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                    <Bell className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>

                {/* Search bar mock */}
                <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2.5 mb-4">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-400">Search stores, products...</span>
                </div>

                {/* Category chips */}
                <div className="flex gap-2 overflow-hidden mb-4">
                  {categories.slice(0, 4).map((c) => (
                    <div key={c.name} className="flex-shrink-0 bg-slate-100 rounded-full px-3 py-1.5 text-xs font-medium text-slate-600 flex items-center gap-1">
                      <span>{c.emoji}</span>
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>

                {/* Mock post cards */}
                {[
                  { store: 'Kebab King', cat: '🍔 Food', likes: '234', color: 'from-orange-400 to-amber-300' },
                  { store: 'Amira Fashion', cat: '👗 Fashion', likes: '891', color: 'from-pink-400 to-rose-300' },
                ].map((card, i) => (
                  <div key={i} className="vendox-card mb-3 overflow-hidden">
                    <div className={`h-20 bg-gradient-to-r ${card.color} opacity-70`} />
                    <div className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200" />
                        <span className="text-xs font-semibold text-slate-700">{card.store}</span>
                        <span className="text-xs text-slate-400 ml-auto">{card.cat}</span>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <span className="text-xs text-slate-400">❤️ {card.likes}</span>
                        <span className="text-xs text-slate-400">💬 45</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Glow */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-8 bg-teal-500/20 blur-xl rounded-full" />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-outfit text-3xl font-bold text-slate-900 text-center mb-10">
            Everything nearby, in one place
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <div key={cat.name} className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-slate-600 text-center leading-tight group-hover:text-teal-600 transition-colors">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-outfit text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Built for local commerce
            </h2>
            <p className="text-slate-500 text-lg">
              Every feature designed with local businesses and shoppers in mind.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <div key={feat.title}
                className="p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={`w-11 h-11 rounded-xl ${feat.color} flex items-center justify-center mb-4`}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="font-outfit font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Khasni highlight */}
      <section className="py-16 px-4 bg-gradient-to-br from-teal-600 to-cyan-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" />
            Unique Feature
          </div>
          <h2 className="font-outfit text-3xl md:text-4xl font-bold mb-4">
            Meet Khasni — "I Need"
          </h2>
          <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">
            Can't find what you're looking for? Post a request and let local stores come to you with their best offers.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-sm mx-auto text-left">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm mb-1">Looking for Nike Air Max size 42</p>
                <p className="text-teal-200 text-xs">Budget: 12,000 DZD · Algiers</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">⚡ 3 responses</span>
                  <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">🟢 Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="font-outfit text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to explore your local market?
          </h2>
          <p className="text-slate-500 text-lg mb-8">
            Join thousands of users and businesses already on VendoX.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="vendox-btn-primary text-base px-8 py-4">
              Create Free Account
            </Link>
            <Link href="/feed" className="vendox-btn-outline text-base px-8 py-4">
              Browse First
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-outfit font-bold text-xl text-white">VendoX</span>
            </div>
            <p className="text-sm text-center">Your local market, reimagined. © 2025 VendoX. All rights reserved.</p>
            <div className="flex gap-4 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

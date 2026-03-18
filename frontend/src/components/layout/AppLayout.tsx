// VendoX Frontend — components/layout/AppLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Map, Zap, TrendingUp, User, Plus, Bell } from 'lucide-react';
import { TopBar } from './TopBar';

const navItems = [
  { href: '/feed',     icon: Home,       label: 'Home',     exact: true },
  { href: '/map',      icon: Map,        label: 'Map' },
  { href: '/khasni',   icon: Zap,        label: 'Khasni',   center: true },
  { href: '/trending', icon: TrendingUp, label: 'Trending' },
  { href: '/profile',  icon: User,       label: 'Profile' },
];

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showTopBar?: boolean;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
}

export function AppLayout({ children, title, showTopBar = true, showBackButton = false, rightAction }: AppLayoutProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-xl mx-auto relative">
      {showTopBar && (
        <TopBar title={title} showBackButton={showBackButton} rightAction={rightAction} />
      )}

      <main className={`flex-1 ${showTopBar ? 'pt-[60px]' : ''} pb-[80px] overflow-y-auto`}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl bg-white border-t border-slate-100 z-40"
           style={{ boxShadow: 'var(--shadow-nav)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center h-[56px]">
          {navItems.map((item) => {
            if (item.center) {
              return (
                <div key={item.href} className="flex-1 flex items-center justify-center -mt-5">
                  <Link href={item.href}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-200 active:scale-95 transition-transform">
                    <Zap className="w-6 h-6 text-white fill-white" />
                  </Link>
                </div>
              );
            }
            const active = isActive(item.href, item.exact);
            return (
              <Link key={item.href} href={item.href}
                className={`bottom-nav-item ${active ? 'active' : ''}`}>
                <div className="relative">
                  <item.icon className={`w-5 h-5 transition-all duration-200 ${active ? 'stroke-[2.5px] scale-110' : 'stroke-[1.8px]'}`} />
                  {active && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-600" />
                  )}
                </div>
                <span className={`text-[10px] font-medium leading-none ${active ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// VendoX Frontend — components/layout/TopBar.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bell, Search, MapPin } from 'lucide-react';

interface TopBarProps {
  title?: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

export function TopBar({ title, showBackButton = false, rightAction, transparent = false }: TopBarProps) {
  const router = useRouter();

  return (
    <header className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 ${
      transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md border-b border-slate-100'
    }`}
      style={{ height: 'var(--top-bar-height)', paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="flex items-center h-full px-4 gap-3">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
        )}

        {title ? (
          <h1 className="font-outfit font-bold text-lg text-slate-900 flex-1 truncate">{title}</h1>
        ) : (
          <div className="flex-1 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-outfit font-bold text-xl text-slate-900">VendoX</span>
          </div>
        )}

        <div className="flex items-center gap-2 flex-shrink-0">
          {rightAction || (
            <>
              <Link href="/search"
                className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <Search className="w-4 h-4 text-slate-600" />
              </Link>
              <Link href="/notifications" className="relative w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <Bell className="w-4 h-4 text-slate-600" />
                {/* Unread badge */}
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  3
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

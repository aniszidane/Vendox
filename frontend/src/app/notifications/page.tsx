// VendoX Frontend — app/notifications/page.tsx
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Bell, Heart, UserPlus, MessageCircle, Zap, Store, BadgeCheck, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ICON_MAP = {
  NEW_FOLLOWER:    { icon: UserPlus,       color: 'bg-purple-100 text-purple-600' },
  NEW_POST:        { icon: Store,          color: 'bg-teal-100 text-teal-600' },
  POST_LIKED:      { icon: Heart,          color: 'bg-rose-100 text-rose-600' },
  POST_COMMENTED:  { icon: MessageCircle,  color: 'bg-blue-100 text-blue-600' },
  KHASNI_RESPONSE: { icon: Zap,            color: 'bg-amber-100 text-amber-600' },
  STORE_VERIFIED:  { icon: BadgeCheck,     color: 'bg-green-100 text-green-600' },
  SYSTEM:          { icon: Bell,           color: 'bg-slate-100 text-slate-600' },
};

const MOCK_NOTIFICATIONS = [
  {
    id: 'n1', type: 'NEW_FOLLOWER', title: 'New follower',
    message: 'Sarah Mansouri started following you',
    isRead: false, createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    imageUrl: null,
  },
  {
    id: 'n2', type: 'KHASNI_RESPONSE', title: 'Khasni response',
    message: 'TechWorld responded to your request for iPhone 14',
    isRead: false, createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    imageUrl: null,
  },
  {
    id: 'n3', type: 'POST_LIKED', title: 'Post liked',
    message: 'Karim and 23 others liked your saved post',
    isRead: false, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    imageUrl: null,
  },
  {
    id: 'n4', type: 'NEW_POST', title: 'New post from Amira Fashion',
    message: '✨ Nouvelle collection Ramadan 2025! Check it out.',
    isRead: true, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    imageUrl: null,
  },
  {
    id: 'n5', type: 'STORE_VERIFIED', title: '🎉 Store verified!',
    message: 'Your store has been verified by VendoX.',
    isRead: true, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: null,
  },
  {
    id: 'n6', type: 'POST_COMMENTED', title: 'New comment',
    message: 'Omar left a comment: "When will this be available?"',
    isRead: true, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: null,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const today = notifications.filter(n => {
    const diff = Date.now() - new Date(n.createdAt).getTime();
    return diff < 24 * 60 * 60 * 1000;
  });

  const earlier = notifications.filter(n => {
    const diff = Date.now() - new Date(n.createdAt).getTime();
    return diff >= 24 * 60 * 60 * 1000;
  });

  return (
    <AppLayout title="Notifications" showBackButton rightAction={
      unreadCount > 0 ? (
        <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 px-3 py-1.5 rounded-full hover:bg-teal-50 transition-colors">
          <CheckCheck className="w-4 h-4" />
          Mark all read
        </button>
      ) : undefined
    }>
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
            <Bell className="w-9 h-9 text-slate-300" />
          </div>
          <h3 className="font-outfit font-bold text-slate-900 text-lg mb-2">No notifications yet</h3>
          <p className="text-slate-500 text-sm">Follow stores to get notified about new posts and offers.</p>
        </div>
      ) : (
        <div className="py-2">
          {today.length > 0 && (
            <Section title="Today" notifications={today} onRead={markRead} />
          )}
          {earlier.length > 0 && (
            <Section title="Earlier" notifications={earlier} onRead={markRead} />
          )}
        </div>
      )}
    </AppLayout>
  );
}

function Section({ title, notifications, onRead }: {
  title: string;
  notifications: typeof MOCK_NOTIFICATIONS;
  onRead: (id: string) => void;
}) {
  return (
    <div className="mb-2">
      <div className="px-4 py-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
      </div>
      {notifications.map((notif) => {
        const config = ICON_MAP[notif.type as keyof typeof ICON_MAP] || ICON_MAP.SYSTEM;
        const Icon = config.icon;
        return (
          <button
            key={notif.id}
            onClick={() => onRead(notif.id)}
            className={`w-full flex items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-slate-50 active:bg-slate-100 relative ${
              !notif.isRead ? 'bg-teal-50/50' : ''
            }`}
          >
            {/* Unread dot */}
            {!notif.isRead && (
              <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-teal-500 rounded-full" />
            )}

            {/* Icon */}
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-snug ${notif.isRead ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>
                <span className="font-semibold">{notif.title}</span>
                {' — '}
                {notif.message}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

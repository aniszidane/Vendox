// VendoX Frontend — components/feed/PostCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface PostImage { url: string; altText?: string; }

interface Post {
  id: string;
  caption?: string;
  likeCount: number;
  commentCount: number;
  saveCount: number;
  publishedAt: string;
  createdAt: string;
  images: PostImage[];
  store: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
    verificationStatus: string;
    category?: { name: string; emoji?: string; color?: string; };
  };
  likes?: { id: string }[];
  savedBy?: { id: string }[];
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => Promise<void>;
  onSave?: (postId: string) => Promise<void>;
  onComment?: (postId: string) => void;
}

export function PostCard({ post, onLike, onSave, onComment }: PostCardProps) {
  const [liked, setLiked] = useState((post.likes?.length || 0) > 0);
  const [saved, setSaved] = useState((post.savedBy?.length || 0) > 0);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleLike = async () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    try { await onLike?.(post.id); }
    catch { setLiked((prev) => !prev); setLikeCount((prev) => (liked ? prev + 1 : prev - 1)); }
  };

  const handleSave = async () => {
    setSaved((prev) => !prev);
    toast.success(saved ? 'Removed from saved' : 'Saved!');
    try { await onSave?.(post.id); }
    catch { setSaved((prev) => !prev); }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post.store.name, url: `${window.location.origin}/post/${post.id}` });
    } else {
      await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      toast.success('Link copied!');
    }
  };

  const hasMultipleImages = post.images.length > 1;

  return (
    <article className="vendox-card overflow-hidden mb-3 animate-fade-in">
      {/* Store Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Link href={`/store/${post.store.slug}`} className="flex-shrink-0">
          <div className="relative">
            {post.store.logoUrl ? (
              <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                <img src={post.store.logoUrl} alt={post.store.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-base shadow-sm">
                {post.store.name[0]}
              </div>
            )}
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/store/${post.store.slug}`} className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-slate-900 truncate">{post.store.name}</span>
            {post.store.verificationStatus === 'VERIFIED' && (
              <BadgeCheck className="w-4 h-4 text-teal-500 flex-shrink-0 fill-teal-50" />
            )}
          </Link>
          <div className="flex items-center gap-2 mt-0.5">
            {post.store.category && (
              <span className="category-badge" style={{ borderColor: `${post.store.category.color}30`, color: post.store.category.color || '#64748b' }}>
                {post.store.category.emoji} {post.store.category.name}
              </span>
            )}
            <span className="text-xs text-slate-400">
              {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              isFollowing
                ? 'border-slate-200 text-slate-500 bg-slate-50'
                : 'border-teal-500 text-teal-600 hover:bg-teal-50'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
          <button onClick={() => setShowOptions(!showOptions)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Options Menu */}
      {showOptions && (
        <div className="mx-4 mb-2 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
          {['Save post', 'Report post', 'Share'].map((opt) => (
            <button key={opt} onClick={() => setShowOptions(false)} className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-100 transition-colors border-b last:border-0 border-slate-100">
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Image Carousel */}
      {post.images.length > 0 && (
        <div className="relative aspect-square bg-slate-100 overflow-hidden">
          <img
            src={post.images[currentImage]?.url}
            alt={post.images[currentImage]?.altText || post.store.name}
            className="w-full h-full object-cover"
          />

          {/* Nav arrows */}
          {hasMultipleImages && (
            <>
              {currentImage > 0 && (
                <button onClick={() => setCurrentImage(p => p - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {currentImage < post.images.length - 1 && (
                <button onClick={() => setCurrentImage(p => p + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {post.images.map((_, i) => (
                  <button key={i} onClick={() => setCurrentImage(i)}
                    className={`rounded-full transition-all duration-200 ${i === currentImage ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/60'}`}
                  />
                ))}
              </div>

              {/* Count badge */}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                {currentImage + 1}/{post.images.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1">
            {/* Like */}
            <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all active:scale-90 ${liked ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-400 hover:bg-rose-50/50'}`}>
              <Heart className={`w-5 h-5 transition-all ${liked ? 'fill-rose-500 scale-110' : ''}`} />
              <span className="text-sm font-semibold">{likeCount > 0 ? likeCount.toLocaleString() : ''}</span>
            </button>

            {/* Comment */}
            <button onClick={() => onComment?.(post.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-teal-500 hover:bg-teal-50/50 transition-all active:scale-90">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">{post.commentCount > 0 ? post.commentCount.toLocaleString() : ''}</span>
            </button>

            {/* Share */}
            <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all active:scale-90">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Save */}
          <button onClick={handleSave} className={`p-2 rounded-xl transition-all active:scale-90 ${saved ? 'text-teal-600 bg-teal-50' : 'text-slate-400 hover:text-teal-500 hover:bg-teal-50/50'}`}>
            <Bookmark className={`w-5 h-5 ${saved ? 'fill-teal-600' : ''}`} />
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm text-slate-700 leading-relaxed pb-3">
            <Link href={`/store/${post.store.slug}`} className="font-semibold text-slate-900 hover:underline mr-1">
              {post.store.name}
            </Link>
            <Caption text={post.caption} />
          </p>
        )}

        {/* View all comments */}
        {post.commentCount > 0 && (
          <button onClick={() => onComment?.(post.id)} className="text-sm text-slate-400 hover:text-slate-600 transition-colors pb-3 block">
            View all {post.commentCount.toLocaleString()} comments
          </button>
        )}
      </div>
    </article>
  );
}

function Caption({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const limit = 120;
  if (text.length <= limit) return <span>{text}</span>;
  return (
    <>
      {expanded ? text : text.slice(0, limit) + '... '}
      <button onClick={() => setExpanded(!expanded)} className="text-slate-500 font-medium hover:text-slate-700">
        {expanded ? 'less' : 'more'}
      </button>
    </>
  );
}

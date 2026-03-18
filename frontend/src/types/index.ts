// VendoX Frontend — types/index.ts

// ── Enums ──────────────────────────────────────────────────────────
export type Role = 'USER' | 'STORE_OWNER' | 'ADMIN';
export type StoreStatus = 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type KhasniStatus = 'OPEN' | 'CLOSED' | 'FULFILLED';
export type NotificationType = 'NEW_FOLLOWER' | 'NEW_POST' | 'POST_LIKED' | 'POST_COMMENTED' | 'KHASNI_RESPONSE' | 'STORE_VERIFIED' | 'SYSTEM';
export type LikeTargetType = 'POST' | 'PRODUCT' | 'SERVICE';

// ── User ───────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  fullName: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  store?: StoreSummary;
}

// ── Store Category ─────────────────────────────────────────────────
export interface StoreCategory {
  id: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  slug: string;
  emoji?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
}

// ── Store ──────────────────────────────────────────────────────────
export interface StoreSummary {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  verificationStatus: VerificationStatus;
  category?: Pick<StoreCategory, 'name' | 'slug' | 'emoji' | 'color'>;
}

export interface Store extends StoreSummary {
  description?: string;
  coverUrl?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  status: StoreStatus;
  followerCount: number;
  postCount: number;
  reviewCount: number;
  averageRating: number;
  isFeatured: boolean;
  location?: Location;
  createdAt: string;
  _count?: {
    posts: number;
    followers: number;
    reviews: number;
    products: number;
    services: number;
  };
  // Client-side
  isFollowing?: boolean;
  distance?: number | null;
}

// ── Location ───────────────────────────────────────────────────────
export interface Location {
  id: string;
  address?: string;
  city?: string;
  wilaya?: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

// ── Post Image ─────────────────────────────────────────────────────
export interface PostImage {
  id: string;
  url: string;
  publicId?: string;
  altText?: string;
  sortOrder: number;
}

// ── Post ───────────────────────────────────────────────────────────
export interface Post {
  id: string;
  caption?: string;
  likeCount: number;
  commentCount: number;
  saveCount: number;
  shareCount: number;
  publishedAt?: string;
  createdAt: string;
  images: PostImage[];
  store: StoreSummary;
  // Client-side hydrated
  likes?: { id: string }[];
  savedBy?: { id: string }[];
  isLiked?: boolean;
  isSaved?: boolean;
}

// ── Comment ────────────────────────────────────────────────────────
export interface Comment {
  id: string;
  content: string;
  likeCount: number;
  isEdited: boolean;
  createdAt: string;
  user: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'username'>;
  replies?: Comment[];
}

// ── Product ────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  currency: string;
  imageUrl?: string;
  images: string[];
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  likeCount: number;
  viewCount: number;
  createdAt: string;
  store: StoreSummary;
  category?: Pick<StoreCategory, 'name' | 'slug' | 'emoji'>;
}

// ── Service ────────────────────────────────────────────────────────
export interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number;
  priceRange?: string;
  currency: string;
  imageUrl?: string;
  status: 'AVAILABLE' | 'UNAVAILABLE';
  createdAt: string;
  store: StoreSummary;
}

// ── Khasni ─────────────────────────────────────────────────────────
export interface KhasniRequest {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  city?: string;
  wilaya?: string;
  budget?: number;
  currency: string;
  status: KhasniStatus;
  responseCount: number;
  expiresAt?: string;
  closedAt?: string;
  createdAt: string;
  user: Pick<User, 'id' | 'fullName' | 'avatarUrl'>;
  category?: Pick<StoreCategory, 'name' | 'slug' | 'emoji'>;
  responses?: KhasniResponse[];
}

export interface KhasniResponse {
  id: string;
  message: string;
  price?: number;
  currency: string;
  imageUrl?: string;
  isAccepted: boolean;
  createdAt: string;
  store: Pick<Store, 'id' | 'name' | 'slug' | 'logoUrl' | 'verificationStatus' | 'phone' | 'whatsapp'>;
}

// ── Notification ───────────────────────────────────────────────────
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  imageUrl?: string;
  actionUrl?: string;
  actorId?: string;
  postId?: string;
  storeId?: string;
  khasniId?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// ── Review ─────────────────────────────────────────────────────────
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  user: Pick<User, 'id' | 'fullName' | 'avatarUrl'>;
}

// ── API Response ───────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── Auth ───────────────────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

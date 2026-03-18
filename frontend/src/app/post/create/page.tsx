// VendoX Frontend — app/post/create/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Image as ImageIcon, X, Plus, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function CreatePostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const charLimit = 2200;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      toast.error('Maximum 10 images per post');
      return;
    }
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(images[idx].preview);
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (images.length === 0) { toast.error('Add at least one image'); return; }
    if (!caption.trim() && images.length === 0) { toast.error('Add a caption or image'); return; }

    setIsLoading(true);
    try {
      // Build form data
      const form = new FormData();
      form.append('caption', caption);
      images.forEach(img => form.append('files', img.file));

      await new Promise(r => setTimeout(r, 2000)); // Simulate API
      toast.success('Post published! 🎉');
      router.push('/feed');
    } catch {
      toast.error('Failed to publish post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="New Post" showBackButton rightAction={
      <button
        onClick={handleSubmit}
        disabled={isLoading || (images.length === 0 && !caption.trim())}
        className="vendox-btn-primary py-2 px-5 text-sm disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish'}
      </button>
    }>
      <div className="px-4 py-5 space-y-5">
        {/* Image picker */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="vendox-label mb-0">Photos *</label>
            <span className="text-xs text-slate-400">{images.length}/10</span>
          </div>

          <div className="flex gap-3 flex-wrap">
            {/* Existing images */}
            {images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img src={img.preview} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    COVER
                  </span>
                )}
              </div>
            ))}

            {/* Add button */}
            {images.length < 10 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1.5 hover:border-teal-400 hover:bg-teal-50/30 transition-all group flex-shrink-0"
              >
                <Plus className="w-6 h-6 text-slate-300 group-hover:text-teal-500 transition-colors" />
                <span className="text-[10px] text-slate-400 group-hover:text-teal-500 transition-colors">Add Photo</span>
              </button>
            )}
          </div>

          {images.length === 0 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full mt-3 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-teal-400 hover:bg-teal-50/20 transition-all"
            >
              <ImageIcon className="w-10 h-10 text-slate-300" />
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500">Tap to add photos</p>
                <p className="text-xs text-slate-400 mt-0.5">Up to 10 images · JPG, PNG, WebP</p>
              </div>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>

        {/* Caption */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="vendox-label mb-0">Caption</label>
            <span className={`text-xs ${caption.length > charLimit * 0.9 ? 'text-orange-500' : 'text-slate-400'}`}>
              {caption.length}/{charLimit}
            </span>
          </div>
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value.slice(0, charLimit))}
            placeholder="Share what's happening at your store... Add hashtags, promotions, or product info. 🎉"
            rows={5}
            className="vendox-input resize-none"
          />
        </div>

        {/* Tips */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700">
            <p className="font-semibold mb-1">Tips for more engagement:</p>
            <ul className="text-xs space-y-1 text-amber-600">
              <li>• Use clear, bright photos</li>
              <li>• Include prices and availability</li>
              <li>• Add your contact info or DM invitation</li>
              <li>• Post during peak hours (12h–15h, 19h–22h)</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

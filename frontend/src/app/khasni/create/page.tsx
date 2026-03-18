// VendoX Frontend — app/khasni/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Image as ImageIcon, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';

const schema = z.object({
  title: z.string().min(5, 'At least 5 characters').max(100),
  description: z.string().max(500).optional(),
  categoryId: z.string().optional(),
  city: z.string().optional(),
  budget: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const CATEGORIES = [
  { id: 'food-drink', name: 'Food & Drink', emoji: '🍔' },
  { id: 'fashion', name: 'Fashion', emoji: '👗' },
  { id: 'electronics', name: 'Electronics', emoji: '📱' },
  { id: 'beauty-health', name: 'Beauty', emoji: '💄' },
  { id: 'home-decor', name: 'Home & Decor', emoji: '🏡' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'automotive', name: 'Auto', emoji: '🚗' },
  { id: 'services', name: 'Services', emoji: '🛠️' },
];

const WILAYAS = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif', 'Béjaïa', 'Tlemcen', 'Biskra', 'Batna'];

export default function CreateKhasniPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [charCount, setCharCount] = useState(0);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const description = watch('description', '');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500)); // Simulate API
      toast.success('Your Khasni request has been posted! 🎉');
      router.push('/khasni');
    } catch {
      toast.error('Failed to post request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="New Khasni Request" showBackButton>
      <div className="px-4 py-5">
        {/* Info banner */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 mb-6 flex gap-3">
          <Zap className="w-5 h-5 text-teal-600 fill-teal-100 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-teal-700 leading-relaxed">
            Post what you're looking for. Stores near you will respond with their best offers within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div>
            <label className="vendox-label">What are you looking for? *</label>
            <input
              {...register('title')}
              placeholder="e.g. Nike Air Max size 42, iPhone 14 128GB..."
              className={`vendox-input ${errors.title ? 'border-red-400' : ''}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="vendox-label">More details <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea
              {...register('description')}
              onChange={e => { register('description').onChange(e); setCharCount(e.target.value.length); }}
              placeholder="Brand, model, color, size, condition, urgency..."
              rows={4}
              className={`vendox-input resize-none ${errors.description ? 'border-red-400' : ''}`}
            />
            <div className="flex justify-between mt-1">
              {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
              <span className="text-xs text-slate-400 ml-auto">{charCount}/500</span>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="vendox-label">Category <span className="text-slate-400 font-normal">(optional)</span></label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { setSelectedCategory(cat.id); setValue('categoryId', cat.id); }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-medium ${
                    selectedCategory === cat.id
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="text-center leading-tight">{cat.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="vendox-label">City / Wilaya <span className="text-slate-400 font-normal">(optional)</span></label>
            <select {...register('city')} className="vendox-input">
              <option value="">Any location</option>
              {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="vendox-label">Budget (DZD) <span className="text-slate-400 font-normal">(optional)</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">DZD</span>
              <input
                {...register('budget')}
                type="number"
                min="0"
                placeholder="Max budget"
                className="vendox-input pl-14"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Giving a budget helps stores respond with relevant offers</p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="vendox-label">Reference Image <span className="text-slate-400 font-normal">(optional)</span></label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all group">
              <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-teal-400 mx-auto mb-2 transition-colors" />
              <p className="text-sm text-slate-500 group-hover:text-teal-600 transition-colors">Tap to add image</p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="vendox-btn-primary w-full py-4 text-base disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-white" />
                Post Khasni Request
              </>
            )}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}

// VendoX Frontend — app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const schema = z.object({ email: z.string().email() });

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email }: { email: string }) => {
    setIsLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-200">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <span className="font-outfit font-bold text-2xl text-slate-900">VendoX</span>
          </Link>
        </div>

        <div className="vendox-card p-6">
          {!sent ? (
            <>
              <h1 className="font-outfit font-bold text-xl text-slate-900 mb-1">Reset your password</h1>
              <p className="text-sm text-slate-500 mb-6">Enter your email and we'll send you a reset link.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="vendox-label">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input {...register('email')} type="email" placeholder="you@example.com" className={`vendox-input pl-10 ${errors.email ? 'border-red-400' : ''}`} />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <button type="submit" disabled={isLoading} className="vendox-btn-primary w-full py-3.5 disabled:opacity-60">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-outfit font-bold text-xl text-slate-900 mb-2">Check your inbox</h2>
              <p className="text-sm text-slate-500 mb-1">We sent a reset link to</p>
              <p className="text-sm font-semibold text-teal-700 mb-6">{getValues('email')}</p>
              <p className="text-xs text-slate-400">Didn't receive it? Check your spam folder or</p>
              <button onClick={() => setSent(false)} className="text-xs text-teal-600 font-semibold hover:underline mt-1">
                try a different email
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-5">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

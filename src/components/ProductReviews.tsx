'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

function StarRating({ value, onChange, size = 5 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: size }).map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 transition-colors ${onChange ? 'cursor-pointer' : ''} ${i < (hover || value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
          onClick={() => onChange?.(i + 1)}
          onMouseEnter={() => onChange && setHover(i + 1)}
          onMouseLeave={() => onChange && setHover(0)}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ customerName: '', phone: '', rating: 0, comment: '' });

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then(r => r.json())
      .then(data => { setReviews(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [productId]);

  const submitReview = async () => {
    if (!form.customerName || !form.phone || !form.rating || !form.comment) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, ...form }),
      });
      if (res.ok) {
        setSubmitted(true);
        setShowForm(false);
        const newReview = { id: Date.now().toString(), ...form, createdAt: new Date().toISOString() };
        setReviews(prev => [newReview, ...prev]);
      }
    } catch { }
    finally { setSubmitting(false); }
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Customer Reviews</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(avgRating)} />
              <span className="text-sm text-gray-500">{avgRating.toFixed(1)} ({reviews.length} reviews)</span>
            </div>
          )}
        </div>
        {!submitted && (
          <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)} className="rounded-xl text-orange-500 border-orange-200">
            {showForm ? 'Cancel' : '+ Write Review'}
          </Button>
        )}
      </div>

      {showForm && (
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 mb-5 space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm">Your Review for {productName}</h4>
          <div>
            <p className="text-xs text-gray-500 mb-1">Your Rating *</p>
            <StarRating value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Your Name *" value={form.customerName} onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))} className="h-10 rounded-xl text-sm" />
            <Input placeholder="Phone Number *" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="h-10 rounded-xl text-sm" />
          </div>
          <textarea value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} placeholder="Share your experience with this product..." rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none bg-white" />
          <Button onClick={submitReview} disabled={submitting || !form.rating || !form.customerName || !form.phone || !form.comment} className="w-full rounded-xl bg-orange-500 text-white hover:bg-orange-600">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      )}

      {submitted && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-700 mb-4 text-center">
          ✅ Thank you! Your review has been submitted.
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />)}</div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-8">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review.id} className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{review.customerName}</p>
                  <StarRating value={review.rating} />
                </div>
                <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              <p className="text-sm text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Product, formatPrice, getDiscountPercent, getWhatsAppLink } from '@/lib/products';
import { useStore } from '@/lib/store';
import { MessageCircle, ShoppingBag, Flame, Zap, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import CountdownTimer from './CountdownTimer';

export default function LocalDealsSection() {
  const { navigateTo } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const offerEnd = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => { setProducts(data.filter((p: Product) => p.isLocal)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white text-sm">📍</span>
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Local Sagar Deals</h2>
              </div>
              <p className="mt-1.5 text-sm text-gray-500">COD Available in Sagar — Cheaper than Flipkart!</p>
            </div>
            <div className="flex flex-col gap-2 sm:items-center">
              <CountdownTimer targetDate={offerEnd} label="Deal ends in" />
              <Button className="rounded-xl bg-orange-500 font-semibold text-white hover:bg-orange-600" onClick={() => navigateTo('products')}>
                View All →
              </Button>
            </div>
          </div>
          <div className="mt-3 h-1 w-12 rounded-full bg-green-500" />
        </motion.div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"><Zap className="mr-1 h-3 w-3" /> COD Available</Badge>
          <Badge className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700"><Flame className="mr-1 h-3 w-3" /> Sagar Exclusive</Badge>
          <Badge variant="outline" className="rounded-full border-green-300 text-xs font-medium text-green-600">🚚 Fast Delivery in Sagar</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-shimmer overflow-hidden rounded-2xl border border-gray-100">
                <div className="aspect-square" />
                <div className="p-4 space-y-2"><div className="h-3 w-24 rounded" /><div className="h-4 w-16 rounded" /><div className="h-8 w-full rounded-xl" /></div>
              </div>
            ))
          ) : (
            products.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/5 hover:border-green-200">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <Badge className="absolute left-2.5 top-2.5 rounded-lg bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white">📍 Sagar Deal</Badge>
                    {product.limitedStock && (
                      <Badge className="absolute right-2.5 top-2.5 rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">🔥 Limited</Badge>
                    )}
                  </div>
                  <div className="p-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{product.category}</p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">{product.name}</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}</span>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                      <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{getDiscountPercent(product.price, product.originalPrice)}% OFF</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="h-9 flex-1 rounded-xl bg-green-500 text-[11px] font-bold text-white hover:bg-green-600" onClick={(e) => { e.stopPropagation(); window.open(getWhatsAppLink(product), '_blank'); }}>
                        <MessageCircle className="mr-1 h-3.5 w-3.5" /> WhatsApp
                      </Button>
                      <Button size="sm" className="h-9 w-9 rounded-xl border-2 border-orange-200 text-orange-500 p-0 hover:bg-orange-50" onClick={(e) => { e.stopPropagation(); navigateTo('product'); }}>
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

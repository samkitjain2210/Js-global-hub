'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Product } from '@/lib/products';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

export default function BestSellers() {
  const { navigateTo } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => { setProducts(data.slice(0, 6)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-end justify-between md:mb-10"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Best Sellers 🔥</h2>
            <p className="mt-1.5 text-sm text-gray-500">Our most popular fitness gear</p>
            <div className="mt-3 h-1 w-12 rounded-full bg-orange-500" />
          </div>
          <Button variant="ghost" className="hidden text-sm font-semibold text-orange-500 hover:text-orange-600 sm:flex" onClick={() => navigateTo('products')}>
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            products.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Button variant="outline" className="rounded-xl text-orange-500" onClick={() => navigateTo('products')}>
            View All Products <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

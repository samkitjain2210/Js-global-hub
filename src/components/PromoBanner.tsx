'use client';

import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function PromoBanner() {
  const { navigateTo } = useStore();

  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 px-6 py-10 text-center md:px-12 md:py-14"
        >
          {/* Decorative circles */}
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10" />

          <div className="relative">
            <h2 className="text-xl font-extrabold text-white md:text-3xl">
              🎯 Flat 50% OFF on Your First Order!
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-orange-100 md:text-base">
              Use code <span className="font-mono font-bold text-white">FIRST50</span> at checkout. Limited time offer for new customers.
            </p>
            <Button
              onClick={() => navigateTo('products')}
              className="mt-6 h-11 rounded-full bg-white px-8 font-bold text-orange-600 shadow-lg shadow-orange-700/30 transition-all hover:bg-orange-50 hover:shadow-xl"
            >
              Shop Now →
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

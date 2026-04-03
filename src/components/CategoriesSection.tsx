'use client';

import { useStore } from '@/lib/store';
import { Smartphone, Shirt, Home, Dumbbell, Sparkles, Watch } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Electronics', description: 'Earbuds, speakers, gadgets & more', icon: Smartphone, color: 'bg-blue-100 text-blue-600', count: '50+' },
  { name: 'Fashion', description: 'T-shirts, bags, accessories & style', icon: Shirt, color: 'bg-pink-100 text-pink-600', count: '80+' },
  { name: 'Home & Kitchen', description: 'Lamps, cookware, decor & essentials', icon: Home, color: 'bg-amber-100 text-amber-600', count: '40+' },
  { name: 'Fitness', description: 'Gym gear, yoga mats & equipment', icon: Dumbbell, color: 'bg-green-100 text-green-600', count: '30+' },
  { name: 'Beauty & Care', description: 'Skincare, serum, grooming & wellness', icon: Sparkles, color: 'bg-purple-100 text-purple-600', count: '35+' },
  { name: 'Accessories', description: 'Bottles, watches, daily essentials', icon: Watch, color: 'bg-orange-100 text-orange-600', count: '25+' },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function CategoriesSection() {
  const { navigateTo } = useStore();

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center md:mb-14">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Shop by Category</h2>
          <p className="mt-2 text-sm text-gray-500">Everything you need, all in one place</p>
          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-orange-500" />
        </motion.div>
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5">
          {categories.map((cat) => (
            <motion.button key={cat.name} variants={item} onClick={() => navigateTo('products')}
              className="group rounded-2xl border border-gray-100 bg-gray-50/50 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 md:p-7">
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${cat.color} transition-transform group-hover:scale-110`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-semibold text-orange-600">{cat.count}</span>
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-900">{cat.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500 md:text-sm">{cat.description}</p>
              <span className="mt-3 inline-flex items-center text-sm font-semibold text-orange-500 opacity-0 transition-opacity group-hover:opacity-100">Browse →</span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { ChevronDown, Users, Star, Truck, Package, MapPin, ShoppingBag, Globe } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  const { navigateTo } = useStore();

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } } };
  const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-gray-900 md:min-h-screen">
      <div className="absolute inset-0">
        <Image src="/hero-banner.png" alt="JS Global Hub store" fill className="object-cover" priority quality={85} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      <div className="relative flex min-h-[85vh] items-center md:min-h-screen">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 md:px-6">
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-xl">
            <motion.div variants={item}>
              <Badge className="mb-5 gap-1.5 rounded-full bg-orange-500/90 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-orange-500/90">
                📍 Best Deals for Sagar — Shop Smart, Save More
              </Badge>
            </motion.div>
            <motion.h1 variants={item} className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              JS GLOBAL{' '}
              <span className="text-gradient">HUB</span>
            </motion.h1>
            <motion.p variants={item} className="mt-5 max-w-md text-base leading-relaxed text-gray-300 md:mt-6 md:text-lg">
              Your trusted local store in Sagar (MP). Premium products at unbeatable prices with Cash on Delivery. Exclusive local deals cheaper than Flipkart & Amazon!
            </motion.p>
            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button size="lg" className="h-12 min-w-[180px] rounded-full bg-green-500 text-base font-bold text-white shadow-lg shadow-green-500/30 transition-all hover:bg-green-600 hover:shadow-xl hover:shadow-green-500/40" onClick={() => navigateTo('products')}>
                <MapPin className="mr-2 h-5 w-5" />
                Shop Local (COD)
              </Button>
              <Button size="lg" variant="outline" className="h-12 min-w-[180px] rounded-full border-white/25 bg-white/5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white" onClick={() => navigateTo('products')}>
                <Globe className="mr-2 h-5 w-5" />
                Shop Online
              </Button>
            </motion.div>
            <motion.div variants={item} className="mt-12 flex flex-wrap gap-6 md:mt-16">
              {[
                { icon: Users, value: '10K+', label: 'Happy Customers' },
                { icon: Star, value: '500+', label: '5-Star Reviews' },
                { icon: Package, value: '500+', label: 'Products' },
                { icon: Truck, value: 'Sagar', label: 'Fast Delivery' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="glass-dark flex h-10 w-10 items-center justify-center rounded-xl">
                    <stat.icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{stat.value}</p>
                    <p className="text-[10px] text-gray-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <button onClick={() => document.getElementById('trust-badges')?.scrollIntoView({ behavior: 'smooth' })} className="animate-bounce-subtle text-white/50 transition-colors hover:text-white" aria-label="Scroll down">
          <ChevronDown className="h-6 w-6" />
        </button>
      </motion.div>
    </section>
  );
}

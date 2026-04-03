'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';

export default function StickyMobileCTA() {
  const { currentPage, navigateTo } = useStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showPages = ['home', 'product', 'products', 'about', 'contact', 'privacy', 'local-deals', 'online-products'];
    const onScroll = () => setVisible(window.scrollY > 300 && showPages.includes(currentPage));
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentPage]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 md:hidden"
        >
          <div className="flex items-center gap-2 rounded-2xl bg-gray-900 px-3 py-2.5 shadow-2xl">
            <Button
              size="sm"
              className="h-9 flex-1 rounded-xl bg-green-500 text-[11px] font-bold text-white shadow-lg"
              onClick={() => navigateTo('products')}
            >
              <MapPin className="mr-1 h-3.5 w-3.5" /> Shop Local
            </Button>
            <Button
              size="sm"
              className="h-9 flex-1 rounded-xl bg-orange-500 text-[11px] font-bold text-white shadow-lg"
              onClick={() => navigateTo('products')}
            >
              <Globe className="mr-1 h-3.5 w-3.5" /> Shop Online
            </Button>
            <Button
              size="sm"
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-green-600 p-0 text-white shadow-lg"
              onClick={() => window.open('https://wa.me/919876543210?text=' + encodeURIComponent('Hi JS Global Hub! I am interested in your products.'), '_blank')}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

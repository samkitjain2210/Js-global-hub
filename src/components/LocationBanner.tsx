'use client';

import { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';

export default function LocationBanner() {
  const { isLocalUser, setIsLocalUser } = useStore();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('jsgh-location');
    if (saved) setIsLocalUser(saved === 'true');
  }, [setIsLocalUser]);

  const handleSetLocation = (isLocal: boolean) => {
    setIsLocalUser(isLocal);
    localStorage.setItem('jsgh-location', String(isLocal));
    setDismissed(true);
  };

  if (dismissed || isLocalUser !== null) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:px-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-white/90" />
            <p className="text-xs font-medium text-white/95">
              Are you from <span className="font-bold">Sagar, MP</span>? Get exclusive COD deals!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="h-7 rounded-full px-3 text-xs font-bold text-white hover:bg-white/20" onClick={() => handleSetLocation(true)}>
              Yes, I'm from Sagar
            </Button>
            <Button size="sm" variant="ghost" className="h-7 rounded-full px-3 text-xs text-white/70 hover:bg-white/10" onClick={() => handleSetLocation(false)}>
              No, other city
            </Button>
            <button onClick={() => setDismissed(true)} className="text-white/50 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

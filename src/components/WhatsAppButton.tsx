'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const message = encodeURIComponent('Hi JS Global Hub! 👋\n\nI am interested in your products. Can you help me?');

  return (
    <motion.a
      href={`https://wa.me/919876543210?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 2, stiffness: 200, damping: 15 }}
      className="animate-pulse-ring fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition-transform hover:scale-110 hover:shadow-xl md:right-6 md:bottom-6"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </motion.a>
  );
}

'use client';

import { Banknote, Truck, Shield, RotateCcw, Headphones, BadgeCheck } from 'lucide-react';

const badges = [
  { icon: Banknote, label: 'COD Available' },
  { icon: Truck, label: 'Free Delivery' },
  { icon: Shield, label: 'Secure Payment' },
  { icon: RotateCcw, label: 'Easy Returns' },
  { icon: Headphones, label: '24/7 Support' },
  { icon: BadgeCheck, label: 'Genuine Products' },
];

export default function TrustBadges() {
  return (
    <div id="trust-badges" className="border-y border-gray-100 bg-gray-50/50 py-3">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-center gap-4 overflow-x-auto md:gap-8 md:overflow-visible">
          {badges.map((b) => (
            <div key={b.label} className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-gray-500 md:text-xs">
              <b.icon className="h-4 w-4 text-orange-500" />
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

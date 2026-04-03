'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  targetDate: string;
  label?: string;
}

export default function CountdownTimer({ targetDate, label = 'Offer ends in' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { clearInterval(timer); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hrs' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ];

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-orange-500" />
      <span className="text-xs font-medium text-gray-500 mr-1">{label}:</span>
      <div className="flex items-center gap-1">
        {units.map((u) => (
          <span key={u.label} className="flex flex-col items-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-xs font-bold text-white">
              {String(u.value).padStart(2, '0')}
            </span>
            <span className="mt-0.5 text-[9px] font-medium text-gray-400">{u.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useStore } from '@/lib/store';
import { Shield, Truck, Clock, RotateCcw, Phone, Mail, MessageCircle, Instagram, Facebook, Twitter, Youtube, Send, ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Footer() {
  const { navigateTo } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="mt-auto">
      {/* Newsletter */}
      <div className="bg-gradient-brand py-10 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left md:justify-between">
            <div>
              <h3 className="text-xl font-bold text-white md:text-2xl">
                Get 10% Off Your First Order
              </h3>
              <p className="mt-1 text-sm text-orange-100">
                Subscribe to our newsletter for exclusive deals and updates
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-sm gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-200" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl border-0 bg-white/20 pl-10 pr-4 text-white placeholder:text-orange-200 backdrop-blur-sm focus:bg-white/30 focus:ring-2 focus:ring-white/40"
                />
              </div>
              <Button
                type="submit"
                className="h-11 shrink-0 rounded-xl bg-white px-5 font-semibold text-orange-600 hover:bg-orange-50"
              >
                {subscribed ? '✓ Subscribed' : <><Send className="mr-1.5 h-4 w-4" /> Subscribe</>}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gray-900 pt-12 pb-8 text-gray-300 md:pt-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Image
                src="/jsglobalhub-logo.jpg"
                alt="JS Global Hub"
                width={130}
                height={38}
                className="h-8 w-auto brightness-200"
              />
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                Your trusted local store in Sagar, Madhya Pradesh. Premium products at unbeatable prices with Cash on Delivery. Exclusive local deals cheaper than Flipkart & Amazon!
              </p>
              <div className="mt-5 flex gap-3">
                <a
                  href="https://instagram.com/jsglobalhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-all hover:bg-gradient-to-tr hover:from-purple-500 hover:to-pink-500 hover:text-white"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://facebook.com/jsglobalhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-all hover:bg-blue-600 hover:text-white"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com/jsglobalhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-all hover:bg-sky-500 hover:text-white"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://youtube.com/@jsglobalhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-all hover:bg-red-600 hover:text-white"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Home', page: 'home' as const },
                  { label: 'Shop All Products', page: 'products' as const },
                  { label: 'About Us', page: 'about' as const },
                  { label: 'Contact Us', page: 'contact' as const },
                  { label: 'Privacy Policy', page: 'privacy' as const },
                ].map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigateTo(link.page)}
                      className="group flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-orange-400"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                Categories
              </h4>
              <ul className="space-y-2.5">
                {['Electronics', 'Fashion', 'Home & Kitchen', 'Fitness', 'Beauty & Care', 'Accessories'].map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => navigateTo('products')}
                      className="group flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-orange-400"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                Contact Us
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/15">
                    <MessageCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">WhatsApp</p>
                    <p className="text-sm font-medium text-gray-300">+91 98765 43210</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/15">
                    <Phone className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-300">+91 98765 43210</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15">
                    <Mail className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-300">support@jsglobalhub.com</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/15">
                    <MapPin className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-300">Sagar, Madhya Pradesh</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col items-center gap-4 border-t border-gray-800 pt-6 md:flex-row md:justify-between">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} JS Global Hub. All Rights Reserved. Made with ❤️ in Sagar, MP
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                COD in Sagar
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                Local Deals
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Online Products
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
                Instagram
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

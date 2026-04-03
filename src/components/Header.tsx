'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, Search, X, Shield, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useStore } from '@/lib/store';
import { useIsMobile } from '@/hooks/use-mobile';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

const ANNOUNCEMENT_TEXT = '🚚 FREE Delivery on orders above ₹499 in Sagar   •   💵 COD Available in Sagar (MP)   •   📍 Local Deals at Best Prices   •   🔄 Easy 7-Day Returns';

export default function Header() {
  const { navigateTo, cartItemCount, setCartOpen, currentPage } = useStore();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemCount = cartItemCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    setSearchQuery('');
    navigateTo('products');
  };

  const navLinks = [
    { label: 'Home', page: 'home' as const },
    { label: 'Shop', page: 'products' as const },
    { label: 'About Us', page: 'about' as const },
    { label: 'Contact', page: 'contact' as const },
    { label: 'Privacy Policy', page: 'privacy' as const },
    { label: 'Admin', page: 'admin' as const },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement Bar */}
      <div className="bg-gray-900 py-1.5 text-[11px] font-medium text-gray-300 md:text-xs">
        <div className="overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            <span className="mx-8">{ANNOUNCEMENT_TEXT}</span>
            <span className="mx-8">{ANNOUNCEMENT_TEXT}</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? 'border-gray-200 bg-white/95 shadow-lg backdrop-blur-md'
            : 'border-transparent bg-white'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:h-17 md:px-6">
          {/* Logo */}
          <button onClick={() => navigateTo('home')} className="shrink-0">
            <Image
              src="/jsglobalhub-logo.jpg"
              alt="JS Global Hub"
              width={130}
              height={38}
              className="h-7 w-auto md:h-9"
              priority
            />
          </button>

          {/* Desktop Nav */}
          {!isMobile && (
            <nav className="flex items-center gap-1">
              {navLinks.slice(0, 5).map((link) => (
                <button
                  key={link.page}
                  onClick={() => navigateTo(link.page)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    currentPage === link.page
                      ? 'text-orange-500'
                      : 'text-gray-600 hover:text-orange-500'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}

          {/* Desktop Search */}
          {!isMobile && (
            <form onSubmit={handleSearch} className="mx-auto max-w-xs flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-full border-gray-200 bg-gray-50 pl-10 pr-4 text-sm transition-all focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </form>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            {/* Instagram */}
            <a
              href="https://instagram.com/jsglobalhub"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex h-10 w-10 items-center justify-center text-gray-400 hover:text-pink-500 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>

            {/* Mobile Search Toggle */}
            {isMobile && !searchOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-600 hover:text-orange-500"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 text-gray-600 hover:text-orange-500"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white"
                >
                  {itemCount}
                </motion.span>
              )}
            </Button>

            {/* Mobile Menu */}
            {isMobile && (
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600 hover:text-orange-500">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <div className="flex flex-col gap-6 pt-6">
                    <button onClick={() => { navigateTo('home'); setMenuOpen(false); }}>
                      <Image src="/jsglobalhub-logo.jpg" alt="JS Global Hub" width={110} height={32} className="h-7 w-auto" />
                    </button>
                    <nav className="flex flex-col gap-1">
                      {navLinks.map((link) => (
                        <button
                          key={link.page}
                          onClick={() => { navigateTo(link.page); setMenuOpen(false); }}
                          className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                            currentPage === link.page
                              ? 'bg-orange-50 font-semibold text-orange-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {link.label}
                        </button>
                      ))}
                    </nav>
                    <div className="flex items-center gap-3 px-4">
                      <a
                        href="https://instagram.com/jsglobalhub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500 transition-colors"
                      >
                        <Instagram className="h-4 w-4" />
                        Follow on Instagram
                      </a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {searchOpen && isMobile && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-100"
            >
              <form onSubmit={handleSearch} className="flex items-center gap-2 px-4 py-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    autoFocus
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 rounded-full border-gray-200 bg-gray-50 pl-10 pr-4 text-sm"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-gray-400"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

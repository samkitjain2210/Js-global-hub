'use client';

import { useState, useEffect, useMemo } from 'react';
import { type Product, CATEGORIES, formatPrice, getWhatsAppLink, getDiscountPercent } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { MessageCircle, ExternalLink, ShoppingBag, Filter, SlidersHorizontal } from 'lucide-react';
import { useStore } from '@/lib/store';
import Image from 'next/image';

export default function ProductList() {
  const { navigateTo, selectProduct } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('popular');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (activeTab === 'local') result = result.filter((p) => p.isLocal);
    else if (activeTab === 'online') result = result.filter((p) => !p.isLocal);

    if (category !== 'all') result = result.filter((p) => p.category === category);

    switch (sort) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: result.sort((a, b) => b.reviews - a.reviews);
    }
    return result;
  }, [category, sort, activeTab, products]);

  const localProducts = useMemo(() => products.filter((p) => p.isLocal), [products]);
  const onlineProducts = useMemo(() => products.filter((p) => !p.isLocal), [products]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Shop All Products</h1>
        <p className="mt-1 text-sm text-gray-500">
          {loading ? 'Loading...' : `${products.length} products — Local deals & online listings`}
        </p>
        <div className="mt-3 h-1 w-12 rounded-full bg-orange-500" />
      </div>

      {/* Tabs: All / Local Deals / Online Products */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-6 h-auto flex-wrap gap-2 bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-orange-500 data-[state=active]:shadow-md data-[state=active]:shadow-orange-500/20"
          >
            All Products ({products.length})
          </TabsTrigger>
          <TabsTrigger
            value="local"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:border-green-500 data-[state=active]:shadow-md data-[state=active]:shadow-green-500/20"
          >
            📍 Local Sagar Deals ({localProducts.length})
          </TabsTrigger>
          <TabsTrigger
            value="online"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:border-blue-500 data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/20"
          >
            🌐 Online Products ({onlineProducts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button key={cat.value} variant={category === cat.value ? 'default' : 'outline'} size="sm"
                  className={`rounded-xl transition-all ${category === cat.value ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20' : 'hover:border-orange-300 hover:text-orange-500'}`}
                  onClick={() => setCategory(cat.value)}>
                  {cat.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-400" />
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100">
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              filtered.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </div>

          {!loading && filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg font-medium text-gray-400">No products found in this category</p>
              <Button className="mt-4 rounded-xl bg-orange-500 text-white hover:bg-orange-600" onClick={() => setCategory('all')}>View All Products</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="local" className="mt-0">
          {/* Local Deals Section */}
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 md:p-5">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white hover:bg-green-500">📍 Sagar Exclusive</Badge>
              <Badge className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">COD Available</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">Exclusive deals for Sagar customers. Cash on Delivery available. Order on WhatsApp for fastest service!</p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              filtered.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="group overflow-hidden rounded-2xl border border-green-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/5 hover:border-green-200">
                    <div className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer" onClick={() => selectProduct(product)}>
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      <Badge className="absolute left-2.5 top-2.5 rounded-lg bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-green-500">📍 Sagar Deal</Badge>
                      {product.limitedStock && (
                        <Badge className="absolute right-2.5 top-2.5 rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse hover:bg-red-500">🔥 Limited</Badge>
                      )}
                      {getDiscountPercent(product.price, product.originalPrice) > 0 && (
                        <Badge className="absolute left-2.5 bottom-2.5 rounded-lg bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm hover:bg-black/70">
                          {getDiscountPercent(product.price, product.originalPrice)}% OFF
                        </Badge>
                      )}
                    </div>
                    <div className="p-3.5">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{product.category}</p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900 cursor-pointer hover:text-orange-500" onClick={() => selectProduct(product)}>{product.name}</h3>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      <p className="mt-1 text-[10px] text-gray-400">Cheaper than Flipkart!</p>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" className="h-9 flex-1 rounded-xl bg-green-500 text-[11px] font-bold text-white hover:bg-green-600"
                          onClick={(e) => { e.stopPropagation(); window.open(getWhatsAppLink(product), '_blank'); }}>
                          <MessageCircle className="mr-1 h-3.5 w-3.5" /> WhatsApp
                        </Button>
                        <Button size="sm" className="h-9 w-9 rounded-xl border-2 border-orange-200 text-orange-500 p-0 hover:bg-orange-50"
                          onClick={(e) => { e.stopPropagation(); selectProduct(product); }}>
                          <ShoppingBag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {!loading && filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg font-medium text-gray-400">No local deals available right now</p>
              <Button className="mt-4 rounded-xl bg-orange-500 text-white hover:bg-orange-600" onClick={() => setActiveTab('online')}>Browse Online Products</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="online" className="mt-0">
          {/* Online Products Section */}
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-5">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white hover:bg-blue-500">🌐 Online</Badge>
              <Badge className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">Verified Listings</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">Buy directly from our Flipkart & Amazon listings. Pan India delivery available!</p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              filtered.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" onClick={() => selectProduct(product)}>
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      <Badge className="absolute left-2.5 top-2.5 rounded-lg bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-gray-900 hover:bg-yellow-400">
                        {product.flipkartLink !== '#' ? 'Flipkart' : product.amazonLink !== '#' ? 'Amazon' : 'Online'}
                      </Badge>
                      {getDiscountPercent(product.price, product.originalPrice) > 0 && (
                        <Badge className="absolute left-2.5 bottom-2.5 rounded-lg bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm hover:bg-black/70">
                          {getDiscountPercent(product.price, product.originalPrice)}% OFF
                        </Badge>
                      )}
                    </div>
                    <div className="p-3.5">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{product.category}</p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">{product.name}</h3>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="mt-3 h-9 w-full rounded-xl bg-yellow-400 text-[11px] font-bold text-gray-900 hover:bg-yellow-300"
                        onClick={(e) => { e.stopPropagation(); window.open(product.flipkartLink !== '#' ? product.flipkartLink : product.amazonLink, '_blank'); }}
                      >
                        <ExternalLink className="mr-1 h-3.5 w-3.5" /> Buy on {product.flipkartLink !== '#' ? 'Flipkart' : 'Amazon'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {!loading && filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg font-medium text-gray-400">No online products available right now</p>
              <Button className="mt-4 rounded-xl bg-orange-500 text-white hover:bg-orange-600" onClick={() => setActiveTab('local')}>Browse Local Deals</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

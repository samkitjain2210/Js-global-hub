'use client';

import { useState } from 'react';
import { Star, ShoppingCart, Minus, Plus, Truck, Shield, CheckCircle2, ExternalLink, ChevronRight, Home, BadgeCheck, RotateCcw, Zap, MessageCircle, MapPin, Clock, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type Product, getDiscountPercent, formatPrice, getWhatsAppLink } from '@/lib/products';
import { useStore } from '@/lib/store';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { selectedProduct, addToCart, navigateTo } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!selectedProduct) return null;
  const product = selectedProduct;
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const savings = product.originalPrice - product.price;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10"
    >
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-gray-400 md:text-sm">
        <button onClick={() => navigateTo('home')} className="hover:text-orange-500">Home</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => navigateTo('products')} className="hover:text-orange-500">Products</button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-700">{product.name}</span>
      </nav>

      {/* Local Deal Banner */}
      {product.isLocal && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white md:p-5"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold">Exclusive Local Offer — Sagar Only</h3>
                <p className="text-sm text-green-100">COD Available • Fast 1-2 Day Delivery • Cheaper than Flipkart!</p>
              </div>
            </div>
            <Button
              className="mt-2 h-10 rounded-xl bg-white px-5 font-bold text-green-600 shadow-lg hover:bg-green-50 sm:mt-0"
              onClick={() => window.open(getWhatsAppLink(product), '_blank')}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Order on WhatsApp
            </Button>
          </div>
        </motion.div>
      )}

      {/* Online Product Banner */}
      {!product.isOwnProduct && !product.isLocal && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white md:p-5"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <ExternalLink className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold">Available on Flipkart / Amazon</h3>
                <p className="text-sm text-blue-100">Buy directly from our verified listings • Pan India Delivery</p>
              </div>
            </div>
            <Button
              className="mt-2 h-10 rounded-xl bg-white px-5 font-bold text-blue-600 shadow-lg hover:bg-blue-50 sm:mt-0"
              onClick={() => window.open(product.flipkartLink !== '#' ? product.flipkartLink : product.amazonLink, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" /> Buy Now on {product.flipkartLink !== '#' ? 'Flipkart' : 'Amazon'}
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 shadow-sm">
            <Image src={product.images[selectedImage]} alt={product.name} fill className="object-cover" priority />
            {discount > 0 && (
              <Badge className="absolute left-4 top-4 rounded-lg bg-green-500 px-2.5 py-1 text-sm font-bold text-white hover:bg-green-500">{discount}% OFF</Badge>
            )}
            {product.limitedStock && (
              <Badge className="absolute right-4 top-4 rounded-lg bg-red-500 px-2.5 py-1 text-sm font-bold text-white animate-pulse hover:bg-red-500">🔥 Limited Stock</Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(idx)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${selectedImage === idx ? 'border-orange-500 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info — Sticky on Desktop */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-lg text-xs capitalize">{product.category}</Badge>
            {product.isLocal && (
              <Badge className="rounded-lg bg-green-100 text-xs font-semibold text-green-700 hover:bg-green-100">📍 Sagar Exclusive</Badge>
            )}
            {!product.isOwnProduct && (
              <Badge className="rounded-lg bg-yellow-100 text-xs font-semibold text-yellow-700 hover:bg-yellow-100">🌐 Online Listing</Badge>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">{product.name}</h1>

          {/* Rating + Bought */}
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
              ))}
              <span className="ml-1 text-sm font-medium text-gray-600">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
            <span className="text-sm text-gray-400">·</span>
            <span className="text-sm text-orange-600 font-medium">1.2K+ bought last month</span>
          </div>

          <Separator className="my-4" />

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-3">
            <span className={`text-3xl font-extrabold ${product.isLocal ? 'text-green-600' : 'text-gray-900'}`}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="rounded-lg bg-green-50 px-2 py-0.5 text-sm font-semibold text-green-600">
                  You save {formatPrice(savings)} ({discount}%)
                </span>
              </>
            )}
          </div>

          {/* Local vs Online Price Comparison */}
          {product.isLocal && (
            <div className="mt-3 rounded-xl bg-green-50 border border-green-200 p-3">
              <p className="text-xs font-semibold text-green-700 mb-1">💰 Price Comparison</p>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Sagar Price: </span>
                  <span className="font-bold text-green-600">{formatPrice(product.price)}</span>
                  <span className="text-[10px] ml-1 text-green-600 bg-green-100 px-1.5 py-0.5 rounded font-semibold">BEST</span>
                </div>
                <div>
                  <span className="text-gray-500">Flipkart: </span>
                  <span className="font-medium text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                </div>
              </div>
              <p className="mt-1 text-[11px] text-green-600">You save {formatPrice(savings)} by ordering locally!</p>
            </div>
          )}

          {/* Offers */}
          <div className="mt-4 flex flex-wrap gap-2">
            {product.isLocal && [
              { icon: BadgeCheck, label: 'COD in Sagar', color: 'text-green-500 bg-green-50' },
              { icon: Zap, label: 'Best Price', color: 'text-orange-500 bg-orange-50' },
              { icon: Truck, label: 'Fast Delivery', color: 'text-blue-500 bg-blue-50' },
              { icon: RotateCcw, label: 'Easy Returns', color: 'text-purple-500 bg-purple-50' },
            ].map((offer) => (
              <span key={offer.label} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${offer.color}`}>
                <offer.icon className="h-3.5 w-3.5" />
                {offer.label}
              </span>
            ))}
            {!product.isLocal && !product.isOwnProduct && [
              { icon: ExternalLink, label: 'Buy on Flipkart', color: 'text-yellow-600 bg-yellow-50' },
              { icon: Truck, label: 'Free Delivery', color: 'text-blue-500 bg-blue-50' },
              { icon: BadgeCheck, label: 'Verified Listing', color: 'text-green-500 bg-green-50' },
            ].map((offer) => (
              <span key={offer.label} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${offer.color}`}>
                <offer.icon className="h-3.5 w-3.5" />
                {offer.label}
              </span>
            ))}
            {product.isOwnProduct && !product.isLocal && [
              { icon: Zap, label: 'Best Price', color: 'text-orange-500 bg-orange-50' },
              { icon: Truck, label: 'Free Delivery', color: 'text-blue-500 bg-blue-50' },
              { icon: BadgeCheck, label: 'COD Available', color: 'text-green-500 bg-green-50' },
              { icon: RotateCcw, label: '7-Day Return', color: 'text-purple-500 bg-purple-50' },
            ].map((offer) => (
              <span key={offer.label} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${offer.color}`}>
                <offer.icon className="h-3.5 w-3.5" />
                {offer.label}
              </span>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Description */}
          <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>

          {/* Benefits */}
          {product.benefits.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-900">Key Benefits</h3>
              <ul className="space-y-1.5">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator className="my-4" />

          {/* Delivery Info */}
          {product.isLocal ? (
            <div className="rounded-xl bg-green-50 border border-green-100 p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900">Fast Delivery in Sagar</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Estimated delivery in 1-2 business days within Sagar city</p>
              <div className="mt-2 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs text-gray-500">Order by 6 PM for same-day processing</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium text-gray-900">Delivery across India</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Estimated delivery in 3-5 business days</p>
            </div>
          )}

          {/* Quantity + Actions */}
          <div className="mt-6 space-y-3">
            {product.isOwnProduct && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center overflow-hidden rounded-xl border border-gray-200">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-10 w-10 items-center justify-center text-gray-500 transition-colors hover:bg-gray-100">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex h-10 w-12 items-center justify-center border-x border-gray-200 text-sm font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="flex h-10 w-10 items-center justify-center text-gray-500 transition-colors hover:bg-gray-100">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {product.isLocal ? (
              <>
                <Button size="lg" className="h-12 w-full rounded-xl bg-green-500 text-base font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-600 hover:shadow-xl"
                  onClick={() => window.open(getWhatsAppLink(product), '_blank')}>
                  <MessageCircle className="mr-2 h-5 w-5" /> Order on WhatsApp — COD Available
                </Button>
                <Button size="lg" className="h-12 w-full rounded-xl border-2 border-orange-500 bg-transparent text-base font-bold text-orange-500 transition-all hover:bg-orange-50"
                  onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart — {formatPrice(product.price)}
                </Button>
              </>
            ) : product.isOwnProduct ? (
              <>
                <Button size="lg" className="h-12 w-full rounded-xl border-2 border-orange-500 bg-transparent text-base font-bold text-orange-500 transition-all hover:bg-orange-50" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                <Button size="lg" className="h-12 w-full rounded-xl bg-green-500 text-base font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-600 hover:shadow-xl" onClick={handleAddToCart}>
                  Buy Now →
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" className="h-12 w-full rounded-xl bg-yellow-400 text-base font-bold text-gray-900 transition-all hover:bg-yellow-300 shadow-lg shadow-yellow-400/20"
                  onClick={() => window.open(product.flipkartLink !== '#' ? product.flipkartLink : product.amazonLink, '_blank')}>
                  <ExternalLink className="mr-2 h-5 w-5" /> Buy on {product.flipkartLink !== '#' ? 'Flipkart' : 'Amazon'} — {formatPrice(product.price)}
                </Button>
                {product.amazonLink !== '#' && product.flipkartLink !== '#' && (
                  <Button size="lg" variant="outline" className="h-12 w-full rounded-xl border-orange-200 text-base font-bold text-orange-500 transition-all hover:bg-orange-50"
                    onClick={() => window.open(product.amazonLink, '_blank')}>
                    <ExternalLink className="mr-2 h-5 w-5" /> Buy on Amazon — {formatPrice(product.price)}
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Trust Row */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-green-500" /> Genuine Product</span>
            <span className="flex items-center gap-1"><BadgeCheck className="h-3.5 w-3.5 text-blue-500" /> Secure Payment</span>
            <span className="flex items-center gap-1"><RotateCcw className="h-3.5 w-3.5 text-purple-500" /> Easy Returns</span>
            {product.isLocal && (
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-orange-500" /> Sagar Fast Delivery</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

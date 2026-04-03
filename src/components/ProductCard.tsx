'use client';

import { Star, ShoppingCart, ExternalLink, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Product, getDiscountPercent, formatPrice, getWhatsAppLink } from '@/lib/products';
import { useStore } from '@/lib/store';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: Product }) {
  const { selectProduct, addToCart } = useStore();
  const discount = getDiscountPercent(product.price, product.originalPrice);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5"
        onClick={() => selectProduct(product)}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {discount > 0 && (
            <Badge className="absolute left-3 top-3 rounded-lg bg-green-500 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-green-500">
              {discount}% OFF
            </Badge>
          )}
          {product.isLocal && (
            <Badge className="absolute right-3 top-3 rounded-lg bg-green-500 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-green-500">
              📍 Sagar Deal
            </Badge>
          )}
          {!product.isOwnProduct && !product.isLocal && (
            <Badge className="absolute right-3 top-3 rounded-lg bg-yellow-400 px-2 py-0.5 text-[11px] font-bold text-gray-900 hover:bg-yellow-400">
              {product.flipkartLink !== '#' ? 'Flipkart' : 'Online'}
            </Badge>
          )}
          {product.limitedStock && (
            <Badge className="absolute left-3 bottom-3 rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse hover:bg-red-500">
              🔥 Limited Stock
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-3.5 md:p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            {product.category}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-lg font-bold ${product.isLocal ? 'text-green-600' : 'text-gray-900'}`}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-[11px] font-semibold text-green-600">{discount}% off</span>
            )}
          </div>

          {product.isLocal && (
            <p className="mt-1 text-[10px] text-green-600 font-medium">COD Available in Sagar</p>
          )}

          {/* Action */}
          <div className="mt-3">
            {product.isLocal ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-10 flex-1 rounded-xl bg-green-500 text-xs font-bold text-white transition-all hover:bg-green-600 hover:shadow-md hover:shadow-green-500/20"
                  onClick={(e) => { e.stopPropagation(); window.open(getWhatsAppLink(product), '_blank'); }}
                >
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                  WhatsApp
                </Button>
                <Button
                  size="sm"
                  className="h-10 w-10 rounded-xl border-2 border-orange-200 text-orange-500 p-0 hover:bg-orange-50"
                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            ) : product.isOwnProduct ? (
              <Button
                size="sm"
                className="h-10 w-full rounded-xl bg-green-500 text-xs font-semibold text-white transition-all hover:bg-green-600 hover:shadow-md hover:shadow-green-500/20"
                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              >
                <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                Add to Cart
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-10 w-full rounded-xl bg-yellow-400 text-xs font-semibold text-gray-900 transition-all hover:bg-yellow-300 hover:shadow-md"
                onClick={(e) => { e.stopPropagation(); window.open(product.flipkartLink !== '#' ? product.flipkartLink : product.amazonLink, '_blank'); }}
              >
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Buy on {product.flipkartLink !== '#' ? 'Flipkart' : 'Amazon'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

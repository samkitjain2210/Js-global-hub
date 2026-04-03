'use client';

import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/products';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQuantity, removeFromCart, cartTotal, navigateTo } = useStore();
  const total = cartTotal();
  const shippingFree = total >= 499;
  const shippingCost = shippingFree ? 0 : 49;
  const progress = Math.min((total / 499) * 100, 100);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-lg font-bold">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            Shopping Cart
            <span className="text-sm font-normal text-gray-400">({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <ShoppingBag className="h-10 w-10 text-gray-300" />
            </div>
            <p className="font-medium text-gray-500">Your cart is empty</p>
            <p className="text-sm text-gray-400">Add some items to get started</p>
            <Button className="mt-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600" onClick={() => { setCartOpen(false); navigateTo('products'); }}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 pb-4">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="line-clamp-1 text-sm font-semibold text-gray-900">{item.product.name}</p>
                          <p className="mt-0.5 text-sm font-bold text-orange-500">{formatPrice(item.product.price)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                            <button className="flex h-7 w-7 items-center justify-center text-gray-500 hover:text-gray-700" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="flex h-7 w-8 items-center justify-center text-xs font-semibold border-x border-gray-200">{item.quantity}</span>
                            <button className="flex h-7 w-7 items-center justify-center text-gray-500 hover:text-gray-700" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-gray-300 transition-colors hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t bg-gray-50 px-4 pt-4">
              {/* Free delivery progress */}
              {!shippingFree && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Add {formatPrice(499 - total)} more for FREE delivery</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shippingFree ? 'font-semibold text-green-600' : ''}>
                    {shippingFree ? '✓ FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span><span>{formatPrice(total + shippingCost)}</span>
                </div>
              </div>

              <Button className="mt-4 h-12 w-full rounded-xl bg-green-500 text-base font-bold text-white shadow-lg shadow-green-500/20 hover:bg-green-600" onClick={() => { setCartOpen(false); navigateTo('checkout'); }}>
                Proceed to Checkout →
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

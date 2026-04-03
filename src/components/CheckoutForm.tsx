'use client';

import { useState } from 'react';
import { CheckCircle2, ArrowLeft, ArrowRight, ShoppingBag, Package, CreditCard, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/products';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 1 | 2 | 3 | 4;

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh"
];

interface FormData {
  fullName: string; phone: string; email: string; address1: string; address2: string;
  city: string; state: string; pincode: string; paymentMethod: string;
}

const emptyForm: FormData = {
  fullName: '', phone: '', email: '', address1: '', address2: '', city: '', state: '', pincode: '', paymentMethod: 'cod',
};

export default function CheckoutForm() {
  const { cart, cartTotal, clearCart, navigateTo } = useStore();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);

  const total = cartTotal();
  const shippingFree = total >= 499;
  const shippingCost = shippingFree ? 0 : 49;
  const grandTotal = total + shippingCost;

  const updateField = (field: keyof FormData, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  const validateStep1 = () => {
    if (!formData.fullName.trim() || !/^\d{10}$/.test(formData.phone) || !formData.address1.trim() || !formData.city.trim() || !formData.state.trim() || !/^\d{6}$/.test(formData.pincode)) return false;
    return true;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.fullName, phone: formData.phone, email: formData.email,
          address: `${formData.address1}${formData.address2 ? ', ' + formData.address2 : ''}`,
          city: formData.city, state: formData.state, pincode: formData.pincode,
          items: cart.map((item) => ({ productId: item.product.id, name: item.product.name, price: item.product.price, quantity: item.quantity })),
          totalAmount: grandTotal, paymentMethod: formData.paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.id) { setOrderId(data.id); setStep(4); clearCart(); }
    } catch { alert('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleWhatsAppShare = () => {
    const msg = `Hi! I just placed an order on JS Global Hub 🏋️\n\nOrder ID: ${orderId}\nTotal: ${formatPrice(grandTotal)}\n\nThank you!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const stepLabels = [
    { num: 1, label: 'Shipping', icon: MapPin },
    { num: 2, label: 'Summary', icon: Package },
    { num: 3, label: 'Payment', icon: CreditCard },
  ];

  // Empty cart
  if (cart.length === 0 && !orderId) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <ShoppingBag className="h-10 w-10 text-gray-300" />
          </div>
        </motion.div>
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="mt-1 text-sm text-gray-500">Add some items before checkout</p>
        <Button className="mt-5 rounded-xl bg-orange-500 text-white hover:bg-orange-600" onClick={() => navigateTo('products')}>Shop Now</Button>
      </div>
    );
  }

  // Success
  if (step === 4 && orderId) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-lg px-4 py-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900">Order Confirmed! 🎉</h2>
        <p className="mt-2 text-sm text-gray-500">Thank you for shopping with JS Global Hub</p>
        <Card className="mt-6 text-left">
          <CardContent className="p-5 space-y-2.5 text-sm">
            {[
              { label: 'Order ID', value: orderId },
              { label: 'Total', value: formatPrice(grandTotal) },
              { label: 'Payment', value: 'Cash on Delivery' },
              { label: 'Delivery', value: '3-5 business days' },
            ].map((row) => (
              <div key={row.label} className="flex justify-between"><span className="text-gray-500">{row.label}</span><span className="font-semibold text-gray-900">{row.value}</span></div>
            ))}
          </CardContent>
        </Card>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button className="rounded-xl bg-green-500 font-semibold text-white hover:bg-green-600" onClick={handleWhatsAppShare}>
            <MessageCircle className="mr-2 h-4 w-4" /> Share on WhatsApp
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={() => navigateTo('home')}>Continue Shopping</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-10">
      <button onClick={() => { if (step === 1) navigateTo('products'); else setStep((step - 1) as Step); }} className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {stepLabels.map((s, idx) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                  step >= s.num ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
                </div>
                <span className={`mt-1 text-[10px] font-medium md:text-xs ${step >= s.num ? 'text-orange-500' : 'text-gray-400'}`}>{s.label}</span>
              </div>
              {idx < stepLabels.length - 1 && (
                <div className={`mx-2 mb-5 h-0.5 w-10 md:mx-4 md:w-20 transition-all duration-300 ${step > s.num ? 'bg-orange-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Shipping */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Shipping Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" placeholder="John Doe" value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} className="mt-1.5 h-11 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">+91</span>
                  <Input id="phone" placeholder="9876543210" maxLength={10} value={formData.phone} onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, ''))} className="h-11 rounded-xl pl-10" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email (optional)</Label>
                <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="mt-1.5 h-11 rounded-xl" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address1">Address Line 1 *</Label>
                <Input id="address1" placeholder="House/Flat No., Street" value={formData.address1} onChange={(e) => updateField('address1', e.target.value)} className="mt-1.5 h-11 rounded-xl" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input id="address2" placeholder="Landmark, Area" value={formData.address2} onChange={(e) => updateField('address2', e.target.value)} className="mt-1.5 h-11 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" placeholder="Mumbai" value={formData.city} onChange={(e) => updateField('city', e.target.value)} className="mt-1.5 h-11 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <select id="state" value={formData.state} onChange={(e) => updateField('state', e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100">
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input id="pincode" placeholder="400001" maxLength={6} value={formData.pincode} onChange={(e) => updateField('pincode', e.target.value.replace(/\D/g, ''))} className="mt-1.5 h-11 rounded-xl" />
              </div>
            </div>
            <Button className="mt-4 h-12 w-full rounded-xl bg-orange-500 text-base font-bold text-white hover:bg-orange-600" onClick={() => setStep(2)} disabled={!validateStep1()}>
              Continue to Summary <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Step 2: Summary */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            <Card className="rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{formData.fullName}</p>
                    <p className="mt-1 text-xs text-gray-500">{formData.address1}{formData.address2 ? `, ${formData.address2}` : ''}</p>
                    <p className="text-xs text-gray-500">{formData.city}, {formData.state} - {formData.pincode}</p>
                    <p className="text-xs text-gray-500">Phone: +91 {formData.phone}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-orange-500">Edit</Button>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shippingFree ? 'font-semibold text-green-600' : ''}>{shippingFree ? '✓ FREE' : formatPrice(shippingCost)}</span></div>
              <Separator />
              <div className="flex justify-between text-lg font-bold text-gray-900"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button className="flex-1 rounded-xl bg-orange-500 text-white hover:bg-orange-600" onClick={() => setStep(3)}>Payment <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
            <div className="rounded-xl border-2 border-green-500 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500"><CreditCard className="h-5 w-5 text-white" /></div>
                <div className="flex-1"><p className="text-sm font-semibold text-gray-900">Cash on Delivery</p><p className="text-xs text-gray-500">Pay when your order arrives at your doorstep</p></div>
                <span className="rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-semibold text-white">Recommended</span>
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">You&apos;re paying</span>
                <span className="text-lg font-bold text-gray-900">{formatPrice(grandTotal)}</span>
              </div>
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-500"><Package className="h-3.5 w-3.5" /> Delivery in 3-5 business days</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(2)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button className="h-12 flex-1 rounded-xl bg-green-500 text-base font-bold text-white shadow-lg shadow-green-500/20 hover:bg-green-600" onClick={handlePlaceOrder} disabled={loading}>
                {loading ? 'Placing Order...' : 'Place Order ✓'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { Search, Package, CheckCircle2, Truck, Clock, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/products';

interface OrderData {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-100' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-100' },
  { key: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-100' },
  { key: 'delivered', label: 'Delivered', icon: Package, color: 'text-green-500', bg: 'bg-green-100' },
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReturn, setShowReturn] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnDesc, setReturnDesc] = useState('');
  const [returnSubmitted, setReturnSubmitted] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);

  const trackOrder = async () => {
    if (!orderId.trim()) return;
    setLoading(true); setError(''); setOrder(null);
    try {
      const res = await fetch(`/api/orders/${orderId.trim()}`);
      if (!res.ok) { setError('Order not found. Please check your Order ID.'); return; }
      const data = await res.json();
      setOrder(data);
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const submitReturn = async () => {
    if (!returnReason || !returnDesc || !order) return;
    setReturnLoading(true);
    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, reason: returnReason, description: returnDesc }),
      });
      if (res.ok) { setReturnSubmitted(true); setShowReturn(false); }
    } catch { }
    finally { setReturnLoading(false); }
  };

  const currentStep = order ? STATUS_STEPS.findIndex(s => s.key === order.status) : -1;
  const isCancelled = order?.status === 'cancelled';

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
          <Package className="h-7 w-7 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
        <p className="mt-1 text-sm text-gray-500">Enter your Order ID to see delivery status</p>
      </div>

      <div className="flex gap-2 mb-8">
        <Input
          placeholder="Enter Order ID (e.g. cm1abc...)"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && trackOrder()}
          className="h-12 rounded-xl flex-1"
        />
        <Button onClick={trackOrder} disabled={loading} className="h-12 rounded-xl bg-orange-500 text-white hover:bg-orange-600 px-6">
          {loading ? '...' : <Search className="h-5 w-5" />}
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600 mb-6">
          {error}
        </div>
      )}

      {order && (
        <div className="space-y-5">
          {/* Status tracker */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                isCancelled ? 'bg-red-100 text-red-600' :
                order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>{order.status.toUpperCase()}</span>
            </div>
            <p className="text-xs text-gray-400 mb-5">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

            {isCancelled ? (
              <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4">
                <XCircle className="h-8 w-8 text-red-400" />
                <div><p className="font-semibold text-red-700">Order Cancelled</p><p className="text-xs text-red-500">Contact us for help</p></div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                {STATUS_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done = i <= currentStep;
                  const active = i === currentStep;
                  return (
                    <div key={step.key} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${done ? step.bg : 'bg-gray-100'}`}>
                          <Icon className={`h-5 w-5 ${done ? step.color : 'text-gray-300'}`} />
                        </div>
                        <span className={`mt-1.5 text-[10px] font-medium text-center w-14 ${active ? 'text-orange-500 font-semibold' : done ? 'text-gray-700' : 'text-gray-300'}`}>{step.label}</span>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 mb-5 ${i < currentStep ? 'bg-orange-400' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order details */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold">
                <span>Total</span><span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
              <p>📍 {order.address}, {order.city}, {order.state} - {order.pincode}</p>
              <p className="mt-1">💳 {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'upi' ? 'UPI' : 'Bank Transfer'}</p>
            </div>
          </div>

          {/* Return/Refund */}
          {order.status === 'delivered' && !returnSubmitted && (
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              {!showReturn ? (
                <button onClick={() => setShowReturn(true)} className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 font-medium">
                  <RotateCcw className="h-4 w-4" /> Request Return / Refund
                </button>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Return Request</h3>
                  <select value={returnReason} onChange={e => setReturnReason(e.target.value)} className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm">
                    <option value="">Select reason</option>
                    <option value="damaged">Product damaged / broken</option>
                    <option value="wrong">Wrong product received</option>
                    <option value="not_as_described">Not as described</option>
                    <option value="defective">Defective / not working</option>
                    <option value="changed_mind">Changed my mind</option>
                  </select>
                  <textarea value={returnDesc} onChange={e => setReturnDesc(e.target.value)} placeholder="Describe the issue in detail..." rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none" />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowReturn(false)} className="rounded-xl">Cancel</Button>
                    <Button size="sm" onClick={submitReturn} disabled={returnLoading || !returnReason || !returnDesc} className="rounded-xl bg-orange-500 text-white hover:bg-orange-600">
                      {returnLoading ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {returnSubmitted && (
            <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700 text-center">
              ✅ Return request submitted! We will contact you within 24 hours.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

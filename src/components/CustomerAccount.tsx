'use client';

import { useState, useEffect } from 'react';
import { User, Package, LogOut, Eye, EyeOff, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/products';

interface Customer { id: string; name: string; phone: string; }
interface OrderItem { name: string; quantity: number; price: number; }
interface Order {
  id: string; status: string; totalAmount: number;
  createdAt: string; items: OrderItem[]; paymentMethod: string;
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function CustomerAccount() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });

  useEffect(() => {
    const saved = localStorage.getItem('jsglobalhub_customer');
    if (saved) {
      const c = JSON.parse(saved);
      setCustomer(c);
      fetchOrders(c.phone);
    }
  }, []);

  const fetchOrders = async (phone: string) => {
    try {
      const res = await fetch(`/api/auth?phone=${phone}`);
      if (res.ok) setOrders(await res.json());
    } catch { }
  };

  const handleAuth = async () => {
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: mode, ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); return; }
      setCustomer(data);
      localStorage.setItem('jsglobalhub_customer', JSON.stringify(data));
      fetchOrders(data.phone);
    } catch { setError('Network error. Try again.'); }
    finally { setLoading(false); }
  };

  const logout = () => {
    setCustomer(null);
    setOrders([]);
    localStorage.removeItem('jsglobalhub_customer');
  };

  if (!customer) {
    return (
      <div className="mx-auto max-w-sm px-4 py-12">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
            <User className="h-7 w-7 text-orange-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</h1>
          <p className="text-sm text-gray-500 mt-1">{mode === 'login' ? 'Login to see your orders' : 'Sign up to track your orders'}</p>
        </div>

        <div className="space-y-3">
          {mode === 'register' && (
            <Input placeholder="Full Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-11 rounded-xl" />
          )}
          <Input placeholder="Phone Number *" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))} maxLength={10} className="h-11 rounded-xl" />
          {mode === 'register' && (
            <Input placeholder="Email (optional)" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="h-11 rounded-xl" />
          )}
          <div className="relative">
            <Input type={showPw ? 'text' : 'password'} placeholder="Password *" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="h-11 rounded-xl pr-10" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
          <Button onClick={handleAuth} disabled={loading} className="w-full h-11 rounded-xl bg-orange-500 text-white hover:bg-orange-600 font-semibold">
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </Button>
          <p className="text-center text-sm text-gray-500">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="text-orange-500 font-medium">
              {mode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100">
            <User className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{customer.name}</p>
            <p className="text-xs text-gray-500">+91 {customer.phone}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="text-gray-400 hover:text-red-500">
          <LogOut className="h-4 w-4 mr-1" /> Logout
        </Button>
      </div>

      <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-orange-500" /> My Orders ({orders.length})
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
              <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                <div>
                  <p className="font-semibold text-sm text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status.toUpperCase()}</span>
                  <span className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
                  {expandedOrder === order.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </div>
              </div>
              {expandedOrder === order.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="space-y-1.5 mb-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name} x{item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <a href={`/track?id=${order.id}`} className="text-xs text-orange-500 font-medium hover:underline flex items-center gap-1">
                      <Package className="h-3 w-3" /> Track Order
                    </a>
                    {order.status === 'delivered' && (
                      <a href={`/track?id=${order.id}`} className="text-xs text-gray-400 font-medium hover:text-orange-500 flex items-center gap-1">
                        <RotateCcw className="h-3 w-3" /> Return / Refund
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

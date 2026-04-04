'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Pencil, Trash2, Save, X, ArrowLeft, Shield,
  Package, Eye, EyeOff, CheckCircle2, AlertCircle,
  Upload, MapPin, RotateCcw, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useStore } from '@/lib/store';
import { type Product, formatPrice } from '@/lib/products';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'jsglobalhub2024';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

type Tab = 'products' | 'orders' | 'returns' | 'pincodes';

interface Order {
  id: string; customerName: string; phone: string; email?: string;
  address: string; city: string; state: string; pincode: string;
  items: string; totalAmount: number; paymentMethod: string;
  status: string; createdAt: string;
}

interface Return {
  id: string; orderId: string; reason: string; description: string;
  status: string; createdAt: string;
  order: { customerName: string; phone: string; };
}

interface ProductFormData {
  name: string; price: string; originalPrice: string; imageUrl: string;
  description: string; benefits: string; category: string;
  inStock: boolean; flipkartLink: string; amazonLink: string;
  isOwnProduct: boolean; isLocal: boolean; limitedStock: boolean;
  rating: string; reviews: string;
}

const emptyForm: ProductFormData = {
  name: '', price: '', originalPrice: '', imageUrl: '', description: '',
  benefits: '', category: 'electronics', inStock: true, flipkartLink: '#',
  amazonLink: '#', isOwnProduct: true, isLocal: false, limitedStock: false,
  rating: '4.5', reviews: '0',
};

export default function AdminPanel() {
  const { navigateTo } = useStore();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<Return[]>([]);
  const [pincodes, setPincodes] = useState<Array<{ id: string; pincode: string; area: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [newPin, setNewPin] = useState({ pincode: '', area: '' });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) setProducts(await res.json());
    } catch { } finally { setLoading(false); }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) setOrders(await res.json());
    } catch { }
  }, []);

  const fetchReturns = useCallback(async () => {
    try {
      const res = await fetch('/api/returns');
      if (res.ok) setReturns(await res.json());
    } catch { }
  }, []);

  const fetchPincodes = useCallback(async () => {
    try {
      const res = await fetch('/api/pincode');
      if (res.ok) setPincodes(await res.json());
    } catch { }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchProducts(); fetchOrders(); fetchReturns(); fetchPincodes();
    }
  }, [authenticated, fetchProducts, fetchOrders, fetchReturns, fetchPincodes]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) { setAuthenticated(true); setPasswordError(''); }
    else setPasswordError('Incorrect password. Try again.');
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) { setFormData(p => ({ ...p, imageUrl: data.url })); showToast('Image uploaded!'); }
      else showToast('Upload failed — add Cloudinary env vars', 'error');
    } catch { showToast('Upload error', 'error'); }
    finally { setUploading(false); }
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price) { showToast('Name and price required', 'error'); return; }
    setSaving(true);
    try {
      const payload = {
        name: formData.name, price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        images: [formData.imageUrl || '/product-resistance-bands.png'],
        description: formData.description,
        benefits: formData.benefits.split('\n').filter(Boolean),
        category: formData.category, inStock: formData.inStock,
        flipkartLink: formData.flipkartLink || '#', amazonLink: formData.amazonLink || '#',
        isOwnProduct: formData.isOwnProduct, isLocal: formData.isLocal,
        limitedStock: formData.limitedStock, rating: Number(formData.rating), reviews: Number(formData.reviews),
      };
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        showToast(editingProduct ? 'Product updated!' : 'Product created!');
        setEditingProduct(null); setIsCreating(false); setFormData(emptyForm); fetchProducts();
      } else showToast('Failed to save', 'error');
    } catch { showToast('Error saving product', 'error'); }
    finally { setSaving(false); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      showToast('Product deleted'); fetchProducts();
    } catch { showToast('Delete failed', 'error'); }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Status updated!');
        fetchOrders();
        // Open WhatsApp to notify customer
        if (data.whatsappUrl && status !== 'pending') {
          setTimeout(() => window.open(data.whatsappUrl, '_blank'), 500);
        }
      }
    } catch { showToast('Failed to update status', 'error'); }
  };

  const updateReturnStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/returns', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      showToast('Return updated'); fetchReturns();
    } catch { showToast('Failed to update', 'error'); }
  };

  const addPincode = async () => {
    if (!newPin.pincode || !newPin.area) return;
    try {
      await fetch('/api/pincode', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newPin) });
      showToast('Pincode added!'); setNewPin({ pincode: '', area: '' }); fetchPincodes();
    } catch { showToast('Failed to add', 'error'); }
  };

  const deletePincode = async (pincode: string) => {
    try {
      await fetch('/api/pincode', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pincode }) });
      showToast('Pincode removed'); fetchPincodes();
    } catch { showToast('Failed to remove', 'error'); }
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p); setIsCreating(false);
    setFormData({
      name: p.name, price: String(p.price), originalPrice: String(p.originalPrice),
      imageUrl: p.images[0] || '', description: p.description,
      benefits: Array.isArray(p.benefits) ? p.benefits.join('\n') : '',
      category: p.category, inStock: p.inStock, flipkartLink: p.flipkartLink,
      amazonLink: p.amazonLink || '#', isOwnProduct: p.isOwnProduct,
      isLocal: p.isLocal, limitedStock: p.limitedStock,
      rating: String(p.rating), reviews: String(p.reviews),
    });
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <Shield className="h-6 w-6 text-orange-500" />
            </div>
            <CardTitle className="text-xl">Admin Panel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Input type={showPassword ? 'text' : 'password'} placeholder="Admin Password" value={password}
                onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="h-11 rounded-xl pr-10" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
            <Button onClick={handleLogin} className="w-full rounded-xl bg-orange-500 text-white hover:bg-orange-600">Login</Button>
            <Button variant="ghost" size="sm" onClick={() => navigateTo('home')} className="w-full text-gray-400">
              <ArrowLeft className="mr-1 h-3 w-3" /> Back to Store
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isEditing = editingProduct !== null || isCreating;

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">JS Global Hub</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigateTo('home')} className="text-gray-400">
            <ArrowLeft className="mr-1 h-4 w-4" /> Store
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
          {([
            { key: 'products', label: 'Products', count: products.length },
            { key: 'orders', label: 'Orders', count: orders.length },
            { key: 'returns', label: 'Returns', count: returns.filter(r => r.status === 'pending').length },
            { key: 'pincodes', label: 'Pincodes', count: pincodes.length },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.key ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            {!isEditing && (
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-900">{products.length} Products</h2>
                <Button onClick={() => { setIsCreating(true); setEditingProduct(null); setFormData(emptyForm); }}
                  className="rounded-xl bg-orange-500 text-white hover:bg-orange-600">
                  <Plus className="mr-1 h-4 w-4" /> Add Product
                </Button>
              </div>
            )}

            {isEditing ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{editingProduct ? 'Edit Product' : 'New Product'}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => { setEditingProduct(null); setIsCreating(false); setFormData(emptyForm); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Image upload */}
                  <div>
                    <Label>Product Image</Label>
                    <div className="mt-1.5 flex gap-2 items-start">
                      <Input value={formData.imageUrl} onChange={e => setFormData(p => ({ ...p, imageUrl: e.target.value }))} placeholder="Image URL or upload below" className="h-10 rounded-xl flex-1 text-sm" />
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }} />
                      <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} className="rounded-xl h-10 whitespace-nowrap">
                        <Upload className="mr-1 h-3.5 w-3.5" /> {uploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                    {formData.imageUrl && <img src={formData.imageUrl} alt="preview" className="mt-2 h-20 w-20 object-cover rounded-xl border" />}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2"><Label>Product Name *</Label><Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="mt-1 h-10 rounded-xl" /></div>
                    <div><Label>Price (₹) *</Label><Input type="number" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} className="mt-1 h-10 rounded-xl" /></div>
                    <div><Label>Original Price (₹)</Label><Input type="number" value={formData.originalPrice} onChange={e => setFormData(p => ({ ...p, originalPrice: e.target.value }))} className="mt-1 h-10 rounded-xl" /></div>
                    <div className="col-span-2"><Label>Description</Label><textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none" /></div>
                    <div className="col-span-2"><Label>Benefits (one per line)</Label><textarea value={formData.benefits} onChange={e => setFormData(p => ({ ...p, benefits: e.target.value }))} rows={3} placeholder="Fast delivery&#10;Easy returns&#10;Quality assured" className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none" /></div>
                    <div>
                      <Label>Category</Label>
                      <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3 text-sm">
                        {['electronics','fashion','home','fitness','beauty','accessories'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div><Label>Flipkart Link</Label><Input value={formData.flipkartLink} onChange={e => setFormData(p => ({ ...p, flipkartLink: e.target.value }))} className="mt-1 h-10 rounded-xl text-sm" /></div>
                    <div><Label>Amazon Link</Label><Input value={formData.amazonLink} onChange={e => setFormData(p => ({ ...p, amazonLink: e.target.value }))} className="mt-1 h-10 rounded-xl text-sm" /></div>
                    <div><Label>Rating</Label><Input type="number" step="0.1" min="1" max="5" value={formData.rating} onChange={e => setFormData(p => ({ ...p, rating: e.target.value }))} className="mt-1 h-10 rounded-xl" /></div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {([
                      { key: 'inStock', label: 'In Stock' },
                      { key: 'isOwnProduct', label: 'Own Product' },
                      { key: 'isLocal', label: 'Local Sagar Deal' },
                      { key: 'limitedStock', label: 'Limited Stock' },
                    ] as const).map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={formData[key]} onCheckedChange={v => setFormData(p => ({ ...p, [key]: Boolean(v) }))} />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" onClick={() => { setEditingProduct(null); setIsCreating(false); setFormData(emptyForm); }} className="flex-1 rounded-xl">Cancel</Button>
                    <Button onClick={handleSaveProduct} disabled={saving} className="flex-1 rounded-xl bg-orange-500 text-white hover:bg-orange-600">
                      <Save className="mr-1 h-4 w-4" /> {saving ? 'Saving...' : 'Save Product'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />)
                ) : products.map(product => (
                  <div key={product.id} className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-3">
                    <img src={product.images[0]} alt={product.name} className="h-14 w-14 rounded-xl object-cover bg-gray-50 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-bold text-orange-500">{formatPrice(product.price)}</span>
                        <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                        {product.isLocal && <Badge className="text-[10px] bg-green-100 text-green-700 px-1.5">Local</Badge>}
                        {!product.inStock && <Badge className="text-[10px] bg-red-100 text-red-600 px-1.5">Out of stock</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <Button variant="outline" size="sm" onClick={() => startEdit(product)} className="h-8 w-8 p-0 rounded-lg"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)} className="h-8 w-8 p-0 rounded-lg text-red-400 hover:text-red-600 hover:border-red-200"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            <h2 className="font-semibold text-gray-900">{orders.length} Orders</h2>
            {orders.map(order => {
              const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
              return (
                <div key={order.id} className="rounded-xl bg-white border border-gray-100 overflow-hidden">
                  <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">#{order.id.slice(-8).toUpperCase()} — {order.customerName}</p>
                      <p className="text-xs text-gray-400">📱 {order.phone} · {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{formatPrice(order.totalAmount)}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                      {expandedOrder === order.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  </div>
                  {expandedOrder === order.id && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
                      <div className="text-sm text-gray-600">
                        <p>📍 {order.address}, {order.city}, {order.state} - {order.pincode}</p>
                        {order.email && <p>✉️ {order.email}</p>}
                        <p>💳 {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'upi' ? 'UPI' : 'Bank Transfer'}</p>
                      </div>
                      <div className="space-y-1">
                        {items.map((item: {name:string;quantity:number;price:number}, i: number) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1.5">UPDATE STATUS — sends WhatsApp to customer:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {STATUS_OPTIONS.map(s => (
                            <button key={s} onClick={() => updateOrderStatus(order.id, s)}
                              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${order.status === s ? STATUS_COLOR[s] + ' border-transparent' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {orders.length === 0 && <p className="text-center text-gray-400 py-10">No orders yet</p>}
          </div>
        )}

        {/* RETURNS TAB */}
        {activeTab === 'returns' && (
          <div className="space-y-3">
            <h2 className="font-semibold text-gray-900">{returns.length} Return Requests</h2>
            {returns.map(ret => (
              <div key={ret.id} className="rounded-xl bg-white border border-gray-100 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{ret.order.customerName}</p>
                    <p className="text-xs text-gray-400">Order: #{ret.orderId.slice(-8).toUpperCase()} · {new Date(ret.createdAt).toLocaleDateString('en-IN')}</p>
                    <p className="text-xs text-gray-500 mt-1">Reason: <span className="font-medium">{ret.reason}</span></p>
                    <p className="text-xs text-gray-600 mt-1">{ret.description}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ret.status === 'pending' ? 'bg-orange-100 text-orange-700' : ret.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{ret.status}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => updateReturnStatus(ret.id, 'approved')} className="text-xs px-3 py-1.5 rounded-full bg-green-100 text-green-700 font-medium">Approve</button>
                  <button onClick={() => updateReturnStatus(ret.id, 'rejected')} className="text-xs px-3 py-1.5 rounded-full bg-red-100 text-red-600 font-medium">Reject</button>
                  <a href={`https://wa.me/${ret.order.phone}`} target="_blank" rel="noreferrer" className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 font-medium">WhatsApp Customer</a>
                </div>
              </div>
            ))}
            {returns.length === 0 && <p className="text-center text-gray-400 py-10">No return requests</p>}
          </div>
        )}

        {/* PINCODES TAB */}
        {activeTab === 'pincodes' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Serviceable Pincodes</h2>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-3">Add pincodes where you deliver. Customers can check delivery availability before ordering.</p>
                <div className="flex gap-2">
                  <Input placeholder="Pincode (6 digits)" value={newPin.pincode} maxLength={6} onChange={e => setNewPin(p => ({ ...p, pincode: e.target.value.replace(/\D/g, '') }))} className="h-10 rounded-xl w-32" />
                  <Input placeholder="Area name (e.g. Sagar City)" value={newPin.area} onChange={e => setNewPin(p => ({ ...p, area: e.target.value }))} className="h-10 rounded-xl flex-1" />
                  <Button onClick={addPincode} disabled={newPin.pincode.length !== 6 || !newPin.area} className="h-10 rounded-xl bg-orange-500 text-white hover:bg-orange-600">Add</Button>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-2">
              {pincodes.map(pin => (
                <div key={pin.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span className="font-mono font-semibold text-sm">{pin.pincode}</span>
                    <span className="text-sm text-gray-600">{pin.area}</span>
                  </div>
                  <button onClick={() => deletePincode(pin.pincode)} className="text-red-400 hover:text-red-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {pincodes.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No pincodes added yet</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

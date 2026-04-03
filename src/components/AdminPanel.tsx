'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, Save, X, ArrowLeft, Shield,
  Package, Eye, EyeOff, Image as ImageIcon, Link,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useStore } from '@/lib/store';
import { type Product, formatPrice } from '@/lib/products';

interface ProductFormData {
  name: string;
  price: string;
  originalPrice: string;
  imageUrl: string;
  description: string;
  benefits: string;
  category: string;
  inStock: boolean;
  flipkartLink: string;
  amazonLink: string;
  isOwnProduct: boolean;
  isLocal: boolean;
  limitedStock: boolean;
  rating: string;
  reviews: string;
}

const emptyForm: ProductFormData = {
  name: '',
  price: '',
  originalPrice: '',
  imageUrl: '',
  description: '',
  benefits: '',
  category: 'electronics',
  inStock: true,
  flipkartLink: '#',
  amazonLink: '#',
  isOwnProduct: true,
  isLocal: false,
  limitedStock: false,
  rating: '4.5',
  reviews: '0',
};

const ADMIN_PASSWORD = 'jsglobalhub2024';

export default function AdminPanel() {
  const { navigateTo } = useStore();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchProducts();
  }, [authenticated, fetchProducts]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Try again.');
    }
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setIsCreating(true);
    setFormData(emptyForm);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setIsCreating(false);
    setFormData({
      name: product.name,
      price: String(product.price),
      originalPrice: String(product.originalPrice),
      imageUrl: product.images[0] || '',
      description: product.description,
      benefits: product.benefits.join('\n'),
      category: product.category,
      inStock: product.inStock,
      flipkartLink: product.flipkartLink,
      amazonLink: product.amazonLink || '#',
      isOwnProduct: product.isOwnProduct,
      isLocal: product.isLocal || false,
      limitedStock: product.limitedStock || false,
      rating: String(product.rating),
      reviews: String(product.reviews),
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.price.trim()) {
      showToast('Name and price are required', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        images: formData.imageUrl ? [formData.imageUrl] : ['/product-resistance-bands.png'],
        description: formData.description,
        benefits: formData.benefits.split('\n').filter((b) => b.trim()),
        category: formData.category,
        inStock: formData.inStock,
        flipkartLink: formData.flipkartLink || '#',
        amazonLink: formData.amazonLink || '#',
        isOwnProduct: formData.isOwnProduct,
        isLocal: formData.isLocal,
        limitedStock: formData.limitedStock,
        rating: Number(formData.rating || 4.5),
        reviews: Number(formData.reviews || 0),
      };

      if (isCreating) {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast('Product created successfully!');
          setIsCreating(false);
          setFormData(emptyForm);
          fetchProducts();
        } else {
          showToast('Failed to create product', 'error');
        }
      } else if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast('Product updated successfully!');
          setEditingProduct(null);
          setFormData(emptyForm);
          fetchProducts();
        } else {
          showToast('Failed to update product', 'error');
        }
      }
    } catch {
      showToast('Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Product deleted successfully!');
        fetchProducts();
      } else {
        showToast('Failed to delete product', 'error');
      }
    } catch {
      showToast('Something went wrong', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const updateField = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
          <Shield className="h-8 w-8 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
        <p className="mt-1 text-sm text-gray-500">Enter your admin password to manage products</p>

        <div className="mt-6 w-full space-y-3">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="h-11 pr-10"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordError && (
            <p className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {passwordError}
            </p>
          )}
          <Button
            className="h-11 w-full bg-orange-500 font-semibold text-white hover:bg-orange-600"
            onClick={handleLogin}
          >
            Unlock Admin Panel
          </Button>
          <Button
            variant="ghost"
            className="w-full text-gray-500"
            onClick={() => navigateTo('home')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Store
          </Button>
        </div>
      </div>
    );
  }

  // Admin main screen
  const isFormOpen = isCreating || !!editingProduct;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
      {/* Toast */}
      {toast && (
        <div className={`animate-fade-in fixed left-1/2 top-4 z-[100] -translate-x-1/2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {toast.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => navigateTo('home')}
            className="mb-2 flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </button>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your products — add, edit, or remove items
          </p>
        </div>
        {!isFormOpen && (
          <Button
            className="bg-green-500 font-semibold text-white hover:bg-green-600"
            onClick={openCreateForm}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      {/* Create / Edit Form */}
      {isFormOpen && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {isCreating ? 'Add New Product' : 'Edit Product'}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsCreating(false);
                  setEditingProduct(null);
                  setFormData(emptyForm);
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="p-name">Product Name *</Label>
                <Input
                  id="p-name"
                  placeholder="e.g. Premium Resistance Bands"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="p-price">Selling Price (₹) *</Label>
                <Input
                  id="p-price"
                  type="number"
                  placeholder="499"
                  value={formData.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="p-orig-price">Original Price (₹)</Label>
                <Input
                  id="p-orig-price"
                  type="number"
                  placeholder="999"
                  value={formData.originalPrice}
                  onChange={(e) => updateField('originalPrice', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="p-image">Product Image URL</Label>
                <div className="relative">
                  <Input
                    id="p-image"
                    placeholder="/product-image.png or https://..."
                    value={formData.imageUrl}
                    onChange={(e) => updateField('imageUrl', e.target.value)}
                    className="mt-1 pr-9"
                  />
                  <ImageIcon className="absolute right-3 top-[calc(50%+4px)] h-4 w-4 text-gray-400" />
                </div>
                <p className="mt-1 text-[10px] text-gray-400">
                  Use /filename.png for uploaded images or a full URL
                </p>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="p-desc">Description</Label>
                <Input
                  id="p-desc"
                  placeholder="Brief product description..."
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="p-benefits">Benefits (one per line)</Label>
                <textarea
                  id="p-benefits"
                  placeholder={'Benefit 1\nBenefit 2\nBenefit 3'}
                  value={formData.benefits}
                  onChange={(e) => updateField('benefits', e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300"
                />
              </div>
              <div>
                <Label htmlFor="p-category">Category</Label>
                <select
                  id="p-category"
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300"
                >
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Kitchen</option>
                  <option value="fitness">Fitness</option>
                  <option value="beauty">Beauty & Care</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div>
                <Label htmlFor="p-flipkart">Flipkart Link</Label>
                <div className="relative">
                  <Input
                    id="p-flipkart"
                    placeholder="https://flipkart.com/..."
                    value={formData.flipkartLink}
                    onChange={(e) => updateField('flipkartLink', e.target.value)}
                    className="mt-1 pr-9"
                  />
                  <Link className="absolute right-3 top-[calc(50%+4px)] h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div>
                <Label htmlFor="p-amazon">Amazon Link</Label>
                <div className="relative">
                  <Input
                    id="p-amazon"
                    placeholder="https://amazon.in/..."
                    value={formData.amazonLink}
                    onChange={(e) => updateField('amazonLink', e.target.value)}
                    className="mt-1 pr-9"
                  />
                  <Link className="absolute right-3 top-[calc(50%+4px)] h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div>
                <Label htmlFor="p-rating">Rating (1-5)</Label>
                <Input
                  id="p-rating"
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => updateField('rating', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="p-reviews">Number of Reviews</Label>
                <Input
                  id="p-reviews"
                  type="number"
                  value={formData.reviews}
                  onChange={(e) => updateField('reviews', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="p-own"
                  checked={formData.isOwnProduct}
                  onCheckedChange={(checked) => updateField('isOwnProduct', !!checked)}
                />
                <Label htmlFor="p-own" className="cursor-pointer text-sm">Own Product (sell directly)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="p-local"
                  checked={formData.isLocal}
                  onCheckedChange={(checked) => updateField('isLocal', !!checked)}
                />
                <Label htmlFor="p-local" className="cursor-pointer text-sm">Sagar Local Deal (COD)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="p-stock"
                  checked={formData.inStock}
                  onCheckedChange={(checked) => updateField('inStock', !!checked)}
                />
                <Label htmlFor="p-stock" className="cursor-pointer text-sm">In Stock</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="p-limited"
                  checked={formData.limitedStock}
                  onCheckedChange={(checked) => updateField('limitedStock', !!checked)}
                />
                <Label htmlFor="p-limited" className="cursor-pointer text-sm">Limited Stock</Label>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setEditingProduct(null);
                  setFormData(emptyForm);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-500 font-semibold text-white hover:bg-green-600"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : isCreating ? 'Create Product' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="mx-auto mb-1 h-5 w-5 text-orange-500" />
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            <p className="text-[11px] text-gray-500">Total Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-1 flex h-5 w-5 items-center justify-center text-green-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{products.filter((p) => p.isOwnProduct).length}</p>
            <p className="text-[11px] text-gray-500">Own Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Badge className="bg-yellow-500 text-black hover:bg-yellow-500">F</Badge>
            <p className="mt-1 text-2xl font-bold text-gray-900">{products.filter((p) => !p.isOwnProduct).length}</p>
            <p className="text-[11px] text-gray-500">Flipkart Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="mx-auto mb-1 h-5 w-5 text-blue-500" />
            <p className="text-2xl font-bold text-gray-900">{products.filter((p) => p.inStock).length}</p>
            <p className="text-[11px] text-gray-500">In Stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Product List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Products</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-sm text-gray-400">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center">
              <Package className="mx-auto mb-2 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-500">No products yet</p>
              <Button
                className="mt-3 bg-orange-500 text-white hover:bg-orange-600"
                size="sm"
                onClick={openCreateForm}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add your first product
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50 md:gap-4 md:p-4"
                >
                  {/* Image thumbnail */}
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {product.name}
                      </h3>
                      {product.isOwnProduct ? (
                        <Badge className="bg-green-500 text-white hover:bg-green-500 text-[10px]">
                          Own
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500 text-black hover:bg-yellow-500 text-[10px]">
                          Flipkart
                        </Badge>
                      )}
                      {!product.inStock && (
                        <Badge variant="secondary" className="text-[10px] text-red-500">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-sm font-bold text-orange-500">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400 capitalize">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-gray-400 hover:text-orange-500"
                      onClick={() => openEditForm(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-gray-400 hover:text-red-500"
                      onClick={() => setDeleteTarget(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

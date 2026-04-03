export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  images: string[];
  description: string;
  benefits: string[];
  category: string;
  inStock: boolean;
  flipkartLink: string;
  amazonLink: string;
  isOwnProduct: boolean;
  isLocal: boolean;
  limitedStock: boolean;
  rating: number;
  reviews: number;
}

export const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'home', label: 'Home & Kitchen' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'beauty', label: 'Beauty & Care' },
  { value: 'accessories', label: 'Accessories' },
];

export const WHATSAPP_NUMBER = '919425691935';

export function getDiscountPercent(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function getWhatsAppLink(product: Product): string {
  const msg = encodeURIComponent(`Hi JS Global Hub! 👋\n\nI want to order:\n📦 ${product.name}\n💰 ${formatPrice(product.price)}\n\n📍 Delivery Address: \n📱 Phone: \n\nPlease confirm availability!`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

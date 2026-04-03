import { create } from 'zustand';
import { type Product } from './products';

export type Page = 'home' | 'product' | 'products' | 'checkout' | 'cart' | 'admin' | 'about' | 'contact' | 'privacy' | 'local-deals' | 'online-products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  currentPage: Page;
  selectedProduct: Product | null;
  cart: CartItem[];
  cartOpen: boolean;
  isLocalUser: boolean | null;

  navigateTo: (page: Page) => void;
  selectProduct: (product: Product) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  cartTotal: () => number;
  cartItemCount: () => number;
  setIsLocalUser: (val: boolean | null) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  currentPage: 'home',
  selectedProduct: null,
  cart: [],
  cartOpen: false,
  isLocalUser: null,

  navigateTo: (page) => {
    set({ currentPage: page, cartOpen: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  selectProduct: (product) => {
    set({ selectedProduct: product, currentPage: 'product' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  addToCart: (product) => {
    const { cart } = get();
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      set({ cart: cart.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)) });
    } else {
      set({ cart: [...cart, { product, quantity: 1 }] });
    }
    set({ cartOpen: true });
  },

  removeFromCart: (productId) => {
    set({ cart: get().cart.filter((item) => item.product.id !== productId) });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) { get().removeFromCart(productId); return; }
    set({ cart: get().cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item)) });
  },

  clearCart: () => set({ cart: [] }),
  setCartOpen: (open) => set({ cartOpen: open }),
  setIsLocalUser: (val) => set({ isLocalUser: val }),

  cartTotal: () => get().cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  cartItemCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),
}));

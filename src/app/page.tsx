'use client';

import { useStore } from '@/lib/store';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import TrustBadges from '@/components/TrustBadges';
import LocationBanner from '@/components/LocationBanner';
import CategoriesSection from '@/components/CategoriesSection';
import BestSellers from '@/components/BestSellers';
import LocalDealsSection from '@/components/LocalDealsSection';
import OnlineProductsSection from '@/components/OnlineProductsSection';
import PromoBanner from '@/components/PromoBanner';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import ProductList from '@/components/ProductList';
import ProductDetail from '@/components/ProductDetail';
import CartDrawer from '@/components/CartDrawer';
import CheckoutForm from '@/components/CheckoutForm';
import WhatsAppButton from '@/components/WhatsAppButton';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import AdminPanel from '@/components/AdminPanel';
import AboutUs from '@/components/AboutUs';
import Contact from '@/components/ContactPage';
import PrivacyPolicy from '@/components/PrivacyPolicy';

function HomePage() {
  return (
    <>
      <HeroSection />
      <LocationBanner />
      <TrustBadges />
      <CategoriesSection />
      <LocalDealsSection />
      <OnlineProductsSection />
      <BestSellers />
      <PromoBanner />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
}

export default function App() {
  const { currentPage } = useStore();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'products' && <ProductList />}
        {currentPage === 'product' && <ProductDetail />}
        {currentPage === 'checkout' && <CheckoutForm />}
        {currentPage === 'cart' && <CheckoutForm />}
        {currentPage === 'about' && <AboutUs />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'privacy' && <PrivacyPolicy />}
        {currentPage === 'admin' && <AdminPanel />}
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
      <StickyMobileCTA />
    </div>
  );
}

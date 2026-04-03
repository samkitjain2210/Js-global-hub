'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Shield, Truck, RotateCcw } from 'lucide-react';

export default function AboutUs() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-16">
      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">About JS Global Hub</h1>
      <div className="mt-3 h-1 w-16 rounded-full bg-orange-500" />

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Who We Are</h2>
          <p>
            JS Global Hub is your one-stop online shopping destination, based in <strong>Sagar, Madhya Pradesh</strong>. We are passionate about bringing the best products at the most competitive prices directly to your doorstep. What started as a small local business has grown into a trusted brand serving customers across India.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Our Mission</h2>
          <p>
            Our mission is simple: <strong>Shop Smart, Save More.</strong> We handpick every product to ensure quality and offer prices that beat major marketplaces. For our Sagar customers, we provide exclusive COD deals with faster delivery and personal customer service you won't find anywhere else.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Why Sagar?</h2>
          <p>
            Sagar is our home, and we believe local customers deserve better. That&apos;s why we offer <strong>exclusive discounts for Sagar buyers</strong> — prices lower than Flipkart and Amazon — with the convenience of Cash on Delivery. No need to wait days for shipping from metros!
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">What Sets Us Apart</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2"><Shield className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" /> <span><strong>100% Genuine Products</strong> — Every product is quality-checked</span></li>
            <li className="flex items-start gap-2"><Truck className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" /> <span><strong>Fast Local Delivery</strong> — Get products in Sagar in 1-2 days</span></li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" /> <span><strong>WhatsApp Support</strong> — Message us anytime, we respond fast</span></li>
            <li className="flex items-start gap-2"><RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" /> <span><strong>Easy Returns</strong> — 7-day hassle-free return policy</span></li>
            <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" /> <span><strong>Best Prices</strong> — Always cheaper than online platforms</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Contact Us</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-orange-500" /> Sagar, Madhya Pradesh, India</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-orange-500" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-orange-500" /> support@jsglobalhub.com</li>
          </ul>
        </section>
      </div>
    </motion.div>
  );
}

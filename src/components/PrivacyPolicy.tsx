'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-16">
      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Privacy Policy</h1>
      <div className="mt-3 h-1 w-16 rounded-full bg-orange-500" />
      <p className="mt-4 text-sm text-gray-500">Last updated: April 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-2">
            <Shield className="h-5 w-5 text-orange-500" /> Introduction
          </h2>
          <p>
            At JS Global Hub (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website jsglobalhub.com, interact with our services, or make a purchase through our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site. We are based in Sagar, Madhya Pradesh, India, and this policy is governed by Indian data protection laws.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-2">
            <Eye className="h-5 w-5 text-orange-500" /> Information We Collect
          </h2>
          <p className="mb-3">We may collect the following types of personal information when you use our services:</p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" /> <span><strong>Personal Information:</strong> Your name, phone number, email address, shipping address, city, state, and pincode when you place an order or fill out a contact form.</span></li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" /> <span><strong>Order Information:</strong> Details about products you purchase, order history, payment method preferences, and delivery information.</span></li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" /> <span><strong>Usage Data:</strong> Information about how you use our website, including IP address, browser type, device information, pages visited, and time spent on the site. We use cookies and similar tracking technologies for this purpose.</span></li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" /> <span><strong>Communication Data:</strong> Any messages, feedback, or inquiries you send to us via WhatsApp, email, or our contact form.</span></li>
          </ul>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-2">
            <FileText className="h-5 w-5 text-orange-500" /> How We Use Your Information
          </h2>
          <p className="mb-3">We use the information we collect for the following purposes:</p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" /> <span><strong>Order Processing:</strong> To process and fulfill your orders, including delivery coordination, COD verification, and customer support.</span></li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" /> <span><strong>Communication:</strong> To send order confirmations, delivery updates, promotional offers, and respond to your inquiries via WhatsApp, email, or phone.</span></li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" /> <span><strong>Service Improvement:</strong> To analyze website usage, improve our products and services, and enhance your shopping experience.</span></li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" /> <span><strong>Security:</strong> To detect and prevent fraud, unauthorized transactions, and ensure the security of our platform.</span></li>
          </ul>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-2">
            <Lock className="h-5 w-5 text-orange-500" /> Data Sharing and Disclosure
          </h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted third parties only as necessary to provide our services, including delivery partners (for shipping your orders), payment processors (for handling COD orders), and analytics providers (for improving our website). We may also disclose your information if required by law or to protect our legal rights. All third-party service providers are bound by confidentiality agreements to protect your data.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-2">
            <Shield className="h-5 w-5 text-orange-500" /> Data Security
          </h2>
          <p>
            We implement industry-standard security measures to protect your personal information, including encryption of sensitive data, secure server infrastructure, and regular security audits. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security. We encourage you to contact us immediately if you suspect any unauthorized access to your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Cookies</h2>
          <p>
            Our website uses cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser preferences. Please note that disabling cookies may affect some features of our website. We use both session cookies (which expire when you close your browser) and persistent cookies (which remain until they expire or you delete them).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information at any time. You can update your information through your account settings or by contacting us directly. If you wish to unsubscribe from promotional communications, you can do so by clicking the unsubscribe link in our emails or messaging us on WhatsApp. We will respond to all data-related requests within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites such as Flipkart and Amazon. We are not responsible for the privacy practices or content of these external sites. We encourage you to read the privacy policies of any third-party websites you visit. Our privacy policy applies only to our website and services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on this page with a revised &quot;Last updated&quot; date. Your continued use of our website after any changes constitutes your acceptance of the updated Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-2">
            <Mail className="h-5 w-5 text-orange-500" /> Contact Us
          </h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="mt-3 rounded-xl bg-gray-50 p-4 space-y-2 text-sm">
            <p><strong>JS Global Hub</strong></p>
            <p>Sagar, Madhya Pradesh, India</p>
            <p>Email: support@jsglobalhub.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>WhatsApp: +91 98765 43210</p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

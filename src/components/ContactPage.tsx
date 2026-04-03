'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(`Hi JS Global Hub!\n\nName: ${formData.name}\nPhone: ${formData.phone}\n\n${formData.message}`);
    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
    setSent(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-16">
      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Contact Us</h1>
      <div className="mt-3 h-1 w-16 rounded-full bg-orange-500" />
      <p className="mt-4 text-sm text-gray-500">We&apos;d love to hear from you. Reach out via WhatsApp or fill the form below.</p>

      {/* Quick Contact */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: Phone, title: 'Phone', value: '+91 98765 43210', color: 'bg-orange-100 text-orange-600' },
          { icon: MessageCircle, title: 'WhatsApp', value: '+91 98765 43210', color: 'bg-green-100 text-green-600' },
          { icon: Mail, title: 'Email', value: 'support@jsglobalhub.com', color: 'bg-blue-100 text-blue-600' },
          { icon: MapPin, title: 'Location', value: 'Sagar, Madhya Pradesh', color: 'bg-purple-100 text-purple-600' },
        ].map((item) => (
          <div key={item.title} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{item.title}</p>
              <p className="text-sm font-semibold text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Business Hours */}
      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-orange-500" />
          <h3 className="font-bold text-gray-900">Business Hours</h3>
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <p>Monday – Saturday: 10:00 AM – 8:00 PM</p>
          <p>Sunday: 10:00 AM – 2:00 PM</p>
          <p className="text-xs text-gray-400 mt-1">WhatsApp support available 24/7</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-5 md:p-6">
        <h3 className="mb-4 text-lg font-bold text-gray-900">Send a Message</h3>
        {sent ? (
          <div className="text-center py-6">
            <p className="text-lg font-semibold text-green-600">✅ Message Sent!</p>
            <p className="mt-1 text-sm text-gray-500">We&apos;ll get back to you soon on WhatsApp.</p>
            <Button className="mt-4 rounded-xl bg-orange-500 text-white hover:bg-orange-600" onClick={() => setSent(false)}>Send Another</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="contact-name">Your Name</Label>
              <Input id="contact-name" placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="contact-phone">Phone Number</Label>
              <Input id="contact-phone" type="tel" placeholder="+91 XXXXX XXXXX" maxLength={15} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="contact-msg">Your Message</Label>
              <textarea id="contact-msg" placeholder="What do you need help with?" rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="mt-1.5 min-h-[100px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 resize-none" />
            </div>
            <Button type="submit" className="mt-2 h-11 w-full rounded-xl bg-green-500 text-base font-bold text-white hover:bg-green-600">
              <MessageCircle className="mr-2 h-4 w-4" /> Send via WhatsApp
            </Button>
          </form>
        )}
      </div>
    </motion.div>
  );
}

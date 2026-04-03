'use client';

import { Shield, Truck, Clock, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const features = [
  { icon: Shield, title: 'Premium Quality', description: 'Curated products with strict quality checks for your satisfaction', color: 'bg-orange-100 text-orange-600' },
  { icon: Truck, title: 'COD Available', description: 'Cash on Delivery across India for your convenience', color: 'bg-green-100 text-green-600' },
  { icon: Clock, title: 'Fast Delivery', description: 'Get your products delivered in 3-5 business days', color: 'bg-teal-100 text-teal-600' },
  { icon: Headphones, title: '24/7 Support', description: 'WhatsApp support for all your queries anytime', color: 'bg-purple-100 text-purple-600' },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-gray-50 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center md:mb-14">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Why Choose JS Global Hub?</h2>
          <p className="mt-2 text-sm text-gray-500">Trusted by thousands of happy shoppers across India</p>
          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-orange-500" />
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-5 text-center md:p-7">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${f.color} transition-transform hover:scale-110`}>
                    <f.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-gray-900 md:text-base">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-500 md:text-sm">{f.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { Star, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Rahul Sharma', location: 'Delhi', rating: 5,
    text: 'Amazing quality earbuds! The sound quality is incredible and the noise cancellation works great. Delivery was super fast and packaging was perfect.',
    initials: 'RS', color: 'bg-orange-500',
  },
  {
    name: 'Priya Mehta', location: 'Mumbai', rating: 5,
    text: 'I ordered the cotton t-shirt and backpack combo — both products exceeded my expectations. COD option made it so convenient to order.',
    initials: 'PM', color: 'bg-pink-500',
  },
  {
    name: 'Amit Kumar', location: 'Bangalore', rating: 5,
    text: 'JS Global Hub has become my go-to online store. The LED desk lamp with wireless charger is a game-changer for my work-from-home setup. Highly recommend!',
    initials: 'AK', color: 'bg-blue-500',
  },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center md:mb-14">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">What Our Customers Say</h2>
          <p className="mt-2 text-sm text-gray-500">Trusted by thousands of happy shoppers across India</p>
          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-orange-500" />
        </motion.div>
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={item} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${t.color} text-xs font-bold text-white`}>{t.initials}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <div className="flex items-center gap-1.5">
                    <BadgeCheck className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-xs text-gray-500">Verified Buyer · {t.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

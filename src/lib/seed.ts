import { db } from '@/lib/db';

const allProducts = [
  // LOCAL SAGAR DEALS (COD Available, cheaper than online)
  {
    name: 'Wireless Bluetooth Earbuds Pro',
    price: 799, originalPrice: 1999,
    images: JSON.stringify(['/product-earbuds.png']),
    description: 'True wireless earbuds with active noise cancellation, deep bass, and crystal-clear calls. IPX5 water resistant with 30-hour total battery life. Sagar exclusive price — cheaper than Flipkart!',
    benefits: JSON.stringify(['Active Noise Cancellation', '30hr total battery life', 'IPX5 water resistant', 'Bluetooth 5.3 connection', 'Touch controls']),
    category: 'electronics',
    inStock: true, flipkartLink: 'https://www.flipkart.com', amazonLink: '#',
    isOwnProduct: true, isLocal: true, limitedStock: true,
    rating: 4.4, reviews: 456,
  },
  {
    name: 'Premium Cotton Round Neck T-Shirt',
    price: 299, originalPrice: 799,
    images: JSON.stringify(['/product-tshirt.png']),
    description: 'Ultra-soft 100% combed cotton t-shirt. Pre-shrunk, bio-washed, double-stitched. 250 GSM premium fabric. Sagar exclusive deal at just ₹299!',
    benefits: JSON.stringify(['100% combed cotton', 'Bio-washed softness', 'Pre-shrunk fabric', '250 GSM thick', 'Multiple colors']),
    category: 'fashion',
    inStock: true, flipkartLink: '#', amazonLink: '#',
    isOwnProduct: true, isLocal: true, limitedStock: true,
    rating: 4.3, reviews: 567,
  },
  {
    name: 'LED Desk Lamp with Wireless Charger',
    price: 699, originalPrice: 1599,
    images: JSON.stringify(['/product-lamp.png']),
    description: 'Modern LED desk lamp with built-in 15W wireless charger. 5 brightness levels, 3 color temperatures, flexible gooseneck. Eye-caring technology.',
    benefits: JSON.stringify(['Built-in wireless charger', '5 brightness levels', '3 color temps', 'Eye-caring LED', 'Flexible design']),
    category: 'home',
    inStock: true, flipkartLink: '#', amazonLink: '#',
    isOwnProduct: true, isLocal: true, limitedStock: false,
    rating: 4.7, reviews: 198,
  },
  {
    name: 'Professional Resistance Bands Set',
    price: 399, originalPrice: 999,
    images: JSON.stringify(['/product-resistance-bands.png']),
    description: 'Premium resistance bands with 5 levels. Perfect for home workouts and stretching. Made from natural latex. Sagar lowest price guaranteed.',
    benefits: JSON.stringify(['5 resistance levels', 'Premium latex', 'Home & gym', 'Portable', 'Improves flexibility']),
    category: 'fitness',
    inStock: true, flipkartLink: '#', amazonLink: '#',
    isOwnProduct: true, isLocal: true, limitedStock: false,
    rating: 4.5, reviews: 234,
  },
  {
    name: 'Premium Insulated Water Bottle',
    price: 279, originalPrice: 699,
    images: JSON.stringify(['/product-water-bottle.png']),
    description: 'Double-wall vacuum insulated stainless steel bottle. Keeps drinks cold 24hrs or hot 12hrs. Leak-proof matte black finish.',
    benefits: JSON.stringify(['24hr cold / 12hr hot', 'BPA-free steel', 'Leak-proof', '1 liter capacity', 'Matte black']),
    category: 'fitness',
    inStock: true, flipkartLink: '#', amazonLink: '#',
    isOwnProduct: true, isLocal: true, limitedStock: true,
    rating: 4.7, reviews: 189,
  },
  {
    name: 'Vitamin C Face Serum 30ml',
    price: 349, originalPrice: 899,
    images: JSON.stringify(['/product-serum.png']),
    description: 'Advanced Vitamin C serum with hyaluronic acid. Brightens skin, reduces dark spots, boosts collagen. Sagar exclusive lower price!',
    benefits: JSON.stringify(['Brightens skin tone', 'Reduces dark spots', 'Hyaluronic acid', 'Boosts collagen', 'All skin types']),
    category: 'beauty',
    inStock: true, flipkartLink: '#', amazonLink: '#',
    isOwnProduct: true, isLocal: true, limitedStock: true,
    rating: 4.5, reviews: 389,
  },

  // ONLINE PRODUCTS (Flipkart/Amazon)
  {
    name: 'Portable Bluetooth Speaker 20W',
    price: 1299, originalPrice: 2499,
    images: JSON.stringify(['/product-speaker.png']),
    description: 'Powerful 20W portable speaker with 360° surround sound, deep bass, and RGB lights. IPX7 waterproof for outdoor parties.',
    benefits: JSON.stringify(['20W output & deep bass', '360° surround sound', 'IPX7 waterproof', '12hrs playtime', 'RGB party lights']),
    category: 'electronics',
    inStock: true, flipkartLink: 'https://www.flipkart.com', amazonLink: 'https://www.amazon.in',
    isOwnProduct: false, isLocal: false, limitedStock: false,
    rating: 4.6, reviews: 321,
  },
  {
    name: 'Urban Laptop Backpack 30L',
    price: 899, originalPrice: 1799,
    images: JSON.stringify(['/product-backpack.png']),
    description: 'Sleek 30L laptop backpack with padded 15.6" compartment, USB charging port, and water-resistant fabric. Perfect for college and travel.',
    benefits: JSON.stringify(['Fits 15.6" laptop', 'USB charging port', 'Water-resistant', 'Padded straps', 'Multi-pocket']),
    category: 'fashion',
    inStock: true, flipkartLink: 'https://www.flipkart.com', amazonLink: '#',
    isOwnProduct: false, isLocal: false, limitedStock: false,
    rating: 4.5, reviews: 289,
  },
  {
    name: 'Premium Stainless Steel Knife Set',
    price: 699, originalPrice: 1399,
    images: JSON.stringify(['/product-knife.png']),
    description: 'Professional 5-piece knife set with high-carbon steel blades. Includes chef, bread, utility, and paring knife with wooden block.',
    benefits: JSON.stringify(['5 essential knives', 'High-carbon steel', 'Ergonomic handles', 'Wooden block', 'Dishwasher safe']),
    category: 'home',
    inStock: true, flipkartLink: 'https://www.flipkart.com', amazonLink: 'https://www.amazon.in',
    isOwnProduct: false, isLocal: false, limitedStock: false,
    rating: 4.8, reviews: 167,
  },
  {
    name: 'Adjustable Dumbbells Set',
    price: 1299, originalPrice: 2499,
    images: JSON.stringify(['/product-dumbbells.png']),
    description: 'Adjustable dumbbells for home workouts. Switch between weight settings easily. Compact, space-saving design with professional performance.',
    benefits: JSON.stringify(['Adjustable weight', 'Space-saving', 'Anti-slip grip', 'Durable steel', 'Quick change']),
    category: 'fitness',
    inStock: true, flipkartLink: 'https://www.flipkart.com', amazonLink: 'https://www.amazon.in',
    isOwnProduct: false, isLocal: false, limitedStock: false,
    rating: 4.8, reviews: 312,
  },
  {
    name: 'Premium Non-Slip Yoga Mat',
    price: 599, originalPrice: 1199,
    images: JSON.stringify(['/product-yoga-mat.png']),
    description: 'Extra thick 6mm yoga mat with superior grip and cushioning. Non-slip surface. Perfect for yoga, pilates, and floor exercises.',
    benefits: JSON.stringify(['6mm extra thick', 'Non-slip both sides', 'Eco-friendly TPE', 'Portable', 'Carry strap included']),
    category: 'fitness',
    inStock: true, flipkartLink: 'https://www.flipkart.com', amazonLink: '#',
    isOwnProduct: false, isLocal: false, limitedStock: false,
    rating: 4.6, reviews: 278,
  },
  {
    name: 'Protein Shaker Bottle 700ml',
    price: 249, originalPrice: 499,
    images: JSON.stringify(['/product-shaker.png']),
    description: 'Premium shaker with built-in mixer ball. BPA-free, leak-proof, dishwasher safe with measurement markings.',
    benefits: JSON.stringify(['Built-in mixer ball', 'BPA-free', 'Leak-proof', 'Measurement marks', 'Dishwasher safe']),
    category: 'accessories',
    inStock: true, flipkartLink: 'https://www.flipkart.com', amazonLink: 'https://www.amazon.in',
    isOwnProduct: false, isLocal: false, limitedStock: false,
    rating: 4.4, reviews: 198,
  },
];

async function seed() {
  const count = await db.product.count();
  if (count > 0) {
    await db.product.deleteMany();
  }
  for (const p of allProducts) {
    await db.product.create({ data: p });
  }
  console.log(`Seeded ${allProducts.length} products (6 local Sagar deals + 6 online).`);
}

seed();

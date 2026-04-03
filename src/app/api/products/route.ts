import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      images: JSON.parse(p.images),
      description: p.description,
      benefits: JSON.parse(p.benefits),
      category: p.category,
      inStock: p.inStock,
      flipkartLink: p.flipkartLink,
      amazonLink: p.amazonLink || '#',
      isOwnProduct: p.isOwnProduct,
      isLocal: p.isLocal,
      limitedStock: p.limitedStock,
      rating: p.rating,
      reviews: p.reviews,
    }));

    return NextResponse.json(formatted);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      price,
      originalPrice,
      images,
      description,
      benefits,
      category,
      inStock,
      flipkartLink,
      isOwnProduct,
      rating,
      reviews,
    } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        name,
        price: Number(price),
        originalPrice: Number(originalPrice || price),
        images: JSON.stringify(images || ['/product-resistance-bands.png']),
        description: description || '',
        benefits: JSON.stringify(benefits || []),
        category: category || 'electronics',
        inStock: inStock !== false,
        flipkartLink: flipkartLink || '#',
        amazonLink: body.amazonLink || '#',
        isOwnProduct: isOwnProduct !== false,
        isLocal: body.isLocal || false,
        limitedStock: body.limitedStock || false,
        rating: Number(rating || 4.5),
        reviews: Number(reviews || 0),
      },
    });

    return NextResponse.json({ id: product.id, message: 'Product created successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

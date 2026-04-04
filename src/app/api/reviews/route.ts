import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  try {
    const reviews = await db.review.findMany({
      where: productId ? { productId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { productId, customerName, phone, rating, comment, orderId } = await request.json();
    if (!productId || !customerName || !phone || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });
    }
    const review = await db.review.create({
      data: { productId, customerName, phone, rating: Number(rating), comment, orderId: orderId || null },
    });
    // Update product average rating
    const allReviews = await db.review.findMany({ where: { productId } });
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await db.product.update({
      where: { id: productId },
      data: { rating: Math.round(avg * 10) / 10, reviews: allReviews.length },
    });
    return NextResponse.json({ id: review.id, message: 'Review submitted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

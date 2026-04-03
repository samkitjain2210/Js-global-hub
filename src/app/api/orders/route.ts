import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      items,
      totalAmount,
      paymentMethod,
    } = body;

    if (!customerName || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const order = await db.order.create({
      data: {
        customerName,
        phone,
        email: email || null,
        address,
        city,
        state,
        pincode,
        items: JSON.stringify(items),
        totalAmount,
        paymentMethod: paymentMethod || 'cod',
        status: 'pending',
      },
    });

    return NextResponse.json({ id: order.id, message: 'Order placed successfully' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to place order' },
      { status: 500 }
    );
  }
}

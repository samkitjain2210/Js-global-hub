import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const returns = await db.return.findMany({
      orderBy: { createdAt: 'desc' },
      include: { order: true },
    });
    return NextResponse.json(returns);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch returns' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { orderId, reason, description } = await request.json();
    if (!orderId || !reason || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const order = await db.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const ret = await db.return.create({
      data: { orderId, reason, description, status: 'pending' },
    });
    return NextResponse.json({ id: ret.id, message: 'Return request submitted' });
  } catch {
    return NextResponse.json({ error: 'Failed to submit return request' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const ret = await db.return.update({ where: { id }, data: { status } });
    return NextResponse.json({ id: ret.id, status: ret.status });
  } catch {
    return NextResponse.json({ error: 'Failed to update return' }, { status: 500 });
  }
}

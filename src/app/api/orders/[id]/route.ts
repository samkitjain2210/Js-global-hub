import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await db.order.findUnique({
      where: { id },
      include: { returns: true },
    });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ ...order, items: JSON.parse(order.items) });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    const order = await db.order.update({ where: { id }, data: { status } });

    // Notify customer on WhatsApp when status changes
    const statusEmoji: Record<string, string> = {
      confirmed: '✅', shipped: '🚚', delivered: '📦', cancelled: '❌',
    };
    const statusMsg: Record<string, string> = {
      confirmed: 'Your order has been confirmed and is being prepared!',
      shipped: 'Your order is on the way! Expected delivery in 2-3 days.',
      delivered: 'Your order has been delivered! Hope you love it 😊',
      cancelled: 'Your order has been cancelled. Contact us for help.',
    };
    if (statusMsg[status]) {
      const msg = encodeURIComponent(
        `${statusEmoji[status]} JS Global Hub Order Update\n\nOrder ID: ${id}\nStatus: ${status.toUpperCase()}\n\n${statusMsg[status]}\n\nThank you for shopping with us!`
      );
      const waUrl = `https://api.whatsapp.com/send?phone=${order.phone}&text=${msg}`;
      return NextResponse.json({ id: order.id, status: order.status, whatsappUrl: waUrl });
    }

    return NextResponse.json({ id: order.id, status: order.status });
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

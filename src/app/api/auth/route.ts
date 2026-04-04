import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

function hashPassword(password: string) {
  return createHash('sha256').update(password + 'jsglobalhub_salt').digest('hex');
}

export async function POST(request: Request) {
  try {
    const { action, name, phone, email, password } = await request.json();

    if (action === 'register') {
      if (!name || !phone || !password) {
        return NextResponse.json({ error: 'Name, phone and password required' }, { status: 400 });
      }
      const existing = await db.customer.findUnique({ where: { phone } });
      if (existing) return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });

      const customer = await db.customer.create({
        data: { name, phone, email: email || null, passwordHash: hashPassword(password) },
      });
      return NextResponse.json({ id: customer.id, name: customer.name, phone: customer.phone, message: 'Account created!' });
    }

    if (action === 'login') {
      if (!phone || !password) return NextResponse.json({ error: 'Phone and password required' }, { status: 400 });
      const customer = await db.customer.findUnique({ where: { phone } });
      if (!customer || customer.passwordHash !== hashPassword(password)) {
        return NextResponse.json({ error: 'Invalid phone or password' }, { status: 401 });
      }
      return NextResponse.json({ id: customer.id, name: customer.name, phone: customer.phone });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 });
  try {
    const orders = await db.order.findMany({
      where: { phone },
      orderBy: { createdAt: 'desc' },
      include: { returns: true },
    });
    return NextResponse.json(orders.map(o => ({ ...o, items: JSON.parse(o.items) })));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

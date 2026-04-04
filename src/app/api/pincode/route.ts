// src/app/api/pincode/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get('pincode');
  if (!pincode) return NextResponse.json({ error: 'Pincode required' }, { status: 400 });
  try {
    const pin = await db.serviceablePin.findUnique({ where: { pincode } });
    if (pin) return NextResponse.json({ serviceable: true, area: pin.area });
    return NextResponse.json({ serviceable: false });
  } catch {
    return NextResponse.json({ error: 'Failed to check pincode' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { pincode, area } = await request.json();
    const pin = await db.serviceablePin.upsert({
      where: { pincode },
      update: { area },
      create: { pincode, area },
    });
    return NextResponse.json(pin);
  } catch {
    return NextResponse.json({ error: 'Failed to add pincode' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { pincode } = await request.json();
    await db.serviceablePin.delete({ where: { pincode } });
    return NextResponse.json({ message: 'Pincode removed' });
  } catch {
    return NextResponse.json({ error: 'Failed to remove pincode' }, { status: 500 });
  }
}

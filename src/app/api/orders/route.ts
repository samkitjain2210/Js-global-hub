import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

const WHATSAPP_NUMBER = '919425691935';

function formatItems(items: Array<{name: string; quantity: number; price: number}>) {
  return items.map(i => `• ${i.name} x${i.quantity} = ₹${i.price * i.quantity}`).join('\n');
}

export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { returns: true },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, email, address, city, state, pincode, items, totalAmount, paymentMethod } = body;

    if (!customerName || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const order = await db.order.create({
      data: {
        customerName, phone, email: email || null, address, city, state, pincode,
        items: JSON.stringify(items), totalAmount,
        paymentMethod: paymentMethod || 'cod', status: 'pending',
      },
    });

    // WhatsApp notification to store owner
    const itemsText = formatItems(items);
    const payLabel = paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash on Delivery';
    const ownerMsg = encodeURIComponent(
      `🛍️ NEW ORDER RECEIVED!\n\nOrder ID: ${order.id}\n\n👤 Customer: ${customerName}\n📱 Phone: ${phone}\n📧 Email: ${email || 'Not provided'}\n\n📦 Items:\n${itemsText}\n\n💰 Total: ₹${totalAmount}\n💳 Payment: ${payLabel}\n\n📍 Address:\n${address}, ${city}, ${state} - ${pincode}\n\nLogin to admin panel to update status.`
    );
    const ownerWaUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${ownerMsg}`;

    // Send email via Resend if configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && email) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'JS Global Hub <orders@jsglobalhub.com>',
            to: email,
            subject: `Order Confirmed! #${order.id.slice(-8).toUpperCase()}`,
            html: `
              <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
                <h2 style="color:#f97316">Order Confirmed! 🎉</h2>
                <p>Hi ${customerName}, your order has been placed successfully.</p>
                <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:16px 0">
                  <b>Order ID:</b> ${order.id}<br/>
                  <b>Total:</b> ₹${totalAmount}<br/>
                  <b>Payment:</b> ${payLabel}<br/>
                  <b>Delivery:</b> 3-5 business days
                </div>
                <h3>Items Ordered:</h3>
                <ul>${items.map((i: {name:string;quantity:number;price:number}) => `<li>${i.name} x${i.quantity} — ₹${i.price * i.quantity}</li>`).join('')}</ul>
                <p>Track your order at: <a href="${process.env.NEXT_PUBLIC_SITE_URL}/track?id=${order.id}">Click here</a></p>
                <p style="color:#888;font-size:12px">JS Global Hub, Sagar, MP</p>
              </div>
            `,
          }),
        });
      } catch { /* email failed silently */ }
    }

    return NextResponse.json({ id: order.id, message: 'Order placed successfully', whatsappUrl: ownerWaUrl });
  } catch {
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}

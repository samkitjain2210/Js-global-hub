import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = await db.product.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : existing.name,
        price: body.price !== undefined ? Number(body.price) : existing.price,
        originalPrice: body.originalPrice !== undefined ? Number(body.originalPrice) : existing.originalPrice,
        images: body.images !== undefined ? JSON.stringify(body.images) : existing.images,
        description: body.description !== undefined ? body.description : existing.description,
        benefits: body.benefits !== undefined ? JSON.stringify(body.benefits) : existing.benefits,
        category: body.category !== undefined ? body.category : existing.category,
        inStock: body.inStock !== undefined ? body.inStock : existing.inStock,
        flipkartLink: body.flipkartLink !== undefined ? body.flipkartLink : existing.flipkartLink,
        amazonLink: body.amazonLink !== undefined ? body.amazonLink : existing.amazonLink,
        isOwnProduct: body.isOwnProduct !== undefined ? body.isOwnProduct : existing.isOwnProduct,
        isLocal: body.isLocal !== undefined ? body.isLocal : existing.isLocal,
        limitedStock: body.limitedStock !== undefined ? body.limitedStock : existing.limitedStock,
        rating: body.rating !== undefined ? Number(body.rating) : existing.rating,
        reviews: body.reviews !== undefined ? Number(body.reviews) : existing.reviews,
      },
    });

    return NextResponse.json({ id: product.id, message: 'Product updated successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
    try {
        // Get session without authOptions first
        const session = await getServerSession();
        
        console.log('Session:', session); // Debug log
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const { items, shippingInfo, total } = await request.json();

        console.log('Order data:', { itemsCount: items?.length, total }); // Debug log

        // Basic validation
        if (!items?.length || !shippingInfo?.name || !total) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get user ID from email (since session.user.id might not be available)
        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Create order
        const order = await db.order.create({
            data: {
                userId: user.id,
                status: 'PENDING',
                totalAmount: Math.round(total * 100),
                address: `${shippingInfo.streetAddress}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`,
            }
        });

        // Create order details
        for (const item of items) {
            const product = await db.product.findUnique({ 
                where: { id: item.product.id } 
            });
            
            if (!product) continue;

            const finalPrice = product.price - (product.price * (product.discount || 0) / 100);

            await db.orderDetails.create({
                data: {
                    orderId: order.id,
                    productId: item.product.id,
                    userId: user.id,
                    quantity: item.quantity,
                    priceAtPurchase: Math.round(finalPrice * 100),
                    size: item.size || product.size,
                }
            });

            // Update stock
            await db.product.update({
                where: { id: item.product.id },
                data: { stock: { decrement: item.quantity } }
            });
        }

        // Clear cart
        await db.cart.deleteMany({
            where: { 
                userId: user.id,
                productId: { in: items.map((item: any) => item.product.id) }
            }
        });

        return NextResponse.json({
            message: 'Order created successfully',
            orderId: order.id,
        }, { status: 201 });

    } catch (error: any) {
        console.error('Order error:', error);
        return NextResponse.json({ error: error.message || 'Order failed' }, { status: 500 });
    }
}

// Add this GET method after your POST method:

export async function GET() {
    try {
        const session = await getServerSession();
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        // Get user ID from email
        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const orders = await db.order.findMany({
            where: { userId: user.id },
            include: {
                orderDetails: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                price: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedOrders = orders.map(order => ({
            id: order.id,
            status: order.status,
            totalAmount: order.totalAmount / 100,
            address: order.address,
            createdAt: order.createdAt,
            orderDetails: order.orderDetails.map(detail => ({
                id: detail.id,
                quantity: detail.quantity,
                priceAtPurchase: detail.priceAtPurchase / 100,
                product: detail.product
            }))
        }));

        return NextResponse.json(formattedOrders);

    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
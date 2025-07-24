import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const session = await getServerSession();
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: { role: true }
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const orders = await db.order.findMany({
            include: {
                user: {
                    select: { name: true, email: true, image: true }
                },
                orderDetails: {
                    include: {
                        product: {
                            select: { name: true, image: true, price: true }
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
            user: order.user,
            orderDetails: order.orderDetails.map(detail => ({
                id: detail.id,
                quantity: detail.quantity,
                priceAtPurchase: detail.priceAtPurchase / 100,
                product: detail.product
            }))
        }));

        return NextResponse.json(formattedOrders);

    } catch (error) {
        console.error('Orders fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

// Update order status
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession();
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: { role: true }
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { orderId, status } = await request.json();

        if (!orderId || !status) {
            return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
        }

        const validStatuses = ['PENDING', 'ACCEPTED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const updatedOrder = await db.order.update({
            where: { id: orderId },
            data: { status: status }
        });

        return NextResponse.json({ 
            message: 'Order status updated successfully',
            order: updatedOrder 
        });

    } catch (error) {
        console.error('Order update error:', error);
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }
}
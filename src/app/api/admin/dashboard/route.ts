import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db'; // Adjust the import path based on your db setup

export async function GET() {
    try {
        const session = await getServerSession();
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        // Get user and check if admin
        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: { role: true }
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        // Fetch dashboard statistics
        const [totalRevenue, totalOrders, totalProducts, totalCustomers, recentOrders, topProducts] = await Promise.all([
            // Total Revenue (sum of all delivered orders)
            db.order.aggregate({
                where: { status: 'DELIVERED' },
                _sum: { totalAmount: true }
            }),
            
            // Total Orders count
            db.order.count(),
            
            // Total Products count
            db.product.count(),
            
            // Total Customers count
            db.user.count({
                where: { role: 'CUSTOMER' }
            }),
            
            // Recent Orders (last 5)
            db.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { name: true, email: true }
                    }
                }
            }),
            
            // Top Products by sales
            db.orderDetails.groupBy({
                by: ['productId'],
                _sum: { quantity: true, priceAtPurchase: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 4
            })
        ]);

        // Get product details for top products
        const topProductsWithDetails = await Promise.all(
            topProducts.map(async (item, index) => {
                const product = await db.product.findUnique({
                    where: { id: item.productId },
                    select: { name: true, image: true }
                });
                
                return {
                    rank: (index + 1).toString(),
                    itemName: product?.name || 'Unknown Product',
                    itemImage: product?.image || '',
                    totalSales: item._sum.quantity || 0,
                    totalRevenue: ((item._sum.priceAtPurchase || 0) / 100).toFixed(2)
                };
            })
        );

        return NextResponse.json({
            totalRevenue: (totalRevenue._sum.totalAmount || 0) / 100,
            totalOrders: totalOrders,
            totalProducts: totalProducts,
            totalCustomers: totalCustomers,
            recentOrders: recentOrders.map(order => ({
                id: order.id,
                orderedBy: order.user.name || 'Unknown',
                email: order.user.email,
                itemPrice: (order.totalAmount / 100).toFixed(2),
                status: order.status,
                date: order.createdAt.toISOString().split('T')[0]
            })),
            topProducts: topProductsWithDetails
        });

    } catch (error) {
        console.error('Dashboard data fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
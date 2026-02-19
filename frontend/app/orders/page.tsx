'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, Package, Calendar, Clock } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';

export default function OrdersPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=/orders');
        }
    }, [isAuthenticated, router]);

    const { data: ordersData, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: ordersApi.getAll,
        enabled: isAuthenticated,
    });

    const orders = ordersData?.orders || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'bg-green-100 text-green-700 border-green-200';
            case 'SHIPPED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'PROCESSING': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'PENDING': return 'bg-neutral-100 text-neutral-700 border-neutral-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-neutral-100 text-neutral-700';
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-xl" />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed">
                    <div className="mb-4 rounded-full bg-neutral-100 p-4">
                        <ShoppingBag className="h-8 w-8 text-neutral-400" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No orders found</h2>
                    <p className="text-neutral-500 mb-6 text-center">You haven't placed any orders yet. Start shopping to see them here!</p>
                    <Button onClick={() => router.push('/products')}>Browse Products</Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order: any) => (
                        <Card key={order.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                            <CardHeader className="bg-neutral-50 border-b">
                                <div className="flex flex-wrap justify-between gap-4">
                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Order Placed</p>
                                            <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Total Amount</p>
                                            <p className="text-sm font-bold">${Number(order.total).toFixed(2)}</p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Order ID</p>
                                            <p className="text-sm font-mono text-neutral-600">#{order.id.split('-')[0]}</p>
                                        </div>
                                    </div>
                                    <Badge className={getStatusColor(order.status)}>
                                        {order.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {order.orderItems.map((item: any) => (
                                        <div key={item.id} className="p-4 flex gap-4 items-center">
                                            <div className="h-16 w-16 bg-neutral-100 rounded-md flex-shrink-0 relative overflow-hidden">
                                                {item.product.imageUrl ? (
                                                    <Image
                                                        src={item.product.imageUrl}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <Package className="h-full w-full p-4 text-neutral-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm truncate">{item.product.name}</h4>
                                                <p className="text-xs text-neutral-500">Qty: {item.quantity} · ${Number(item.price).toFixed(2)} each</p>
                                            </div>
                                            <p className="font-bold text-sm ml-auto">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

// Button and other UI components are assumed to be available
import { Button } from '@/components/ui/button';

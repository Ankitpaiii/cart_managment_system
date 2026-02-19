'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
    const total = getTotal();

    if (items.length === 0) {
        return (
            <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4">
                <div className="mb-6 rounded-full bg-neutral-100 p-6">
                    <ShoppingBag className="h-12 w-12 text-neutral-400" />
                </div>
                <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
                <p className="mb-8 text-neutral-500">Looks like you haven't added anything to your cart yet.</p>
                <Link href="/products">
                    <Button size="lg">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <Card key={item.productId} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    {/* Image */}
                                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
                                        {item.imageUrl ? (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-neutral-400 text-xs">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-semibold">{item.name}</h3>
                                                <p className="text-sm text-neutral-500">${item.price.toFixed(2)}</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                className="text-neutral-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2 border rounded-md">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="text-sm w-4 text-center">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex justify-between py-2">
                        <Button variant="outline" size="sm" onClick={clearCart} className="text-neutral-500">
                            Clear Cart
                        </Button>
                        <Link href="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                            Continue Shopping <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Shipping</span>
                                <span>Free</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <Link href="/checkout" className="block w-full">
                                <Button className="w-full" size="lg">
                                    Proceed to Checkout
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Simple Card components to avoid separate files if not already there
function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={`p-6 pb-4 ${className}`}>{children}</div>;
}

function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return <h3 className={`text-xl font-bold ${className}`}>{children}</h3>;
}

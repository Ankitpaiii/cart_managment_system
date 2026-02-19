'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { ordersApi, addressesApi, paymentsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { Loader2, CreditCard, Truck, Wallet, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const { isAuthenticated, customer } = useAuthStore();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');

    const total = getTotal();

    // Fetch saved addresses
    const { data: addressesData, isLoading: isLoadingAddresses } = useQuery({
        queryKey: ['addresses'],
        queryFn: addressesApi.getAll,
        enabled: isAuthenticated,
    });

    const addresses = addressesData?.addresses || [];
    const defaultAddress = addresses.find((addr: any) => addr.isDefault) || addresses[0];

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=/checkout');
        } else if (items.length === 0 && !orderSuccess) {
            router.push('/cart');
        }
    }, [isAuthenticated, items.length, orderSuccess, router]);

    const handlePlaceOrder = async () => {
        if (!defaultAddress) {
            alert('Please add a delivery address in your profile first.');
            router.push('/profile');
            return;
        }

        setIsPlacingOrder(true);
        try {
            // 1. Create order
            const orderData = await ordersApi.create({
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            });

            // 2. Process payment (simulated)
            await paymentsApi.create({
                orderId: orderData.order.id,
                amount: total,
                paymentMethod: paymentMethod,
                transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`
            });

            setOrderSuccess(true);
            clearCart();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to place order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4">
                <div className="mb-6 rounded-full bg-green-100 p-6">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
                <h1 className="mb-2 text-3xl font-bold">Order Placed Successfully!</h1>
                <p className="mb-8 text-neutral-500 text-center max-w-md">
                    Thank you for your purchase. We've received your order and are processing it now.
                </p>
                <div className="flex gap-4">
                    <Button onClick={() => router.push('/orders')}>View Orders</Button>
                    <Button variant="outline" onClick={() => router.push('/')}>Back to Home</Button>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold text-center md:text-left">Checkout</h1>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Delivery Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Delivery Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoadingAddresses ? (
                                <div className="flex items-center gap-2 text-neutral-500">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Loading addresses...
                                </div>
                            ) : addresses && addresses.length > 0 ? (
                                <div className="rounded-lg border p-4 bg-neutral-50">
                                    <p className="font-bold">{customer?.firstName} {customer?.lastName}</p>
                                    <p className="text-neutral-600 font-medium">{defaultAddress.street}</p>
                                    <p className="text-neutral-600 font-medium">
                                        {defaultAddress.city}, {defaultAddress.state} {defaultAddress.zipCode}
                                    </p>
                                    <p className="text-neutral-600 font-medium">{defaultAddress.country}</p>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-neutral-500 mb-4">No saved addresses found.</p>
                                    <Button onClick={() => router.push('/profile')}>Add Address</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Method
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-neutral-50">
                                    <RadioGroupItem value="CREDIT_CARD" id="card" />
                                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <CreditCard className="h-4 w-4" />
                                        <span>Credit / Debit Card</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-neutral-50">
                                    <RadioGroupItem value="UPI" id="upi" />
                                    <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <Wallet className="h-4 w-4" />
                                        <span>UPI</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-neutral-50">
                                    <RadioGroupItem value="CASH_ON_DELIVERY" id="cod" />
                                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <Truck className="h-4 w-4" />
                                        <span>Cash on Delivery</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                            <CardDescription>{items.length} items in your bag</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="max-h-[300px] overflow-y-auto space-y-3">
                                {items.map(item => (
                                    <div key={item.productId} className="flex justify-between text-sm">
                                        <span className="text-neutral-500 line-clamp-1">{item.quantity}x {item.name}</span>
                                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-neutral-500 font-medium">Subtotal</span>
                                <span className="font-medium">${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500 font-medium">Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder || !defaultAddress}
                            >
                                {isPlacingOrder ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Placing Order...
                                    </>
                                ) : (
                                    'Complete Purchase'
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

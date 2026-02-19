'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { productsApi } from '@/lib/api';
import { useCartStore } from '@/lib/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const { data, isLoading, error } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => productsApi.getById(slug as string),
    });

    const product = data?.product;

    const handleAddToCart = () => {
        if (product) {
            addItem({
                productId: product.id,
                name: product.name,
                price: Number(product.price),
                imageUrl: product.imageUrl,
            });
            // Optional: Show toast or redirect
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <Skeleton className="aspect-square w-full rounded-xl" />
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4">
                <h1 className="mb-4 text-2xl font-bold">Product not found</h1>
                <Button onClick={() => router.push('/products')}>Back to Products</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                className="mb-8 gap-2 pl-0 hover:bg-transparent"
                onClick={() => router.back()}
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </Button>

            <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 shadow-sm">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-neutral-400">
                            No image available
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                    <div className="mb-6">
                        <Badge variant="secondary" className="mb-4">
                            {product.category?.name}
                        </Badge>
                        <h1 className="mb-2 text-4xl font-bold tracking-tight">{product.name}</h1>
                        <p className="text-2xl font-bold text-primary">${Number(product.price).toFixed(2)}</p>
                    </div>

                    <p className="mb-8 text-lg leading-relaxed text-neutral-600">
                        {product.description || 'No description available for this product.'}
                    </p>

                    <div className="mb-8 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center rounded-md border">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    -
                                </Button>
                                <span className="w-10 text-center font-medium">{quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </Button>
                            </div>
                            <Button className="flex-1 gap-2" size="lg" onClick={handleAddToCart}>
                                <ShoppingCart className="h-5 w-5" />
                                Add to Cart
                            </Button>
                        </div>
                        {product.stock <= 5 && product.stock > 0 && (
                            <p className="text-sm font-medium text-amber-600">
                                Only {product.stock} items left in stock!
                            </p>
                        )}
                        {product.stock === 0 && (
                            <p className="text-sm font-medium text-red-500">Out of stock</p>
                        )}
                    </div>

                    <Separator className="mb-8" />

                    {/* Features/Trust Badges */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="flex items-start gap-3">
                            <Truck className="h-5 w-5 text-neutral-400" />
                            <div>
                                <h4 className="text-sm font-semibold">Free Delivery</h4>
                                <p className="text-xs text-neutral-500">Orders over $100</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <RotateCcw className="h-5 w-5 text-neutral-400" />
                            <div>
                                <h4 className="text-sm font-semibold">30 Day Returns</h4>
                                <p className="text-xs text-neutral-500">Hassle-free process</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="h-5 w-5 text-neutral-400" />
                            <div>
                                <h4 className="text-sm font-semibold">Secure Payment</h4>
                                <p className="text-xs text-neutral-500">100% data protection</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

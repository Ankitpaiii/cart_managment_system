'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/stores/cartStore';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    slug: string;
    categoryName?: string;
}

export function ProductCard({ id, name, price, imageUrl, slug, categoryName }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({ productId: id, name, price, imageUrl });
    };

    return (
        <Link href={`/products/${slug}`}>
            <motion.div
                className="group relative overflow-hidden rounded-lg bg-white"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
            >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-neutral-400">
                            <span className="text-sm">No image</span>
                        </div>
                    )}

                    {/* Hover overlay with Add to Cart */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button
                            onClick={handleAddToCart}
                            size="sm"
                            className="gap-2"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                        </Button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                    {categoryName && (
                        <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                            {categoryName}
                        </p>
                    )}
                    <h3 className="font-medium text-sm mb-2 line-clamp-2">{name}</h3>
                    <p className="text-lg font-semibold">${price.toFixed(2)}</p>
                </div>
            </motion.div>
        </Link>
    );
}

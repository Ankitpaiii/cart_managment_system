'use client';

import { ProductCard } from './ProductCard';

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    slug: string;
    category?: {
        name: string;
    };
}

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-neutral-500">No products found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={Number(product.price)}
                    imageUrl={product.imageUrl}
                    slug={product.slug}
                    categoryName={product.category?.name}
                />
            ))}
        </div>
    );
}

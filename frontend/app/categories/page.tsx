'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, ChevronRight, Layers } from 'lucide-react';

export default function CategoriesPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: categoriesApi.getAll,
    });

    const categories = data?.categories || [];

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12 text-center">
                <h1 className="mb-4 text-4xl font-bold tracking-tight">Browse Categories</h1>
                <p className="mx-auto max-w-2xl text-lg text-neutral-500">
                    Find exactly what you're looking for by browsing through our curated collections.
                </p>
            </div>

            {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category: any) => (
                        <Link key={category.id} href={`/products?categoryId=${category.id}`}>
                            <Card className="group h-full overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-lg">
                                <CardHeader className="relative h-40 bg-neutral-100 flex items-center justify-center overflow-hidden">
                                    <Layers className="h-16 w-16 text-neutral-300 group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-neutral-900/5 group-hover:bg-transparent transition-colors" />
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                            {category.name}
                                        </h3>
                                        <ChevronRight className="h-5 w-5 text-neutral-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
                                        {category.description || `Explore our high-quality selection of ${category.name.toLowerCase()}.`}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
                                        <ShoppingBag className="h-3 w-3" />
                                        <span>{category._count?.products || 0} Products</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

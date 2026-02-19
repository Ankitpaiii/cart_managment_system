'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ProductsPage() {
    const [search, setSearch] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');

    const { data, isLoading } = useQuery({
        queryKey: ['products', selectedCategories, sortBy, order],
        queryFn: () => productsApi.getAll({
            categoryId: selectedCategories.length > 0 ? selectedCategories[0] : undefined, // API handles single category for now
            sortBy,
            order,
        }),
    });

    // Local filtering for search and price range (since API might not support all filters yet)
    const filteredProducts = useMemo(() => {
        if (!data?.products) return [];

        return data.products.filter((product: any) => {
            const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
            const matchesPrice = Number(product.price) >= priceRange[0] && Number(product.price) <= priceRange[1];
            return matchesSearch && matchesPrice;
        });
    }, [data, search, priceRange]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-8 md:flex-row">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Filters</h2>
                        <ProductFilters
                            search={search}
                            setSearch={setSearch}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                        />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <h1 className="text-2xl font-bold">
                            {isLoading ? 'Loading Products...' : `${filteredProducts.length} Products`}
                        </h1>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-500">Sort by:</span>
                            <Select
                                value={`${sortBy}-${order}`}
                                onValueChange={(value) => {
                                    const [newSortBy, newOrder] = value.split('-');
                                    setSortBy(newSortBy);
                                    setOrder(newOrder as 'asc' | 'desc');
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                    <SelectItem value="name-asc">Name: A-Z</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="aspect-square w-full rounded-lg" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <ProductGrid products={filteredProducts} />
                    )}
                </main>
            </div>
        </div>
    );
}

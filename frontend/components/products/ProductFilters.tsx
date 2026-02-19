'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api';

interface Category {
    id: string;
    name: string;
    slug: string;
    _count?: {
        products: number;
    };
}

interface ProductFiltersProps {
    search: string;
    setSearch: (value: string) => void;
    priceRange: [number, number];
    setPriceRange: (value: [number, number]) => void;
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
}

export function ProductFilters({
    search,
    setSearch,
    priceRange,
    setPriceRange,
    selectedCategories,
    setSelectedCategories,
}: ProductFiltersProps) {
    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: categoriesApi.getAll,
    });

    const handleCategoryChange = (categoryId: string, checked: boolean) => {
        if (checked) {
            setSelectedCategories([...selectedCategories, categoryId]);
        } else {
            setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
        }
    };

    return (
        <div className="space-y-8">
            {/* Search */}
            <div>
                <Label htmlFor="search" className="mb-2 block text-sm font-semibold">
                    Search Products
                </Label>
                <Input
                    id="search"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Categories */}
            <div>
                <Label className="mb-4 block text-sm font-semibold">Categories</Label>
                <div className="space-y-3">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-2">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))
                    ) : (
                        categories?.categories?.map((category: Category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={category.id}
                                    checked={selectedCategories.includes(category.id)}
                                    onCheckedChange={(checked) =>
                                        handleCategoryChange(category.id, checked === true)
                                    }
                                />
                                <label
                                    htmlFor={category.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between w-full"
                                >
                                    <span>{category.name}</span>
                                    {category._count && (
                                        <span className="text-neutral-400 text-xs">
                                            ({category._count.products})
                                        </span>
                                    )}
                                </label>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <Label className="text-sm font-semibold">Price Range</Label>
                    <span className="text-xs font-medium text-neutral-500">
                        ${priceRange[0]} - ${priceRange[1]}
                    </span>
                </div>
                <Slider
                    defaultValue={[0, 2000]}
                    max={2000}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="py-4"
                />
            </div>
        </div>
    );
}

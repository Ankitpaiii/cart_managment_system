'use client';

import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/button';

export function Header() {
    const itemCount = useCartStore((state) => state.getItemCount());
    const { isAuthenticated, customer } = useAuthStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-semibold tracking-tight">SHOP</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link
                        href="/products"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Products
                    </Link>
                    <Link
                        href="/categories"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Categories
                    </Link>
                    {isAuthenticated && (
                        <>
                            <Link
                                href="/orders"
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                Orders
                            </Link>
                        </>
                    )}
                    {isAuthenticated && customer?.email === 'admin@gmail.com' && (
                        <Link
                            href="/admin"
                            className="text-sm font-medium transition-colors hover:text-blue-600 font-bold"
                        >
                            Admin
                        </Link>
                    )}
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    {/* Cart */}
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                    {itemCount}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {/* User */}
                    {isAuthenticated ? (
                        <Link href="/profile">
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/auth/login">
                            <Button variant="default" size="sm">
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header >
    );
}

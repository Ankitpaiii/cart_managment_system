export function Footer() {
    return (
        <footer className="border-t bg-neutral-50 mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">SHOP</h3>
                        <p className="text-sm text-neutral-600">
                            Modern e-commerce platform for premium products.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-medium mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-neutral-600">
                            <li>
                                <a href="/products" className="hover:text-neutral-900 transition-colors">
                                    All Products
                                </a>
                            </li>
                            <li>
                                <a href="/categories" className="hover:text-neutral-900 transition-colors">
                                    Categories
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer */}
                    <div>
                        <h4 className="font-medium mb-4">Customer</h4>
                        <ul className="space-y-2 text-sm text-neutral-600">
                            <li>
                                <a href="/orders" className="hover:text-neutral-900 transition-colors">
                                    My Orders
                                </a>
                            </li>
                            <li>
                                <a href="/profile" className="hover:text-neutral-900 transition-colors">
                                    Profile
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-medium mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-neutral-600">
                            <li>
                                <a href="#" className="hover:text-neutral-900 transition-colors">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-neutral-900 transition-colors">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t text-center text-sm text-neutral-600">
                    <p>&copy; {new Date().getFullYear()} SHOP. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

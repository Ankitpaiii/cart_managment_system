import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Discover Premium
          <br />
          <span className="text-neutral-600">Products</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-neutral-600">
          Curated collection of high-quality products designed for modern living.
          Simple, elegant, and built to last.
        </p>
        <Link href="/products">
          <Button size="lg" className="gap-2">
            Shop Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Featured Categories */}
      <section className="py-20">
        <h2 className="mb-12 text-center text-3xl font-semibold">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {['Electronics', 'Fashion', 'Home & Living'].map((category) => (
            <Link
              key={category}
              href={`/products?category=${category.toLowerCase()}`}
              className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-100 transition-transform hover:scale-[1.02]"
            >
              <div className="flex h-full items-center justify-center">
                <h3 className="text-2xl font-medium">{category}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-3xl rounded-2xl bg-neutral-50 p-12">
          <h2 className="mb-4 text-3xl font-semibold">
            Join Our Community
          </h2>
          <p className="mb-8 text-neutral-600">
            Sign up to get exclusive access to new products and special offers.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="outline">
              Create Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

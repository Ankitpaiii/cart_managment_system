import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Clear existing data (in reverse order of dependency)
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.address.deleteMany();
    await prisma.customer.deleteMany();

    console.log('🧹 database cleared.');

    // 2. Create Categories
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Electronics',
                slug: 'electronics',
                description: 'Latest gadgets and electronic devices'
            }
        }),
        prisma.category.create({
            data: {
                name: 'Apparel',
                slug: 'apparel',
                description: 'Stylish clothing for men and women'
            }
        }),
        prisma.category.create({
            data: {
                name: 'Home & Living',
                slug: 'home-living',
                description: 'Furniture and decor for your home'
            }
        })
    ]);

    const [electronics, apparel, homeLiving] = categories;
    console.log('📁 Categories created.');

    // 3. Create Products
    const products = await Promise.all([
        // Electronics
        prisma.product.create({
            data: {
                name: 'HyperX Cloud II Gaming Headset',
                slug: 'hyperx-cloud-ii',
                description: 'Versatile gaming headset designed for comfort and audio precision.',
                price: 99.99,
                stock: 50,
                imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426ff473c?q=80&w=1470&auto=format&fit=crop',
                categoryId: electronics.id
            }
        }),
        prisma.product.create({
            data: {
                name: 'MacBook Air M2',
                slug: 'macbook-air-m2',
                description: 'Strikingly thin and fast so you can work, play, or create anywhere.',
                price: 1099.00,
                stock: 15,
                imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1452&auto=format&fit=crop',
                categoryId: electronics.id
            }
        }),
        // Apparel
        prisma.product.create({
            data: {
                name: 'Premium Cotton Hoodie',
                slug: 'premium-cotton-hoodie',
                description: 'An essential hoodie made from heavy-weight brushback cotton fleece.',
                price: 65.00,
                stock: 100,
                imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1374&auto=format&fit=crop',
                categoryId: apparel.id
            }
        }),
        prisma.product.create({
            data: {
                name: 'Classic White Sneakers',
                slug: 'classic-white-sneakers',
                description: 'Minimalist sneakers crafted from full-grain Italian leather.',
                price: 120.00,
                stock: 40,
                imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1412&auto=format&fit=crop',
                categoryId: apparel.id
            }
        }),
        // Home
        prisma.product.create({
            data: {
                name: 'Minimalist Ceramic Vase',
                slug: 'minimalist-ceramic-vase',
                description: 'Hand-crafted ceramic vase with a matte finish.',
                price: 45.00,
                stock: 25,
                imageUrl: 'https://images.unsplash.com/photo-1581333100576-b73bbebd3c2e?q=80&w=1374&auto=format&fit=crop',
                categoryId: homeLiving.id
            }
        })
    ]);

    console.log('🏷️ Products created.');

    // 4. Create a Demo Admin User
    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = await prisma.customer.create({
        data: {
            email: 'demo@example.com',
            password: hashedPassword,
            firstName: 'Demo',
            lastName: 'User',
            phone: '1234567890',
            addresses: {
                create: {
                    street: '123 Tech Lane',
                    city: 'San Francisco',
                    state: 'CA',
                    zipCode: '94107',
                    country: 'USA',
                    isDefault: true
                }
            }
        }
    });

    console.log('👤 Demo user created (demo@example.com / password123)');

    const hashedAdminPassword = await bcrypt.hash('123456', 10);
    const adminUser = await prisma.customer.create({
        data: {
            email: 'admin@gmail.com',
            password: hashedAdminPassword,
            firstName: 'Admin',
            lastName: 'User',
            phone: '0000000000',
            role: 'ADMIN',
            addresses: {
                create: {
                    street: '1 Admin Way',
                    city: 'Admin City',
                    state: 'AD',
                    zipCode: '00000',
                    country: 'ADMIN',
                    isDefault: true
                }
            }
        }
    });

    console.log('👤 Admin user created (admin@gmail.com / 123456)');

    console.log('✅ Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

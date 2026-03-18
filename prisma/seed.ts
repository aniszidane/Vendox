// VendoX — Database Seed
// Run: pnpm prisma db seed

import { PrismaClient, Role, StoreStatus, StoreVerificationStatus, KhasniStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding VendoX database...');

  // ── Categories ──────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.storeCategory.upsert({
      where: { slug: 'food-drink' },
      update: {},
      create: { name: 'Food & Drink', nameAr: 'طعام وشراب', nameFr: 'Alimentation', slug: 'food-drink', emoji: '🍔', color: '#FF6B35', sortOrder: 1 },
    }),
    prisma.storeCategory.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: { name: 'Fashion & Clothing', nameAr: 'أزياء وملابس', nameFr: 'Mode', slug: 'fashion', emoji: '👗', color: '#E91E8C', sortOrder: 2 },
    }),
    prisma.storeCategory.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: { name: 'Electronics', nameAr: 'إلكترونيات', nameFr: 'Électronique', slug: 'electronics', emoji: '📱', color: '#0D47A1', sortOrder: 3 },
    }),
    prisma.storeCategory.upsert({
      where: { slug: 'beauty-health' },
      update: {},
      create: { name: 'Beauty & Health', nameAr: 'جمال وصحة', nameFr: 'Beauté & Santé', slug: 'beauty-health', emoji: '💄', color: '#AD1457', sortOrder: 4 },
    }),
    prisma.storeCategory.upsert({
      where: { slug: 'home-decor' },
      update: {},
      create: { name: 'Home & Decor', nameAr: 'منزل وديكور', nameFr: 'Maison & Décor', slug: 'home-decor', emoji: '🏡', color: '#2E7D32', sortOrder: 5 },
    }),
    prisma.storeCategory.upsert({
      where: { slug: 'sports' },
      update: {},
      create: { name: 'Sports & Fitness', nameAr: 'رياضة ولياقة', nameFr: 'Sport & Fitness', slug: 'sports', emoji: '⚽', color: '#1565C0', sortOrder: 6 },
    }),
    prisma.storeCategory.upsert({
      where: { slug: 'automotive' },
      update: {},
      create: { name: 'Automotive', nameAr: 'سيارات', nameFr: 'Automobile', slug: 'automotive', emoji: '🚗', color: '#BF360C', sortOrder: 7 },
    }),
    prisma.storeCategory.upsert({
      where: { slug: 'services' },
      update: {},
      create: { name: 'Services', nameAr: 'خدمات', nameFr: 'Services', slug: 'services', emoji: '🛠️', color: '#4527A0', sortOrder: 8 },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // ── Admin User ───────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vendox.dz' },
    update: {},
    create: {
      email: 'admin@vendox.dz',
      passwordHash: adminPassword,
      fullName: 'VendoX Admin',
      username: 'vendox_admin',
      role: Role.ADMIN,
      emailVerified: true,
      avatarUrl: 'https://ui-avatars.com/api/?name=VendoX+Admin&background=0D7490&color=fff',
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ── Regular Users ────────────────────────────────────────────────
  const userPassword = await bcrypt.hash('user1234!', 12);
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'anis@example.dz' },
      update: {},
      create: {
        email: 'anis@example.dz',
        passwordHash: userPassword,
        fullName: 'Anis Beloufa',
        username: 'anis_belo',
        emailVerified: true,
        avatarUrl: 'https://ui-avatars.com/api/?name=Anis+Beloufa&background=0D7490&color=fff',
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah@example.dz' },
      update: {},
      create: {
        email: 'sarah@example.dz',
        passwordHash: userPassword,
        fullName: 'Sarah Mansouri',
        username: 'sarah_m',
        emailVerified: true,
        avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Mansouri&background=E91E8C&color=fff',
      },
    }),
    prisma.user.upsert({
      where: { email: 'karim@example.dz' },
      update: {},
      create: {
        email: 'karim@example.dz',
        passwordHash: userPassword,
        fullName: 'Karim Tlemcani',
        username: 'karim_tlm',
        emailVerified: true,
        avatarUrl: 'https://ui-avatars.com/api/?name=Karim+Tlemcani&background=1565C0&color=fff',
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} regular users`);

  // ── Store Owners ─────────────────────────────────────────────────
  const storeOwnerPassword = await bcrypt.hash('store1234!', 12);
  const storeOwners = await Promise.all([
    prisma.user.upsert({
      where: { email: 'kebab_king@example.dz' },
      update: {},
      create: {
        email: 'kebab_king@example.dz',
        passwordHash: storeOwnerPassword,
        fullName: 'Hassan Bouzid',
        username: 'hassan_kebab',
        role: Role.STORE_OWNER,
        emailVerified: true,
        avatarUrl: 'https://ui-avatars.com/api/?name=Hassan+Bouzid&background=FF6B35&color=fff',
      },
    }),
    prisma.user.upsert({
      where: { email: 'fashion_store@example.dz' },
      update: {},
      create: {
        email: 'fashion_store@example.dz',
        passwordHash: storeOwnerPassword,
        fullName: 'Amira Chelli',
        username: 'amira_fashion',
        role: Role.STORE_OWNER,
        emailVerified: true,
        avatarUrl: 'https://ui-avatars.com/api/?name=Amira+Chelli&background=E91E8C&color=fff',
      },
    }),
    prisma.user.upsert({
      where: { email: 'tech_shop@example.dz' },
      update: {},
      create: {
        email: 'tech_shop@example.dz',
        passwordHash: storeOwnerPassword,
        fullName: 'Youcef Hadj',
        username: 'youcef_tech',
        role: Role.STORE_OWNER,
        emailVerified: true,
        avatarUrl: 'https://ui-avatars.com/api/?name=Youcef+Hadj&background=0D47A1&color=fff',
      },
    }),
  ]);
  console.log(`✅ Created ${storeOwners.length} store owners`);

  // ── Stores ───────────────────────────────────────────────────────
  const store1 = await prisma.store.upsert({
    where: { slug: 'kebab-king-alger' },
    update: {},
    create: {
      ownerId: storeOwners[0].id,
      name: 'Kebab King',
      slug: 'kebab-king-alger',
      description: 'The best kebabs in Algiers! Fresh ingredients daily, authentic recipes, and the tastiest sauces in town. Open 7 days a week.',
      logoUrl: 'https://ui-avatars.com/api/?name=Kebab+King&background=FF6B35&color=fff&size=200',
      categoryId: categories[0].id,
      phone: '+213 555 123 456',
      whatsapp: '+213 555 123 456',
      instagramUrl: 'https://instagram.com/kebabking_alger',
      status: StoreStatus.OPEN,
      verificationStatus: StoreVerificationStatus.VERIFIED,
      verifiedAt: new Date(),
      followerCount: 1240,
      postCount: 45,
      reviewCount: 128,
      averageRating: 4.7,
      location: {
        create: {
          address: '15 Rue Didouche Mourad',
          city: 'Alger',
          wilaya: 'Alger',
          latitude: 36.7538,
          longitude: 3.0588,
        },
      },
    },
  });

  const store2 = await prisma.store.upsert({
    where: { slug: 'amira-fashion-bab-ezzouar' },
    update: {},
    create: {
      ownerId: storeOwners[1].id,
      name: 'Amira Fashion',
      slug: 'amira-fashion-bab-ezzouar',
      description: 'Trendy fashion boutique. Latest collections from European and local designers. Hijab fashion specialists.',
      logoUrl: 'https://ui-avatars.com/api/?name=Amira+Fashion&background=E91E8C&color=fff&size=200',
      categoryId: categories[1].id,
      phone: '+213 555 234 567',
      instagramUrl: 'https://instagram.com/amira_fashion_dz',
      facebookUrl: 'https://facebook.com/amirafashiondz',
      status: StoreStatus.OPEN,
      verificationStatus: StoreVerificationStatus.VERIFIED,
      verifiedAt: new Date(),
      followerCount: 3200,
      postCount: 89,
      reviewCount: 215,
      averageRating: 4.9,
      location: {
        create: {
          address: 'Centre Commercial Bab Ezzouar',
          city: 'Bab Ezzouar',
          wilaya: 'Alger',
          latitude: 36.7310,
          longitude: 3.1830,
        },
      },
    },
  });

  const store3 = await prisma.store.upsert({
    where: { slug: 'tech-world-oran' },
    update: {},
    create: {
      ownerId: storeOwners[2].id,
      name: 'TechWorld',
      slug: 'tech-world-oran',
      description: 'Your one-stop shop for all electronics. Smartphones, laptops, accessories, repairs, and more. Authorized reseller.',
      logoUrl: 'https://ui-avatars.com/api/?name=TechWorld&background=0D47A1&color=fff&size=200',
      categoryId: categories[2].id,
      phone: '+213 555 345 678',
      whatsapp: '+213 555 345 678',
      instagramUrl: 'https://instagram.com/techworldoran',
      status: StoreStatus.OPEN,
      verificationStatus: StoreVerificationStatus.VERIFIED,
      verifiedAt: new Date(),
      followerCount: 5800,
      postCount: 120,
      reviewCount: 340,
      averageRating: 4.5,
      location: {
        create: {
          address: '23 Rue des Aurès',
          city: 'Oran',
          wilaya: 'Oran',
          latitude: 35.6971,
          longitude: -0.6308,
        },
      },
    },
  });

  console.log(`✅ Created 3 stores`);

  // ── Posts ────────────────────────────────────────────────────────
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        storeId: store1.id,
        caption: '🔥 Nouveau menu été! Notre Kebab Spécial avec sauce harissa maison et légumes frais. Prix spécial: 350 DZD seulement aujourd\'hui! 🌶️',
        likeCount: 234,
        commentCount: 45,
        saveCount: 67,
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', sortOrder: 0 },
            { url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600', sortOrder: 1 },
          ],
        },
      },
    }),
    prisma.post.create({
      data: {
        storeId: store2.id,
        caption: '✨ Nouvelle collection Ramadan 2025! Des abaya et robes de soirée magnifiques pour toutes les occasions. En stock maintenant! 🌙',
        likeCount: 891,
        commentCount: 123,
        saveCount: 456,
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600', sortOrder: 0 },
            { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600', sortOrder: 1 },
            { url: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600', sortOrder: 2 },
          ],
        },
      },
    }),
    prisma.post.create({
      data: {
        storeId: store3.id,
        caption: '📱 iPhone 15 Pro Max disponible en stock! Toutes les couleurs. Prix compétitifs et garantie officielle. Venez nous rendre visite ou DM pour info! 💻',
        likeCount: 567,
        commentCount: 89,
        saveCount: 234,
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600', sortOrder: 0 },
          ],
        },
      },
    }),
    prisma.post.create({
      data: {
        storeId: store1.id,
        caption: '🎉 Spécial vendredi! Commandez 2 kebabs et obtenez une boisson gratuite. Valable uniquement aujourd\'hui de 12h à 15h.',
        likeCount: 156,
        commentCount: 23,
        saveCount: 34,
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600', sortOrder: 0 },
          ],
        },
      },
    }),
  ]);
  console.log(`✅ Created ${posts.length} posts`);

  // ── Products ─────────────────────────────────────────────────────
  await Promise.all([
    prisma.product.create({
      data: {
        storeId: store3.id,
        categoryId: categories[2].id,
        name: 'iPhone 15 Pro Max 256GB',
        description: 'Latest Apple iPhone 15 Pro Max, 256GB storage, titanium design, A17 Pro chip. All colors available.',
        price: 245000,
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        likeCount: 234,
      },
    }),
    prisma.product.create({
      data: {
        storeId: store3.id,
        categoryId: categories[2].id,
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Samsung Galaxy S24 Ultra with S-Pen, 12GB RAM, 512GB storage.',
        price: 215000,
        imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
        likeCount: 189,
      },
    }),
    prisma.product.create({
      data: {
        storeId: store2.id,
        categoryId: categories[1].id,
        name: 'Abaya Premium - Collection 2025',
        description: 'Luxurious abaya crafted from premium fabric. Available in black, navy and grey. Sizes S to XL.',
        price: 8500,
        imageUrl: 'https://images.unsplash.com/photo-1549140600-78c9b8275e9d?w=400',
        likeCount: 456,
      },
    }),
  ]);
  console.log(`✅ Created products`);

  // ── Khasni Requests ──────────────────────────────────────────────
  await Promise.all([
    prisma.khasniRequest.create({
      data: {
        userId: users[0].id,
        categoryId: categories[2].id,
        title: 'Cherche iPhone 14 reconditionné',
        description: 'Je cherche un iPhone 14 128GB reconditionné en bon état. Budget max 120,000 DZD. Préférence pour Alger.',
        city: 'Alger',
        wilaya: 'Alger',
        budget: 120000,
        status: KhasniStatus.OPEN,
        responseCount: 3,
      },
    }),
    prisma.khasniRequest.create({
      data: {
        userId: users[1].id,
        categoryId: categories[1].id,
        title: 'Cherche robe de mariée taille 38',
        description: 'Robe de mariée blanche ou ivoire, taille 38, style moderne. Budget entre 15,000 et 25,000 DZD.',
        city: 'Alger',
        wilaya: 'Alger',
        budget: 25000,
        status: KhasniStatus.OPEN,
        responseCount: 2,
      },
    }),
    prisma.khasniRequest.create({
      data: {
        userId: users[2].id,
        categoryId: categories[0].id,
        title: 'Looking for catering for 50 people',
        description: 'Need catering for a family event, 50 guests. Traditional Algerian cuisine preferred. Date: next month.',
        city: 'Oran',
        wilaya: 'Oran',
        budget: 50000,
        status: KhasniStatus.OPEN,
        responseCount: 1,
      },
    }),
  ]);
  console.log(`✅ Created Khasni requests`);

  // ── Follows ──────────────────────────────────────────────────────
  await Promise.all([
    prisma.follow.upsert({
      where: { userId_storeId: { userId: users[0].id, storeId: store1.id } },
      update: {},
      create: { userId: users[0].id, storeId: store1.id },
    }),
    prisma.follow.upsert({
      where: { userId_storeId: { userId: users[0].id, storeId: store2.id } },
      update: {},
      create: { userId: users[0].id, storeId: store2.id },
    }),
    prisma.follow.upsert({
      where: { userId_storeId: { userId: users[1].id, storeId: store2.id } },
      update: {},
      create: { userId: users[1].id, storeId: store2.id },
    }),
    prisma.follow.upsert({
      where: { userId_storeId: { userId: users[2].id, storeId: store3.id } },
      update: {},
      create: { userId: users[2].id, storeId: store3.id },
    }),
  ]);
  console.log(`✅ Created follows`);

  // ── Notifications ────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId: users[0].id,
        type: 'NEW_FOLLOWER',
        title: 'New follower',
        message: 'Sarah Mansouri started following you',
        actorId: users[1].id,
        isRead: false,
      },
      {
        userId: users[0].id,
        type: 'KHASNI_RESPONSE',
        title: 'New response to your Khasni',
        message: 'TechWorld responded to your iPhone request',
        storeId: store3.id,
        isRead: false,
      },
      {
        userId: users[1].id,
        type: 'NEW_POST',
        title: 'Amira Fashion posted something new',
        message: '✨ Nouvelle collection Ramadan 2025!',
        storeId: store2.id,
        isRead: true,
      },
    ],
  });
  console.log(`✅ Created notifications`);

  console.log('\n🎉 VendoX seed complete!');
  console.log('\n📧 Test accounts:');
  console.log('   Admin:       admin@vendox.dz         / admin123!');
  console.log('   User:        anis@example.dz          / user1234!');
  console.log('   Store owner: kebab_king@example.dz    / store1234!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

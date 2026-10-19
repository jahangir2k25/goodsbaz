import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Category from './models/Category.js';
import Brand from './models/Brand.js';
import Banner from './models/Banner.js';
import Coupon from './models/Coupon.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

const categories = [
  { name: 'Personal Care', subCategories: ['Bath & Body', 'Oral Care', 'Deodorant', 'Feminine Care', 'Hand & Foot Care'] },
  { name: 'Skin Care', subCategories: ['Face Wash', 'Moisturizer', 'Serum', 'Sunscreen', 'Toner', 'Face Mask', 'Lip Care'] },
  { name: 'Hair Care', subCategories: ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Mask', 'Hair Treatment'] },
  { name: 'Makeup', subCategories: ['Lips', 'Eyes', 'Face', 'Nails', 'Makeup Tools'] },
  { name: 'Kids & Mom', subCategories: ['Baby Skincare', 'Baby Bath', 'Diapers', 'Mom Care'] },
  { name: 'K-Beauty', subCategories: ['Cleansers', 'Essence & Serum', 'Sunscreen', 'Masks', 'Toner'] },
  { name: 'J-Beauty', subCategories: ['Face Wash', 'Sunscreen', 'Lip Care', 'Skincare'] },
  { name: 'B-Glam', subCategories: ['Skin Care', 'Hair Care', 'Makeup', 'Body Care'] },
].map((c, i) => ({ ...c, order: i }));

const featuredBrands = ['Cos De BAHA', 'COSRX', 'Dot & Key', 'Beauty of Joseon', 'Anua', 'Tiam', 'Skin Aqua', 'Biore'];
const otherBrands = [
  'Hada Labo', 'Cetaphil', 'The Ordinary', 'Garnier', 'Simple', 'Himalaya', 'Neutrogena', 'Sebamed',
  "Johnson's", 'Maybelline', 'Lakme', "Pond's", 'Dove', 'Nivea', 'Sensodyne', 'Rexona', 'Herbal Glow BD',
];

const banners = [
  // ---- hero slider ----
  {
    type: 'hero', tag: 'MADE POSSIBLE BY YOUR LOVE', title: '1 MILLION FACEBOOK FOLLOWERS',
    subtitle: 'Thank You', highlight: 'FOR BEING A PART OF OUR STORY',
    gradient: 'linear-gradient(100deg,#fff1f5 0%,#f9cadb 55%,#e48db0 100%)', textColor: '#7a0a3a', link: '/shop', order: 1,
  },
  {
    type: 'hero', tag: 'UPTO 80% OFF', title: 'WINTER CLEARANCE', subtitle: 'Skincare, haircare and more at the lowest prices',
    gradient: 'linear-gradient(100deg,#1e3a8a 0%,#6d28d9 55%,#db2777 100%)', textColor: '#ffffff', link: '/shop?offers=true', order: 2,
  },
  {
    type: 'hero', tag: '100% AUTHENTIC', title: 'K-BEAUTY FESTIVAL', subtitle: 'COSRX  ·  Anua  ·  Beauty of Joseon',
    gradient: 'linear-gradient(100deg,#fdf2f8 0%,#fbcfe8 50%,#f472b6 100%)', textColor: '#831843', link: '/shop?category=k-beauty', order: 3,
  },
  {
    type: 'hero', tag: 'STARTS FROM ৳250', title: 'SUNSCREEN SEASON', subtitle: 'Protect your skin every single day',
    gradient: 'linear-gradient(100deg,#fef3c7 0%,#fcd34d 55%,#f97316 100%)', textColor: '#78350f', link: '/shop?sub=Sunscreen', order: 4,
  },
  {
    type: 'hero', tag: 'JUST LANDED', title: 'NEW ARRIVALS', subtitle: 'Discover the newest in beauty',
    gradient: 'linear-gradient(100deg,#ecfdf5 0%,#a7f3d0 55%,#34d399 100%)', textColor: '#064e3b', link: '/shop?newArrival=true', order: 5,
  },
  // ---- hot deals strip ----
  { type: 'deal', tag: 'UPTO', title: 'WINTER CLEARANCE', highlight: '80%', subtitle: 'OFF', link: '/shop?offers=true', order: 1 },
  { type: 'deal', tag: 'UPTO', title: 'FOOD SUPPLEMENT', highlight: '48%', subtitle: 'OFF', link: '/shop?offers=true', order: 2 },
  { type: 'deal', tag: '', title: '', highlight: 'COMBO OFFER', subtitle: '', link: '/shop?offers=true', order: 3 },
  { type: 'deal', tag: 'FLAT', title: 'TIAM স্কিনকেয়ার', highlight: '10%', subtitle: 'OFF', link: '/shop?brand=tiam', order: 4 },
  { type: 'deal', tag: '', title: 'LOWEST', highlight: 'PRICE', subtitle: 'JAPANESE Products', link: '/shop?category=j-beauty', order: 5 },
  { type: 'deal', tag: 'থেকে শুরু', title: '', highlight: '২৫০৳', subtitle: 'সানস্ক্রিন', link: '/shop?sub=Sunscreen', order: 6 },
  { type: 'deal', tag: 'নিচে সেরা', title: '', highlight: '৫০০৳', subtitle: 'ফেসওয়াশ', link: '/shop?sub=Face%20Wash&maxPrice=500', order: 7 },
  { type: 'deal', tag: 'নিচে সেরা', title: '', highlight: '১০০০৳', subtitle: 'শ্যাম্পু', link: '/shop?sub=Shampoo&maxPrice=1000', order: 8 },
  // ---- brand banners ----
  {
    type: 'brand', tag: 'Elegance is the OFFICIAL DISTRIBUTOR of', title: 'Cos De BAHA', subtitle: 'Authentic Korean skincare',
    gradient: 'linear-gradient(135deg,#f472b6 0%,#be185d 100%)', textColor: '#ffffff', link: '/shop?brand=cos-de-baha', order: 1,
  },
  {
    type: 'brand', tag: '', title: 'K-beauty', subtitle: 'The best of Korean skincare',
    gradient: 'linear-gradient(135deg,#fdf2f8 0%,#e7e5e4 100%)', textColor: '#1f2937', link: '/shop?category=k-beauty', order: 2,
  },
  {
    type: 'brand', tag: '', title: 'DOT & KEY', subtitle: 'Fruit-powered skincare',
    gradient: 'linear-gradient(135deg,#fb7185 0%,#be123c 100%)', textColor: '#ffffff', link: '/shop?brand=dot-and-key', order: 3,
  },
];

const coupons = [
  { code: 'WELCOME10', type: 'percent', value: 10, minOrder: 500, maxDiscount: 300 },
  { code: 'ELEGANCE100', type: 'fixed', value: 100, minOrder: 1500 },
];

// [name, brand, category, subCategory, price, salePrice, flags(F=featured,B=best,N=new), size]
const P = [
  ['Low pH Good Morning Gel Cleanser', 'COSRX', 'K-Beauty', 'Cleansers', 1650, 1390, 'FB', '150ml'],
  ['Advanced Snail 96 Mucin Power Essence', 'COSRX', 'K-Beauty', 'Essence & Serum', 2650, 2290, 'FB', '100ml'],
  ['Relief Sun Rice + Probiotics SPF50+', 'Beauty of Joseon', 'K-Beauty', 'Sunscreen', 2250, 1890, 'B', '50ml'],
  ['Glow Serum Propolis + Niacinamide', 'Beauty of Joseon', 'K-Beauty', 'Essence & Serum', 2450, 0, 'FN', '30ml'],
  ['Heartleaf 77% Soothing Toner', 'Anua', 'K-Beauty', 'Toner', 2850, 2490, 'FB', '250ml'],
  ['Niacinamide 10% + TXA Serum', 'Anua', 'K-Beauty', 'Essence & Serum', 2350, 1990, 'BN', '30ml'],
  ['Cos De BAHA Niacinamide 10% Serum', 'Cos De BAHA', 'K-Beauty', 'Essence & Serum', 1450, 1250, 'FN', '30ml'],
  ['Cos De BAHA Hyaluronic Acid 2% Serum', 'Cos De BAHA', 'K-Beauty', 'Essence & Serum', 1450, 1250, 'B', '30ml'],
  ['Cos De BAHA Vitamin C 20% Serum', 'Cos De BAHA', 'K-Beauty', 'Essence & Serum', 1550, 1350, 'N', '30ml'],
  ['Watermelon Cooling Hydrating Sunscreen SPF50', 'Dot & Key', 'Skin Care', 'Sunscreen', 1550, 1190, 'FB', '50g'],
  ['Vitamin C + E Super Bright Moisturizer', 'Dot & Key', 'Skin Care', 'Moisturizer', 1450, 1190, 'N', '50ml'],
  ['Strawberry Dew Lip Sleeping Mask', 'Dot & Key', 'Skin Care', 'Lip Care', 850, 690, 'F', '12g'],
  ['UV Super Moisture Gel SPF50+', 'Skin Aqua', 'J-Beauty', 'Sunscreen', 1350, 1090, 'FB', '110g'],
  ['UV Aqua Rich Watery Essence SPF50+', 'Biore', 'J-Beauty', 'Sunscreen', 1250, 990, 'BN', '70g'],
  ['Gokujyun Hyaluronic Lotion', 'Hada Labo', 'J-Beauty', 'Skincare', 1450, 1250, 'F', '170ml'],
  ['Gokujyun Foaming Face Wash', 'Hada Labo', 'J-Beauty', 'Face Wash', 990, 0, '', '100g'],
  ['Gentle Skin Cleanser', 'Cetaphil', 'Skin Care', 'Face Wash', 1550, 1390, 'B', '250ml'],
  ['Moisturising Lotion', 'Cetaphil', 'Skin Care', 'Moisturizer', 1850, 0, '', '250ml'],
  ['Niacinamide 10% + Zinc 1%', 'The Ordinary', 'Skin Care', 'Serum', 1650, 1450, 'FB', '30ml'],
  ['Hyaluronic Acid 2% + B5', 'The Ordinary', 'Skin Care', 'Serum', 1850, 0, 'N', '30ml'],
  ['Vita B3 Source Serum', 'Tiam', 'Skin Care', 'Serum', 1450, 1305, 'F', '40ml'],
  ['Cica Soothing Cream', 'Tiam', 'Skin Care', 'Moisturizer', 1250, 1125, 'N', '50ml'],
  ['Kind to Skin Micellar Water', 'Simple', 'Skin Care', 'Face Wash', 1250, 1050, '', '200ml'],
  ['Hydro Boost Water Gel', 'Neutrogena', 'Skin Care', 'Moisturizer', 1950, 1690, 'B', '50g'],
  ['Purifying Neem Face Wash', 'Himalaya', 'Skin Care', 'Face Wash', 280, 240, 'B', '100ml'],
  ['Pure Active Neem Face Wash', 'Garnier', 'Skin Care', 'Face Wash', 420, 360, 'B', '100ml'],
  ['Refreshing Facial Wash', 'Simple', 'Skin Care', 'Face Wash', 650, 550, '', '150ml'],
  ['Sun Protect SPF30 Lotion', "Pond's", 'Skin Care', 'Sunscreen', 350, 249, 'B', '80ml'],
  ['Sun Expert SPF50 Gel', 'Lakme', 'Skin Care', 'Sunscreen', 650, 550, '', '50ml'],
  ['Fructis Hair Fall Shampoo', 'Garnier', 'Hair Care', 'Shampoo', 450, 390, 'B', '340ml'],
  ['Ultra Doux Argan Oil Hair Mask', 'Garnier', 'Hair Care', 'Hair Mask', 650, 550, '', '300ml'],
  ['Anti-Hair Fall Shampoo', 'Himalaya', 'Hair Care', 'Shampoo', 520, 0, '', '400ml'],
  ['Protein Conditioner', 'Himalaya', 'Hair Care', 'Conditioner', 480, 420, '', '200ml'],
  ['Nourishing Almond Hair Oil', 'Himalaya', 'Hair Care', 'Hair Oil', 380, 0, '', '200ml'],
  ['Anti-Dandruff Shampoo', 'Sebamed', 'Hair Care', 'Shampoo', 1450, 1250, 'N', '200ml'],
  ["Baby Shampoo", "Johnson's", 'Kids & Mom', 'Baby Bath', 350, 310, 'B', '200ml'],
  ["Baby Lotion", "Johnson's", 'Kids & Mom', 'Baby Skincare', 420, 0, '', '200ml'],
  ['Baby Wash Extra Soft', 'Sebamed', 'Kids & Mom', 'Baby Bath', 1350, 1190, 'N', '200ml'],
  ['Baby Cream', 'Himalaya', 'Kids & Mom', 'Baby Skincare', 320, 280, '', '100ml'],
  ['Fit Me Matte + Poreless Foundation', 'Maybelline', 'Makeup', 'Face', 1250, 1050, 'FB', '30ml'],
  ['Sky High Mascara', 'Maybelline', 'Makeup', 'Eyes', 1450, 1190, 'BN', '6ml'],
  ['Superstay Matte Ink Lipstick', 'Maybelline', 'Makeup', 'Lips', 1150, 950, 'F', '5ml'],
  ['9to5 Primer + Matte Lipstick', 'Lakme', 'Makeup', 'Lips', 750, 650, '', '3.6g'],
  ['Absolute Kajal', 'Lakme', 'Makeup', 'Eyes', 350, 0, 'B', '0.35g'],
  ['Deeply Nourishing Body Wash', 'Dove', 'Personal Care', 'Bath & Body', 750, 650, 'B', '500ml'],
  ['Soft Body Lotion', 'Nivea', 'Personal Care', 'Bath & Body', 550, 0, '', '200ml'],
  ['Fresh Mint Toothpaste', 'Sensodyne', 'Personal Care', 'Oral Care', 480, 430, '', '100g'],
  ['Women Antiperspirant Roll-On', 'Rexona', 'Personal Care', 'Deodorant', 320, 280, '', '50ml'],
  ['Aloe Vera Soothing Gel', 'Herbal Glow BD', 'B-Glam', 'Skin Care', 350, 290, 'N', '200ml'],
  ['Rose Water Toner', 'Herbal Glow BD', 'B-Glam', 'Skin Care', 280, 250, '', '120ml'],
  ['Argan Hair Serum', 'Herbal Glow BD', 'B-Glam', 'Hair Care', 450, 390, 'F', '100ml'],
  ['Beetroot Lip Balm', 'Herbal Glow BD', 'B-Glam', 'Makeup', 220, 0, 'N', '5g'],
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany(), Category.deleteMany(), Brand.deleteMany(), Banner.deleteMany(),
    Coupon.deleteMany(), Product.deleteMany(), Order.deleteMany(),
  ]);
  console.log('Old data cleared');

  if (process.argv.includes('--destroy')) {
    console.log('Data destroyed');
    process.exit(0);
  }

  await User.create([
    { name: 'Admin', email: 'admin@elegance.com', password: 'admin123', role: 'admin', phone: '01700000000' },
    { name: 'Demo Customer', email: 'user@elegance.com', password: 'user123', phone: '01800000000', address: 'Dhanmondi, Dhaka' },
  ]);

  const cats = await Category.create(categories);
  const brs = await Brand.create([
    ...featuredBrands.map((name) => ({ name, featured: true })),
    ...otherBrands.map((name) => ({ name })),
  ]);
  const catBy = Object.fromEntries(cats.map((c) => [c.name, c]));
  const brandBy = Object.fromEntries(brs.map((b) => [b.name, b]));

  await Banner.create(banners);
  await Coupon.create(coupons);

  const docs = P.map(([name, brand, category, sub, price, salePrice, flags, size], i) => ({
    name: `${brand} ${name}`.replace(`${brand} ${brand}`, brand),
    brand: brandBy[brand]._id,
    category: catBy[category]._id,
    subCategory: sub,
    price,
    salePrice,
    size,
    images: [], // add real image URLs from the admin panel; the UI shows a nice placeholder bottle meanwhile
    description:
      `${name} by ${brand}. 100% authentic ${sub.toLowerCase()} product, carefully selected by Elegance.\n\n` +
      `• Size: ${size}\n• Suitable for daily use\n• Dermatologically tested\n• Store in a cool, dry place away from direct sunlight`,
    stock: i === 5 ? 3 : i === 17 ? 0 : 12 + ((i * 7) % 60),
    sku: `ELG-${String(1000 + i)}`,
    tags: [brand, category, sub].map((t) => t.toLowerCase()),
    isFeatured: flags.includes('F'),
    isBestSeller: flags.includes('B'),
    isNewArrival: flags.includes('N'),
    sold: 5 + ((i * 13) % 120),
    rating: Number((4 + ((i * 3) % 10) / 10).toFixed(1)),
    numReviews: 3 + (i % 20),
  }));
  await Product.create(docs);

  console.log(`Seeded: ${cats.length} categories, ${brs.length} brands, ${docs.length} products, ${banners.length} banners`);
  console.log('Admin login:    admin@elegance.com / admin123');
  console.log('Customer login: user@elegance.com / user123');
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  ratingCount: number;
  reviewCount: number;
  image: string;
  stock: number;
  isGadaAssured: boolean;
  isDealOfTheDay: boolean;
  highlights: string[];
  specs: Record<string, string>;
  seller: {
    name: string;
    rating: number;
    location: string;
  };
  reviews: Review[];
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  customer: {
    fullName: string;
    phone: string;
    address: string;
    locality: string;
    city: string;
    pincode: string;
    state: string;
  };
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
  paymentStatus: 'paid' | 'pending';
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  couponCode?: string;
  status: 'ordered' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  trackingHistory: {
    status: string;
    label: string;
    timestamp: string;
    description: string;
    done: boolean;
  }[];
  estimatedDelivery: string;
}

// In-Memory Database for Gada Electronics Store
let products: Product[] = [
  {
    id: 'gada-tv-55',
    name: 'Gada Vision 55-inch Ultra HD (4K) OLED Smart Google TV with Dolby Vision & Atmos',
    brand: 'Gada Vision',
    category: 'Smart TVs',
    price: 44999,
    originalPrice: 79999,
    discountPercentage: 43,
    rating: 4.8,
    ratingCount: 2840,
    reviewCount: 684,
    image: '/src/assets/images/product_smart_tv_1791529059574.jpg',
    stock: 18,
    isGadaAssured: true,
    isDealOfTheDay: true,
    highlights: [
      '55 inch 4K Ultra HD OLED Panel (3840 x 2160)',
      '120Hz Native Refresh Rate with MEMC',
      'Dolby Vision IQ & Dolby Atmos 60W Soundbar Built-in',
      'Google TV OS with Hands-free Voice Search',
      '2 Years Gada On-Site Comprehensive Warranty'
    ],
    specs: {
      'Screen Size': '55 Inch (139 cm)',
      'Display Technology': 'Self-Lit OLED 4K',
      'Resolution': '3840 x 2160 Pixels',
      'Refresh Rate': '120 Hz',
      'Speaker Output': '60 W Quad Speakers',
      'Operating System': 'Google TV (Android 14)',
      'HDMI Ports': '4 x HDMI 2.1 (eARC supported)',
      'USB Ports': '2 x USB 3.0',
      'Warranty': '2 Years Gada Certified Warranty'
    },
    seller: {
      name: 'Gada Electronics Flagship Store',
      rating: 4.9,
      location: 'Gokuldham Market, Mumbai'
    },
    reviews: [
      {
        id: 'rev-1',
        userName: 'Taarak Mehta',
        rating: 5,
        date: '2026-03-28',
        comment: 'Remarkable picture clarity and pitch-perfect sound! Jethalal gave an exceptional price in the festive deal.',
        verifiedPurchase: true,
        helpfulCount: 42
      },
      {
        id: 'rev-2',
        userName: 'Aatmaram Bhide',
        rating: 5,
        date: '2026-03-20',
        comment: 'Strictly inspected the quality according to society standards. Superb quality and quick installation by Bagha.',
        verifiedPurchase: true,
        helpfulCount: 19
      }
    ]
  },
  {
    id: 'gada-phone-pro',
    name: 'Gada Apex Phone 16 Pro (Titanium Blue, 256 GB) with Studio Grade Triple Camera',
    brand: 'Gada Apex',
    category: 'Smartphones',
    price: 64999,
    originalPrice: 89999,
    discountPercentage: 27,
    rating: 4.7,
    ratingCount: 5120,
    reviewCount: 1208,
    image: '/src/assets/images/product_flagship_phone_1791529072137.jpg',
    stock: 24,
    isGadaAssured: true,
    isDealOfTheDay: true,
    highlights: [
      '6.7-inch Super Retina XDR LTPO 1-120Hz Display',
      'Flagship 4nm Octa-Core AI Processor',
      '200MP OIS Main + 50MP Ultra-Wide + 50MP Periscope 5x Zoom',
      '5500 mAh Battery with 100W HyperCharge & Wireless Charging',
      'Aerospace Titanium Frame & Ceramic Shield Glass'
    ],
    specs: {
      'RAM & Storage': '12 GB RAM | 256 GB ROM',
      'Processor': 'Octa Core Snapdragon 8 Gen 3 Flagship',
      'Rear Camera': '200 MP + 50 MP + 50 MP',
      'Front Camera': '32 MP Ultra Autofocus',
      'Display': '6.7 inch 1.5K AMOLED 120Hz',
      'Battery': '5500 mAh with 100W Fast Charger included',
      'Network': '5G Dual SIM Active VoNR'
    },
    seller: {
      name: 'Gada Electronics Flagship Store',
      rating: 4.9,
      location: 'Gokuldham Market, Mumbai'
    },
    reviews: [
      {
        id: 'rev-3',
        userName: 'Popatlal Patrakar',
        rating: 5,
        date: '2026-04-01',
        comment: 'Duniya hila dene wala phone! The camera quality for reporting events is stellar. Gada store warranty is 100% genuine.',
        verifiedPurchase: true,
        helpfulCount: 31
      }
    ]
  },
  {
    id: 'gada-laptop-ultra',
    name: 'Gada Book Ultra 16 Thin & Light Laptop (Intel Core Ultra 7, 32GB RAM, 1TB SSD, OLED)',
    brand: 'Gada Compute',
    category: 'Laptops',
    price: 78999,
    originalPrice: 114999,
    discountPercentage: 31,
    rating: 4.9,
    ratingCount: 1420,
    reviewCount: 388,
    image: '/src/assets/images/product_laptop_pro_1791529083131.jpg',
    stock: 12,
    isGadaAssured: true,
    isDealOfTheDay: false,
    highlights: [
      'Intel Core Ultra 7 155H with Dedicated Intel AI Boost NPU',
      '16-inch 3.2K 120Hz PureSight OLED Display with 100% DCI-P3',
      '32 GB LPDDR5X RAM & 1 TB NVMe Gen4 SSD',
      'All-Day 84Wh Battery with 100W Type-C Fast Charger',
      'Full CNC Aluminium Unibody Chassis (Weight: 1.48 kg)'
    ],
    specs: {
      'Processor': 'Intel Core Ultra 7 155H (16 Cores, 22 Threads)',
      'Memory': '32 GB LPDDR5X 7467 MHz',
      'Storage': '1 TB PCIe Gen 4 SSD',
      'Display': '16 inch 3.2K (3200 x 2000) 120Hz OLED 500 nits',
      'Graphics': 'Intel Arc Integrated Graphics',
      'Weight': '1.48 kg Ultra Slim 14.9mm',
      'Operating System': 'Windows 11 Home Lifetime License'
    },
    seller: {
      name: 'Gada Electronics - IT & Computing Wing',
      rating: 4.9,
      location: 'Gokuldham Market, Mumbai'
    },
    reviews: [
      {
        id: 'rev-4',
        userName: 'Dr. Hansraj Hathi',
        rating: 5,
        date: '2026-03-15',
        comment: 'Sahi baat hai! Extremely smooth for all hospital research papers and clinical presentations. Battery lasts whole day.',
        verifiedPurchase: true,
        helpfulCount: 22
      }
    ]
  },
  {
    id: 'gada-anc-headphones',
    name: 'Gada Sonic Pro Over-Ear Wireless Active Noise Cancelling Headphones (Hi-Res Audio, 60h Playtime)',
    brand: 'Gada Sonic',
    category: 'Audio',
    price: 8999,
    originalPrice: 16999,
    discountPercentage: 47,
    rating: 4.6,
    ratingCount: 3890,
    reviewCount: 910,
    image: '/src/assets/images/gada_hero_banner_1791529045598.jpg',
    stock: 35,
    isGadaAssured: true,
    isDealOfTheDay: true,
    highlights: [
      'Hybrid Active Noise Cancellation up to 45dB with Transparency mode',
      '40mm Custom Titanium Drivers with LDAC Hi-Res Wireless',
      'Up to 60 Hours Playback (40h with ANC on)',
      'Dual Device Multipoint Pairing & Wear Detection',
      'Plush Memory Foam Ear Cushions for all-day comfort'
    ],
    specs: {
      'Driver Size': '40 mm Custom Titanium Diaphragm',
      'Noise Cancellation': 'Hybrid Active Noise Cancelling (-45dB)',
      'Battery Life': '60 Hours (ANC Off) / 40 Hours (ANC On)',
      'Charging': 'Type-C Fast Charge (10 min = 5 hours play)',
      'Bluetooth': 'v5.4 with LDAC, AAC, SBC codec support',
      'Microphones': '5 AI Beamforming ENC Mics for Calls'
    },
    seller: {
      name: 'Gada Electronics Audio Wing',
      rating: 4.8,
      location: 'Gokuldham Market, Mumbai'
    },
    reviews: [
      {
        id: 'rev-5',
        userName: 'Iyer Subramaniam',
        rating: 5,
        date: '2026-03-25',
        comment: 'Scientifically calibrated frequency response. Excellent noise attenuation in lab environments.',
        verifiedPurchase: true,
        helpfulCount: 15
      }
    ]
  },
  {
    id: 'gada-smart-refrigerator',
    name: 'Gada FrostShield 340L 3-Star Double Door Inverter Refrigerator with Convertible Modes',
    brand: 'Gada Home',
    category: 'Home Appliances',
    price: 31999,
    originalPrice: 48999,
    discountPercentage: 34,
    rating: 4.8,
    ratingCount: 1980,
    reviewCount: 420,
    image: '/src/assets/images/product_smart_tv_1791529059574.jpg',
    stock: 8,
    isGadaAssured: true,
    isDealOfTheDay: false,
    highlights: [
      '340 Litres Capacity suitable for families of 3 to 5 members',
      'Digital Smart Inverter Compressor with 10 Years Warranty',
      '5-in-1 Convertible Modes (Normal, Extra Fridge, Seasonal, Vacation, Home Alone)',
      'Moist Fresh Zone & Active Deodorizing Filter',
      'Stabilizer Free Operation (100V - 300V)'
    ],
    specs: {
      'Capacity': '340 Litres',
      'Energy Rating': '3 Star BEE Efficiency',
      'Defrosting Type': 'Auto Defrost Frost Free',
      'Compressor': 'Digital Smart Inverter',
      'Shelves': 'Toughened Glass Shelves (Holds up to 175 kg)',
      'Warranty': '1 Year on Unit + 10 Years on Compressor'
    },
    seller: {
      name: 'Gada Electronics Home Appliances',
      rating: 4.9,
      location: 'Gokuldham Market, Mumbai'
    },
    reviews: [
      {
        id: 'rev-6',
        userName: 'Madhavi Bhide',
        rating: 5,
        date: '2026-03-12',
        comment: 'Keeps all homemade pickles and papad fresh for months! Low electricity bill and quiet operation.',
        verifiedPurchase: true,
        helpfulCount: 28
      }
    ]
  },
  {
    id: 'gada-smartwatch-titan',
    name: 'Gada Titan Ultra AMOLED Smartwatch with Bluetooth Calling, GPS & Stainless Steel Strap',
    brand: 'Gada Wear',
    category: 'Audio',
    price: 3499,
    originalPrice: 7999,
    discountPercentage: 56,
    rating: 4.5,
    ratingCount: 6240,
    reviewCount: 1450,
    image: '/src/assets/images/product_flagship_phone_1791529072137.jpg',
    stock: 45,
    isGadaAssured: true,
    isDealOfTheDay: true,
    highlights: [
      '1.43-inch Super AMOLED Display with 1000 Nits Peak Brightness',
      'Always-On Display & 60Hz Smooth UI',
      'Bluetooth Calling with AI Noise-Cancelling Mic',
      'Continuous 24/7 SpO2, Heart Rate, Stress & Sleep Tracking',
      'IP68 Water & Dust Resistant Metallic Frame'
    ],
    specs: {
      'Display': '1.43 Inch AMOLED (466 x 466 px)',
      'Battery Life': 'Up to 7 Days typical use',
      'Sensors': 'Optical Heart Rate, SpO2, Accelerometer, Barometer',
      'Water Resistance': 'IP68 Swim-proof',
      'Compatibility': 'Android 8.0+ & iOS 12.0+'
    },
    seller: {
      name: 'Gada Electronics Gadgets Hub',
      rating: 4.7,
      location: 'Gokuldham Market, Mumbai'
    },
    reviews: [
      {
        id: 'rev-7',
        userName: 'Roshan Singh Sodhi',
        rating: 5,
        date: '2026-03-29',
        comment: 'Oye papaji! Solid build quality! Battery easily goes for 6 days. Best value watch at Gada shop!',
        verifiedPurchase: true,
        helpfulCount: 37
      }
    ]
  }
];

// In-Memory Orders Database
let orders: Order[] = [
  {
    id: 'GADA-ORD-9021',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      {
        productId: 'gada-tv-55',
        name: 'Gada Vision 55-inch Ultra HD (4K) OLED Smart Google TV',
        price: 44999,
        quantity: 1,
        image: '/src/assets/images/product_smart_tv_1791529059574.jpg'
      }
    ],
    customer: {
      fullName: 'Jethalal Champaklal Gada',
      phone: '+91 98201 12345',
      address: 'Flat 402, Gokuldham Co-Operative Housing Society',
      locality: 'Powai Goregaon Link Road',
      city: 'Mumbai',
      pincode: '400063',
      state: 'Maharashtra'
    },
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    subtotal: 44999,
    discount: 4500,
    deliveryFee: 0,
    totalAmount: 40499,
    couponCode: 'JETHALAL10',
    status: 'shipped',
    trackingHistory: [
      {
        status: 'ordered',
        label: 'Order Confirmed',
        timestamp: '2 days ago, 10:30 AM',
        description: 'Order verified and confirmed by Gada Electronics backend system.',
        done: true
      },
      {
        status: 'packed',
        label: 'Packed at Gada Electronics',
        timestamp: 'Yesterday, 03:15 PM',
        description: 'Quality tested & sealed by Natu Kaka & Bagha at Gokuldham Hub.',
        done: true
      },
      {
        status: 'shipped',
        label: 'Shipped via Gada Express Logistics',
        timestamp: 'Today, 08:45 AM',
        description: 'Package in transit with tracking ID GADAX-881920.',
        done: true
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        timestamp: 'Expected Tomorrow',
        description: 'Delivery associate will contact customer prior to arrival.',
        done: false
      },
      {
        status: 'delivered',
        label: 'Delivered',
        timestamp: 'Expected Tomorrow by 6:00 PM',
        description: 'Package delivered with OTP verification.',
        done: false
      }
    ],
    estimatedDelivery: 'Tomorrow, by 6:00 PM'
  }
];

// Valid Promotional Coupons
const COUPONS: Record<string, { discountPercent?: number; flatDiscount?: number; minOrder: number; description: string }> = {
  JETHALAL10: { discountPercent: 10, minOrder: 1000, description: '10% instant discount on all electronics' },
  NATUKAKA5: { flatDiscount: 500, minOrder: 2000, description: '₹500 flat off - Natu Kaka special recommendation' },
  GOKULDHAM20: { discountPercent: 20, minOrder: 15000, description: '20% mega festive discount on orders above ₹15,000' },
  BAGHA15: { discountPercent: 15, minOrder: 5000, description: '15% instant off - Bagha Boy special offer' }
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // 1. Get all products with filters, sorting, and search
  app.get('/api/products', (req: Request, res: Response) => {
    let result = [...products];
    const { category, search, minPrice, maxPrice, sort, minRating, dealOnly } = req.query;

    if (category && category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }

    if (search && String(search).trim()) {
      const q = String(search).toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.highlights.some(h => h.toLowerCase().includes(q))
      );
    }

    if (minPrice) {
      result = result.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    if (minRating) {
      result = result.filter(p => p.rating >= Number(minRating));
    }

    if (dealOnly === 'true') {
      result = result.filter(p => p.isDealOfTheDay);
    }

    // Sort order
    if (sort === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'discount') {
      result.sort((a, b) => b.discountPercentage - a.discountPercentage);
    }

    res.json({
      success: true,
      count: result.length,
      products: result
    });
  });

  // 2. Get single product by ID
  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  });

  // 3. Post a review for a product
  app.post('/api/products/:id/reviews', (req: Request, res: Response) => {
    const { userName, rating, comment } = req.body;
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!userName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Name, rating, and review text are required' });
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userName: String(userName).trim(),
      rating: Math.min(5, Math.max(1, Number(rating))),
      date: new Date().toISOString().split('T')[0],
      comment: String(comment).trim(),
      verifiedPurchase: true,
      helpfulCount: 1
    };

    const targetProduct = products[productIndex];
    targetProduct.reviews.unshift(newReview);
    targetProduct.reviewCount += 1;
    // Recalculate average rating
    const totalRatingSum = targetProduct.reviews.reduce((acc, r) => acc + r.rating, 0);
    targetProduct.rating = Number((totalRatingSum / targetProduct.reviews.length).toFixed(1));

    res.json({
      success: true,
      message: 'Review posted successfully',
      review: newReview,
      updatedRating: targetProduct.rating,
      reviewCount: targetProduct.reviewCount
    });
  });

  // 4. Get categories with counts
  app.get('/api/categories', (_req: Request, res: Response) => {
    const categoryCounts: Record<string, number> = {};
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    const categoryList = [
      { name: 'All', count: products.length, icon: 'Grid' },
      { name: 'Smartphones', count: categoryCounts['Smartphones'] || 0, icon: 'Smartphone' },
      { name: 'Smart TVs', count: categoryCounts['Smart TVs'] || 0, icon: 'Tv' },
      { name: 'Laptops', count: categoryCounts['Laptops'] || 0, icon: 'Laptop' },
      { name: 'Audio', count: categoryCounts['Audio'] || 0, icon: 'Headphones' },
      { name: 'Home Appliances', count: categoryCounts['Home Appliances'] || 0, icon: 'Refrigerator' }
    ];

    res.json({ success: true, categories: categoryList });
  });

  // 5. Validate Coupon Code
  app.post('/api/coupons/validate', (req: Request, res: Response) => {
    const { code, cartTotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const normalizedCode = String(code).trim().toUpperCase();
    const coupon = COUPONS[normalizedCode];

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code. Try JETHALAL10, NATUKAKA5, or GOKULDHAM20!'
      });
    }

    const total = Number(cartTotal) || 0;
    if (total < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum cart value of ₹${coupon.minOrder.toLocaleString('en-IN')}`
      });
    }

    let discount = 0;
    if (coupon.discountPercent) {
      discount = Math.round((total * coupon.discountPercent) / 100);
    } else if (coupon.flatDiscount) {
      discount = coupon.flatDiscount;
    }

    res.json({
      success: true,
      code: normalizedCode,
      discount,
      description: coupon.description
    });
  });

  // 6. Place New Order
  app.post('/api/orders', (req: Request, res: Response) => {
    const { items, customer, paymentMethod, couponCode, subtotal, discount, deliveryFee, totalAmount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    if (!customer || !customer.fullName || !customer.phone || !customer.address || !customer.pincode) {
      return res.status(400).json({ success: false, message: 'Complete customer shipping address is required' });
    }

    const orderId = `GADA-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const estDate = new Date(now.getTime() + 86400000 * 2);
    const dateFormatted = estDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const newOrder: Order = {
      id: orderId,
      createdAt: now.toISOString(),
      items,
      customer,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      subtotal: Number(subtotal),
      discount: Number(discount) || 0,
      deliveryFee: Number(deliveryFee) || 0,
      totalAmount: Number(totalAmount),
      couponCode,
      status: 'ordered',
      trackingHistory: [
        {
          status: 'ordered',
          label: 'Order Confirmed',
          timestamp: 'Just now',
          description: 'Order placed and payment authorized under Gada SafePay.',
          done: true
        },
        {
          status: 'packed',
          label: 'Packing at Gada Electronics',
          timestamp: 'Expected in 4 hours',
          description: 'Natu Kaka & Bagha preparing secure bubble-wrap packing.',
          done: false
        },
        {
          status: 'shipped',
          label: 'Shipped via Gada Express',
          timestamp: 'Expected tomorrow',
          description: 'Package will be dispatched via Gokuldham central depot.',
          done: false
        },
        {
          status: 'out_for_delivery',
          label: 'Out for Delivery',
          timestamp: `Expected ${dateFormatted}`,
          description: 'Delivery rider assigned with secure 4-digit delivery PIN.',
          done: false
        },
        {
          status: 'delivered',
          label: 'Delivered',
          timestamp: `By ${dateFormatted}, 7:00 PM`,
          description: 'Delivered to your doorstep.',
          done: false
        }
      ],
      estimatedDelivery: `${dateFormatted}, by 7:00 PM`
    };

    orders.unshift(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Gada Electronics thanks you.',
      order: newOrder
    });
  });

  // 7. Get All Orders
  app.get('/api/orders', (_req: Request, res: Response) => {
    res.json({
      success: true,
      orders
    });
  });

  // 8. Get Order By ID (for Tracking)
  app.get('/api/orders/:orderId', (req: Request, res: Response) => {
    const order = orders.find(o => o.id === req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  });

  // 9. Cancel Order
  app.post('/api/orders/:orderId/cancel', (req: Request, res: Response) => {
    const order = orders.find(o => o.id === req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.status === 'delivered') {
      return res.status(400).json({ success: false, message: 'Delivered orders cannot be cancelled. Initiate return instead.' });
    }
    order.status = 'cancelled';
    order.trackingHistory.push({
      status: 'cancelled',
      label: 'Order Cancelled',
      timestamp: 'Just now',
      description: 'Order was cancelled by the customer.',
      done: true
    });
    res.json({ success: true, message: 'Order cancelled successfully', order });
  });

  // 10. Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', store: 'Gada Electronics', platform: 'Full Stack React & Express' });
  });

  // Vite Integration for dev & static serve for production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gada Electronics Server running on port ${PORT}`);
  });
}

startServer();

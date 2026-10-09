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

export interface CartItem {
  product: Product;
  quantity: number;
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

export type ViewMode = 'catalog' | 'product-detail' | 'cart' | 'checkout' | 'orders' | 'wishlist';

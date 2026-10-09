/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, ViewMode, Review } from './types';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { HeroBanner } from './components/HeroBanner';
import { CatalogView } from './components/CatalogView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartView } from './components/CartView';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersView } from './components/OrdersView';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { WishlistView } from './components/WishlistView';
import { Footer } from './components/Footer';
import { Check, Info } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number; icon: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<ViewMode>('catalog');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showDealsOnly, setShowDealsOnly] = useState<boolean>(false);

  // Modals & Selected items
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Cart & Coupon
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gada_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Wishlist
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('gada_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('gada_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('gada_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Fetch products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes, orderRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/orders')
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.products) setProducts(prodData.products);
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.categories) setCategories(catData.categories);
        }

        if (orderRes.ok) {
          const orderData = await orderRes.json();
          if (orderData.orders) setOrders(orderData.orders);
        }
      } catch (err) {
        console.error('Error fetching backend data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cart actions
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added "${product.name.slice(0, 30)}..." to your cart`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    showToast('Item removed from cart');
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  // Coupon engine
  const handleApplyCoupon = async (code: string) => {
    const sellingTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: sellingTotal })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.code);
        setCouponDiscount(data.discount);
        showToast(`Coupon ${data.code} applied! Saved ₹${data.discount}`);
        return { success: true, message: data.description };
      } else {
        return { success: false, message: data.message };
      }
    } catch {
      return { success: false, message: 'Failed to validate coupon code' };
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast('Coupon removed');
  };

  // Wishlist actions
  const wishlistIds = new Set(wishlist.map((p) => p.id));

  const handleToggleWishlist = (product: Product) => {
    if (wishlistIds.has(product.id)) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      showToast('Removed from wishlist');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast('Added to wishlist');
    }
  };

  const handleRemoveFromWishlist = (product: Product) => {
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
    showToast('Removed from wishlist');
  };

  // Review submission sync
  const handleReviewSubmitted = (productId: string, updatedRating: number, newReview: Review) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            rating: updatedRating,
            reviewCount: p.reviewCount + 1,
            reviews: [newReview, ...p.reviews]
          };
        }
        return p;
      })
    );

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) =>
        prev
          ? {
              ...prev,
              rating: updatedRating,
              reviewCount: prev.reviewCount + 1,
              reviews: [newReview, ...prev.reviews]
            }
          : null
      );
    }
    showToast('Thank you! Review posted successfully');
  };

  // Order placed
  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast(`Order #${newOrder.id} confirmed!`);
  };

  // Order cancellation
  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (trackingOrder && trackingOrder.id === orderId) {
          setTrackingOrder(data.order);
        }
        showToast(`Order #${orderId} has been cancelled`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Navigation helpers
  const handleExploreCategory = (catName: string) => {
    setSelectedCategory(catName);
    setShowDealsOnly(false);
    setCurrentView('catalog');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleExploreDeals = () => {
    setShowDealsOnly(true);
    setCurrentView('catalog');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setShowDealsOnly(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-[#2874F0] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Flipkart-Style Top Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlist.length}
        orderCount={orders.length}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (currentView !== 'catalog') setCurrentView('catalog');
        }}
        onOpenDeals={handleExploreDeals}
      />

      {/* Category Navigation Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setShowDealsOnly(false);
          if (currentView !== 'catalog') setCurrentView('catalog');
        }}
        categories={categories}
        showDealsOnly={showDealsOnly}
        onToggleDeals={() => {
          setShowDealsOnly(!showDealsOnly);
          if (currentView !== 'catalog') setCurrentView('catalog');
        }}
      />

      {/* View Routing */}
      <div className="flex-1">
        {currentView === 'catalog' && (
          <>
            {/* Hero Banner only shown when not searching and category is All and not deal filter */}
            {selectedCategory === 'All' && !searchQuery && !showDealsOnly && (
              <HeroBanner
                onExploreDeals={handleExploreDeals}
                onExploreCategory={handleExploreCategory}
              />
            )}

            {/* Catalog Grid */}
            <CatalogView
              products={products}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categories={categories}
              searchQuery={searchQuery}
              onSelectProduct={(product) => setSelectedProduct(product)}
              onAddToCart={handleAddToCart}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              showDealsOnly={showDealsOnly}
              onResetFilters={handleResetFilters}
            />
          </>
        )}

        {currentView === 'cart' && (
          <CartView
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onProceedToCheckout={() => setIsCheckoutOpen(true)}
            onContinueShopping={() => setCurrentView('catalog')}
            appliedCoupon={appliedCoupon}
            couponDiscount={couponDiscount}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentView === 'orders' && (
          <OrdersView
            orders={orders}
            onTrackOrder={(order) => setTrackingOrder(order)}
            onContinueShopping={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistView
            wishlist={wishlist}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onContinueShopping={() => setCurrentView('catalog')}
          />
        )}
      </div>

      {/* Product Detail Modal (PDP) */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          isWishlisted={wishlistIds.has(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          items={cart}
          appliedCoupon={appliedCoupon}
          couponDiscount={couponDiscount}
          onClose={() => {
            setIsCheckoutOpen(false);
            if (orders.length > 0) setCurrentView('orders');
          }}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* Order Tracker Modal */}
      {trackingOrder && (
        <OrderTrackerModal
          order={trackingOrder}
          onClose={() => setTrackingOrder(null)}
          onCancelOrder={handleCancelOrder}
        />
      )}

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={handleExploreCategory}
      />
    </div>
  );
}

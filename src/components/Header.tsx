import React from 'react';
import { Search, ShoppingCart, Heart, Package, Sparkles } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  cartCount: number;
  wishlistCount: number;
  orderCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenDeals: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  cartCount,
  wishlistCount,
  orderCount,
  searchQuery,
  onSearchChange,
  onOpenDeals
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#2874F0] text-white shadow-md">
      {/* Top Notification Strip */}
      <div className="bg-[#1b58bf] px-4 py-1.5 text-xs font-medium text-slate-100 flex items-center justify-between border-b border-blue-400/20">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-yellow-300">Gada Electronics Exclusive:</span>
            <span>Use code <span className="font-mono font-bold text-white bg-blue-900/60 px-1.5 py-0.5 rounded">JETHALAL10</span> for 10% instant discount</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-blue-100">
            <span>Direct from Gokuldham Market</span>
            <span aria-hidden="true">·</span>
            <span>100% Genuine Certified</span>
            <span aria-hidden="true">·</span>
            <span>24/7 Support by Natu Kaka</span>
          </div>
        </div>
      </div>

      {/* Main Flipkart-Style Blue Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sm:gap-8">
        {/* Brand Zone */}
        <button
          onClick={() => onNavigate('catalog')}
          className="text-left group cursor-pointer shrink-0 focus:outline-none"
        >
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black italic tracking-tight text-white group-hover:text-amber-200 transition-colors">
              Gada
            </span>
            <span className="text-sm font-semibold tracking-wide text-amber-300">
              Plus
            </span>
          </div>
          <div className="flex items-center gap-1 -mt-1 text-[11px] text-blue-100 italic">
            <span>Electronics</span>
            <Sparkles className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
          </div>
        </button>

        {/* Search Bar Zone */}
        <div className="flex-1 max-w-2xl relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search for Smart TVs, 5G Mobiles, Laptops, Audio & more..."
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 pl-4 pr-10 py-2.5 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner"
            />
            <div className="absolute right-3 text-[#2874F0]">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          {/* Deals Jump Button */}
          <button
            onClick={onOpenDeals}
            className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-white hover:text-amber-300 transition-colors px-2 py-1 rounded"
          >
            <span>Top Deals</span>
          </button>

          {/* Orders Tracking Link */}
          <button
            onClick={() => onNavigate('orders')}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-2 py-1 rounded cursor-pointer ${
              currentView === 'orders' ? 'text-amber-300 font-bold' : 'text-white hover:text-amber-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Orders</span>
            {orderCount > 0 && (
              <span className="font-mono text-xs bg-amber-400 text-blue-950 font-bold px-1.5 py-0.2 rounded-full">
                {orderCount}
              </span>
            )}
          </button>

          {/* Wishlist Link */}
          <button
            onClick={() => onNavigate('wishlist')}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-2 py-1 rounded cursor-pointer ${
              currentView === 'wishlist' ? 'text-amber-300 font-bold' : 'text-white hover:text-amber-200'
            }`}
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden md:inline">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="font-mono text-xs bg-white text-[#2874F0] font-bold px-1.5 py-0.2 rounded-full">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Primary Action */}
          <button
            onClick={() => onNavigate('cart')}
            className="flex items-center gap-2 bg-white text-[#2874F0] hover:bg-amber-300 hover:text-blue-950 font-bold px-4 py-2 rounded-sm text-sm transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 font-mono text-[10px] bg-red-600 text-white font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface WishlistViewProps {
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onContinueShopping: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
  onContinueShopping
}) => {
  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg border border-slate-200 p-10 max-w-md mx-auto shadow-xs">
          <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-500 mb-6">
            Tap the heart icon on any electronic device you like to save it for later.
          </p>
          <button
            onClick={onContinueShopping}
            className="bg-[#2874F0] hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded text-sm transition-all cursor-pointer shadow-sm w-full"
          >
            Explore Electronics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Wishlist</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        <button
          onClick={onContinueShopping}
          className="text-xs font-semibold text-[#2874F0] hover:underline cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 shadow-xs">
        {wishlist.map((product) => (
          <div key={product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
            <div
              onClick={() => onSelectProduct(product)}
              className="w-24 h-24 bg-slate-50 rounded border border-slate-200 p-2 shrink-0 cursor-pointer flex items-center justify-center"
            >
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3
                onClick={() => onSelectProduct(product)}
                className="font-semibold text-sm text-slate-900 hover:text-[#2874F0] cursor-pointer line-clamp-1"
              >
                {product.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {product.category} · Seller: {product.seller.name}
              </p>

              <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-2">
                <span className="text-base font-black text-slate-950 font-mono tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {product.discountPercentage}% Off
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onRemoveFromWishlist(product);
                }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Move to Cart</span>
              </button>

              <button
                onClick={() => onRemoveFromWishlist(product)}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                title="Remove from Wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

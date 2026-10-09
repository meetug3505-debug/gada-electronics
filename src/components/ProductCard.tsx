import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Check, Zap } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}) => {
  const [imageError, setImageError] = useState(false);
  const [addedRecently, setAddedRecently] = useState(false);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 1600);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-lg border border-slate-200/90 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer relative"
    >
      {/* Top Tag & Wishlist Button */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
        <div>
          {product.isDealOfTheDay && (
            <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-xs tracking-wider shadow-2xs inline-flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 fill-current" />
              Deal
            </span>
          )}
        </div>
        <button
          onClick={handleWishlistClick}
          className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'
            }`}
          />
        </button>
      </div>

      {/* Product Image Area */}
      <div className="relative w-full aspect-[4/3] bg-slate-50 flex items-center justify-center p-3 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-100 to-blue-50 text-slate-400 p-4 text-center">
            <span className="text-xs font-semibold text-slate-600">{product.brand}</span>
            <span className="text-[11px] text-slate-400 mt-1">{product.category}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Metadata: Category & Brand (Clean unboxed text) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-[#2874F0] uppercase tracking-wide text-[11px]">
              {product.brand}
            </span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-[#2874F0] transition-colors">
            {product.name}
          </h3>

          {/* Ratings & Gada Assured */}
          <div className="flex items-center gap-2 mt-2">
            <div className="inline-flex items-center gap-1 bg-emerald-600 text-white font-bold text-xs px-1.5 py-0.5 rounded">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-white text-white" />
            </div>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              ({product.ratingCount.toLocaleString('en-IN')})
            </span>
            {product.isGadaAssured && (
              <span className="ml-auto text-[11px] font-bold italic text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                Gada Assured
              </span>
            )}
          </div>

          {/* Highlights Preview */}
          <ul className="mt-2.5 space-y-1 text-xs text-slate-600 hidden sm:block">
            {product.highlights.slice(0, 2).map((item, idx) => (
              <li key={idx} className="line-clamp-1 flex items-start gap-1">
                <span className="text-slate-400">·</span>
                <span className="truncate">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price & Action Area */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-900 font-mono tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-600">
              {product.discountPercentage}% off
            </span>
          </div>

          <button
            onClick={handleAddToCartClick}
            disabled={addedRecently}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              addedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-2xs'
            }`}
          >
            {addedRecently ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

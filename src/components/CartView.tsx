import React, { useState } from 'react';
import { Trash2, Plus, Minus, Tag, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartViewProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  appliedCoupon: string | null;
  couponDiscount: number;
  onApplyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  onRemoveCoupon: () => void;
  onSelectProduct: (product: Product) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
  appliedCoupon,
  couponDiscount,
  onApplyCoupon,
  onRemoveCoupon,
  onSelectProduct
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  // Calculations
  const totalMrp = items.reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0);
  const sellingTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const productDiscount = totalMrp - sellingTotal;
  const deliveryFee = sellingTotal > 499 || items.length === 0 ? 0 : 40;
  const totalPayable = Math.max(0, sellingTotal - couponDiscount + deliveryFee);
  const totalSavings = productDiscount + couponDiscount;

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return;

    setApplying(true);
    setCouponError(null);
    const res = await onApplyCoupon(code.trim().toUpperCase());
    setApplying(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg border border-slate-200 p-10 max-w-md mx-auto shadow-xs">
          <div className="w-20 h-20 rounded-full bg-blue-50 text-[#2874F0] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 mb-6">
            Explore authentic electronics and unbeatable deals curated by Gada Electronics.
          </p>
          <button
            onClick={onContinueShopping}
            className="bg-[#2874F0] hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded text-sm transition-all cursor-pointer shadow-sm w-full"
          >
            Shop Festival Electronics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span>Shopping Cart</span>
          <span className="text-xs text-slate-500 font-normal">
            ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
          </span>
        </h1>
        <button
          onClick={onContinueShopping}
          className="text-xs font-semibold text-[#2874F0] hover:underline cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs divide-y divide-slate-100">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                {/* Thumbnail */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 rounded border border-slate-200 p-2 shrink-0 cursor-pointer flex items-center justify-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Info & Quantity */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="font-semibold text-sm text-slate-900 hover:text-[#2874F0] cursor-pointer line-clamp-2"
                      >
                        {product.name}
                      </h3>
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Seller: {product.seller.name}
                    </p>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-base font-black text-slate-950 font-mono tabular-nums">
                        ₹{(product.price * quantity).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                        ₹{(product.originalPrice * quantity).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {product.discountPercentage}% Off
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-4 mt-4 pt-2 border-t border-slate-100">
                    <div className="flex items-center border border-slate-300 rounded overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(product.id, -1)}
                        className="w-7 h-7 flex items-center justify-center bg-slate-50 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-xs font-bold font-mono tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        className="w-7 h-7 flex items-center justify-center bg-slate-50 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="text-xs font-semibold text-slate-500 hover:text-red-600 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Code Section */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-[#2874F0]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Gada Electronics Coupons & Offers
              </h3>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded border border-emerald-200 text-xs">
                <div>
                  <p className="font-bold text-emerald-800">
                    Code <span className="font-mono">{appliedCoupon}</span> applied!
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    You saved ₹{couponDiscount.toLocaleString('en-IN')} on this order
                  </p>
                </div>
                <button
                  onClick={onRemoveCoupon}
                  className="font-bold text-red-600 hover:text-red-700 cursor-pointer text-xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. JETHALAL10)"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs uppercase focus:outline-none focus:border-blue-600 font-mono font-semibold"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={applying}
                    className="bg-[#2874F0] hover:bg-blue-700 text-white font-bold px-4 py-2 rounded text-xs transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {applying ? 'Checking...' : 'Apply'}
                  </button>
                </div>

                {couponError && (
                  <p className="text-xs text-red-600">{couponError}</p>
                )}

                {/* Quick Coupon Chips */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
                  <span className="text-slate-400 text-[11px] self-center">Quick apply:</span>
                  <button
                    onClick={() => handleApplyCoupon('JETHALAL10')}
                    className="border border-dashed border-blue-400 bg-blue-50/70 hover:bg-blue-100 text-[#2874F0] font-mono font-bold px-2 py-0.5 rounded cursor-pointer text-[11px]"
                  >
                    JETHALAL10 (10% off)
                  </button>
                  <button
                    onClick={() => handleApplyCoupon('NATUKAKA5')}
                    className="border border-dashed border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-800 font-mono font-bold px-2 py-0.5 rounded cursor-pointer text-[11px]"
                  >
                    NATUKAKA5 (₹500 off)
                  </button>
                  <button
                    onClick={() => handleApplyCoupon('GOKULDHAM20')}
                    className="border border-dashed border-emerald-400 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded cursor-pointer text-[11px]"
                  >
                    GOKULDHAM20 (20% off)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Price Details Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-3 border-b border-slate-200">
              Price Details
            </h2>

            <div className="py-3 space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Price ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="font-mono tabular-nums">₹{totalMrp.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="font-mono tabular-nums">-₹{productDiscount.toLocaleString('en-IN')}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span className="font-mono tabular-nums">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charges</span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600 font-semibold">FREE</span>
                ) : (
                  <span className="font-mono tabular-nums">₹{deliveryFee}</span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-dashed border-slate-300 flex justify-between items-baseline font-bold text-sm text-slate-900">
              <span>Total Amount</span>
              <span className="text-lg font-black font-mono tabular-nums text-slate-950">
                ₹{totalPayable.toLocaleString('en-IN')}
              </span>
            </div>

            {totalSavings > 0 && (
              <div className="mt-3 p-2 bg-emerald-50 rounded text-emerald-800 text-xs font-bold text-center">
                You will save ₹{totalSavings.toLocaleString('en-IN')} on this order!
              </div>
            )}

            <button
              onClick={onProceedToCheckout}
              className="mt-5 w-full bg-[#fb641b] hover:bg-[#e85b17] text-white font-bold py-3 rounded text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Safe & Secure Transaction Note */}
          <div className="flex items-center gap-2 text-xs text-slate-500 px-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Safe and Secure Payments. 100% Authentic Products guaranteed by Gada Electronics.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

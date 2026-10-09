import React, { useState } from 'react';
import { X, Star, Heart, ShoppingCart, Zap, ShieldCheck, Truck, Check, Send, ThumbsUp, MapPin } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onReviewSubmitted: (productId: string, updatedRating: number, newReview: Review) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  onReviewSubmitted
}) => {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState<'highlights' | 'specs' | 'reviews'>('highlights');
  const [pincode, setPincode] = useState('400063');
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length >= 6) {
      setPincodeChecked(true);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        onReviewSubmitted(product.id, data.updatedRating, data.review);
        setReviewSuccess(true);
        setReviewName('');
        setReviewComment('');
        setTimeout(() => setReviewSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-bold text-[#2874F0]">{product.brand}</span>
            <span aria-hidden="true">/</span>
            <span>{product.category}</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700 font-medium truncate max-w-xs">{product.name}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Image & Quick Buy Buttons */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-full aspect-square bg-slate-50 rounded-lg border border-slate-200/80 p-4 flex items-center justify-center relative overflow-hidden group">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => onToggleWishlist(product)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Wishlist"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 gap-3 w-full mt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addedAnimation}
                  className={`py-3 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-sm'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onBuyNow(product)}
                  className="py-3 px-4 rounded bg-[#fb641b] hover:bg-[#e85b17] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Seller Information */}
              <div className="w-full mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{product.seller.name}</span>
                  <span className="bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded text-[11px]">
                    {product.seller.rating} ★
                  </span>
                </div>
                <p className="text-slate-500">{product.seller.location}</p>
                <div className="flex items-center gap-1.5 text-blue-700 font-semibold pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Authorized Gada Franchise Partner</span>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Pricing, Highlights, Specs & Reviews */}
            <div className="md:col-span-7 flex flex-col space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="inline-flex items-center gap-1 bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">
                    <span>{product.rating}</span>
                    <Star className="w-3 h-3 fill-white text-white" />
                  </div>
                  <span className="text-slate-500 font-medium">
                    {product.ratingCount.toLocaleString('en-IN')} Ratings & {product.reviewCount} Reviews
                  </span>
                  {product.isGadaAssured && (
                    <span className="text-blue-700 font-bold italic bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      Gada Assured
                    </span>
                  )}
                </div>
              </div>

              {/* Price Block */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-slate-950 font-mono tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    {product.discountPercentage}% off
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Inclusive of all taxes</p>

                {/* Available Offers Box */}
                <div className="mt-3 pt-2 border-t border-slate-200 space-y-1 text-xs">
                  <p className="font-bold text-slate-800">Available Offers:</p>
                  <p className="text-slate-700">
                    • <span className="font-semibold text-emerald-700">Special Price:</span> Extra ₹{((product.originalPrice - product.price)).toLocaleString('en-IN')} off already applied.
                  </p>
                  <p className="text-slate-700">
                    • <span className="font-semibold text-[#2874F0]">Gada Coupon:</span> Apply code <span className="font-mono font-bold bg-white px-1 border border-slate-300 rounded">JETHALAL10</span> for 10% instant off in cart.
                  </p>
                </div>
              </div>

              {/* Delivery Pincode Checker */}
              <div className="border border-slate-200 rounded-lg p-3 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>Check Delivery Availability</span>
                  </div>
                </div>
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode"
                    className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-600 font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded font-semibold text-xs cursor-pointer"
                  >
                    Check
                  </button>
                </form>
                {pincodeChecked && (
                  <div className="mt-2 text-emerald-700 flex items-center gap-1 text-[11px] font-medium">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Delivery by tomorrow to {pincode} · <strong>FREE Delivery</strong></span>
                  </div>
                )}
              </div>

              {/* Tabs for Details */}
              <div className="border-b border-slate-200 flex gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('highlights')}
                  className={`pb-2 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                    activeTab === 'highlights'
                      ? 'border-[#2874F0] text-[#2874F0]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Key Highlights
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                    activeTab === 'specs'
                      ? 'border-[#2874F0] text-[#2874F0]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                    activeTab === 'reviews'
                      ? 'border-[#2874F0] text-[#2874F0]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Customer Reviews ({product.reviews.length})
                </button>
              </div>

              {/* Tab Contents */}
              <div className="text-xs text-slate-700">
                {activeTab === 'highlights' && (
                  <ul className="space-y-2 py-1">
                    {product.highlights.map((hl, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2874F0] mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{hl}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'specs' && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <tbody>
                        {Object.entries(product.specs).map(([key, val], idx) => (
                          <tr
                            key={key}
                            className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}
                          >
                            <td className="py-2 px-3 font-semibold text-slate-600 w-1/3 border-b border-slate-200">
                              {key}
                            </td>
                            <td className="py-2 px-3 text-slate-800 border-b border-slate-200">
                              {val}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {/* Add Review Form */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-900 text-xs">Rate & Review this Product</h4>
                      {reviewSuccess && (
                        <div className="bg-emerald-50 text-emerald-800 text-xs p-2 rounded border border-emerald-200">
                          Thank you! Your verified review has been published.
                        </div>
                      )}
                      <form onSubmit={handleSubmitReview} className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Your Full Name"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            required
                            className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-600"
                          />
                          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded px-2">
                            <span className="text-slate-500 text-[11px]">Rating:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="cursor-pointer"
                              >
                                <Star
                                  className={`w-3.5 h-3.5 ${
                                    star <= reviewRating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Write your genuine product experience..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          required
                          className="w-full bg-white border border-slate-300 rounded p-2 text-xs focus:outline-none focus:border-blue-600"
                        />
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="bg-[#2874F0] hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1.5 cursor-pointer ml-auto"
                        >
                          <Send className="w-3 h-3" />
                          <span>{submittingReview ? 'Posting...' : 'Submit Review'}</span>
                        </button>
                      </form>
                    </div>

                    {/* Existing Reviews List */}
                    <div className="space-y-3">
                      {product.reviews.map((rev) => (
                        <div key={rev.id} className="border-b border-slate-200 pb-3 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded text-[10px]">
                              {rev.rating} ★
                            </span>
                            <span className="font-bold text-slate-900">{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[11px] text-emerald-700 font-medium">
                                Verified Buyer
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400 ml-auto">{rev.date}</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed text-xs">{rev.comment}</p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{rev.helpfulCount} people found this helpful</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

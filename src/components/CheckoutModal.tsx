import React, { useState } from 'react';
import { X, CheckCircle, Truck, CreditCard, QrCode, Banknote, ShieldCheck } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  items: CartItem[];
  appliedCoupon: string | null;
  couponDiscount: number;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  items,
  appliedCoupon,
  couponDiscount,
  onClose,
  onOrderSuccess
}) => {
  const [step, setStep] = useState<'address' | 'payment' | 'confirmed'>('address');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address State
  const [fullName, setFullName] = useState('Jethalal Champaklal Gada');
  const [phone, setPhone] = useState('+91 98201 12345');
  const [address, setAddress] = useState('Flat 402, Gokuldham Co-Operative Housing Society');
  const [locality, setLocality] = useState('Powai Goregaon Link Road');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400063');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  const [upiId, setUpiId] = useState('jethalal@oksbi');

  // Pricing
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const deliveryFee = subtotal > 499 ? 0 : 40;
  const totalAmount = Math.max(0, subtotal - couponDiscount + deliveryFee);

  const handlePreFillGokuldham = () => {
    setFullName('Jethalal Champaklal Gada');
    setPhone('+91 98201 12345');
    setAddress('Flat 402, Wing B, Gokuldham Society');
    setLocality('Powai Goregaon Link Road');
    setCity('Mumbai');
    setState('Maharashtra');
    setPincode('400063');
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !pincode) {
      setError('Please fill in all required shipping address fields');
      return;
    }
    setError(null);
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    const orderPayload = {
      items: items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      customer: {
        fullName,
        phone,
        address,
        locality,
        city,
        pincode,
        state
      },
      paymentMethod,
      couponCode: appliedCoupon || undefined,
      subtotal,
      discount: couponDiscount,
      deliveryFee,
      totalAmount
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success && data.order) {
        setPlacedOrder(data.order);
        setStep('confirmed');
        onOrderSuccess(data.order);
      } else {
        setError(data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error(err);
      setError('Network error while placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#2874F0] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold">
              {step === 'confirmed' ? 'Order Confirmed!' : 'Gada Express Checkout'}
            </h2>
          </div>
          {step !== 'confirmed' && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Steps indicator */}
        {step !== 'confirmed' && (
          <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setStep('address')}
              className={`py-2.5 text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                step === 'address'
                  ? 'bg-white text-[#2874F0] border-b-2 border-[#2874F0]'
                  : 'text-slate-500'
              }`}
            >
              <span>1. Delivery Address</span>
            </button>
            <button
              onClick={() => {
                if (fullName && address) setStep('payment');
              }}
              className={`py-2.5 text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                step === 'payment'
                  ? 'bg-white text-[#2874F0] border-b-2 border-[#2874F0]'
                  : 'text-slate-500'
              }`}
            >
              <span>2. Payment Option</span>
            </button>
          </div>
        )}

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
              {error}
            </div>
          )}

          {/* STEP 1: Address Form */}
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Shipping Details
                </span>
                <button
                  type="button"
                  onClick={handlePreFillGokuldham}
                  className="text-xs text-[#2874F0] hover:underline font-semibold cursor-pointer"
                >
                  Use Gokuldham Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (10 digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address, Flat / House No *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Locality / Landmark
                  </label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    maxLength={6}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                <div className="text-xs text-slate-500">
                  Total Payable: <strong className="font-mono text-slate-900 text-sm">₹{totalAmount.toLocaleString('en-IN')}</strong>
                </div>
                <button
                  type="submit"
                  className="bg-[#2874F0] hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded text-xs transition-colors cursor-pointer"
                >
                  Deliver to This Address
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Options */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wide pb-2 border-b border-slate-100">
                Select Payment Method
              </div>

              {/* Payment Methods */}
              <div className="space-y-2.5">
                {/* Cash on Delivery */}
                <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-[#2874F0] bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold text-xs text-slate-900">Cash on Delivery (COD)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Recommended</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Pay safely at your doorstep with Cash or UPI QR when Natu Kaka / Bagha delivers your gadget.
                    </p>
                  </div>
                </label>

                {/* UPI Payment */}
                <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'upi' ? 'border-[#2874F0] bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#2874F0]" />
                      <span className="font-bold text-xs text-slate-900">UPI Instant Payment (Google Pay, PhonePe, Paytm)</span>
                    </div>
                    {paymentMethod === 'upi' && (
                      <div className="mt-2.5 pt-2 border-t border-blue-200">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                          className="w-full max-w-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    )}
                  </div>
                </label>

                {/* Card Payment */}
                <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-[#2874F0] bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      <span className="font-bold text-xs text-slate-900">Credit / Debit Card (Visa, RuPay, MasterCard)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Safe 256-bit SSL encrypted bank transaction with Instant 2-Factor OTP.
                    </p>
                  </div>
                </label>
              </div>

              {/* Order Recap */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Shipping To:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[250px]">{fullName}, {city} ({pincode})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Payable:</span>
                  <span className="font-mono font-bold text-slate-950 text-sm">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  ← Back to Address
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="bg-[#fb641b] hover:bg-[#e85b17] text-white font-bold px-6 py-2.5 rounded text-xs transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Confirming...' : `Confirm & Pay ₹${totalAmount.toLocaleString('en-IN')}`}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Placed Success */}
          {step === 'confirmed' && placedOrder && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Thank You for Your Order!</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Order ID: <span className="font-mono font-bold text-[#2874F0]">{placedOrder.id}</span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  An SMS confirmation has been sent to {placedOrder.customer.phone}
                </p>
              </div>

              {/* Delivery Timeline Preview */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-left text-xs max-w-md mx-auto space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <Truck className="w-4 h-4" />
                  <span>Estimated Delivery: {placedOrder.estimatedDelivery}</span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  Shipping to: <strong>{placedOrder.customer.address}, {placedOrder.customer.city} - {placedOrder.customer.pincode}</strong>
                </div>
                <div className="text-slate-600 text-[11px]">
                  Amount: <strong className="font-mono">₹{placedOrder.totalAmount.toLocaleString('en-IN')}</strong> ({placedOrder.paymentMethod.toUpperCase()})
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={onClose}
                  className="bg-[#2874F0] hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded text-xs transition-colors cursor-pointer"
                >
                  View My Orders & Track
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

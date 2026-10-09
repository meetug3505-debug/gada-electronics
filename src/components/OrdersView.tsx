import React from 'react';
import { Package, Truck, Calendar, ShoppingBag, ArrowRight, Printer } from 'lucide-react';
import { Order } from '../types';

interface OrdersViewProps {
  orders: Order[];
  onTrackOrder: (order: Order) => void;
  onContinueShopping: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onTrackOrder,
  onContinueShopping
}) => {
  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg border border-slate-200 p-10 max-w-md mx-auto shadow-xs">
          <div className="w-20 h-20 rounded-full bg-blue-50 text-[#2874F0] flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Orders Yet</h2>
          <p className="text-xs text-slate-500 mb-6">
            You haven't placed any electronics orders yet with Gada Electronics.
          </p>
          <button
            onClick={onContinueShopping}
            className="bg-[#2874F0] hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded text-sm transition-all cursor-pointer shadow-sm w-full"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: sans-serif; padding: 24px; color: #1e293b; }
            .header { border-bottom: 2px solid #2874f0; padding-bottom: 12px; margin-bottom: 16px; }
            .title { font-size: 22px; font-weight: bold; color: #2874f0; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
            th { background-color: #f1f5f9; }
            .total { text-align: right; font-weight: bold; margin-top: 16px; font-size: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Gada Electronics - Official Invoice</div>
            <p>Gokuldham Market, Mumbai | GSTIN: 27AABCG1234F1Z9</p>
          </div>
          <p><strong>Order ID:</strong> ${order.id} | <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Billed To:</strong> ${order.customer.fullName}, ${order.customer.address}, ${order.customer.city} (${order.customer.pincode})</p>
          <table>
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${order.items.map(i => `
                <tr>
                  <td>${i.name}</td>
                  <td>${i.quantity}</td>
                  <td>₹${i.price.toLocaleString('en-IN')}</td>
                  <td>₹${(i.price * i.quantity).toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">Total Paid: ₹${order.totalAmount.toLocaleString('en-IN')} (${order.paymentMethod.toUpperCase()})</div>
          <p style="margin-top: 24px; font-size: 11px; color: #64748b;">Authorized Signature: Jethalal Champaklal Gada</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Your Orders & Deliveries</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track and manage your electronics orders from Gada Electronics
          </p>
        </div>
        <button
          onClick={onContinueShopping}
          className="text-xs font-semibold text-[#2874F0] hover:underline cursor-pointer"
        >
          Explore More Products
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isCancelled = order.status === 'cancelled';
          return (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
            >
              {/* Order Meta Header */}
              <div className="bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-slate-500">Order ID:</span>
                    <span className="font-mono font-bold text-slate-900 ml-1.5">{order.id}</span>
                  </div>
                  <div className="hidden sm:block text-slate-300">|</div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="hidden sm:block text-slate-300">|</div>
                  <div>
                    <span className="text-slate-500">Total:</span>
                    <span className="font-mono font-bold text-slate-900 ml-1">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                      isCancelled
                        ? 'bg-red-100 text-red-800'
                        : order.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {isCancelled ? 'Cancelled' : order.status.replace(/_/g, ' ')}
                  </span>

                  <button
                    onClick={() => handlePrintInvoice(order)}
                    className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Print Invoice"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 sm:p-6 divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded border border-slate-200 p-1.5 shrink-0 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Qty: {item.quantity} · Price: <span className="font-mono">₹{item.price.toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer & Actions */}
              <div className="bg-slate-50/50 px-4 sm:px-6 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Truck className="w-4 h-4 text-[#2874F0]" />
                  <span>
                    {isCancelled
                      ? 'Order was cancelled'
                      : `Expected delivery by ${order.estimatedDelivery}`}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onTrackOrder(order)}
                    className="bg-[#2874F0] hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Track Shipment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

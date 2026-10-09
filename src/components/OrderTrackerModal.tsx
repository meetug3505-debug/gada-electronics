import React from 'react';
import { X, CheckCircle2, Clock, Truck, MapPin, Package, ShieldCheck, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerModalProps {
  order: Order | null;
  onClose: () => void;
  onCancelOrder: (orderId: string) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  onClose,
  onCancelOrder
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#2874F0] text-white flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">Track Shipment</h2>
            <p className="text-xs text-blue-100 font-mono mt-0.5">Order ID: {order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Estimated Delivery Status Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wide">
                Delivery Estimate
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {order.status === 'delivered' ? 'Delivered successfully' : order.estimatedDelivery}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Carrier: Gada Express Logistics (Gokuldham Hub)
              </p>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#2874F0] shadow-2xs">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Shipment Milestones
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {order.trackingHistory.map((step, idx) => {
                const isCancelled = order.status === 'cancelled';
                return (
                  <div key={idx} className="relative flex items-start gap-3">
                    {/* Status dot icon */}
                    <div className="absolute -left-6 mt-0.5">
                      {step.done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 bg-white" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-bold ${step.done ? 'text-slate-900' : 'text-slate-500'}`}>
                          {step.label}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">{step.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Destination Details */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Delivery Address</span>
            </div>
            <p className="text-slate-700 font-medium">
              {order.customer.fullName} ({order.customer.phone})
            </p>
            <p className="text-slate-500">
              {order.customer.address}, {order.customer.locality}, {order.customer.city} - {order.customer.pincode}
            </p>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            {order.status !== 'cancelled' && order.status !== 'delivered' ? (
              <button
                onClick={() => onCancelOrder(order.id)}
                className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
              >
                Cancel This Order
              </button>
            ) : (
              <span className="text-xs text-slate-500">
                {order.status === 'cancelled' ? 'Order has been cancelled' : 'Order completed'}
              </span>
            )}

            <button
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';
import { ViewMode } from '../types';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs mt-16 border-t border-slate-800">
      {/* Top Value Strip */}
      <div className="border-b border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-white font-semibold">100% Original Products</p>
              <p className="text-[11px] text-slate-500">Every gadget tested before dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-white font-semibold">7 Days Easy Return</p>
              <p className="text-[11px] text-slate-500">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-white font-semibold">Gada Express Logistics</p>
              <p className="text-[11px] text-slate-500">Fast delivery across all pincodes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-white font-semibold">Certified Gada Assured</p>
              <p className="text-[11px] text-slate-500">Under personal guidance of Jethalal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-xl font-black italic tracking-tight text-white">
                Gada
              </span>
              <span className="text-xs font-semibold text-amber-300">
                Electronics
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              India's favorite neighborhood electronics showroom, now online in a modern Flipkart-style e-commerce experience.
            </p>
            <p className="text-[11px] text-slate-500 mt-2">
              Proprietor: Jethalal Champaklal Gada <br />
              Shop No. 1–3, Gokuldham Market, Mumbai 400063
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3">
              Quick Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCategory('Smart TVs')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  4K OLED Smart TVs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Smartphones')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  5G Flagship Smartphones
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Laptops')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Thin & Light AI Laptops
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Audio')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  ANC Headphones & Wearables
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Home Appliances')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Inverter Refrigerators & ACs
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3">
              Customer Support
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('orders')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Track Your Shipment
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cart')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Shopping Bag & Checkout
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wishlist')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <span className="text-slate-500">Helpline: +91 98201 12345 (Natu Kaka)</span>
              </li>
              <li>
                <span className="text-slate-500">Technical Support: Bagha Boy</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3">
              Academic Context
            </h4>
            <div className="p-3 bg-slate-800/80 rounded border border-slate-700/60 text-[11px] leading-relaxed text-slate-300">
              <p className="font-semibold text-amber-300">DAVV Web Designing Project</p>
              <p className="mt-1 text-slate-400">
                Full-Stack React + Node/Express Application featuring custom responsive UI, dynamic shopping cart, coupon calculation, orders database, and tracking pipeline.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Gada Electronics. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Flipkart-Inspired Architecture</span>
            <span aria-hidden="true">·</span>
            <span>DAVV Web Design Curriculum</span>
            <span aria-hidden="true">·</span>
            <span>React 19 & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

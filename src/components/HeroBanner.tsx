import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

interface HeroBannerProps {
  onExploreDeals: () => void;
  onExploreCategory: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreDeals,
  onExploreCategory
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
      {/* Main Campaign Showcase Banner */}
      <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-slate-200/80 shadow-sm aspect-[21/9] sm:aspect-[24/9] max-h-[380px]">
        <img
          src="/src/assets/images/gada_hero_banner_1791529045598.jpg"
          alt="Gada Electronics Mega Tech Showcase"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle scrim for maximum legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent flex items-center p-6 sm:p-10">
          <div className="max-w-lg text-white space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <span>Grand Electronics Festival</span>
              <span aria-hidden="true">·</span>
              <span>Gokuldham Market Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              Upgrade Your Tech with Gada Electronics
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-md">
              Up to 50% Off on 4K Smart TVs, Flagship 5G Mobiles, AI Laptops & Soundbars. Verified personally by Jethalal Champaklal Gada.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onExploreDeals}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2 rounded text-xs sm:text-sm transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                Shop Festival Deals
              </button>
              <button
                onClick={() => onExploreCategory('Smart TVs')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white border border-white/30 font-semibold px-4 py-2 rounded text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap"
              >
                Explore Smart TVs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Strip (4 Pillars) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3 py-2 bg-white rounded-lg border border-slate-200 px-4 text-slate-700 text-xs">
        <div className="flex items-center gap-2.5 py-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900 leading-tight">100% Genuine Tech</p>
            <p className="text-[11px] text-slate-500">Authorized Brand Warranty</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 py-1">
          <Truck className="w-4 h-4 text-[#2874F0] shrink-0" />
          <div>
            <p className="font-bold text-slate-900 leading-tight">Express Delivery</p>
            <p className="text-[11px] text-slate-500">Free delivery on orders over ₹499</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 py-1">
          <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900 leading-tight">7 Days Easy Return</p>
            <p className="text-[11px] text-slate-500">Hassle-free replacement policy</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 py-1">
          <Award className="w-4 h-4 text-purple-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900 leading-tight">Gada Assured Seal</p>
            <p className="text-[11px] text-slate-500">Pre-inspected by Natu Kaka</p>
          </div>
        </div>
      </div>
    </div>
  );
};

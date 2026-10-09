import React from 'react';
import { Smartphone, Tv, Laptop, Headphones, Refrigerator, LayoutGrid, Zap } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: { name: string; count: number; icon: string }[];
  showDealsOnly: boolean;
  onToggleDeals: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  categories,
  showDealsOnly,
  onToggleDeals
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Smartphones':
        return <Smartphone className="w-5 h-5" />;
      case 'Smart TVs':
        return <Tv className="w-5 h-5" />;
      case 'Laptops':
        return <Laptop className="w-5 h-5" />;
      case 'Audio':
        return <Headphones className="w-5 h-5" />;
      case 'Home Appliances':
        return <Refrigerator className="w-5 h-5" />;
      default:
        return <LayoutGrid className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {categories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase() && !showDealsOnly;
              return (
                <button
                  key={cat.name}
                  onClick={() => onSelectCategory(cat.name)}
                  className={`flex flex-col sm:flex-row items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-[#2874F0] border border-blue-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className={isActive ? 'text-[#2874F0]' : 'text-slate-500'}>
                    {getIcon(cat.name)}
                  </span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          <div className="shrink-0 flex items-center pl-3 border-l border-slate-200">
            <button
              onClick={onToggleDeals}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                showDealsOnly
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Jethalal's Deals</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

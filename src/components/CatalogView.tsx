import React, { useState } from 'react';
import { SlidersHorizontal, RotateCcw, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface CatalogViewProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: { name: string; count: number }[];
  searchQuery: string;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  showDealsOnly: boolean;
  onResetFilters: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  categories,
  searchQuery,
  onSelectProduct,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  showDealsOnly,
  onResetFilters
}) => {
  // Local Filter & Sort states
  const [selectedSort, setSelectedSort] = useState<'popular' | 'price-low-high' | 'price-high-low' | 'rating' | 'discount'>('popular');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedPriceRange, setSelectedPriceRange] = useState<'all' | 'under10k' | '10k-40k' | '40k-80k' | 'above80k'>('all');
  const [gadaAssuredOnly, setGadaAssuredOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filter products locally for instantaneous UI response
  let filtered = [...products];

  // Price range filter
  if (selectedPriceRange === 'under10k') {
    filtered = filtered.filter(p => p.price < 10000);
  } else if (selectedPriceRange === '10k-40k') {
    filtered = filtered.filter(p => p.price >= 10000 && p.price <= 40000);
  } else if (selectedPriceRange === '40k-80k') {
    filtered = filtered.filter(p => p.price > 40000 && p.price <= 80000);
  } else if (selectedPriceRange === 'above80k') {
    filtered = filtered.filter(p => p.price > 80000);
  }

  // Minimum rating filter
  if (selectedRating > 0) {
    filtered = filtered.filter(p => p.rating >= selectedRating);
  }

  // Gada assured filter
  if (gadaAssuredOnly) {
    filtered = filtered.filter(p => p.isGadaAssured);
  }

  // Deal of the day filter
  if (showDealsOnly) {
    filtered = filtered.filter(p => p.isDealOfTheDay);
  }

  // Sorting
  if (selectedSort === 'price-low-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (selectedSort === 'price-high-low') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (selectedSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (selectedSort === 'discount') {
    filtered.sort((a, b) => b.discountPercentage - a.discountPercentage);
  }

  const handleReset = () => {
    setSelectedSort('popular');
    setSelectedRating(0);
    setSelectedPriceRange('all');
    setGadaAssuredOnly(false);
    onResetFilters();
  };

  const isAnyFilterActive =
    selectedRating > 0 ||
    selectedPriceRange !== 'all' ||
    gadaAssuredOnly ||
    selectedCategory !== 'All' ||
    showDealsOnly ||
    searchQuery.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between pb-4">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-1.5 rounded text-xs font-semibold text-slate-800"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters {isAnyFilterActive ? '(Active)' : ''}</span>
        </button>

        <span className="text-xs text-slate-500 font-mono">
          {filtered.length} products found
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Filter Sidebar */}
        <aside
          className={`lg:col-span-3 bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#2874F0]" />
              <span>Filters</span>
            </h2>
            {isAnyFilterActive && (
              <button
                onClick={handleReset}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-500 mb-2.5">
              Categories
            </h3>
            <div className="space-y-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => onSelectCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-blue-50 text-[#2874F0] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="font-mono text-[11px] text-slate-400">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase text-slate-500 mb-2.5">
              Price Range
            </h3>
            <div className="space-y-1.5 text-xs text-slate-700">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under10k', label: 'Under ₹10,000' },
                { id: '10k-40k', label: '₹10,000 – ₹40,000' },
                { id: '40k-80k', label: '₹40,000 – ₹80,000' },
                { id: 'above80k', label: 'Above ₹80,000' }
              ].map((range) => (
                <label key={range.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === range.id}
                    onChange={() => setSelectedPriceRange(range.id as any)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase text-slate-500 mb-2.5">
              Customer Ratings
            </h3>
            <div className="space-y-1.5 text-xs text-slate-700">
              {[
                { val: 4.5, label: '4.5 ★ & above' },
                { val: 4.0, label: '4.0 ★ & above' },
                { val: 0, label: 'All Ratings' }
              ].map((r) => (
                <label key={r.val} className="flex items-center gap-2 cursor-pointer py-0.5">
                  <input
                    type="radio"
                    name="ratingFilter"
                    checked={selectedRating === r.val}
                    onChange={() => setSelectedRating(r.val)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-1">
                    <span>{r.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Gada Assured Seal Filter */}
          <div className="pt-4 border-t border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
              <input
                type="checkbox"
                checked={gadaAssuredOnly}
                onChange={(e) => setGadaAssuredOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-bold text-blue-700">Gada Assured</span>
              <span className="text-[11px] text-slate-400">Only</span>
            </label>
          </div>
        </aside>

        {/* Right Section: Product Grid and Sorting Bar */}
        <main className="lg:col-span-9 space-y-4">
          {/* Header Row: Results count + Flipkart Sort Bar */}
          <div className="bg-white rounded-lg border border-slate-200 p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-900">
                {selectedCategory === 'All' ? 'All Electronics' : selectedCategory}
              </span>
              {searchQuery && (
                <span className="text-slate-500">
                  matching "<strong className="text-slate-900">{searchQuery}</strong>"
                </span>
              )}
              {showDealsOnly && (
                <span className="text-amber-800 font-bold bg-amber-100 px-1.5 py-0.2 rounded text-[11px]">
                  Festival Deals
                </span>
              )}
              <span className="text-slate-400 font-mono">({filtered.length} items)</span>
            </div>

            {/* Sort Segmented Controls */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
              <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">Sort By:</span>
              {[
                { id: 'popular', label: 'Popularity' },
                { id: 'price-low-high', label: 'Price: Low to High' },
                { id: 'price-high-low', label: 'Price: High to Low' },
                { id: 'rating', label: 'Rating' },
                { id: 'discount', label: 'Discount' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSort(s.id as any)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedSort === s.id
                      ? 'bg-[#2874F0] text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlistIds.has(product.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center shadow-xs">
              <h3 className="text-base font-bold text-slate-800 mb-1">
                No electronics match your search/filter criteria
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Try loosening your price filters or searching with a different term.
              </p>
              <button
                onClick={handleReset}
                className="bg-[#2874F0] hover:bg-blue-700 text-white font-bold px-4 py-2 rounded text-xs transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

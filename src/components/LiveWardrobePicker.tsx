import React, { useState, useRef } from 'react';
import { ClothingItem, OutfitState, ColorHarmonyResult, GarmentCategory } from '../types';
import { TRADITIONAL_COLORS } from '../data/colorsData';
import { 
  Shirt, 
  Scissors, 
  Crown, 
  Footprints, 
  Watch, 
  Check, 
  X, 
  Info, 
  Search, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Palette,
  Compass,
  Undo2,
  Redo2
} from 'lucide-react';

interface LiveWardrobePickerProps {
  wardrobe: ClothingItem[];
  outfit: OutfitState;
  onEquipItem: (item: ClothingItem) => void;
  onUnequipItem: (category: keyof OutfitState['colors']) => void;
  onColorChange: (category: keyof OutfitState['colors'], colorHex: string) => void;
  onViewItemDetails: (item: ClothingItem) => void;
  theme?: 'dark' | 'light';
  harmony: ColorHarmonyResult;
  onSwitchToColorTab?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  avatarType?: 'female' | 'male' | 'unisex' | 'cyber';
  setAvatarType?: (type: 'female' | 'male' | 'unisex' | 'cyber') => void;
}

export const LiveWardrobePicker: React.FC<LiveWardrobePickerProps> = ({
  wardrobe,
  outfit,
  onEquipItem,
  onUnequipItem,
  onColorChange,
  onViewItemDetails,
  theme = 'dark',
  harmony,
  onSwitchToColorTab,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  avatarType = 'female',
  setAvatarType,
}) => {
  const isLight = theme === 'light';
  const [selectedCategory, setSelectedCategory] = useState<GarmentCategory>('outer');
  const [searchQuery, setSearchQuery] = useState('');
  const [eraFilter, setEraFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male' | 'unisex'>('all');
  const [colorPickerItemId, setColorPickerItemId] = useState<string | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -180 : 180,
        behavior: 'smooth',
      });
    }
  };

  const categories: Array<{
    id: GarmentCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    slotKey: keyof OutfitState['colors'];
    idKey: keyof OutfitState;
  }> = [
    { id: 'outer', label: 'Áo Ngoài', icon: Shirt, slotKey: 'outer', idKey: 'outerId' },
    { id: 'inner', label: 'Áo Trong / Yếm', icon: Scissors, slotKey: 'inner', idKey: 'innerId' },
    { id: 'bottom', label: 'Quần & Váy', icon: Shirt, slotKey: 'bottom', idKey: 'bottomId' },
    { id: 'headwear', label: 'Khăn & Nón', icon: Crown, slotKey: 'headwear', idKey: 'headwearId' },
    { id: 'footwear', label: 'Giày & Guốc', icon: Footprints, slotKey: 'footwear', idKey: 'footwearId' },
    { id: 'accessory', label: 'Phụ Kiện', icon: Watch, slotKey: 'accessory', idKey: 'accessoryId' },
  ];

  const currentCategoryMeta = categories.find((c) => c.id === selectedCategory) || categories[0];
  const currentEquippedId = outfit[currentCategoryMeta.idKey] as string | undefined;

  // Filter items in current category
  const categoryItems = wardrobe.filter((item) => {
    if (item.category !== selectedCategory) return false;

    // 1. Gender filter
    if (genderFilter === 'female') {
      if (item.genderContext && item.genderContext !== 'female' && item.genderContext !== 'unisex') {
        return false;
      }
    } else if (genderFilter === 'male') {
      if (item.genderContext && item.genderContext !== 'male' && item.genderContext !== 'unisex') {
        return false;
      }
    } else if (genderFilter === 'unisex') {
      if (item.genderContext !== 'unisex') {
        return false;
      }
    }

    // 2. Era filter
    if (eraFilter !== 'all') {
      if (eraFilter === 'traditional' && !item.isTraditional) return false;
      if (eraFilter === 'remix' && item.isTraditional) return false;
      if (eraFilter === 'nguyen' && !item.era.includes('Nguyễn')) return false;
      if (eraFilter === 'le_ly' && !item.era.includes('Lê') && !item.era.includes('Lý')) return false;
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchEra = item.era.toLowerCase().includes(q);
      return matchName || matchDesc || matchEra;
    }
    return true;
  });

  return (
    <div
      className={`rounded-2xl border shadow-sm flex flex-col transition-colors overflow-hidden ${
        isLight ? 'bg-white border-[#e7e1d5]' : 'bg-[#18181e] border-white/10'
      }`}
    >
      {/* 1. Header with Compact Harmony Score & Switcher */}
      <div
        className={`p-3.5 sm:p-4 border-b flex items-center justify-between gap-3 transition-colors ${
          isLight ? 'bg-[#fbf9f4] border-[#e7e1d5]' : 'bg-[#141418] border-white/10'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#c93b2b] animate-pulse" />
          <h3 className={`font-serif text-sm sm:text-base font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
            Kho Đồ Trực Tiếp (Chọn Đồ Xem Ngay)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Undo / Redo */}
          {onUndo && (
            <div className="flex items-center gap-1 mr-0.5">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className={`p-1.5 rounded-lg border transition-all ${
                  !canUndo
                    ? 'opacity-30 cursor-not-allowed border-transparent'
                    : isLight
                    ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700 hover:text-[#c93b2b] shadow-2xs cursor-pointer hover:scale-105 active:scale-95'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300 hover:text-white cursor-pointer hover:scale-105 active:scale-95'
                }`}
                title={canUndo ? 'Hoàn tác trang phục trước (Ctrl+Z)' : 'Chưa có thao tác để hoàn tác'}
                aria-label="Undo"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className={`p-1.5 rounded-lg border transition-all ${
                  !canRedo
                    ? 'opacity-30 cursor-not-allowed border-transparent'
                    : isLight
                    ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700 hover:text-[#c93b2b] shadow-2xs cursor-pointer hover:scale-105 active:scale-95'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300 hover:text-white cursor-pointer hover:scale-105 active:scale-95'
                }`}
                title={canRedo ? 'Làm lại trang phục (Ctrl+Y / Ctrl+Shift+Z)' : 'Không có thao tác để làm lại'}
                aria-label="Redo"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {onSwitchToColorTab && (
            <button
              onClick={onSwitchToColorTab}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-stone-50 border-[#ded6c5] text-stone-700 shadow-xs hover:border-amber-700/30'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300 hover:border-white/20'
              }`}
              title="Chuyển sang bảng chỉnh màu và chấm điểm ngũ hành"
            >
              <Compass className="w-3.5 h-3.5 text-[#c93b2b]" />
              <span className="tabular-nums font-mono">Hòa sắc {harmony.score}/100</span>
              <ChevronRight className="w-3 h-3 text-stone-400" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Horizontal Category Tabs with Scroll Controls */}
      <div
        className={`px-3 py-2.5 border-b space-y-2 transition-colors ${
          isLight ? 'bg-stone-50/70 border-stone-200' : 'bg-black/20 border-white/5'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
            Phân Loại Trang Phục
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleScrollCategories('left')}
              className={`p-1 rounded-md border cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700 shadow-xs'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
              }`}
              title="Cuộn danh mục sang trái"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleScrollCategories('right')}
              className={`p-1 rounded-md border cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700 shadow-xs'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
              }`}
              title="Cuộn danh mục sang phải"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Scrollable ribbon of categories with subtle hover scaling and brightening */}
        <div
          ref={categoryScrollRef}
          className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 scrollbar-thin scroll-smooth"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const isEquipped = !!outfit[cat.idKey];
            const count = wardrobe.filter((w) => w.category === cat.id).length;
            const equippedColor = outfit.colors[cat.slotKey];

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setColorPickerItemId(null);
                }}
                className={`group relative px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ease-out cursor-pointer border transform hover:scale-[1.04] active:scale-95 ${
                  isSelected
                    ? 'bg-[#c93b2b] text-white border-[#c93b2b] shadow-md shadow-[#c93b2b]/25 hover:brightness-110 hover:shadow-lg hover:shadow-[#c93b2b]/35'
                    : isLight
                    ? 'bg-white hover:bg-white text-stone-700 hover:text-[#c93b2b] border-stone-200 hover:border-amber-700/35 hover:shadow-md hover:brightness-105'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/5 hover:border-white/20 hover:brightness-115 hover:shadow-[0_0_14px_rgba(255,255,255,0.08)]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-translate-y-0.5 ${
                  isSelected ? 'text-white' : 'text-stone-500 group-hover:text-[#c93b2b] dark:text-zinc-400 dark:group-hover:text-amber-400'
                }`} />
                <span className="tracking-tight">{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full transition-colors duration-200 ${
                    isSelected
                      ? 'bg-white/25 text-white'
                      : isLight
                      ? 'bg-stone-200/90 text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-900'
                      : 'bg-white/10 text-zinc-400 group-hover:bg-white/20 group-hover:text-zinc-200'
                  }`}
                >
                  {count}
                </span>
                {isEquipped && (
                  <span
                    className="w-2 h-2 rounded-full border border-white/60 shadow-xs shrink-0 group-hover:scale-125 transition-transform duration-200"
                    style={{ backgroundColor: equippedColor }}
                    title="Đang mặc món trong nhóm này"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Search & Sub-Era Quick Filter Chips */}
      <div className={`p-3 border-b flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs ${
        isLight ? 'bg-white border-stone-200' : 'bg-white/[0.02] border-white/5'
      }`}>
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder={`Tìm trong ${currentCategoryMeta.label}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:border-[#c93b2b] transition-colors ${
              isLight
                ? 'bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400'
                : 'bg-white/5 border-white/10 text-white placeholder:text-zinc-500'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
          {[
            { id: 'all', label: 'Tất cả niên đại' },
            { id: 'traditional', label: 'Cổ phục' },
            { id: 'remix', label: 'Remix' },
            { id: 'nguyen', label: 'Triều Nguyễn' },
            { id: 'le_ly', label: 'Lê - Lý' },
          ].map((era) => (
            <button
              key={era.id}
              onClick={() => setEraFilter(era.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all duration-200 ease-out cursor-pointer border transform hover:scale-105 active:scale-95 ${
                eraFilter === era.id
                  ? isLight
                    ? 'bg-stone-800 text-white border-stone-800 shadow-2xs'
                    : 'bg-white text-stone-900 border-white shadow-2xs'
                  : isLight
                  ? 'bg-stone-100 hover:bg-stone-200/80 hover:text-stone-900 text-stone-600 border-stone-200 hover:border-stone-300 hover:shadow-2xs'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border-white/5 hover:border-white/10'
              }`}
            >
              {era.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3.5 Gender Filter Ribbon & Model Sync */}
      <div className={`px-3 py-1.5 border-b flex flex-wrap items-center justify-between gap-2 text-xs transition-colors ${
        isLight ? 'bg-amber-50/30 border-stone-200' : 'bg-white/[0.01] border-white/5'
      }`}>
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
            Lọc Giới Tính:
          </span>
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'Tất Cả' },
              { id: 'female', label: '👩 Đồ Nữ' },
              { id: 'male', label: '👨 Đồ Nam' },
              { id: 'unisex', label: '✨ Unisex' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setGenderFilter(g.id as any)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer border ${
                  genderFilter === g.id
                    ? 'bg-[#c93b2b] text-white border-[#c93b2b] shadow-xs'
                    : isLight
                    ? 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Model quick indicator & sync */}
        {setAvatarType && (
          <div className="flex items-center gap-1 text-[11px]">
            <span className={isLight ? 'text-stone-500' : 'text-zinc-400'}>Model:</span>
            <button
              onClick={() => {
                const nextGender = avatarType === 'female' ? 'male' : 'female';
                setAvatarType(nextGender);
                setGenderFilter(nextGender);
              }}
              className={`px-2 py-0.5 rounded-md border font-semibold transition-all cursor-pointer ${
                avatarType === 'female'
                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                  : avatarType === 'male'
                  ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30'
                  : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
              }`}
              title="Bấm để đổi nhanh giới tính Model (Nữ ⇄ Nam) và đồng bộ trang phục"
            >
              {avatarType === 'female' ? '👩 Nữ (Đổi sang Nam)' : avatarType === 'male' ? '👨 Nam (Đổi sang Nữ)' : '⚡ Gen Z'}
            </button>
          </div>
        )}
      </div>

      {/* 4. Garment Items Grid (Direct Real-time Selection) */}
      <div className="p-3 sm:p-4 max-h-[460px] overflow-y-auto space-y-2.5 scrollbar-thin">
        {categoryItems.length === 0 ? (
          <div className="py-12 text-center text-xs text-stone-400">
            Không tìm thấy trang phục phù hợp với từ khóa "{searchQuery}".
          </div>
        ) : (
          categoryItems.map((item) => {
            const isEquipped = currentEquippedId === item.id;
            const itemColor = isEquipped ? outfit.colors[currentCategoryMeta.slotKey] : item.defaultColor;
            const isColorPickerOpen = colorPickerItemId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isEquipped) {
                    onEquipItem(item);
                  }
                }}
                className={`rounded-xl border p-3 transition-all duration-200 ease-out flex flex-col gap-2.5 cursor-pointer relative group transform hover:-translate-y-0.5 hover:scale-[1.01] ${
                  isEquipped
                    ? isLight
                      ? 'bg-amber-50/60 border-[#c93b2b] ring-1 ring-[#c93b2b] shadow-sm hover:shadow-md'
                      : 'bg-[#c93b2b]/10 border-[#c93b2b] ring-1 ring-[#c93b2b] hover:shadow-md'
                    : isLight
                    ? 'bg-[#fbf9f4] hover:bg-white hover:border-amber-700/30 border-[#e7e1d5] shadow-2xs hover:shadow-md hover:brightness-[1.01]'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 hover:border-white/20 hover:brightness-110 hover:shadow-lg hover:shadow-black/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    {/* Color Swatch / Quick Indicator */}
                    <div
                      className="w-5 h-5 rounded-full border-2 border-white dark:border-black/50 shadow-sm shrink-0 mt-0.5"
                      style={{ backgroundColor: itemColor }}
                      title={`Màu sắc: ${itemColor}`}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4
                          className={`text-xs sm:text-sm font-semibold truncate transition-colors ${
                            isEquipped
                              ? 'text-[#c93b2b] font-bold'
                              : isLight
                              ? 'text-stone-900 group-hover:text-[#c93b2b]'
                              : 'text-white group-hover:text-[#ff7566]'
                          }`}
                        >
                          {item.name}
                        </h4>

                        {isEquipped && (
                          <span className="px-1.5 py-0.2 rounded bg-[#c93b2b] text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" />
                            <span>Đang Mặc</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] flex-wrap">
                        <span className={`px-1.5 py-0.2 rounded border ${
                          isLight ? 'bg-white border-stone-200 text-stone-600' : 'bg-white/10 border-white/5 text-zinc-300'
                        }`}>
                          {item.era}
                        </span>
                        {item.genderContext === 'female' && (
                          <span className="px-1.5 py-0.2 rounded font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            👩 Nữ
                          </span>
                        )}
                        {item.genderContext === 'male' && (
                          <span className="px-1.5 py-0.2 rounded font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                            👨 Nam
                          </span>
                        )}
                        {item.genderContext === 'unisex' && (
                          <span className="px-1.5 py-0.2 rounded font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            ✨ Unisex
                          </span>
                        )}
                        {item.isTraditional ? (
                          <span className="text-amber-600 dark:text-amber-400 font-medium">★ Cổ phục</span>
                        ) : (
                          <span className="text-cyan-600 dark:text-cyan-400 font-medium">✦ Tân thời / Remix</span>
                        )}
                      </div>

                      <p className={`text-[11px] mt-1 line-clamp-1 leading-relaxed ${
                        isLight ? 'text-stone-600' : 'text-zinc-400'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Cultural Info Button */}
                    <button
                      onClick={() => onViewItemDetails(item)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isLight
                          ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-600 hover:text-[#c93b2b]'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                      title="Xem nguồn gốc & ý nghĩa văn hóa"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    {/* Color Quick Tune Button for Equipped Item */}
                    {isEquipped && (
                      <button
                        onClick={() => setColorPickerItemId(isColorPickerOpen ? null : item.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isColorPickerOpen
                            ? 'bg-[#c93b2b] text-white border-[#c93b2b]'
                            : isLight
                            ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
                        }`}
                        title="Đổi màu truyền thống cho món này"
                      >
                        <Palette className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Equip / Unequip Action Button */}
                    {isEquipped ? (
                      <button
                        onClick={() => onUnequipItem(currentCategoryMeta.slotKey)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 ${
                          isLight
                            ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                            : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-400'
                        }`}
                        title="Tháo món này ra khỏi Avatar"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[10px]">Tháo</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onEquipItem(item)}
                        className="px-2.5 py-1 bg-[#c93b2b] hover:bg-[#b02f20] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Mặc</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Traditional Color Palette Quick Switcher (when expanded) */}
                {isColorPickerOpen && isEquipped && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`mt-2 pt-2 border-t space-y-1.5 animate-fadeIn ${
                      isLight ? 'border-stone-200' : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-semibold ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>
                        Chọn màu truyền thống ngũ hành:
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {itemColor}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                      {TRADITIONAL_COLORS.slice(0, 10).map((col) => (
                        <button
                          key={col.hex}
                          onClick={() => onColorChange(currentCategoryMeta.slotKey, col.hex)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer relative shrink-0 ${
                            itemColor.toLowerCase() === col.hex.toLowerCase()
                              ? 'scale-115 border-[#c93b2b] ring-2 ring-[#c93b2b]/30'
                              : 'border-white/80 dark:border-black/60 hover:scale-105'
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={`${col.vietnameseName} (${col.element})`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. Bottom Equipped Summary Strip */}
      <div
        className={`p-3 border-t flex items-center justify-between gap-2 text-xs transition-colors ${
          isLight ? 'bg-[#fbf9f4] border-[#e7e1d5]' : 'bg-[#141418] border-white/10'
        }`}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-1">
          <span className={`text-[10px] font-semibold uppercase tracking-wider shrink-0 ${
            isLight ? 'text-stone-500' : 'text-zinc-500'
          }`}>
            Đang Mặc:
          </span>
          {categories.map((c) => {
            const itId = outfit[c.idKey] as string | undefined;
            const equippedItem = itId ? wardrobe.find((w) => w.id === itId) : null;
            if (!equippedItem) return null;

            return (
              <span
                key={c.id}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] border whitespace-nowrap ${
                  isLight
                    ? 'bg-white border-stone-200 text-stone-800'
                    : 'bg-white/5 border-white/10 text-zinc-300'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: outfit.colors[c.slotKey] }}
                />
                <span className="truncate max-w-[80px]">{equippedItem.name}</span>
                <button
                  onClick={() => onUnequipItem(c.slotKey)}
                  className="hover:text-rose-500 ml-0.5 cursor-pointer"
                  title={`Tháo ${equippedItem.name}`}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            );
          })}
        </div>

        <button
          onClick={() => {
            categories.forEach((c) => onUnequipItem(c.slotKey));
          }}
          className={`text-[10px] font-medium hover:underline shrink-0 cursor-pointer ${
            isLight ? 'text-stone-500 hover:text-stone-800' : 'text-zinc-500 hover:text-zinc-300'
          }`}
          title="Tháo toàn bộ trang phục về áo cánh quần lụa mặc định"
        >
          Cởi hết
        </button>
      </div>
    </div>
  );
};

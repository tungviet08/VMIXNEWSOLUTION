import React, { useState, useRef } from 'react';
import { ClothingItem, OutfitState } from '../types';
import { 
  Search, 
  Plus, 
  Info, 
  Check, 
  Sparkles, 
  Shirt, 
  Crown, 
  Scissors, 
  Compass, 
  Footprints, 
  Watch,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface WardrobeBrowserProps {
  wardrobe: ClothingItem[];
  outfit: OutfitState;
  onEquipItem: (item: ClothingItem) => void;
  onUnequipItem: (category: keyof OutfitState['colors']) => void;
  onViewItemDetails: (item: ClothingItem) => void;
  onOpenCustomItemModal: () => void;
  theme?: 'dark' | 'light';
}

export const WardrobeBrowser: React.FC<WardrobeBrowserProps> = ({
  wardrobe,
  outfit,
  onEquipItem,
  onUnequipItem,
  onViewItemDetails,
  onOpenCustomItemModal,
  theme = 'dark',
}) => {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isLight = theme === 'light';

  const filterTabs = [
    { id: 'all', label: 'Tất Cả', icon: Sparkles },
    { id: 'ao_dai', label: 'Áo Dài', icon: Shirt },
    { id: 'ngu_than', label: 'Ngũ Thân & Áo Tấc', icon: Crown },
    { id: 'tu_than', label: 'Áo Tứ Thân', icon: Scissors },
    { id: 'nhat_binh_giao_linh', label: 'Nhật Bình & Giao Lĩnh', icon: Compass },
    { id: 'modern_top', label: 'Áo Hiện Đại & Yếm', icon: Shirt },
    { id: 'headwear', label: 'Khăn, Mấn & Nón', icon: Crown },
    { id: 'bottom', label: 'Quần & Chân Váy', icon: Shirt },
    { id: 'footwear', label: 'Giày & Guốc Mộc', icon: Footprints },
    { id: 'accessory', label: 'Phụ Kiện Cung Đình', icon: Watch },
  ];

  const filteredItems = wardrobe.filter((item) => {
    // Tab filter
    if (selectedTab !== 'all') {
      if (selectedTab === 'ao_dai' && item.subType !== 'ao_dai') return false;
      if (selectedTab === 'ngu_than' && item.subType !== 'ngu_than') return false;
      if (selectedTab === 'tu_than' && item.subType !== 'tu_than') return false;
      if (selectedTab === 'nhat_binh_giao_linh' && item.subType !== 'nhat_binh' && item.subType !== 'giao_linh') return false;
      if (selectedTab === 'modern_top' && item.subType !== 'modern_top' && item.category !== 'inner') return false;
      if (selectedTab === 'headwear' && item.category !== 'headwear') return false;
      if (selectedTab === 'bottom' && item.category !== 'bottom') return false;
      if (selectedTab === 'footwear' && item.category !== 'footwear') return false;
      if (selectedTab === 'accessory' && item.category !== 'accessory') return false;
    }

    // Era filter
    if (selectedEra !== 'all' && item.era !== selectedEra) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchEra = item.era.toLowerCase().includes(q);
      const matchOrigin = item.historicalOrigin.toLowerCase().includes(q);
      return matchName || matchDesc || matchEra || matchOrigin;
    }

    return true;
  });

  const isEquipped = (item: ClothingItem) => {
    return (
      outfit.outerId === item.id ||
      outfit.innerId === item.id ||
      outfit.bottomId === item.id ||
      outfit.headwearId === item.id ||
      outfit.footwearId === item.id ||
      outfit.accessoryId === item.id
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Controls Bar */}
      <div
        className={`flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl border shadow-sm transition-colors ${
          isLight
            ? 'bg-[#ffffff] border-[#e8e2d5]'
            : 'bg-[#18181e] border-white/10'
        }`}
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-stone-400' : 'text-zinc-400'}`} />
          <input
            type="text"
            placeholder="Tìm theo tên trang phục, chất liệu, triều đại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#c93b2b] transition-colors ${
              isLight
                ? 'bg-[#faf8f4] border-[#e0d8ca] text-stone-900 placeholder:text-stone-400'
                : 'bg-white/5 border-white/10 text-white placeholder:text-zinc-500'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs cursor-pointer ${
                isLight ? 'text-stone-400 hover:text-stone-700' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Xóa
            </button>
          )}
        </div>

        {/* Era dropdown filter & Custom item button */}
        <div className="flex items-center gap-2">
          <select
            value={selectedEra}
            onChange={(e) => setSelectedEra(e.target.value)}
            className={`px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#c93b2b] cursor-pointer ${
              isLight
                ? 'bg-[#faf8f4] border-[#e0d8ca] text-stone-800'
                : 'bg-[#202026] border-white/10 text-white'
            }`}
          >
            <option value="all">Tất cả thời kỳ</option>
            <option value="Triều Nguyễn (1802–1945)">Triều Nguyễn</option>
            <option value="Triều Lê (1428–1789)">Triều Lê</option>
            <option value="Dân gian Đồng bằng Bắc Bộ">Bắc Bộ Dân Gian</option>
            <option value="Tân thời (1930–1950s)">Tân Thời 1930s</option>
            <option value="Sài Gòn thập niên 1960–1970">Sài Gòn 1960-70</option>
            <option value="Hiện đại / Remix">Hiện Đại / Remix</option>
          </select>

          <button
            onClick={onOpenCustomItemModal}
            className="px-3.5 py-2 bg-[#c93b2b] hover:bg-[#b02f20] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thêm Tùy Chỉnh</span>
          </button>
        </div>
      </div>

      {/* Category Segmented Scrollable Filter with Navigation Controls */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
            Thanh điều hướng danh mục trang phục:
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleScrollCategories('left')}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                isLight
                  ? 'bg-[#f4efe6] hover:bg-[#ebe3d4] text-stone-700 border-[#ded6c5]'
                  : 'bg-white/5 hover:bg-white/15 text-zinc-300 border-white/10'
              }`}
              title="Cuộn danh mục sang trái"
              aria-label="Cuộn sang trái"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleScrollCategories('right')}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                isLight
                  ? 'bg-[#f4efe6] hover:bg-[#ebe3d4] text-stone-700 border-[#ded6c5]'
                  : 'bg-white/5 hover:bg-white/15 text-zinc-300 border-white/10'
              }`}
              title="Cuộn danh mục sang phải"
              aria-label="Cuộn sang phải"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          ref={categoryScrollRef}
          className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scroll-smooth"
        >
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? isLight
                      ? 'bg-stone-900 text-white shadow-md font-semibold'
                      : 'bg-white text-zinc-900 shadow-md font-semibold'
                    : isLight
                    ? 'bg-[#f4efe6] text-stone-600 hover:text-stone-900 hover:bg-[#ebe3d4] border border-[#ded6c5]'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wardrobe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const equipped = isEquipped(item);

          return (
            <div
              key={item.id}
              className={`group rounded-2xl border transition-all duration-200 p-4 flex flex-col justify-between shadow-sm hover:shadow-md ${
                equipped
                  ? isLight
                    ? 'bg-[#ffffff] border-[#c93b2b] ring-1 ring-[#c93b2b]/40'
                    : 'bg-[#16161b] border-[#c93b2b] ring-1 ring-[#c93b2b]/50'
                  : isLight
                  ? 'bg-[#ffffff] hover:bg-[#faf7f2] border-[#e8e2d5]'
                  : 'bg-[#16161b] hover:bg-[#1a1a20] border-white/10'
              }`}
            >
              <div>
                {/* Header Swatch & Badges */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm shrink-0"
                      style={{ backgroundColor: item.defaultColor }}
                      title={`Màu mặc định: ${item.defaultColor}`}
                    />
                    <span className={`text-[11px] font-medium truncate ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                      {item.era}
                    </span>
                  </div>

                  {item.isTraditional ? (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium border shrink-0 ${
                        isLight
                          ? 'bg-[#c93b2b]/10 text-[#c93b2b] border-[#c93b2b]/25'
                          : 'bg-[#c93b2b]/15 text-[#ff7566] border-[#c93b2b]/25'
                      }`}
                    >
                      Cổ Phục
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium border shrink-0 ${
                        isLight
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-blue-500/15 text-blue-300 border-blue-500/25'
                      }`}
                    >
                      Remix
                    </span>
                  )}
                </div>

                {/* Name */}
                <h4
                  className={`font-serif text-sm font-bold transition-colors mb-1 line-clamp-1 ${
                    isLight
                      ? 'text-stone-900 group-hover:text-[#c93b2b]'
                      : 'text-white group-hover:text-[#ff7566]'
                  }`}
                >
                  {item.name}
                </h4>

                {/* Description */}
                <p className={`text-xs line-clamp-2 leading-relaxed mb-3 ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
                  {item.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className={`flex items-center justify-between gap-2 pt-3 border-t ${isLight ? 'border-stone-100' : 'border-white/5'}`}>
                <button
                  onClick={() => onViewItemDetails(item)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                    isLight
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white'
                  }`}
                  title="Xem nguồn gốc lịch sử, ý nghĩa và quy chuẩn cổ truyền"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Ý Nghĩa</span>
                </button>

                <button
                  onClick={() => {
                    if (equipped) {
                      onUnequipItem(item.category as any);
                    } else {
                      onEquipItem(item);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    equipped
                      ? isLight
                        ? 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      : 'bg-[#c93b2b] text-white hover:bg-[#b02f20] shadow-sm'
                  }`}
                >
                  {equipped ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Đang Mặc</span>
                    </>
                  ) : (
                    <span>Mặc Vào</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className={`text-center py-16 space-y-2 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
          <Shirt className="w-10 h-10 mx-auto" />
          <p className="text-sm">Không tìm thấy trang phục phù hợp với bộ lọc.</p>
          <p className="text-xs">Thử xóa từ khóa tìm kiếm hoặc chọn danh mục khác nhé!</p>
        </div>
      )}
    </div>
  );
};

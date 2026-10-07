import React, { useState } from 'react';
import { ClothingItem, OutfitState, CulturalEra } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Info, 
  Check, 
  Sparkles, 
  Shirt, 
  Crown, 
  Scissors, 
  Compass,
  Footprints,
  Watch
} from 'lucide-react';

interface WardrobeBrowserProps {
  wardrobe: ClothingItem[];
  outfit: OutfitState;
  onEquipItem: (item: ClothingItem) => void;
  onUnequipItem: (category: keyof OutfitState['colors']) => void;
  onViewItemDetails: (item: ClothingItem) => void;
  onOpenCustomItemModal: () => void;
}

export const WardrobeBrowser: React.FC<WardrobeBrowserProps> = ({
  wardrobe,
  outfit,
  onEquipItem,
  onUnequipItem,
  onViewItemDetails,
  onOpenCustomItemModal,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<string>('all');

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
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 bg-[#18181e] rounded-2xl border border-white/10 shadow-lg">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên trang phục, chất liệu, triều đại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#c93b2b]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs cursor-pointer"
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
            className="px-3 py-2 bg-[#202026] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#c93b2b] cursor-pointer"
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

      {/* Category Segmented Scrollable Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white text-zinc-900 shadow-md font-semibold'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Wardrobe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const equipped = isEquipped(item);

          return (
            <div
              key={item.id}
              className={`group bg-[#16161b] hover:bg-[#1a1a20] rounded-2xl border transition-all duration-200 p-4 flex flex-col justify-between shadow-md hover:shadow-xl ${
                equipped ? 'border-[#c93b2b] ring-1 ring-[#c93b2b]/50' : 'border-white/10'
              }`}
            >
              <div>
                {/* Header Swatch & Badges */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: item.defaultColor }}
                      title={`Màu mặc định: ${item.defaultColor}`}
                    />
                    <span className="text-[11px] text-zinc-400 font-medium">
                      {item.era}
                    </span>
                  </div>

                  {item.isTraditional ? (
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#c93b2b]/15 text-[#ff7566] border border-[#c93b2b]/25 rounded font-medium">
                      Cổ Phục
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/15 text-blue-300 border border-blue-500/25 rounded font-medium">
                      Remix
                    </span>
                  )}
                </div>

                {/* Name */}
                <h4 className="font-serif text-sm font-bold text-white group-hover:text-[#ff7566] transition-colors mb-1 line-clamp-1">
                  {item.name}
                </h4>

                {/* Description */}
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/5">
                <button
                  onClick={() => onViewItemDetails(item)}
                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                  title="Xem nguồn gốc lịch sử, ý nghĩa và quy chuẩn cổ truyền"
                >
                  <Info className="w-3.5 h-3.5 text-zinc-400" />
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
                      ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      : 'bg-[#c93b2b] text-white hover:bg-[#b02f20] shadow-sm'
                  }`}
                >
                  {equipped ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
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
        <div className="text-center py-16 text-zinc-500 space-y-2">
          <Shirt className="w-10 h-10 mx-auto text-zinc-600" />
          <p className="text-sm">Không tìm thấy trang phục phù hợp với bộ lọc.</p>
          <p className="text-xs text-zinc-600">Thử xóa từ khóa tìm kiếm hoặc chọn danh mục khác nhé!</p>
        </div>
      )}
    </div>
  );
};

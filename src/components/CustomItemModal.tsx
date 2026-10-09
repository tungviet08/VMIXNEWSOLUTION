import React, { useState, useEffect } from 'react';
import { ClothingItem, GarmentCategory, CulturalEra } from '../types';
import { X, Plus, Sparkles } from 'lucide-react';
import { TRADITIONAL_COLORS } from '../data/colorsData';

interface CustomItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: ClothingItem) => void;
  theme?: 'dark' | 'light';
}

export const CustomItemModal: React.FC<CustomItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  theme = 'dark',
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<GarmentCategory>('outer');
  const [isTraditional, setIsTraditional] = useState(true);
  const [era, setEra] = useState<CulturalEra>('Triều Nguyễn (1802–1945)');
  const [defaultColor, setDefaultColor] = useState(TRADITIONAL_COLORS[0].hex);
  const [description, setDescription] = useState('');
  const [historicalOrigin, setHistoricalOrigin] = useState('');
  const [symbolism, setSymbolism] = useState('');
  const [traditionalEtiquette, setTraditionalEtiquette] = useState('');
  const [remixTips, setRemixTips] = useState('');

  const isLight = theme === 'light';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: ClothingItem = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      category,
      isTraditional,
      era,
      defaultColor,
      description: description.trim() || 'Trang phục tùy chỉnh sáng tạo bởi người dùng.',
      historicalOrigin: historicalOrigin.trim() || 'Tác phẩm sáng tạo cá nhân kết hợp chất liệu văn hóa Việt Nam.',
      symbolism: symbolism.trim() || 'Tự do biểu đạt nghệ thuật đương đại.',
      traditionalEtiquette: traditionalEtiquette.trim() || 'Mặc với sự tự hào và tự tin.',
      remixTips: remixTips.trim() || 'Phối cùng phụ kiện tối giản để tôn lên phom dáng độc bản.',
      silhouetteSvgType: category === 'outer' ? 'ngu_than_chen' : category === 'bottom' ? 'quan_lua' : 'modern_loafer',
      isCustom: true,
      genderContext: 'unisex'
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-colors ${
          isLight ? 'bg-white border-stone-200 text-stone-900' : 'bg-[#16161b] border-white/10 text-zinc-300'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-5 border-b ${
            isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#1c1c22] border-white/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#c93b2b]" />
            <h3 className={`font-serif text-lg font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
              Thêm Trang Phục Tùy Chỉnh
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-stone-400 hover:text-stone-700' : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm scrollbar-thin">
          <div>
            <label className={`block mb-1 font-medium ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Tên trang phục *</label>
            <input
              type="text"
              required
              placeholder="VD: Áo Ngũ Thân Dạ Tweed Cổ Đứng..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:border-[#c93b2b] ${
                isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-white/5 border-white/10 text-white'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block mb-1 font-medium ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Phân loại</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GarmentCategory)}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#c93b2b] ${
                  isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#202026] border-white/10 text-white'
                }`}
              >
                <option value="outer">Áo Khoác / Áo Ngoài</option>
                <option value="inner">Áo Trong / Yếm</option>
                <option value="bottom">Quần / Chân Váy</option>
                <option value="headwear">Khăn / Nón</option>
                <option value="footwear">Giày / Guốc</option>
                <option value="accessory">Phụ Kiện</option>
              </select>
            </div>

            <div>
              <label className={`block mb-1 font-medium ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Thời kỳ / Nguồn gốc</label>
              <select
                value={era}
                onChange={(e) => setEra(e.target.value as CulturalEra)}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#c93b2b] ${
                  isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#202026] border-white/10 text-white'
                }`}
              >
                <option value="Triều Nguyễn (1802–1945)">Triều Nguyễn</option>
                <option value="Triều Lê (1428–1789)">Triều Lê</option>
                <option value="Dân gian Đồng bằng Bắc Bộ">Bắc Bộ Dân Gian</option>
                <option value="Tân thời (1930–1950s)">Tân Thời 1930s</option>
                <option value="Hiện đại / Remix">Hiện Đại / Remix</option>
                <option value="Tùy chỉnh">Tùy Chỉnh</option>
              </select>
            </div>
          </div>

          {/* Color & Heritage tag */}
          <div
            className={`flex items-center justify-between gap-4 p-3 rounded-xl border ${
              isLight ? 'bg-stone-50 border-stone-200' : 'bg-white/5 border-white/5'
            }`}
          >
            <div>
              <label className={`block text-xs mb-1 font-medium ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Màu sắc chủ đạo</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={defaultColor}
                  onChange={(e) => setDefaultColor(e.target.value)}
                  className="w-7 h-7 rounded border border-black/20 cursor-pointer bg-transparent"
                />
                <span className={`font-mono text-xs ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>{defaultColor}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className={`text-xs cursor-pointer select-none ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>
                <input
                  type="checkbox"
                  checked={isTraditional}
                  onChange={(e) => setIsTraditional(e.target.checked)}
                  className="mr-1.5 accent-[#c93b2b]"
                />
                Trang phục cổ truyền thuần túy
              </label>
            </div>
          </div>

          <div>
            <label className={`block mb-1 font-medium ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Mô tả ngắn</label>
            <input
              type="text"
              placeholder="Mô tả cấu trúc, phom dáng hoặc chất liệu..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-[#c93b2b] ${
                isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-white/5 border-white/10 text-white'
              }`}
            />
          </div>

          <div>
            <label className={`block mb-1 font-medium ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Câu chuyện lịch sử & Ý nghĩa văn hóa</label>
            <textarea
              rows={2}
              placeholder="Nguồn cảm hứng, ý nghĩa văn hóa đằng sau món trang phục này..."
              value={symbolism}
              onChange={(e) => setSymbolism(e.target.value)}
              className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-[#c93b2b] resize-none ${
                isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-white/5 border-white/10 text-white'
              }`}
            />
          </div>

          <div>
            <label className={`block mb-1 font-medium ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Gen Z Remix Tips</label>
            <input
              type="text"
              placeholder="Gợi ý cách mix đồ hiện đại..."
              value={remixTips}
              onChange={(e) => setRemixTips(e.target.value)}
              className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-[#c93b2b] ${
                isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-white/5 border-white/10 text-white'
              }`}
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs cursor-pointer ${
                isLight ? 'text-stone-500 hover:text-stone-800' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#c93b2b] hover:bg-[#b02f20] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#c93b2b]/20 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thêm Vào Tủ Đồ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

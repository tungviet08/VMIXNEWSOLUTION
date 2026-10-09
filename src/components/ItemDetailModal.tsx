import React, { useEffect } from 'react';
import { ClothingItem } from '../types';
import { X, BookOpen, Compass, ShieldAlert, Sparkles, Shirt } from 'lucide-react';

interface ItemDetailModalProps {
  isOpen: boolean;
  item: ClothingItem | null;
  onClose: () => void;
  onEquip?: (item: ClothingItem) => void;
  isEquipped?: boolean;
  theme?: 'dark' | 'light';
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  isOpen,
  item,
  onClose,
  onEquip,
  isEquipped = false,
  theme = 'dark',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const isLight = theme === 'light';

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn transition-colors ${
        isLight ? 'bg-stone-900/35' : 'bg-black/75'
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
          isLight
            ? 'bg-[#ffffff] border-[#e6e1d8] text-[#1c1917]'
            : 'bg-[#16161b] border-white/10 text-zinc-300'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between p-5 border-b transition-colors ${
            isLight
              ? 'bg-[#f8f5ee] border-[#e6e1d8]'
              : 'bg-[#1c1c22] border-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center shadow-sm shrink-0"
              style={{ backgroundColor: item.defaultColor }}
            >
              <Shirt className="w-5 h-5 text-white/95 drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h3
                  className={`font-serif text-lg font-bold tracking-tight ${
                    isLight ? 'text-[#1c1917]' : 'text-white'
                  }`}
                >
                  {item.name}
                </h3>
                {item.isTraditional ? (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                      isLight
                        ? 'bg-[#c93b2b]/10 text-[#c93b2b] border-[#c93b2b]/30'
                        : 'bg-[#c93b2b]/20 text-[#ff6b5b] border-[#c93b2b]/30'
                    }`}
                  >
                    Cổ Phục
                  </span>
                ) : (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                      isLight
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}
                  >
                    Remix Hiện Đại
                  </span>
                )}
              </div>
              <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                {item.era}{' '}
                {item.genderContext &&
                  `· ${
                    item.genderContext === 'unisex'
                      ? 'Phi giới tính (Unisex)'
                      : item.genderContext === 'female'
                      ? 'Nữ giới'
                      : 'Nam giới'
                  }`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isLight
                ? 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/60'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            title="Đóng cửa sổ tra cứu (hoặc bấm phím Esc)"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed scrollbar-thin">
          {/* Brief Description */}
          <div
            className={`p-3.5 rounded-xl border ${
              isLight
                ? 'bg-[#fbf9f4] border-[#ebe5d8] text-stone-800'
                : 'bg-white/5 border-white/5 text-zinc-200'
            }`}
          >
            <p className="italic">{item.description}</p>
          </div>

          {/* Historical Origin */}
          <div className="space-y-1.5">
            <div
              className={`flex items-center gap-2 font-semibold text-xs sm:text-sm ${
                isLight ? 'text-amber-700' : 'text-amber-400'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <h4>Nguồn Gốc Lịch Sử & Triều Đại</h4>
            </div>
            <p className={`pl-6 leading-relaxed ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>
              {item.historicalOrigin}
            </p>
          </div>

          {/* Cultural Symbolism */}
          <div className="space-y-1.5">
            <div
              className={`flex items-center gap-2 font-semibold text-xs sm:text-sm ${
                isLight ? 'text-emerald-700' : 'text-emerald-400'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <h4>Ý Nghĩa Cấu Trúc & Biểu Tượng</h4>
            </div>
            <p className={`pl-6 leading-relaxed ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>
              {item.symbolism}
            </p>
          </div>

          {/* Traditional Etiquette */}
          <div className="space-y-1.5">
            <div
              className={`flex items-center gap-2 font-semibold text-xs sm:text-sm ${
                isLight ? 'text-rose-700' : 'text-rose-400'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <h4>Quy Chuẩn Cổ Truyền & Kiêng Kỵ Cần Biết</h4>
            </div>
            <p className={`pl-6 leading-relaxed ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>
              {item.traditionalEtiquette}
            </p>
          </div>

          {/* Gen Z Remix Tips */}
          <div
            className={`space-y-1.5 p-3.5 rounded-xl border ${
              isLight
                ? 'bg-gradient-to-r from-[#c93b2b]/5 to-amber-500/5 border-[#c93b2b]/20 text-stone-800'
                : 'bg-gradient-to-r from-[#c93b2b]/10 to-purple-500/10 border-[#c93b2b]/20 text-zinc-200'
            }`}
          >
            <div
              className={`flex items-center gap-2 font-semibold text-xs sm:text-sm ${
                isLight ? 'text-[#c93b2b]' : 'text-[#ff7566]'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <h4>Gen Z Styling & Remix Tips</h4>
            </div>
            <p className="leading-relaxed pl-6">{item.remixTips}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className={`p-4 border-t flex items-center justify-between gap-3 ${
            isLight
              ? 'bg-[#f8f5ee] border-[#e6e1d8]'
              : 'bg-[#141418] border-white/10'
          }`}
        >
          <span className={`text-xs ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
            Màu mặc định:{' '}
            <span className={`font-mono font-medium ${isLight ? 'text-stone-800' : 'text-zinc-200'}`}>
              {item.defaultColor}
            </span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isLight
                  ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Đóng
            </button>
            {onEquip && (
              <button
                onClick={() => {
                  onEquip(item);
                  onClose();
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isEquipped
                    ? isLight
                      ? 'bg-stone-300 text-stone-800 hover:bg-stone-400'
                      : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    : 'bg-[#c93b2b] text-white hover:bg-[#b02f20] shadow-md shadow-[#c93b2b]/20'
                }`}
              >
                {isEquipped ? 'Đang Mặc (Mặc lại)' : 'Thử Món Này Lên Người'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

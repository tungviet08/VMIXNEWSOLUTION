import React from 'react';
import { ClothingItem } from '../types';
import { X, BookOpen, Compass, ShieldAlert, Sparkles, Shirt } from 'lucide-react';

interface ItemDetailModalProps {
  item: ClothingItem | null;
  onClose: () => void;
  onEquip?: (item: ClothingItem) => void;
  isEquipped?: boolean;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onEquip,
  isEquipped = false,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#16161b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-white/10 bg-[#1c1c22]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center shadow-inner"
              style={{ backgroundColor: item.defaultColor }}
            >
              <Shirt className="w-5 h-5 text-white/90 drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-serif text-lg font-bold text-white tracking-tight">
                  {item.name}
                </h3>
                {item.isTraditional ? (
                  <span className="text-[10px] px-2 py-0.5 bg-[#c93b2b]/20 text-[#ff6b5b] border border-[#c93b2b]/30 rounded font-medium">
                    Cổ Phục
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded font-medium">
                    Remix Hiện Đại
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                {item.era} {item.genderContext && `· ${item.genderContext === 'unisex' ? 'Phi giới tính (Unisex)' : item.genderContext === 'female' ? 'Nữ giới' : 'Nam giới'}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed scrollbar-thin">
          {/* Brief Description */}
          <div className="p-3.5 bg-white/5 rounded-xl border border-white/5">
            <p className="italic text-zinc-200">{item.description}</p>
          </div>

          {/* Historical Origin */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs sm:text-sm">
              <BookOpen className="w-4 h-4" />
              <h4>Nguồn Gốc Lịch Sử & Triều Đại</h4>
            </div>
            <p className="pl-6 text-zinc-300 leading-relaxed">
              {item.historicalOrigin}
            </p>
          </div>

          {/* Cultural Symbolism */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs sm:text-sm">
              <Compass className="w-4 h-4" />
              <h4>Ý Nghĩa Cấu Trúc & Biểu Tượng</h4>
            </div>
            <p className="pl-6 text-zinc-300 leading-relaxed">
              {item.symbolism}
            </p>
          </div>

          {/* Traditional Etiquette */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs sm:text-sm">
              <ShieldAlert className="w-4 h-4" />
              <h4>Quy Chuẩn Cổ Truyền & Kiêng Kỵ Cần Biết</h4>
            </div>
            <p className="pl-6 text-zinc-300 leading-relaxed">
              {item.traditionalEtiquette}
            </p>
          </div>

          {/* Gen Z Remix Tips */}
          <div className="space-y-1.5 p-3.5 bg-gradient-to-r from-[#c93b2b]/10 to-purple-500/10 rounded-xl border border-[#c93b2b]/20">
            <div className="flex items-center gap-2 text-[#ff7566] font-semibold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4" />
              <h4>Gen Z Styling & Remix Tips</h4>
            </div>
            <p className="text-zinc-200 leading-relaxed pl-6">
              {item.remixTips}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-[#141418] flex items-center justify-between gap-3">
          <span className="text-xs text-zinc-400">
            Màu mặc định: <span className="font-mono text-zinc-300">{item.defaultColor}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
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
                    ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
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

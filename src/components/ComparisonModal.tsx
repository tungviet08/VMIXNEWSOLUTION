import React, { useState } from 'react';
import { OutfitState, ClothingItem, ColorHarmonyResult } from '../types';
import { analyzeColorHarmony } from '../utils/colorHarmony';
import { 
  X, 
  SplitSquareVertical, 
  ArrowLeftRight, 
  Check, 
  Sparkles, 
  Shirt, 
  Compass,
  ArrowRight
} from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lookA: OutfitState;
  lookB: OutfitState;
  itemsMap: Record<string, ClothingItem>;
  onApplyLook: (outfit: OutfitState) => void;
  onSaveAsLookB: () => void;
  theme?: 'dark' | 'light';
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  lookA,
  lookB,
  itemsMap,
  onApplyLook,
  onSaveAsLookB,
  theme = 'dark',
}) => {
  if (!isOpen) return null;

  const isLight = theme === 'light';
  const harmonyA = analyzeColorHarmony(lookA);
  const harmonyB = analyzeColorHarmony(lookB);

  const getSlotItem = (outfit: OutfitState, slot: keyof OutfitState['colors']) => {
    const idKey = `${slot}Id` as keyof OutfitState;
    const itemId = outfit[idKey] as string | undefined;
    return itemId ? itemsMap[itemId] : null;
  };

  const slots: Array<{ key: keyof OutfitState['colors']; label: string }> = [
    { key: 'outer', label: 'Áo Ngoài' },
    { key: 'inner', label: 'Áo Trong / Yếm' },
    { key: 'bottom', label: 'Quần / Váy' },
    { key: 'headwear', label: 'Khăn / Mấn / Nón' },
    { key: 'footwear', label: 'Giày / Guốc' },
    { key: 'accessory', label: 'Phụ Kiện' },
  ];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn transition-colors ${
        isLight ? 'bg-stone-900/35' : 'bg-black/75'
      }`}
    >
      <div
        className={`relative w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden max-h-[92vh] flex flex-col transition-colors ${
          isLight
            ? 'bg-white border-[#e7e1d5] text-[#1f1c19]'
            : 'bg-[#16161b] border-white/10 text-white'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 border-b flex items-center justify-between transition-colors ${
            isLight
              ? 'bg-[#f7f4ed] border-[#e7e1d5]'
              : 'bg-[#1c1c22] border-white/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <SplitSquareVertical className="w-5 h-5 text-[#c93b2b]" />
            <div>
              <h3 className={`font-serif text-lg font-bold ${isLight ? 'text-[#1f1c19]' : 'text-white'}`}>
                So Sánh Song Song 2 Phương Án Phối Đồ
              </h3>
              <p className={`text-xs ${isLight ? 'text-[#6b6357]' : 'text-zinc-400'}`}>
                Đối chiếu chi tiết giữa Look A và Look B để tìm ra phương án tối ưu nhất
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSaveAsLookB}
              className={`px-3 py-1.5 text-xs rounded-xl border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-stone-100 text-stone-800 border-[#ded6c5]'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
              }`}
              title="Lưu outfit hiện tại làm Look B để so sánh"
            >
              Cập Nhật Look B
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isLight
                  ? 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/60'
                  : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Body */}
        <div className={`p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm scrollbar-thin ${
          isLight ? 'text-[#2b2520]' : 'text-zinc-300'
        }`}>
          {/* Top Score Comparison Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* LOOK A CARD */}
            <div
              className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                isLight
                  ? 'bg-[#fbf9f4] border-[#e7e1d5] shadow-xs'
                  : 'bg-gradient-to-br from-[#1d1d26] to-[#16161c] border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-serif font-bold text-base ${isLight ? 'text-[#1f1c19]' : 'text-white'}`}>
                  Look A (Đang Chọn)
                </span>
                <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold tabular-nums ${
                  isLight
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  Hòa sắc {harmonyA.score}/100
                </span>
              </div>
              <div className={`text-xs ${isLight ? 'text-[#6b6357]' : 'text-zinc-400'}`}>
                <span className={isLight ? 'text-[#1f1c19] font-medium' : 'text-zinc-200'}>
                  Hành chủ đạo: {harmonyA.dominantElement}
                </span> · {harmonyA.grade}
              </div>
              <button
                onClick={() => {
                  onApplyLook(lookA);
                  onClose();
                }}
                className="w-full py-2 bg-[#c93b2b] hover:bg-[#b02f20] text-white rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
              >
                Giữ Nguyên Look A
              </button>
            </div>

            {/* LOOK B CARD */}
            <div
              className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                isLight
                  ? 'bg-[#fbf9f4] border-[#e7e1d5] shadow-xs'
                  : 'bg-gradient-to-br from-[#1d1d26] to-[#16161c] border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-serif font-bold text-base ${isLight ? 'text-[#1f1c19]' : 'text-white'}`}>
                  Look B (Phương Án 2)
                </span>
                <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold tabular-nums ${
                  isLight
                    ? 'bg-cyan-50 text-cyan-800 border-cyan-300'
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                }`}>
                  Hòa sắc {harmonyB.score}/100
                </span>
              </div>
              <div className={`text-xs ${isLight ? 'text-[#6b6357]' : 'text-zinc-400'}`}>
                <span className={isLight ? 'text-[#1f1c19] font-medium' : 'text-zinc-200'}>
                  Hành chủ đạo: {harmonyB.dominantElement}
                </span> · {harmonyB.grade}
              </div>
              <button
                onClick={() => {
                  onApplyLook(lookB);
                  onClose();
                }}
                className={`w-full py-2 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer border ${
                  isLight
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                }`}
              >
                Chuyển Sang Mặc Look B
              </button>
            </div>
          </div>

          {/* Breakdown Table By Slots */}
          <div
            className={`border rounded-2xl overflow-hidden transition-colors ${
              isLight
                ? 'bg-white border-[#e7e1d5]'
                : 'bg-[#141418] border-white/10'
            }`}
          >
            <div
              className={`grid grid-cols-3 p-3 border-b text-xs font-semibold uppercase tracking-wider ${
                isLight
                  ? 'bg-[#f7f4ed] border-[#e7e1d5] text-[#6b6357]'
                  : 'bg-white/5 border-white/10 text-zinc-400'
              }`}
            >
              <div>Vị Trí Trang Phục</div>
              <div>Look A</div>
              <div>Look B</div>
            </div>

            <div className={`divide-y text-xs ${isLight ? 'divide-stone-100' : 'divide-white/5'}`}>
              {slots.map(({ key, label }) => {
                const itemA = getSlotItem(lookA, key);
                const itemB = getSlotItem(lookB, key);
                const isDifferent = itemA?.id !== itemB?.id || lookA.colors[key] !== lookB.colors[key];

                return (
                  <div
                    key={key}
                    className={`grid grid-cols-3 p-3 items-center transition-colors ${
                      isDifferent
                        ? isLight
                          ? 'bg-amber-50/40'
                          : 'bg-white/[0.02]'
                        : ''
                    }`}
                  >
                    <div className={`font-medium flex items-center gap-1.5 ${isLight ? 'text-[#6b6357]' : 'text-zinc-400'}`}>
                      <span>{label}</span>
                      {isDifferent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Khác biệt giữa 2 look" />
                      )}
                    </div>

                    {/* Look A item */}
                    <div className="flex items-center gap-2">
                      {itemA ? (
                        <>
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 shadow-xs shrink-0"
                            style={{ backgroundColor: lookA.colors[key] }}
                          />
                          <span className={`font-medium truncate max-w-[140px] ${isLight ? 'text-[#1f1c19]' : 'text-white'}`}>
                            {itemA.name}
                          </span>
                        </>
                      ) : (
                        <span className={isLight ? 'text-stone-400 italic' : 'text-zinc-600 italic'}>Trống</span>
                      )}
                    </div>

                    {/* Look B item */}
                    <div className="flex items-center gap-2">
                      {itemB ? (
                        <>
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 shadow-xs shrink-0"
                            style={{ backgroundColor: lookB.colors[key] }}
                          />
                          <span className={`font-medium truncate max-w-[140px] ${isLight ? 'text-[#1f1c19]' : 'text-white'}`}>
                            {itemB.name}
                          </span>
                        </>
                      ) : (
                        <span className={isLight ? 'text-stone-400 italic' : 'text-zinc-600 italic'}>Trống</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  lookA,
  lookB,
  itemsMap,
  onApplyLook,
  onSaveAsLookB,
}) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#16161b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#1c1c22] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SplitSquareVertical className="w-5 h-5 text-[#c93b2b]" />
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                So Sánh Song Song 2 Phương Án Phối Đồ
              </h3>
              <p className="text-xs text-zinc-400">
                Đối chiếu chi tiết giữa Look A và Look B để tìm ra phương án tối ưu nhất
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSaveAsLookB}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs rounded-xl border border-white/10 transition-colors cursor-pointer"
              title="Lưu outfit hiện tại làm Look B để so sánh"
            >
              Cập Nhật Look B
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-zinc-300 scrollbar-thin">
          {/* Top Score Comparison Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* LOOK A CARD */}
            <div className="p-4 bg-gradient-to-br from-[#1d1d26] to-[#16161c] rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-base text-white">Look A (Đang Chọn)</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold tabular-nums">
                  Hòa sắc {harmonyA.score}/100
                </span>
              </div>
              <div className="text-xs text-zinc-400">
                <span className="text-zinc-200">Hành chủ đạo: {harmonyA.dominantElement}</span> · {harmonyA.grade}
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
            <div className="p-4 bg-gradient-to-br from-[#1d1d26] to-[#16161c] rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-base text-white">Look B (Phương Án 2)</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold tabular-nums">
                  Hòa sắc {harmonyB.score}/100
                </span>
              </div>
              <div className="text-xs text-zinc-400">
                <span className="text-zinc-200">Hành chủ đạo: {harmonyB.dominantElement}</span> · {harmonyB.grade}
              </div>
              <button
                onClick={() => {
                  onApplyLook(lookB);
                  onClose();
                }}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
              >
                Chuyển Sang Mặc Look B
              </button>
            </div>
          </div>

          {/* Breakdown Table By Slots */}
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#141418]">
            <div className="grid grid-cols-3 p-3 bg-white/5 border-b border-white/10 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <div>Vị Trí Trang Phục</div>
              <div>Look A</div>
              <div>Look B</div>
            </div>

            <div className="divide-y divide-white/5 text-xs">
              {slots.map(({ key, label }) => {
                const itemA = getSlotItem(lookA, key);
                const itemB = getSlotItem(lookB, key);
                const isDifferent = itemA?.id !== itemB?.id || lookA.colors[key] !== lookB.colors[key];

                return (
                  <div
                    key={key}
                    className={`grid grid-cols-3 p-3 items-center transition-colors ${
                      isDifferent ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    <div className="font-medium text-zinc-400 flex items-center gap-1.5">
                      <span>{label}</span>
                      {isDifferent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Khác biệt giữa 2 look" />
                      )}
                    </div>

                    {/* Look A item */}
                    <div className="flex items-center gap-2">
                      {itemA ? (
                        <>
                          <span
                            className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: lookA.colors[key] }}
                          />
                          <span className="font-medium text-white truncate max-w-[140px]">
                            {itemA.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-zinc-600 italic">Trống</span>
                      )}
                    </div>

                    {/* Look B item */}
                    <div className="flex items-center gap-2">
                      {itemB ? (
                        <>
                          <span
                            className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: lookB.colors[key] }}
                          />
                          <span className="font-medium text-white truncate max-w-[140px]">
                            {itemB.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-zinc-600 italic">Trống</span>
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

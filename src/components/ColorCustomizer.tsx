import React, { useState } from 'react';
import { OutfitState } from '../types';
import { TRADITIONAL_COLORS } from '../data/colorsData';
import { Palette, Pipette } from 'lucide-react';

interface ColorCustomizerProps {
  outfit: OutfitState;
  onColorChange: (category: keyof OutfitState['colors'], colorHex: string) => void;
}

export const ColorCustomizer: React.FC<ColorCustomizerProps> = ({
  outfit,
  onColorChange,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<keyof OutfitState['colors']>('outer');
  const [hoveredColor, setHoveredColor] = useState<typeof TRADITIONAL_COLORS[0] | null>(null);

  const slotLabels: Record<keyof OutfitState['colors'], string> = {
    outer: 'Áo Khoác / Áo Ngoài',
    inner: 'Lớp Lót / Áo Trong',
    bottom: 'Quần / Váy',
    headwear: 'Khăn Đóng / Nón',
    footwear: 'Guốc / Giày Bốt',
    accessory: 'Phụ Kiện / Quạt',
  };

  const currentColor = outfit.colors[selectedSlot];

  return (
    <div className="bg-[#18181e] rounded-2xl border border-white/10 p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#c93b2b]" />
          <h3 className="font-semibold text-white text-sm">Hòa Sắc Cổ Truyền Việt Nam</h3>
        </div>
        <span className="text-[11px] text-zinc-400">Hệ màu tự nhiên & Ngũ Hành</span>
      </div>

      {/* Slot Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
        {(Object.keys(slotLabels) as Array<keyof OutfitState['colors']>).map((slot) => {
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/30"
                style={{ backgroundColor: outfit.colors[slot] }}
              />
              <span>{slotLabels[slot]}</span>
            </button>
          );
        })}
      </div>

      {/* Palette Color Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-3">
        {TRADITIONAL_COLORS.map((col) => {
          const isCurrent = currentColor.toUpperCase() === col.hex.toUpperCase();
          return (
            <button
              key={col.hex}
              onClick={() => onColorChange(selectedSlot, col.hex)}
              onMouseEnter={() => setHoveredColor(col)}
              onMouseLeave={() => setHoveredColor(null)}
              className={`group relative flex flex-col items-center justify-center p-1 rounded-xl transition-transform hover:scale-110 cursor-pointer ${
                isCurrent ? 'ring-2 ring-white scale-105' : ''
              }`}
              title={`${col.vietnameseName} (${col.element})`}
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shadow-sm border border-white/10 group-hover:border-white/40 transition-colors flex items-center justify-center"
                style={{ backgroundColor: col.hex }}
              >
                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white shadow" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Color Input & Color Story Callout */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-zinc-300 cursor-pointer transition-colors">
            <Pipette className="w-3.5 h-3.5 text-zinc-400" />
            <span>Màu tùy chỉnh</span>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => onColorChange(selectedSlot, e.target.value)}
              className="w-5 h-5 opacity-0 absolute cursor-pointer"
            />
          </label>
          <span className="font-mono text-zinc-400 text-[11px] uppercase">
            {currentColor}
          </span>
        </div>

        {/* Story note */}
        <div className="text-right text-[11px] text-zinc-400 truncate max-w-[240px]">
          {hoveredColor ? (
            <span className="text-zinc-200">
              {hoveredColor.vietnameseName} · Hành {hoveredColor.element}
            </span>
          ) : (
            <span>Chọn màu để nhuộm lớp trang phục</span>
          )}
        </div>
      </div>
    </div>
  );
};

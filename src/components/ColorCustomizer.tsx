import React, { useState, useRef } from 'react';
import { OutfitState } from '../types';
import { TRADITIONAL_COLORS } from '../data/colorsData';
import { Palette, Pipette, ChevronLeft, ChevronRight } from 'lucide-react';

interface ColorCustomizerProps {
  outfit: OutfitState;
  onColorChange: (category: keyof OutfitState['colors'], colorHex: string) => void;
  theme?: 'dark' | 'light';
}

export const ColorCustomizer: React.FC<ColorCustomizerProps> = ({
  outfit,
  onColorChange,
  theme = 'dark',
}) => {
  const [selectedSlot, setSelectedSlot] = useState<keyof OutfitState['colors']>('outer');
  const [hoveredColor, setHoveredColor] = useState<typeof TRADITIONAL_COLORS[0] | null>(null);
  const slotScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollSlots = (direction: 'left' | 'right') => {
    if (slotScrollRef.current) {
      const scrollAmount = direction === 'left' ? -160 : 160;
      slotScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isLight = theme === 'light';

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
    <div
      className={`rounded-2xl border p-4 sm:p-5 shadow-sm transition-colors ${
        isLight
          ? 'bg-[#ffffff] border-[#e8e2d5] text-stone-900'
          : 'bg-[#18181e] border-white/10 text-white'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#c93b2b]" />
          <h3 className={`font-semibold text-sm ${isLight ? 'text-stone-900' : 'text-white'}`}>
            Hòa Sắc Cổ Truyền Việt Nam
          </h3>
        </div>
        <span className={`text-[11px] ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
          Hệ màu tự nhiên & Ngũ Hành
        </span>
      </div>

      {/* Slot Selector with Navigation Controls */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
            Thanh điều hướng vị trí phối:
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleScrollSlots('left')}
              className={`p-1 rounded-md border transition-all cursor-pointer ${
                isLight
                  ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                  : 'bg-white/5 hover:bg-white/15 text-zinc-300 border-white/10'
              }`}
              title="Cuộn vị trí sang trái"
              aria-label="Cuộn sang trái"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleScrollSlots('right')}
              className={`p-1 rounded-md border transition-all cursor-pointer ${
                isLight
                  ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                  : 'bg-white/5 hover:bg-white/15 text-zinc-300 border-white/10'
              }`}
              title="Cuộn vị trí sang phải"
              aria-label="Cuộn sang phải"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          ref={slotScrollRef}
          className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scroll-smooth"
        >
          {(Object.keys(slotLabels) as Array<keyof OutfitState['colors']>).map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? isLight
                      ? 'bg-stone-900 text-white shadow-xs font-semibold'
                      : 'bg-white/15 text-white shadow-sm border border-white/20'
                    : isLight
                    ? 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200 border border-stone-200'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-xs"
                  style={{ backgroundColor: outfit.colors[slot] }}
                />
                <span>{slotLabels[slot]}</span>
              </button>
            );
          })}
        </div>
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
                isCurrent ? 'ring-2 ring-[#c93b2b] scale-105' : ''
              }`}
              title={`${col.vietnameseName} (${col.element})`}
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shadow-sm border border-black/10 group-hover:border-black/30 transition-colors flex items-center justify-center"
                style={{ backgroundColor: col.hex }}
              >
                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Color Input & Color Story Callout */}
      <div
        className={`flex items-center justify-between gap-3 pt-3 border-t text-xs ${
          isLight ? 'border-stone-100' : 'border-white/5'
        }`}
      >
        <div className="flex items-center gap-2">
          <label
            className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-lg cursor-pointer transition-colors ${
              isLight
                ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
            }`}
          >
            <Pipette className={`w-3.5 h-3.5 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`} />
            <span>Màu tùy chỉnh</span>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => onColorChange(selectedSlot, e.target.value)}
              className="w-5 h-5 opacity-0 absolute cursor-pointer"
            />
          </label>
          <span className={`font-mono text-[11px] uppercase ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
            {currentColor}
          </span>
        </div>

        {/* Story note */}
        <div className="text-right text-[11px] truncate max-w-[240px]">
          {hoveredColor ? (
            <span className={isLight ? 'text-stone-800 font-medium' : 'text-zinc-200'}>
              {hoveredColor.vietnameseName} · Hành {hoveredColor.element}
            </span>
          ) : (
            <span className={isLight ? 'text-stone-400' : 'text-zinc-400'}>
              Chọn màu để nhuộm lớp trang phục
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

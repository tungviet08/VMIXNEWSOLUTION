import React, { useState, useRef } from 'react';
import { EventModel, LiveWeatherData } from '../types';
import { PRESET_EVENTS } from '../data/presetEvents';
import { Calendar, CloudSun, Sparkles, Plus, X, ChevronLeft, ChevronRight, MapPin, ArrowRight } from 'lucide-react';

interface EventSelectorProps {
  currentEvent: EventModel;
  onSelectEvent: (event: EventModel) => void;
  onApplyPresetOutfit: (event: EventModel) => void;
  onAddCustomEvent: (event: EventModel) => void;
  theme?: 'dark' | 'light';
  currentWeather?: LiveWeatherData | null;
  onOpenWeatherReport?: () => void;
}

export const EventSelector: React.FC<EventSelectorProps> = ({
  currentEvent,
  onSelectEvent,
  onApplyPresetOutfit,
  onAddCustomEvent,
  theme = 'dark',
  currentWeather,
  onOpenWeatherReport,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customTemp, setCustomTemp] = useState(25);
  const [customVibe, setCustomVibe] = useState('');
  const eventScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollEvents = (direction: 'left' | 'right') => {
    if (eventScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      eventScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isLight = theme === 'light';

  const handleCreateCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newEvent: EventModel = {
      id: `custom_event_${Date.now()}`,
      name: customName.trim(),
      type: 'custom',
      weather: {
        temp: customTemp,
        condition: customTemp > 26 ? 'sunny' : customTemp < 20 ? 'chilly' : 'cool',
        label: `Thời tiết tự chọn · ${customTemp}°C`
      },
      vibe: customVibe.trim() || 'Sáng tạo tự do, thể hiện cá tính riêng.',
      suggestedPalettes: ['#1D3B53', '#B82626', '#F4EFE6', '#1A1A1E'],
      suggestedItems: ['ao-ngu-than-tay-chen', 'head-khan-dong-den', 'bottom-quan-lua-trang']
    };

    onAddCustomEvent(newEvent);
    onSelectEvent(newEvent);
    setIsModalOpen(false);
    setCustomName('');
    setCustomVibe('');
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 shadow-sm space-y-3 transition-colors ${
        isLight
          ? 'bg-[#ffffff] border-[#e8e2d5] text-stone-900'
          : 'bg-[#18181e] border-white/10 text-white'
      }`}
    >
      {/* Current Active Event Banner */}
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b ${
          isLight ? 'border-stone-100' : 'border-white/10'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-[#c93b2b]" />
            <h3 className={`font-semibold text-sm ${isLight ? 'text-stone-900' : 'text-white'}`}>
              Sự Kiện: <span className="text-[#c93b2b]">{currentEvent.name}</span>
            </h3>
          </div>
          <div className={`flex items-center gap-2 text-xs flex-wrap ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
            <div className="flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>{currentEvent.weather.label}</span>
            </div>
            <span className="text-stone-300">·</span>
            <span className="italic truncate max-w-xs">{currentEvent.vibe}</span>

            {/* Live Weather Indicator Chip */}
            {currentWeather && onOpenWeatherReport && (
              <>
                <span className="text-stone-300">·</span>
                <button
                  type="button"
                  onClick={onOpenWeatherReport}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium transition-all cursor-pointer border ${
                    isLight
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/20'
                  }`}
                  title="Nhấp để mở báo cáo thời tiết thời gian thực và xem gợi ý phục sức"
                >
                  <MapPin className="w-3 h-3 text-[#c93b2b]" />
                  <span>Live: {currentWeather.cityName} ({currentWeather.temperature}°C)</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          {onOpenWeatherReport && (
            <button
              onClick={onOpenWeatherReport}
              className={`px-3 py-1.5 border rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isLight
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/20'
              }`}
              title="Mở bảng báo cáo thời tiết chi tiết theo thời gian thực"
            >
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>Báo Cáo Thời Tiết Live</span>
            </button>
          )}

          <button
            onClick={() => onApplyPresetOutfit(currentEvent)}
            className={`flex-1 sm:flex-none px-3 py-1.5 border rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isLight
                ? 'bg-[#c93b2b]/10 hover:bg-[#c93b2b] text-[#c93b2b] hover:text-white border-[#c93b2b]/30'
                : 'bg-[#c93b2b]/15 hover:bg-[#c93b2b] text-[#ff7566] hover:text-white border-[#c93b2b]/30'
            }`}
            title="Tự động trang bị set đồ gợi ý chuẩn bài cho thời tiết và sự kiện này"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Áp Dụng Gợi Ý Outfit</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
              isLight
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/5'
            }`}
            title="Tạo sự kiện hoặc bối cảnh riêng của bạn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tạo Sự Kiện</span>
          </button>
        </div>
      </div>

      {/* Preset Events Quick Switcher Ribbon with Navigation Controls */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
            Thanh điều hướng sự kiện:
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleScrollEvents('left')}
              className={`p-1 rounded-lg border transition-all cursor-pointer ${
                isLight
                  ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                  : 'bg-white/5 hover:bg-white/15 text-zinc-300 border-white/10'
              }`}
              title="Cuộn danh sách sự kiện sang trái"
              aria-label="Cuộn sang trái"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleScrollEvents('right')}
              className={`p-1 rounded-lg border transition-all cursor-pointer ${
                isLight
                  ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                  : 'bg-white/5 hover:bg-white/15 text-zinc-300 border-white/10'
              }`}
              title="Cuộn danh sách sự kiện sang phải"
              aria-label="Cuộn sang phải"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          ref={eventScrollRef}
          className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scroll-smooth"
        >
          {PRESET_EVENTS.map((ev) => {
            const isSelected = currentEvent.id === ev.id;
            return (
              <button
                key={ev.id}
                onClick={() => onSelectEvent(ev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? isLight
                      ? 'bg-stone-900 text-white shadow-xs font-semibold'
                      : 'bg-white text-zinc-900 shadow-sm font-semibold'
                    : isLight
                    ? 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200 border border-stone-200'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {ev.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Create Custom Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div
            className={`relative w-full max-w-md rounded-2xl border shadow-2xl p-5 space-y-4 ${
              isLight ? 'bg-white border-stone-200 text-stone-900' : 'bg-[#16161b] border-white/10 text-white'
            }`}
          >
            <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-stone-100' : 'border-white/10'}`}>
              <h3 className="font-serif text-base font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#c93b2b]" />
                <span>Tạo Sự Kiện Riêng Của Bạn</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`cursor-pointer ${isLight ? 'text-stone-400 hover:text-stone-700' : 'text-zinc-400 hover:text-white'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomEvent} className="space-y-3 text-xs">
              <div>
                <label className={`block mb-1 font-medium ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Tên sự kiện *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Đi tour Hoàng Thành Thăng Long..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#c93b2b] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-white/5 border-white/10 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Nhiệt độ dự kiến (°C)</label>
                <input
                  type="number"
                  min="5"
                  max="45"
                  value={customTemp}
                  onChange={(e) => setCustomTemp(Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#c93b2b] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-white/5 border-white/10 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Dress code / Không khí sự kiện</label>
                <input
                  type="text"
                  placeholder="VD: Thanh lịch, chụp ảnh nghệ thuật, thoải mái..."
                  value={customVibe}
                  onChange={(e) => setCustomVibe(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#c93b2b] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-white/5 border-white/10 text-white'
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-3.5 py-1.5 cursor-pointer ${isLight ? 'text-stone-500 hover:text-stone-800' : 'text-zinc-400 hover:text-white'}`}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#c93b2b] hover:bg-[#b02f20] text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Xác Nhận Sự Kiện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

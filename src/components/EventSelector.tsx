import React, { useState } from 'react';
import { EventModel } from '../types';
import { PRESET_EVENTS } from '../data/presetEvents';
import { Calendar, CloudSun, Sparkles, Plus, Check, X } from 'lucide-react';

interface EventSelectorProps {
  currentEvent: EventModel;
  onSelectEvent: (event: EventModel) => void;
  onApplyPresetOutfit: (event: EventModel) => void;
  onAddCustomEvent: (event: EventModel) => void;
}

export const EventSelector: React.FC<EventSelectorProps> = ({
  currentEvent,
  onSelectEvent,
  onApplyPresetOutfit,
  onAddCustomEvent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customTemp, setCustomTemp] = useState(25);
  const [customVibe, setCustomVibe] = useState('');

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
    <div className="bg-[#18181e] rounded-2xl border border-white/10 p-4 sm:p-5 shadow-lg space-y-3">
      {/* Current Active Event Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-[#c93b2b]" />
            <h3 className="font-semibold text-white text-sm">
              Sự Kiện: <span className="text-[#ff7566]">{currentEvent.name}</span>
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentEvent.weather.label}</span>
            <span className="text-zinc-600">·</span>
            <span className="italic truncate max-w-xs">{currentEvent.vibe}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onApplyPresetOutfit(currentEvent)}
            className="flex-1 sm:flex-none px-3 py-1.5 bg-[#c93b2b]/15 hover:bg-[#c93b2b] text-[#ff7566] hover:text-white border border-[#c93b2b]/30 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            title="Tự động trang bị set đồ gợi ý chuẩn bài cho thời tiết và sự kiện này"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Áp Dụng Gợi Ý Outfit</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl text-xs font-medium border border-white/5 transition-colors cursor-pointer flex items-center gap-1"
            title="Tạo sự kiện hoặc bối cảnh riêng của bạn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tạo Sự Kiện</span>
          </button>
        </div>
      </div>

      {/* Preset Events Quick Switcher Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PRESET_EVENTS.map((ev) => {
          const isSelected = currentEvent.id === ev.id;
          return (
            <button
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {ev.name}
            </button>
          );
        })}
      </div>

      {/* Create Custom Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#16161b] rounded-2xl border border-white/10 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#c93b2b]" />
                <span>Tạo Sự Kiện Riêng Của Bạn</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Tên sự kiện *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Đi tour Hoàng Thành Thăng Long..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c93b2b]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Nhiệt độ dự kiến (°C)</label>
                <input
                  type="number"
                  min="5"
                  max="45"
                  value={customTemp}
                  onChange={(e) => setCustomTemp(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c93b2b]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Dress code / Không khí sự kiện</label>
                <input
                  type="text"
                  placeholder="VD: Thanh lịch, chụp ảnh nghệ thuật, thoải mái..."
                  value={customVibe}
                  onChange={(e) => setCustomVibe(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c93b2b]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-zinc-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#c93b2b] hover:bg-[#b02f20] text-white rounded-xl font-semibold shadow-sm"
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

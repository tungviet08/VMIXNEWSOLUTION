import React, { useState, useEffect } from 'react';
import { LiveWeatherData, WeatherCity, EventModel } from '../types';
import { CULTURAL_CITIES, weatherService } from '../services/weatherService';
import { 
  X, 
  CloudSun, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  Compass, 
  MapPin, 
  RotateCw, 
  Sparkles, 
  Navigation, 
  Check, 
  Shirt,
  Calendar,
  Layers
} from 'lucide-react';

interface LiveWeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeather: LiveWeatherData | null;
  onSelectCity: (city: WeatherCity) => void;
  onUseGpsLocation: () => void;
  onRefreshWeather: () => void;
  isLoading: boolean;
  onApplyWeatherOutfit: (recommendation: LiveWeatherData['outfitRecommendation']) => void;
  onSyncWithEvent: (weather: LiveWeatherData) => void;
  theme?: 'dark' | 'light';
}

export const LiveWeatherModal: React.FC<LiveWeatherModalProps> = ({
  isOpen,
  onClose,
  currentWeather,
  onSelectCity,
  onUseGpsLocation,
  onRefreshWeather,
  isLoading,
  onApplyWeatherOutfit,
  onSyncWithEvent,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentWeather) return null;

  const handleApplyClick = () => {
    onApplyWeatherOutfit(currentWeather.outfitRecommendation);
    onSyncWithEvent(currentWeather);
    setToastMessage(`Đã áp dụng set đồ tối ưu cho thời tiết ${currentWeather.temperature}°C tại ${currentWeather.cityName}! 👘`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const getWeatherIcon = (condition: LiveWeatherData['weatherCondition'], isDay: boolean) => {
    switch (condition) {
      case 'sunny':
        return isDay ? <Sun className="w-10 h-10 text-amber-500 animate-pulse" /> : <Sun className="w-10 h-10 text-amber-300" />;
      case 'rainy':
        return <CloudRain className="w-10 h-10 text-cyan-400" />;
      case 'chilly':
        return <Wind className="w-10 h-10 text-blue-300" />;
      case 'cool':
      default:
        return <CloudSun className="w-10 h-10 text-amber-400" />;
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 backdrop-blur-md animate-fadeIn transition-colors ${
        isLight ? 'bg-stone-900/40' : 'bg-black/75'
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors ${
          isLight ? 'bg-[#ffffff] border-[#e7e1d5] text-[#1c1917]' : 'bg-[#141418] border-white/10 text-white'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 transition-colors ${
            isLight
              ? 'bg-gradient-to-r from-[#fbf9f4] via-[#f7f3ec] to-[#fdeeed] border-[#e7e1d5]'
              : 'bg-gradient-to-r from-[#1c1c24] via-[#1a171d] to-[#251717] border-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c93b2b]/15 border border-[#c93b2b]/30 flex items-center justify-center text-[#c93b2b] shadow-xs">
              <CloudSun className="w-5 h-5 text-[#c93b2b]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-serif text-base sm:text-lg font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  Báo Cáo Thời Tiết Thời Gian Thực
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Open-Meteo
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                Khí tượng thực địa & Cố vấn chất liệu, phom dáng Việt phục tương thích
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshWeather}
              disabled={isLoading}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200 shadow-2xs'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
              }`}
              title="Làm mới dữ liệu thời tiết tức thì"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#c93b2b]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isLight ? 'text-stone-500 hover:text-stone-900 hover:bg-stone-100' : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 scrollbar-thin text-xs sm:text-sm">
          {/* 1. Quick City Selector with GPS option */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                Chọn Địa Điểm Cố Đô / Đô Thị Văn Hóa:
              </span>
              <button
                onClick={onUseGpsLocation}
                disabled={isLoading}
                className={`text-[11px] font-medium flex items-center gap-1 text-[#c93b2b] hover:underline cursor-pointer`}
                title="Sử dụng tọa độ GPS định vị của thiết bị bạn"
              >
                <Navigation className="w-3 h-3" />
                <span>Lấy vị trí GPS của tôi</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {CULTURAL_CITIES.map((city) => {
                const isSelected = currentWeather.cityName.includes(city.name);
                return (
                  <button
                    key={city.id}
                    onClick={() => onSelectCity(city)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#c93b2b] text-white border-[#c93b2b] shadow-sm'
                        : isLight
                        ? 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/5'
                    }`}
                  >
                    <span>{city.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Main Live Weather Stats Card */}
          <div
            className={`p-5 rounded-2xl border transition-colors relative overflow-hidden ${
              isLight
                ? 'bg-gradient-to-br from-[#fbf9f4] to-white border-[#e7e1d5] shadow-xs'
                : 'bg-gradient-to-br from-[#1b1b22] to-[#141418] border-white/10 shadow-lg'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#c93b2b]" />
                  <span className={`font-serif text-lg sm:text-xl font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
                    {currentWeather.cityName}
                  </span>
                  <span className={`text-xs ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                    ({currentWeather.province})
                  </span>
                </div>
                <p className={`text-xs ${isLight ? 'text-stone-600' : 'text-zinc-300'}`}>
                  {currentWeather.weatherDescription}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-stone-400">
                  <span>Cập nhật lúc: <strong className={isLight ? 'text-stone-700' : 'text-zinc-200'}>{currentWeather.updatedAt}</strong></span>
                  <span>·</span>
                  <span>Tọa độ: {currentWeather.latitude.toFixed(2)}°B, {currentWeather.longitude.toFixed(2)}°Đ</span>
                </div>
              </div>

              {/* Temperature display */}
              <div className="flex items-center gap-3 shrink-0">
                {getWeatherIcon(currentWeather.weatherCondition, currentWeather.isDay)}
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-[#c93b2b]">
                    {currentWeather.temperature}°C
                  </div>
                  <div className={`text-[11px] ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                    Cảm nhận: {currentWeather.apparentTemperature}°C
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Micro Metrics */}
            <div className={`grid grid-cols-3 gap-2 mt-4 pt-4 border-t ${
              isLight ? 'border-stone-100' : 'border-white/5'
            }`}>
              <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                isLight ? 'bg-stone-50/80 border-stone-200' : 'bg-white/5 border-white/5'
              }`}>
                <Thermometer className="w-4 h-4 text-rose-500" />
                <div>
                  <div className={`text-[10px] ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Cảm Giác</div>
                  <div className="text-xs font-semibold tabular-nums">{currentWeather.apparentTemperature}°C</div>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                isLight ? 'bg-stone-50/80 border-stone-200' : 'bg-white/5 border-white/5'
              }`}>
                <Droplets className="w-4 h-4 text-cyan-500" />
                <div>
                  <div className={`text-[10px] ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Độ Ẩm</div>
                  <div className="text-xs font-semibold tabular-nums">{currentWeather.humidity}%</div>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                isLight ? 'bg-stone-50/80 border-stone-200' : 'bg-white/5 border-white/5'
              }`}>
                <Wind className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className={`text-[10px] ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Tốc Độ Gió</div>
                  <div className="text-xs font-semibold tabular-nums">{currentWeather.windSpeed} km/h</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Hourly Forecast Preview Strip */}
          {currentWeather.hourlyForecast.length > 0 && (
            <div className="space-y-2">
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                Diễn Biến Nhiệt Độ Trong Ngày:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {currentWeather.hourlyForecast.map((h, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border text-center space-y-1 transition-colors ${
                      isLight ? 'bg-[#fbf9f4] border-[#e7e1d5]' : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <div className={`text-[10px] ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>{h.time}</div>
                    <div className="text-xs font-bold text-[#c93b2b] tabular-nums">{h.temperature}°C</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CỐ VẤN VIỆT PHỤC THEO THỜI TIẾT (Heart of Feature) */}
          <div
            className={`p-5 rounded-2xl border space-y-3.5 transition-colors ${
              isLight
                ? 'bg-[#fffcf7] border-[#d4af37]/40 shadow-xs'
                : 'bg-gradient-to-br from-[#1e1c18] to-[#171618] border-[#d4af37]/30'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <h4 className={`font-serif text-sm sm:text-base font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  {currentWeather.outfitRecommendation.title}
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#d4af37]/15 text-[#b38914] dark:text-[#f3d267] border border-[#d4af37]/30">
                Gợi Ý Chuẩn Bài
              </span>
            </div>

            <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>
              {currentWeather.outfitRecommendation.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-stone-200' : 'bg-white/5 border-white/5'}`}>
                <div className="flex items-center gap-1.5 font-semibold text-[#c93b2b] mb-1">
                  <Shirt className="w-3.5 h-3.5" />
                  <span>Chất Liệu Vải Khuyên Dùng:</span>
                </div>
                <p className={isLight ? 'text-stone-600' : 'text-zinc-300'}>
                  {currentWeather.outfitRecommendation.fabricAdvice}
                </p>
              </div>

              <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-stone-200' : 'bg-white/5 border-white/5'}`}>
                <div className="flex items-center gap-1.5 font-semibold text-[#c93b2b] mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Kỹ Thuật Phối Lớp (Layering):</span>
                </div>
                <p className={isLight ? 'text-stone-600' : 'text-zinc-300'}>
                  {currentWeather.outfitRecommendation.layerAdvice}
                </p>
              </div>
            </div>

            {/* Suggested Color Palette */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-medium ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                  Bảng màu Ngũ Hành dịu mắt:
                </span>
                <div className="flex items-center gap-1.5">
                  {currentWeather.outfitRecommendation.suggestedPalettes.map((hex, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border border-black/15 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={`Màu ${hex}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* CTA: Apply Outfit to Avatar */}
            <button
              onClick={handleApplyClick}
              className="w-full py-2.5 bg-[#c93b2b] hover:bg-[#b02f20] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-[#c93b2b]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Mặc Thử Set Đồ Theo Thời Tiết Này Lên Model Ngay</span>
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-stone-900 text-white border border-white/20 text-xs rounded-xl shadow-2xl flex items-center gap-2 animate-fadeIn z-50">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

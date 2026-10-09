import React, { useState } from 'react';
import { ColorHarmonyResult } from '../types';
import { Compass, Lightbulb, ChevronDown, ChevronUp, CheckCircle2, Sliders } from 'lucide-react';

interface ColorHarmonyCardProps {
  harmony: ColorHarmonyResult;
  theme?: 'dark' | 'light';
}

export const ColorHarmonyCard: React.FC<ColorHarmonyCardProps> = ({ harmony, theme = 'dark' }) => {
  const [showCriteria, setShowCriteria] = useState(true);
  const isLight = theme === 'light';

  // Score color badge
  const scoreColor =
    harmony.score >= 90
      ? isLight
        ? 'text-emerald-800 bg-emerald-50 border-emerald-300'
        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      : harmony.score >= 80
      ? isLight
        ? 'text-amber-800 bg-amber-50 border-amber-300'
        : 'text-amber-300 bg-amber-500/10 border-amber-500/30'
      : isLight
      ? 'text-rose-800 bg-rose-50 border-rose-300'
      : 'text-rose-400 bg-rose-500/10 border-rose-500/30';

  const elementColors: Record<string, string> = {
    Kim: isLight ? 'text-stone-800 bg-stone-200' : 'text-zinc-200 bg-zinc-700/50',
    Mộc: isLight ? 'text-emerald-800 bg-emerald-100' : 'text-emerald-300 bg-emerald-950/60',
    Thủy: isLight ? 'text-cyan-800 bg-cyan-100' : 'text-cyan-300 bg-cyan-950/60',
    Hỏa: isLight ? 'text-rose-800 bg-rose-100' : 'text-rose-300 bg-rose-950/60',
    Thổ: isLight ? 'text-amber-800 bg-amber-100' : 'text-amber-300 bg-amber-950/60',
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 shadow-sm flex flex-col justify-between transition-colors ${
        isLight
          ? 'bg-white border-[#e7e1d5] text-[#1f1c19]'
          : 'bg-[#18181e] border-white/10 text-white'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#c93b2b]" />
            <h3 className={`font-semibold text-sm ${isLight ? 'text-[#1f1c19]' : 'text-white'}`}>
              Hòa Sắc Ngũ Hành & Thị Giác
            </h3>
          </div>
          <div className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold tabular-nums ${scoreColor}`}>
            {harmony.score}/100 · {harmony.grade}
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-2 rounded-full overflow-hidden mb-3 ${isLight ? 'bg-stone-200' : 'bg-white/5'}`}>
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-400"
            style={{ width: `${harmony.score}%` }}
          />
        </div>

        {/* Dominant Element & Relation */}
        <div className="flex items-center gap-2 mb-2 text-xs">
          <span className={isLight ? 'text-[#6b6357]' : 'text-zinc-400'}>Hành chủ đạo:</span>
          <span className={`px-2 py-0.5 rounded-md font-medium ${elementColors[harmony.dominantElement] || ''}`}>
            {harmony.dominantElement}
          </span>
          <span className="text-stone-400">·</span>
          <span className={`font-medium truncate ${isLight ? 'text-[#1f1c19]' : 'text-zinc-300'}`}>
            {harmony.elementRelation}
          </span>
        </div>

        {/* Feedback Paragraph */}
        <p className={`text-xs leading-relaxed mb-3 ${isLight ? 'text-[#6b6357]' : 'text-zinc-300'}`}>
          {harmony.feedback}
        </p>

        {/* Criteria Breakdown Accordion (Tiêu Chí Đánh Giá Chi Tiết) */}
        {harmony.criteria && harmony.criteria.length > 0 && (
          <div
            className={`rounded-xl border p-3 mb-3 transition-colors ${
              isLight ? 'bg-[#f7f4ed] border-[#e7e1d5]' : 'bg-white/5 border-white/5'
            }`}
          >
            <button
              type="button"
              onClick={() => setShowCriteria(!showCriteria)}
              className="w-full flex items-center justify-between text-xs font-semibold cursor-pointer group"
            >
              <span className={`flex items-center gap-1.5 ${isLight ? 'text-[#1f1c19]' : 'text-white'}`}>
                <Sliders className="w-3.5 h-3.5 text-[#c93b2b]" />
                <span>Tiêu Chí Chấm Điểm Chi Tiết (4 Hạng Mục)</span>
              </span>
              <span className={`flex items-center gap-1 text-[11px] font-normal ${isLight ? 'text-[#6b6357]' : 'text-zinc-400'}`}>
                <span>{showCriteria ? 'Thu gọn' : 'Xem chi tiết'}</span>
                {showCriteria ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            {showCriteria && (
              <div className="mt-3 space-y-2.5 pt-2 border-t border-black/5 dark:border-white/5">
                {harmony.criteria.map((crit) => {
                  const pct = Math.round((crit.score / crit.maxScore) * 100);
                  const isHigh = pct >= 85;

                  return (
                    <div key={crit.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-medium ${isLight ? 'text-[#2b2520]' : 'text-zinc-200'}`}>
                          {crit.name}
                        </span>
                        <div className="flex items-center gap-1.5 tabular-nums">
                          <span className={`text-[11px] font-semibold ${isHigh ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            {crit.score}/{crit.maxScore}đ
                          </span>
                          <span className={`text-[10px] ${isLight ? 'text-[#8a7f70]' : 'text-zinc-500'}`}>
                            ({crit.weight})
                          </span>
                        </div>
                      </div>

                      {/* Mini criterion bar */}
                      <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-stone-200/80' : 'bg-white/10'}`}>
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isHigh
                              ? 'bg-emerald-500'
                              : pct >= 70
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <p className={`text-[10px] leading-relaxed italic ${isLight ? 'text-[#756a5c]' : 'text-zinc-400'}`}>
                        {crit.comment}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stylist Tip */}
      {harmony.tips.length > 0 && (
        <div
          className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs ${
            isLight
              ? 'bg-[#f7f4ed] border-[#e7e1d5] text-[#2b2520]'
              : 'bg-white/5 border-white/5 text-zinc-300'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span className="text-[11px] leading-relaxed">
            {harmony.tips[0]}
          </span>
        </div>
      )}
    </div>
  );
};

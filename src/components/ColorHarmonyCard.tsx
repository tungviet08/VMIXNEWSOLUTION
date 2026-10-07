import React from 'react';
import { ColorHarmonyResult } from '../types';
import { Sparkles, Compass, Lightbulb } from 'lucide-react';

interface ColorHarmonyCardProps {
  harmony: ColorHarmonyResult;
}

export const ColorHarmonyCard: React.FC<ColorHarmonyCardProps> = ({ harmony }) => {
  // Score color badge
  const scoreColor =
    harmony.score >= 90
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      : harmony.score >= 80
      ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
      : 'text-rose-400 bg-rose-500/10 border-rose-500/30';

  const elementColors: Record<string, string> = {
    Kim: 'text-zinc-200 bg-zinc-700/50',
    Mộc: 'text-emerald-300 bg-emerald-950/60',
    Thủy: 'text-cyan-300 bg-cyan-950/60',
    Hỏa: 'text-rose-300 bg-rose-950/60',
    Thổ: 'text-amber-300 bg-amber-950/60',
  };

  return (
    <div className="bg-[#18181e] rounded-2xl border border-white/10 p-4 sm:p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#c93b2b]" />
            <h3 className="font-semibold text-white text-sm">Hòa Sắc Ngũ Hành & Thị Giác</h3>
          </div>
          <div className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold tabular-nums ${scoreColor}`}>
            {harmony.score}/100 · {harmony.grade}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-400"
            style={{ width: `${harmony.score}%` }}
          />
        </div>

        {/* Dominant Element & Relation */}
        <div className="flex items-center gap-2 mb-3 text-xs">
          <span className="text-zinc-400">Hành chủ đạo:</span>
          <span className={`px-2 py-0.5 rounded-md font-medium ${elementColors[harmony.dominantElement] || ''}`}>
            {harmony.dominantElement}
          </span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-300 font-medium truncate">{harmony.elementRelation}</span>
        </div>

        {/* Feedback Paragraph */}
        <p className="text-xs text-zinc-300 leading-relaxed mb-3">
          {harmony.feedback}
        </p>
      </div>

      {/* Stylist Tip */}
      {harmony.tips.length > 0 && (
        <div className="flex items-start gap-2 p-2.5 bg-white/5 rounded-xl border border-white/5 text-xs text-zinc-300">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span className="text-[11px] leading-relaxed text-zinc-300">
            {harmony.tips[0]}
          </span>
        </div>
      )}
    </div>
  );
};

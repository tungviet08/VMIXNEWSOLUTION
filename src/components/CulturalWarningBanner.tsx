import React from 'react';
import { CulturalWarning, OutfitState } from '../types';
import { AlertTriangle, Info, CheckCircle2, ArrowRight } from 'lucide-react';

interface CulturalWarningBannerProps {
  warnings: CulturalWarning[];
  onApplyFix: (fixFn: (current: OutfitState) => OutfitState) => void;
}

export const CulturalWarningBanner: React.FC<CulturalWarningBannerProps> = ({
  warnings,
  onApplyFix,
}) => {
  if (warnings.length === 0) return null;

  return (
    <div className="space-y-2.5 mb-4">
      {warnings.map((warn) => {
        const isHigh = warn.severity === 'high';
        const isMedium = warn.severity === 'medium';

        return (
          <div
            key={warn.id}
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
              isHigh
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                : isMedium
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                : 'bg-blue-950/30 border-blue-500/30 text-blue-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                {isHigh ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : isMedium ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold tracking-tight text-white mb-1">
                    {warn.title}
                  </h4>
                  <p className="text-xs leading-relaxed opacity-90 mb-2">
                    {warn.explanation}
                  </p>
                  <p className="text-[11px] opacity-75 italic mb-2">
                    {warn.historicalContext}
                  </p>
                  <p className="text-xs font-medium opacity-95">
                    💡 <span className="underline decoration-white/30">{warn.recommendation}</span>
                  </p>
                </div>
              </div>

              {warn.fixAction && (
                <button
                  onClick={() => onApplyFix(warn.fixAction!.applyFix)}
                  className="shrink-0 px-3 py-1.5 bg-white text-zinc-900 hover:bg-zinc-100 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 shadow-sm cursor-pointer whitespace-nowrap self-start"
                >
                  <span>{warn.fixAction.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

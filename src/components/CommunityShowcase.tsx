import React, { useState, useRef } from 'react';
import { CommunityLookbook, OutfitState, ClothingItem } from '../types';
import { communityService } from '../services/communityService';
import { 
  Heart, 
  Sparkles, 
  ArrowRight, 
  Filter, 
  ArrowUpDown, 
  Tag, 
  Eye, 
  Send,
  X,
  Compass,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface CommunityShowcaseProps {
  onApplyOutfit: (outfit: OutfitState) => void;
  onOpenSubmitModal: () => void;
  theme?: 'dark' | 'light';
}

export const CommunityShowcase: React.FC<CommunityShowcaseProps> = ({
  onApplyOutfit,
  onOpenSubmitModal,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [looks, setLooks] = useState<CommunityLookbook[]>(() => communityService.getCommunityLookbooks());
  const [filterStyle, setFilterStyle] = useState<'all' | 'traditional' | 'remix' | 'experimental'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'harmony'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingLook, setInspectingLook] = useState<CommunityLookbook | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const styleScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollStyle = (direction: 'left' | 'right') => {
    if (styleScrollRef.current) {
      styleScrollRef.current.scrollBy({ left: direction === 'left' ? -180 : 180, behavior: 'smooth' });
    }
  };

  const handleLike = (lookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { look, isLiked } = communityService.toggleLike(lookId);
    if (look) {
      setLooks(prev => prev.map(l => l.id === lookId ? { ...look } : l));
      if (inspectingLook?.id === lookId) {
        setInspectingLook({ ...look });
      }
      setToastMessage(isLiked ? 'Đã thích lookbook này! ❤️' : 'Đã bỏ thích');
      setTimeout(() => setToastMessage(null), 1800);
    }
  };

  // Filter & Sort
  const filteredLooks = looks.filter((item) => {
    if (filterStyle !== 'all' && item.styleCategory !== filterStyle) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchAuthor = item.authorName.toLowerCase().includes(q);
      const matchTag = item.tags.some(t => t.toLowerCase().includes(q));
      const matchEvent = item.eventName.toLowerCase().includes(q);
      return matchTitle || matchAuthor || matchTag || matchEvent;
    }
    return true;
  });

  filteredLooks.sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'harmony') return b.colorHarmonyScore - a.colorHarmonyScore;
    return b.id.localeCompare(a.id); // pseudo newest
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Banner & Submit CTA */}
      <div
        className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl border shadow-xl transition-colors ${
          isLight
            ? 'bg-gradient-to-r from-[#fbf9f4] via-[#f7f3ec] to-[#fdeeed] border-[#e7e1d5] text-[#1f1c19]'
            : 'bg-gradient-to-r from-[#1c1c24] via-[#1a171d] to-[#251717] border-white/10 text-white'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
              isLight
                ? 'bg-[#c93b2b]/10 text-[#c93b2b] border-[#c93b2b]/25'
                : 'bg-[#c93b2b]/20 text-[#ff6b5b] border-[#c93b2b]/30'
            }`}>
              Cộng Đồng Việt Phục Gen Z
            </span>
            <span className={`text-xs ${isLight ? 'text-[#6b6357]' : 'text-zinc-400'}`}>
              · {looks.length} tác phẩm đã đăng
            </span>
          </div>
          <h2 className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight ${
            isLight ? 'text-[#1f1c19]' : 'text-white'
          }`}>
            Sàn Diễn Lookbook Cộng Đồng
          </h2>
          <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${
            isLight ? 'text-[#6b6357]' : 'text-zinc-300'
          }`}>
            Khám phá những bản phối Việt Phục độc bản từ các bạn trẻ trên toàn quốc. Thả tim, học hỏi kinh nghiệm phối màu và bấm "Mặc Ngay" để thử trực tiếp lên Avatar của bạn!
          </p>
        </div>

        <button
          onClick={onOpenSubmitModal}
          className="shrink-0 px-4 py-2.5 bg-[#c93b2b] hover:bg-[#b02f20] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-[#c93b2b]/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Đăng Look Của Bạn Lên Sàn Diễn</span>
        </button>
      </div>

      {/* Filter & Sort Controls with Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        {/* Style Segmented Tabs with Navigation Controls */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleScrollStyle('left')}
            className={`sm:hidden p-1.5 rounded-lg border cursor-pointer ${
              isLight
                ? 'bg-stone-100 border-[#ded6c5] text-stone-700'
                : 'border-white/10 bg-white/5 text-zinc-300 hover:text-white'
            }`}
            title="Cuộn sang trái"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div
            ref={styleScrollRef}
            className={`flex items-center gap-1 p-1 rounded-xl border text-xs overflow-x-auto scrollbar-thin scroll-smooth ${
              isLight
                ? 'bg-white border-[#e7e1d5] shadow-xs'
                : 'bg-white/5 border-white/10'
            }`}
          >
            {[
              { id: 'all', label: 'Tất Cả' },
              { id: 'traditional', label: 'Cổ Phong Thuần Khiết' },
              { id: 'remix', label: 'Remix Đường Phố' },
              { id: 'experimental', label: 'Vị Lai & Avant-Garde' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStyle(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                  filterStyle === tab.id
                    ? 'bg-[#c93b2b] text-white shadow-sm'
                    : isLight
                    ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => handleScrollStyle('right')}
            className={`sm:hidden p-1.5 rounded-lg border cursor-pointer ${
              isLight
                ? 'bg-stone-100 border-[#ded6c5] text-stone-700'
                : 'border-white/10 bg-white/5 text-zinc-300 hover:text-white'
            }`}
            title="Cuộn sang phải"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sort & Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tìm theo tên tác phẩm, tác giả, #hashtag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 sm:w-64 px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:border-[#c93b2b] transition-colors ${
              isLight
                ? 'bg-white border-[#ded6c5] text-stone-900 placeholder:text-stone-400'
                : 'bg-white/5 border-white/10 text-white placeholder:text-zinc-500'
            }`}
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={`px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:border-[#c93b2b] cursor-pointer transition-colors ${
              isLight
                ? 'bg-white border-[#ded6c5] text-stone-900'
                : 'bg-[#202026] border-white/10 text-white'
            }`}
          >
            <option value="popular">Yêu thích nhất</option>
            <option value="harmony">Điểm hòa sắc cao</option>
            <option value="newest">Mới cập nhật</option>
          </select>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-zinc-900 border border-white/20 text-white text-xs rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Lookbooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLooks.map((look) => {
          const isLiked = look.likedByCurrentUser;

          return (
            <div
              key={look.id}
              onClick={() => setInspectingLook(look)}
              className={`group rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl flex flex-col cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-stone-50/80 border-[#e7e1d5] hover:border-stone-300'
                  : 'bg-[#16161b] hover:bg-[#1a1a20] border-white/10 hover:border-white/20'
              }`}
            >
              {/* Card Header & Author */}
              <div
                className={`p-4 flex items-center justify-between gap-3 border-b transition-colors ${
                  isLight ? 'bg-[#f7f4ed] border-[#e7e1d5]' : 'bg-[#141418] border-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={look.authorAvatar}
                    alt={look.authorName}
                    className="w-8 h-8 rounded-full border border-stone-300 dark:border-white/20 object-cover"
                  />
                  <div>
                    <h4
                      className={`text-xs font-semibold transition-colors ${
                        isLight
                          ? 'text-[#1f1c19] group-hover:text-[#c93b2b]'
                          : 'text-white group-hover:text-[#ff7566]'
                      }`}
                    >
                      {look.authorName}
                    </h4>
                    <p className={`text-[10px] ${isLight ? 'text-[#8a7f70]' : 'text-zinc-400'}`}>
                      {look.authorTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={(e) => handleLike(look.id, e)}
                    className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                      isLiked
                        ? isLight
                          ? 'bg-rose-50 text-rose-600 border-rose-300'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : isLight
                        ? 'bg-white text-stone-600 hover:text-stone-900 border-[#ded6c5]'
                        : 'bg-white/5 text-zinc-400 hover:text-white border-white/10'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span className="font-mono text-[11px] tabular-nums">{look.likes}</span>
                  </button>
                </div>
              </div>

              {/* Card Visual / Palette Preview */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium truncate max-w-[200px] border ${
                        isLight
                          ? 'bg-[#f7f4ed] border-[#e7e1d5] text-[#6b6357]'
                          : 'bg-white/5 border-white/5 text-zinc-300'
                      }`}
                    >
                      {look.eventName}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border tabular-nums ${
                        isLight
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      Hòa sắc {look.colorHarmonyScore}/100
                    </span>
                  </div>

                  <h3
                    className={`font-serif text-base font-bold transition-colors mb-1.5 ${
                      isLight
                        ? 'text-[#1f1c19] group-hover:text-[#c93b2b]'
                        : 'text-white group-hover:text-[#ff7566]'
                    }`}
                  >
                    {look.title}
                  </h3>

                  <p className={`text-xs line-clamp-2 leading-relaxed mb-3 ${isLight ? 'text-[#6b6357]' : 'text-zinc-400'}`}>
                    {look.notes}
                  </p>
                </div>

                {/* Outfit Items Color Pill Ribbon */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-none">
                    {look.items.map((it, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] px-2 py-0.5 rounded border whitespace-nowrap ${
                          isLight
                            ? 'bg-[#f7f4ed] border-[#e7e1d5] text-[#2b2520]'
                            : 'bg-white/5 border-white/5 text-zinc-300'
                        }`}
                      >
                        {it.name}
                      </span>
                    ))}
                  </div>

                  {/* Hashtags */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {look.tags.map((tag, i) => (
                      <span key={i} className={`text-[10px] ${isLight ? 'text-[#8a7f70]' : 'text-zinc-500'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div
                className={`p-3 border-t flex items-center justify-between gap-2 text-xs transition-colors ${
                  isLight ? 'bg-[#f7f4ed] border-[#e7e1d5]' : 'bg-[#141418] border-white/5'
                }`}
              >
                <span className={`text-[10px] ${isLight ? 'text-[#8a7f70]' : 'text-zinc-500'}`}>
                  {look.createdAt}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyOutfit(look.outfit);
                    setToastMessage(`Đã mặc "${look.title}" lên Avatar! 👘`);
                    setTimeout(() => setToastMessage(null), 2000);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer border ${
                    isLight
                      ? 'bg-[#c93b2b]/10 hover:bg-[#c93b2b] text-[#c93b2b] hover:text-white border-[#c93b2b]/30'
                      : 'bg-[#c93b2b]/15 hover:bg-[#c93b2b] text-[#ff7566] hover:text-white border-[#c93b2b]/30'
                  }`}
                >
                  <span>Mặc Thử Ngay</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Community Look Modal */}
      {inspectingLook && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setInspectingLook(null);
          }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn transition-colors ${
            isLight ? 'bg-stone-900/35' : 'bg-black/75'
          }`}
        >
          <div
            className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-colors ${
              isLight
                ? 'bg-white border-[#e7e1d5] text-[#1f1c19]'
                : 'bg-[#16161b] border-white/10 text-white'
            }`}
          >
            <div
              className={`p-5 border-b flex items-start justify-between transition-colors ${
                isLight ? 'bg-[#f7f4ed] border-[#e7e1d5]' : 'bg-[#1c1c22] border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={inspectingLook.authorAvatar}
                  alt={inspectingLook.authorName}
                  className="w-10 h-10 rounded-full border-2 border-[#c93b2b] object-cover"
                />
                <div>
                  <h3 className={`font-serif text-lg font-bold ${isLight ? 'text-[#1f1c19]' : 'text-white'}`}>
                    {inspectingLook.title}
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-[#6b6357]' : 'text-zinc-400'}`}>
                    Bởi {inspectingLook.authorName} ({inspectingLook.authorTitle}) · {inspectingLook.createdAt}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectingLook(null)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isLight
                    ? 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/60'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed scrollbar-thin ${
              isLight ? 'text-[#2b2520]' : 'text-zinc-300'
            }`}>
              <div
                className={`p-4 rounded-xl border space-y-1 ${
                  isLight
                    ? 'bg-[#fbf9f4] border-[#e7e1d5]'
                    : 'bg-white/5 border-white/5'
                }`}
              >
                <div className={`flex items-center justify-between text-xs ${isLight ? 'text-[#6b6357]' : 'text-zinc-400'}`}>
                  <span>Sự kiện: {inspectingLook.eventName}</span>
                  <span className={isLight ? 'text-emerald-700 font-semibold' : 'text-emerald-400 font-semibold'}>
                    Điểm hòa sắc: {inspectingLook.colorHarmonyScore}/100
                  </span>
                </div>
                <p className={`italic pt-1 ${isLight ? 'text-[#1f1c19]' : 'text-zinc-200'}`}>
                  {inspectingLook.notes}
                </p>
              </div>

              {/* Items Breakdown */}
              <div>
                <h4 className={`font-semibold text-xs mb-2 uppercase tracking-wider ${isLight ? 'text-[#6b6357]' : 'text-zinc-400'}`}>
                  Chi Tiết Từng Món Trang Phục Phối Đồ:
                </h4>
                <div className="space-y-2">
                  {inspectingLook.items.map((it, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isLight
                          ? 'bg-[#f7f4ed] border-[#e7e1d5]'
                          : 'bg-white/5 border-white/5'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-xs sm:text-sm ${isLight ? 'text-[#1f1c19]' : 'text-white'}`}>
                            {it.name}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded border ${
                              isLight
                                ? 'bg-white border-[#ded6c5] text-stone-700'
                                : 'bg-white/10 border-white/5 text-zinc-300'
                            }`}
                          >
                            {it.era}
                          </span>
                        </div>
                        <p className={`text-[11px] mt-0.5 line-clamp-1 ${isLight ? 'text-[#6b6357]' : 'text-zinc-400'}`}>
                          {it.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hashtags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-2">
                {inspectingLook.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-mono ${
                      isLight
                        ? 'bg-white border-[#ded6c5] text-[#6b6357]'
                        : 'bg-white/5 border-white/5 text-zinc-300'
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div
              className={`p-4 border-t flex items-center justify-between gap-3 transition-colors ${
                isLight ? 'bg-[#f7f4ed] border-[#e7e1d5]' : 'bg-[#141418] border-white/10'
              }`}
            >
              <button
                onClick={(e) => handleLike(inspectingLook.id, e)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  inspectingLook.likedByCurrentUser
                    ? isLight
                      ? 'bg-rose-50 text-rose-600 border-rose-300'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : isLight
                    ? 'bg-white text-stone-700 hover:text-stone-900 border-[#ded6c5]'
                    : 'bg-white/5 text-zinc-300 hover:text-white border-white/10'
                }`}
              >
                <Heart className={`w-4 h-4 ${inspectingLook.likedByCurrentUser ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{inspectingLook.likes} Lượt thích</span>
              </button>

              <button
                onClick={() => {
                  onApplyOutfit(inspectingLook.outfit);
                  setInspectingLook(null);
                  setToastMessage(`Đã mặc "${inspectingLook.title}" lên Avatar! 👘`);
                  setTimeout(() => setToastMessage(null), 2000);
                }}
                className="px-5 py-2 bg-[#c93b2b] hover:bg-[#b02f20] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#c93b2b]/20 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mặc Thử Set Này Lên Avatar Ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

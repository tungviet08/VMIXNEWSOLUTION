import React, { useState, useEffect } from 'react';
import { OutfitState, ClothingItem, EventModel, LookbookEntry, ColorHarmonyResult, CommunityLookbook } from '../types';
import { userService } from '../services/userService';
import { communityService } from '../services/communityService';
import { 
  X, 
  Bookmark, 
  Send, 
  Check, 
  Copy,
  Calendar
} from 'lucide-react';

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: OutfitState;
  itemsMap: Record<string, ClothingItem>;
  currentEvent: EventModel;
  harmony: ColorHarmonyResult;
  onLookbookSaved: () => void;
  theme?: 'dark' | 'light';
}

export const LookbookModal: React.FC<LookbookModalProps> = ({
  isOpen,
  onClose,
  outfit,
  itemsMap,
  currentEvent,
  harmony,
  onLookbookSaved,
  theme = 'dark',
}) => {
  const [title, setTitle] = useState(`${currentEvent.name} - Vibe 2026`);
  const [notes, setNotes] = useState('');
  const [styleCategory, setStyleCategory] = useState<'traditional' | 'remix' | 'experimental'>('remix');
  const [tagsInput, setTagsInput] = useState('#ViệtPhụcRemix #GenZCổPhong #OOTD');
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmittedToCommunity, setIsSubmittedToCommunity] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isLight = theme === 'light';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const equippedItems: ClothingItem[] = [
    outfit.outerId ? itemsMap[outfit.outerId] : null,
    outfit.innerId ? itemsMap[outfit.innerId] : null,
    outfit.bottomId ? itemsMap[outfit.bottomId] : null,
    outfit.headwearId ? itemsMap[outfit.headwearId] : null,
    outfit.footwearId ? itemsMap[outfit.footwearId] : null,
    outfit.accessoryId ? itemsMap[outfit.accessoryId] : null,
  ].filter(Boolean) as ClothingItem[];

  const handleSaveLookbook = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = userService.getCurrentUser();

    const entry: LookbookEntry = {
      id: `look_${Date.now()}`,
      title: title.trim() || 'Việt Phục Remix Look',
      createdAt: 'Vừa xong',
      eventName: currentEvent.name,
      weatherLabel: currentEvent.weather.label,
      outfit,
      items: equippedItems,
      colorHarmonyScore: harmony.score,
      notes: notes.trim() || 'Outfit tạo bởi Việt Phục Remix.',
      likes: 1,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      isPublic: false
    };

    userService.saveUserLookbook(entry);
    setIsSaved(true);
    onLookbookSaved();
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSubmitToCommunity = () => {
    const currentUser = userService.getCurrentUser();
    const tags = tagsInput.split(' ').filter(t => t.startsWith('#') || t.trim());

    const commLook: CommunityLookbook = {
      id: `comm_${Date.now()}`,
      title: title.trim() || 'Việt Phục Remix Look',
      createdAt: 'Vừa xong',
      eventName: currentEvent.name,
      weatherLabel: currentEvent.weather.label,
      outfit,
      items: equippedItems,
      colorHarmonyScore: harmony.score,
      notes: notes.trim() || 'Bản phối sáng tạo chia sẻ cùng cộng đồng Gen Z.',
      likes: 1,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorTitle: currentUser.title,
      authorAvatar: currentUser.avatarUrl,
      styleCategory,
      tags: tags.length > 0 ? tags : ['#ViệtPhụcRemix', '#OOTD'],
      likedByCurrentUser: true
    };

    communityService.submitLookbook(commLook);
    setIsSubmittedToCommunity(true);
    setTimeout(() => setIsSubmittedToCommunity(false), 3000);
  };

  const handleCopyFormattedCard = () => {
    const text = `👘 [Việt Phục Remix - Lookbook]
✨ Tác phẩm: ${title}
📍 Sự kiện: ${currentEvent.name} (${currentEvent.weather.label})
🎨 Hòa sắc Ngũ Hành: ${harmony.score}/100 (${harmony.grade} - Hành ${harmony.dominantElement})
👗 Trang phục:
${equippedItems.map(it => `  • ${it.name} (${it.era})`).join('\n')}
💡 Cảm hứng: "${notes || 'Bản phối tự hào di sản trang phục Việt Nam.'}"
🔗 Khám phá tại: https://vietphucremix.app`;

    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-colors ${
          isLight ? 'bg-white border-stone-200 text-stone-900' : 'bg-[#16161b] border-white/10 text-zinc-300'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#1c1c22] border-white/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#c93b2b]" />
            <h3 className={`font-serif text-lg font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
              Lưu & Chia Sẻ Việt Phục Lookbook
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-stone-400 hover:text-stone-700' : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm scrollbar-thin">
          {/* Live Look Summary Card Preview */}
          <div
            className={`p-4 rounded-2xl border shadow-xs space-y-2 ${
              isLight
                ? 'bg-[#fbf9f4] border-[#e8e2d5]'
                : 'bg-gradient-to-br from-[#1d1d26] to-[#16161c] border-white/10'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#c93b2b] font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{currentEvent.name}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold tabular-nums">
                Hòa sắc {harmony.score}/100
              </span>
            </div>

            <div className="pt-1">
              <h4 className={`font-serif text-base font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
                {title || 'Tên Lookbook'}
              </h4>
              <p className={`text-[11px] mt-0.5 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>{currentEvent.weather.label}</p>
            </div>

            {/* Items summary */}
            <div className="pt-2 flex items-center gap-1.5 flex-wrap">
              {equippedItems.map((it, idx) => (
                <span
                  key={idx}
                  className={`text-[11px] px-2 py-0.5 border rounded-md ${
                    isLight ? 'bg-white border-stone-200 text-stone-700' : 'bg-white/5 border-white/10 text-zinc-300'
                  }`}
                >
                  {it.name}
                </span>
              ))}
            </div>
          </div>

          {/* Form inputs */}
          <form onSubmit={handleSaveLookbook} className="space-y-3">
            <div>
              <label className={`block mb-1 font-medium ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Tiêu đề Lookbook</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-[#c93b2b] ${
                  isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-white/5 border-white/10 text-white'
                }`}
              />
            </div>

            <div>
              <label className={`block mb-1 font-medium ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Ghi chú & Cảm hứng styling</label>
              <textarea
                rows={2}
                placeholder="Chia sẻ lý do bạn chọn phối chiếc áo ngũ thân này cùng đôi chunky loafer..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-[#c93b2b] resize-none ${
                  isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-white/5 border-white/10 text-white'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block mb-1 font-medium ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Phong cách phân loại</label>
                <select
                  value={styleCategory}
                  onChange={(e) => setStyleCategory(e.target.value as any)}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#c93b2b] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-[#202026] border-white/10 text-white'
                  }`}
                >
                  <option value="traditional">Cổ Phong Thuần Khiết</option>
                  <option value="remix">Remix Đường Phố</option>
                  <option value="experimental">Vị Lai & Experimental</option>
                </select>
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Hashtags cộng đồng</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="#ViệtPhụcRemix #ÁoDài..."
                  className={`w-full px-3.5 py-2 border rounded-xl focus:outline-none focus:border-[#c93b2b] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-white/5 border-white/10 text-white'
                  }`}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex items-center justify-between gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleCopyFormattedCard}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isLight ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200' : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Đã sao chép vào bộ nhớ!' : 'Sao Chép Text Lookbook'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSubmitToCommunity}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isSubmittedToCommunity
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : isLight
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-white/10 hover:bg-white/15 text-white border-white/15'
                  }`}
                  title="Gửi bộ look này lên Sàn Diễn Cộng Đồng để mọi người cùng chiêm ngưỡng"
                >
                  {isSubmittedToCommunity ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5 text-amber-500" />}
                  <span>{isSubmittedToCommunity ? 'Đã Đăng Lên Sàn Diễn!' : 'Đăng Lên Cộng Đồng'}</span>
                </button>

                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSaved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#c93b2b] hover:bg-[#b02f20] text-white shadow-[#c93b2b]/20'
                  }`}
                >
                  {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'Đã Lưu Vào Hồ Sơ!' : 'Lưu Lookbook'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

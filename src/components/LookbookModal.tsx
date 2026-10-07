import React, { useState } from 'react';
import { OutfitState, ClothingItem, EventModel, LookbookEntry, ColorHarmonyResult, CommunityLookbook } from '../types';
import { userService } from '../services/userService';
import { communityService } from '../services/communityService';
import { 
  X, 
  Bookmark, 
  Share2, 
  Download, 
  Send, 
  Check, 
  Sparkles, 
  Copy,
  Calendar,
  Compass
} from 'lucide-react';

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: OutfitState;
  itemsMap: Record<string, ClothingItem>;
  currentEvent: EventModel;
  harmony: ColorHarmonyResult;
  onLookbookSaved: () => void;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({
  isOpen,
  onClose,
  outfit,
  itemsMap,
  currentEvent,
  harmony,
  onLookbookSaved,
}) => {
  const [title, setTitle] = useState(`${currentEvent.name} - Vibe 2026`);
  const [notes, setNotes] = useState('');
  const [styleCategory, setStyleCategory] = useState<'traditional' | 'remix' | 'experimental'>('remix');
  const [tagsInput, setTagsInput] = useState('#ViệtPhụcRemix #GenZCổPhong #OOTD');
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmittedToCommunity, setIsSubmittedToCommunity] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#16161b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#1c1c22] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#c93b2b]" />
            <h3 className="font-serif text-lg font-bold text-white">
              Lưu & Chia Sẻ Việt Phục Lookbook
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-300 scrollbar-thin">
          {/* Live Look Summary Card Preview */}
          <div className="p-4 bg-gradient-to-br from-[#1d1d26] to-[#16161c] rounded-2xl border border-white/10 shadow-inner space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#ff7566] font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{currentEvent.name}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold tabular-nums">
                Hòa sắc {harmony.score}/100
              </span>
            </div>

            <div className="pt-1">
              <h4 className="font-serif text-base font-bold text-white">
                {title || 'Tên Lookbook'}
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">{currentEvent.weather.label}</p>
            </div>

            {/* Items summary */}
            <div className="pt-2 flex items-center gap-1.5 flex-wrap">
              {equippedItems.map((it, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-zinc-300"
                >
                  {it.name}
                </span>
              ))}
            </div>
          </div>

          {/* Form inputs */}
          <form onSubmit={handleSaveLookbook} className="space-y-3">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Tiêu đề Lookbook</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c93b2b]"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Ghi chú & Cảm hứng styling</label>
              <textarea
                rows={2}
                placeholder="Chia sẻ lý do bạn chọn phối chiếc áo ngũ thân này cùng đôi chunky loafer..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c93b2b] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Phong cách phân loại</label>
                <select
                  value={styleCategory}
                  onChange={(e) => setStyleCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#202026] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c93b2b]"
                >
                  <option value="traditional">Cổ Phong Thuần Khiết</option>
                  <option value="remix">Remix Đường Phố</option>
                  <option value="experimental">Vị Lai & Experimental</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Hashtags cộng đồng</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="#ViệtPhụcRemix #ÁoDài..."
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c93b2b]"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex items-center justify-between gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleCopyFormattedCard}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl text-xs font-medium border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Đã sao chép vào bộ nhớ!' : 'Sao Chép Text Lookbook'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSubmitToCommunity}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSubmittedToCommunity
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                  }`}
                  title="Gửi bộ look này lên Sàn Diễn Cộng Đồng để mọi người cùng chiêm ngưỡng"
                >
                  {isSubmittedToCommunity ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5 text-amber-400" />}
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

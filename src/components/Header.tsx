import React from 'react';
import { Sparkles, Bookmark, SplitSquareVertical, Shirt, Users, User } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: 'styling' | 'wardrobe' | 'community' | 'comparison';
  setActiveTab: (tab: 'styling' | 'wardrobe' | 'community' | 'comparison') => void;
  currentUser: UserProfile;
  lookbookCount: number;
  onOpenAi: () => void;
  onOpenSaveLookbook: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  lookbookCount,
  onOpenAi,
  onOpenSaveLookbook,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#121216]/95 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('styling')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#e05244] transition-colors">
              Việt Phục Remix
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('styling')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'styling'
                ? 'bg-white/10 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Thử Đồ & Phối Đồ
          </button>
          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'wardrobe'
                ? 'bg-white/10 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Kho Cổ Phục & Remix
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'community'
                ? 'bg-white/10 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#ff7566]" />
            <span>Sàn Diễn Cộng Đồng</span>
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-white/10 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            So Sánh 2 Look
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onOpenSaveLookbook}
            className="px-3 py-1.5 text-xs font-medium text-zinc-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="Lưu Lookbook hiện tại"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#e05244]" />
            <span className="hidden sm:inline">Lưu Look</span>
          </button>

          <button
            onClick={onOpenAi}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#c93b2b] hover:bg-[#b02f20] rounded-lg transition-all shadow-sm hover:shadow-[#c93b2b]/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Stylist</span>
          </button>

          {/* User Profile Avatar Pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors cursor-pointer"
            title={`Hồ sơ cá nhân: ${currentUser.displayName}`}
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-6 h-6 rounded-full border border-white/20 object-cover"
            />
            <span className="text-xs font-medium text-zinc-300 max-w-[85px] truncate hidden sm:inline">
              {currentUser.displayName}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

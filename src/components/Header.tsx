import React from 'react';
import { Sparkles, Bookmark, Users, Sun, Moon } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: 'styling' | 'wardrobe' | 'community' | 'comparison';
  setActiveTab: (tab: 'styling' | 'wardrobe' | 'community' | 'comparison') => void;
  currentUser: UserProfile;
  lookbookCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAi: () => void;
  onOpenSaveLookbook: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  lookbookCount,
  theme,
  onToggleTheme,
  onOpenAi,
  onOpenSaveLookbook,
  onOpenProfile,
}) => {
  const isLight = theme === 'light';

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-md border-b px-4 lg:px-8 py-3 transition-colors ${
        isLight
          ? 'bg-[#ffffff]/95 border-[#e8e2d5] text-[#1c1917]'
          : 'bg-[#121216]/95 border-white/10 text-[#f4f2ee]'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('styling')}
            className="text-left group cursor-pointer focus:outline-none flex items-center gap-2"
          >
            <span
              className={`font-serif text-xl sm:text-2xl font-bold tracking-tight transition-colors ${
                isLight
                  ? 'text-[#1c1917] group-hover:text-[#c93b2b]'
                  : 'text-white group-hover:text-[#ff7566]'
              }`}
            >
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
                ? isLight
                  ? 'bg-stone-200/80 text-stone-900 font-semibold'
                  : 'bg-white/10 text-white font-semibold'
                : isLight
                ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Thử Đồ & Phối Đồ
          </button>
          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'wardrobe'
                ? isLight
                  ? 'bg-stone-200/80 text-stone-900 font-semibold'
                  : 'bg-white/10 text-white font-semibold'
                : isLight
                ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Kho Cổ Phục & Remix
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'community'
                ? isLight
                  ? 'bg-stone-200/80 text-stone-900 font-semibold'
                  : 'bg-white/10 text-white font-semibold'
                : isLight
                ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#c93b2b]" />
            <span>Sàn Diễn Cộng Đồng</span>
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'comparison'
                ? isLight
                  ? 'bg-stone-200/80 text-stone-900 font-semibold'
                  : 'bg-white/10 text-white font-semibold'
                : isLight
                ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            So Sánh 2 Look
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              isLight
                ? 'bg-[#f4efe6] hover:bg-[#e8e0d2] text-amber-700 border-[#ded6c5]'
                : 'bg-white/5 hover:bg-white/10 text-amber-300 border-white/10'
            }`}
            title={
              isLight
                ? 'Chuyển sang giao diện ban đêm (Dark Mode)'
                : 'Chuyển sang giao diện ban ngày (Light Mode)'
            }
            aria-label="Toggle Theme"
          >
            {isLight ? (
              <Moon className="w-4 h-4 text-stone-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-300" />
            )}
          </button>

          <button
            onClick={onOpenSaveLookbook}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap border ${
              isLight
                ? 'bg-[#f6f2ea] hover:bg-[#ede5d6] text-stone-800 border-[#ded6c5]'
                : 'bg-white/5 hover:bg-white/10 text-zinc-200 border-white/10'
            }`}
            title="Lưu Lookbook hiện tại"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#c93b2b]" />
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
            className={`flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full transition-colors cursor-pointer border ${
              isLight
                ? 'bg-[#f6f2ea] hover:bg-[#ece4d3] border-[#ded6c5]'
                : 'bg-white/5 hover:bg-white/10 border-white/10'
            }`}
            title={`Hồ sơ cá nhân: ${currentUser.displayName}`}
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-6 h-6 rounded-full border border-stone-300 dark:border-white/20 object-cover"
            />
            <span
              className={`text-xs font-medium max-w-[85px] truncate hidden sm:inline ${
                isLight ? 'text-stone-800' : 'text-zinc-300'
              }`}
            >
              {currentUser.displayName}
            </span>
          </button>
        </div>
      </div>

      {/* Zone 4: Mobile Responsive Navigation Bar (Thanh Điều Hướng Di Động) */}
      <nav
        aria-label="Thanh điều hướng di động"
        className={`flex md:hidden items-center gap-1 mt-2.5 pt-2 border-t overflow-x-auto pb-1 scrollbar-thin scroll-smooth ${
          isLight ? 'border-stone-200/80' : 'border-white/10'
        }`}
      >
        <button
          onClick={() => setActiveTab('styling')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'styling'
              ? isLight
                ? 'bg-stone-200/90 text-stone-900 font-semibold'
                : 'bg-white/15 text-white font-semibold'
              : isLight
              ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Thử Đồ & Phối Đồ
        </button>
        <button
          onClick={() => setActiveTab('wardrobe')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'wardrobe'
              ? isLight
                ? 'bg-stone-200/90 text-stone-900 font-semibold'
                : 'bg-white/15 text-white font-semibold'
              : isLight
              ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Kho Cổ Phục & Remix
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
            activeTab === 'community'
              ? isLight
                ? 'bg-stone-200/90 text-stone-900 font-semibold'
                : 'bg-white/15 text-white font-semibold'
              : isLight
              ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-3 h-3 text-[#c93b2b]" />
          <span>Sàn Diễn Cộng Đồng</span>
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'comparison'
              ? isLight
                ? 'bg-stone-200/90 text-stone-900 font-semibold'
                : 'bg-white/15 text-white font-semibold'
              : isLight
              ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          So Sánh 2 Look
        </button>
      </nav>
    </header>
  );
};

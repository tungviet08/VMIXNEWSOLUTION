import React, { useState } from 'react';
import { UserProfile, LookbookEntry, OutfitState, CulturalEra } from '../types';
import { userService } from '../services/userService';
import { 
  X, 
  User, 
  Settings, 
  Bookmark, 
  Sparkles, 
  LogOut, 
  UserPlus, 
  LogIn, 
  Check, 
  Trash2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
  savedLookbooks: LookbookEntry[];
  onApplyLookbook: (outfit: OutfitState) => void;
  onDeleteLookbook: (id: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  savedLookbooks,
  onApplyLookbook,
  onDeleteLookbook,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'saved_looks' | 'auth'>('profile');

  // Edit profile state
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [bio, setBio] = useState(currentUser.bio);
  const [title, setTitle] = useState(currentUser.title);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auth switch state
  const [loginUsername, setLoginUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newBio, setNewBio] = useState('');

  // Preferences state
  const [favoriteEra, setFavoriteEra] = useState<CulturalEra>(currentUser.preferences.favoriteEra);
  const [preferredVibe, setPreferredVibe] = useState(currentUser.preferences.preferredVibe);
  const [defaultAvatar, setDefaultAvatar] = useState(currentUser.preferences.defaultAvatar);
  const [enableTips, setEnableTips] = useState(currentUser.preferences.enableCulturalTips);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = userService.updateProfile({
      displayName,
      bio,
      title
    });
    onUserChange(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSavePreferences = () => {
    const updated = userService.updateProfile({
      preferences: {
        favoriteEra,
        preferredVibe,
        defaultAvatar,
        enableCulturalTips: enableTips
      }
    });
    onUserChange(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim()) return;
    const user = userService.login(loginUsername.trim());
    onUserChange(user);
    setDisplayName(user.displayName);
    setBio(user.bio);
    setTitle(user.title);
    setFavoriteEra(user.preferences.favoriteEra);
    setPreferredVibe(user.preferences.preferredVibe);
    setDefaultAvatar(user.preferences.defaultAvatar);
    setEnableTips(user.preferences.enableCulturalTips);
    setActiveTab('profile');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    const user = userService.createAccount(newUsername.trim(), newDisplayName.trim(), newBio.trim());
    onUserChange(user);
    setDisplayName(user.displayName);
    setBio(user.bio);
    setTitle(user.title);
    setActiveTab('profile');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#16161b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header & User Hero */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-[#1c1c24] via-[#1c1c22] to-[#251b1f] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-12 h-12 rounded-full border-2 border-[#c93b2b] object-cover shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#16161b]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-white tracking-tight">
                  {currentUser.displayName}
                </h3>
                <span className="text-[11px] px-2 py-0.5 bg-[#c93b2b]/20 text-[#ff7566] border border-[#c93b2b]/30 rounded-md font-medium">
                  {currentUser.title}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                @{currentUser.username} · Tham gia {currentUser.joinedDate}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-white/5 bg-[#141418] text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3.5 py-2 font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#c93b2b] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Hồ Sơ & Bio</span>
          </button>

          <button
            onClick={() => setActiveTab('saved_looks')}
            className={`flex items-center gap-1.5 px-3.5 py-2 font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'saved_looks'
                ? 'border-[#c93b2b] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Outfit Đã Lưu ({savedLookbooks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-1.5 px-3.5 py-2 font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-[#c93b2b] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Tùy Chọn Phối Đồ</span>
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className={`flex items-center gap-1.5 px-3.5 py-2 font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'auth'
                ? 'border-[#c93b2b] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Tài Khoản</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 scrollbar-thin">
          {saveSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Đã cập nhật thông tin thành công vào bộ nhớ cục bộ (Local Storage)!</span>
            </div>
          )}

          {/* TAB 1: PROFILE EDIT */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm text-zinc-300">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Tên hiển thị</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c93b2b]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Danh hiệu Stylist</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c93b2b]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Tiểu sử (Bio)</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Giới thiệu phong cách và đam mê của bạn với cổ phục Việt..."
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c93b2b] resize-none"
                />
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-zinc-400 flex items-center justify-between">
                <span>Trạng thái lưu trữ:</span>
                <span className="text-zinc-200 font-mono">LocalStorage Verified</span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c93b2b] hover:bg-[#b02f20] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-[#c93b2b]/20"
                >
                  Lưu Thông Tin Hồ Sơ
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SAVED LOOKS */}
          {activeTab === 'saved_looks' && (
            <div className="space-y-3">
              {savedLookbooks.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 space-y-2">
                  <Bookmark className="w-8 h-8 mx-auto text-zinc-600" />
                  <p className="text-xs">Bạn chưa lưu lookbook nào.</p>
                  <p className="text-[11px] text-zinc-600">
                    Hãy bấm nút "Lưu Lookbook" ở góc trên màn hình khi phối xong trang phục ưng ý!
                  </p>
                </div>
              ) : (
                savedLookbooks.map((look) => (
                  <div
                    key={look.id}
                    className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl flex items-center justify-between gap-3 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold text-white text-xs sm:text-sm">
                        {look.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {look.eventName} · {look.createdAt} · Hòa sắc {look.colorHarmonyScore}/100
                      </p>
                      {look.notes && (
                        <p className="text-[11px] text-zinc-500 italic mt-1 line-clamp-1">
                          "{look.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onApplyLookbook(look.outfit);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-[#c93b2b]/20 hover:bg-[#c93b2b] text-[#ff7566] hover:text-white border border-[#c93b2b]/30 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                        title="Mặc lại set đồ này lên Avatar"
                      >
                        <span>Mặc Ngay</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDeleteLookbook(look.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        title="Xóa khỏi danh sách lưu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Triều đại / Thời kỳ yêu thích</label>
                <select
                  value={favoriteEra}
                  onChange={(e) => setFavoriteEra(e.target.value as CulturalEra)}
                  className="w-full px-3 py-2 bg-[#202026] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c93b2b]"
                >
                  <option value="Triều Nguyễn (1802–1945)">Triều Nguyễn (1802–1945) - Ngũ thân, Áo tấc, Nhật bình</option>
                  <option value="Triều Lê (1428–1789)">Triều Lê (1428–1789) - Giao lĩnh, Trực lĩnh</option>
                  <option value="Dân gian Đồng bằng Bắc Bộ">Dân gian Bắc Bộ - Tứ thân, Yếm đào, Nón quai thao</option>
                  <option value="Tân thời (1930–1950s)">Tân thời 1930s - Áo dài Lemur, Lê Phổ</option>
                  <option value="Hiện đại / Remix">Hiện đại / Remix đường phố</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Phong cách định hướng</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Cổ phong thuần túy', 'Remix đường phố', 'Vị lai Minimalist'] as const).map((vibe) => (
                    <button
                      key={vibe}
                      type="button"
                      onClick={() => setPreferredVibe(vibe)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        preferredVibe === vibe
                          ? 'bg-[#c93b2b]/20 border-[#c93b2b] text-white'
                          : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {vibe}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Dáng Avatar mặc định</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'female', label: 'Nữ Cổ Phong' },
                    { id: 'male', label: 'Nam Sĩ Tử' },
                    { id: 'unisex', label: 'Unisex' },
                    { id: 'cyber', label: 'Cyber Gen Z' }
                  ].map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setDefaultAvatar(av.id as any)}
                      className={`p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        defaultAvatar === av.id
                          ? 'bg-[#c93b2b]/20 border-[#c93b2b] text-white'
                          : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {av.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-white text-xs">Cảnh báo văn hóa thông minh</h5>
                  <p className="text-[11px] text-zinc-400">Hiển thị gợi ý & giải thích lịch sử khi có phối đồ nhầm lẫn.</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableTips}
                  onChange={(e) => setEnableTips(e.target.checked)}
                  className="w-4 h-4 accent-[#c93b2b] cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-5 py-2 bg-[#c93b2b] hover:bg-[#b02f20] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-[#c93b2b]/20"
                >
                  Lưu Tùy Chọn
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: AUTH & SWITCH USER */}
          {activeTab === 'auth' && (
            <div className="space-y-6 text-xs sm:text-sm text-zinc-300">
              {/* Sign in with existing username */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                  <LogIn className="w-4 h-4 text-[#c93b2b]" />
                  <h4>Đăng Nhập Hoặc Chuyển Đổi Tài Khoản</h4>
                </div>
                <form onSubmit={handleLogin} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nhập username (VD: ancophong)..."
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c93b2b]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#c93b2b] hover:bg-[#b02f20] text-white rounded-xl font-semibold cursor-pointer whitespace-nowrap"
                  >
                    Chuyển Tài Khoản
                  </button>
                </form>
              </div>

              {/* Create new account */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  <h4>Tạo Tài Khoản Stylist Mới</h4>
                </div>
                <form onSubmit={handleRegister} className="space-y-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Username mới (viết liền không dấu)..."
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Tên hiển thị (VD: Hà Linh Cổ Phong)..."
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold cursor-pointer"
                  >
                    Đăng Ký & Khởi Tạo Bộ Sưu Tập Mới
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

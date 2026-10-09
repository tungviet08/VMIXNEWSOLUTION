import React, { useState } from 'react';
import { 
  GroupMember, 
  GroupOccasionId, 
  CoordinationMode, 
  ClothingItem, 
  OutfitState,
  ElementType 
} from '../types';
import { 
  GROUP_OCCASIONS, 
  GROUP_PRESET_THEMES, 
  calculateGroupMatch,
  FEMALE_STARTER_PRESETS,
  MALE_STARTER_PRESETS,
  UNISEX_STARTER_PRESETS,
  GenderStarterOutfit
} from '../utils/groupHarmony';
import { MiniAvatarCanvas } from './MiniAvatarCanvas';
import { TRADITIONAL_COLORS } from '../data/colorsData';
import { 
  Users, 
  Heart, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  ArrowRightLeft, 
  Copy, 
  Compass, 
  Sliders, 
  X, 
  Wand2, 
  HelpCircle,
  Share2,
  BookmarkCheck,
  Palette,
  UserPlus
} from 'lucide-react';

interface GroupCoordinationViewProps {
  wardrobe: ClothingItem[];
  itemsMap: Record<string, ClothingItem>;
  mainOutfit: OutfitState;
  onApplyOutfitToMain: (outfit: OutfitState) => void;
  theme?: 'dark' | 'light';
}

export const GroupCoordinationView: React.FC<GroupCoordinationViewProps> = ({
  wardrobe,
  itemsMap,
  mainOutfit,
  onApplyOutfitToMain,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  // Mode: 'couple' | 'group'
  const [mode, setMode] = useState<CoordinationMode>('couple');
  const [occasionId, setOccasionId] = useState<GroupOccasionId>('xuan_hoi');

  // Members state initialized with the first couple preset
  const [members, setMembers] = useState<GroupMember[]>(() => {
    const couplePreset = GROUP_PRESET_THEMES.find(t => t.id === 'couple-royal-nguyen')!;
    return couplePreset.members.map((m, idx) => ({
      id: `member-${Date.now()}-${idx}`,
      name: m.name,
      role: m.role,
      avatarType: m.avatarType,
      outfit: { ...m.outfit }
    }));
  });

  // Modal / Drawer state for editing a specific member
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<keyof OutfitState['colors']>('outer');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Member Modal State (Chọn Giới Tính Khi Thêm Bạn)
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberGender, setNewMemberGender] = useState<'female' | 'male' | 'unisex'>('female');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Bạn thân');
  const [newMemberPresetId, setNewMemberPresetId] = useState<string>('female_ngu_than');
  const [drawerGenderFilter, setDrawerGenderFilter] = useState<'all' | 'female' | 'male' | 'unisex'>('all');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Switch mode handler
  const handleSwitchMode = (newMode: CoordinationMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    if (newMode === 'couple') {
      const preset = GROUP_PRESET_THEMES.find(t => t.mode === 'couple')!;
      setMembers(preset.members.map((m, idx) => ({
        id: `member-${Date.now()}-${idx}`,
        name: m.name,
        role: m.role,
        avatarType: m.avatarType,
        outfit: { ...m.outfit }
      })));
      showToast('Đã chuyển sang chế độ Phối Đồ Cặp Đôi (2 người) 💕');
    } else {
      const preset = GROUP_PRESET_THEMES.find(t => t.mode === 'group')!;
      setMembers(preset.members.map((m, idx) => ({
        id: `member-${Date.now()}-${idx}`,
        name: m.name,
        role: m.role,
        avatarType: m.avatarType,
        outfit: { ...m.outfit }
      })));
      showToast('Đã chuyển sang chế độ Phối Đồ Nhóm Bạn (3-5 người) 👥');
    }
  };

  // Apply curated preset
  const handleApplyPreset = (presetId: string) => {
    const preset = GROUP_PRESET_THEMES.find(t => t.id === presetId);
    if (!preset) return;
    setMode(preset.mode);
    setOccasionId(preset.occasionId);
    setMembers(preset.members.map((m, idx) => ({
      id: `member-${Date.now()}-${idx}`,
      name: m.name,
      role: m.role,
      avatarType: m.avatarType,
      outfit: { ...m.outfit }
    })));
    showToast(`Đã áp dụng set mẫu "${preset.title}" ✨`);
  };

  // Quick Add Member by Gender
  const handleQuickAddMember = (gender: 'female' | 'male' | 'unisex') => {
    if (members.length >= 5) {
      showToast('Tối đa 5 thành viên trong một đội hình nhóm!');
      return;
    }
    const newIdx = members.length + 1;
    const starterPreset = gender === 'female'
      ? FEMALE_STARTER_PRESETS[0]
      : gender === 'male'
      ? MALE_STARTER_PRESETS[0]
      : UNISEX_STARTER_PRESETS[0];

    const defaultNamesFemale = ['Lan Anh', 'Minh Thư', 'Ngọc Mai', 'Phương Linh', 'Hà My'];
    const defaultNamesMale = ['Hoàng Nam', 'Quang Huy', 'Tuấn Kiệt', 'Đức Anh', 'Bảo Long'];
    const defaultNamesUnisex = ['Alex', 'Hải Đăng', 'Quân', 'Châu', 'Bình'];

    const suggestedName = gender === 'female'
      ? defaultNamesFemale[newIdx % defaultNamesFemale.length]
      : gender === 'male'
      ? defaultNamesMale[newIdx % defaultNamesMale.length]
      : defaultNamesUnisex[newIdx % defaultNamesUnisex.length];

    const newMember: GroupMember = {
      id: `member-${Date.now()}-${newIdx}`,
      name: suggestedName,
      role: `Thành viên ${newIdx}`,
      avatarType: gender === 'unisex' ? 'cyber' : gender,
      outfit: JSON.parse(JSON.stringify(starterPreset.outfit))
    };

    setMembers([...members, newMember]);
    showToast(`Đã thêm ${gender === 'female' ? '👩 Bạn Nữ' : gender === 'male' ? '👨 Bạn Nam' : '⚡ Bạn Unisex'} "${newMember.name}" vào nhóm! ✨`);
  };

  // Open Add Member Modal with preselected gender
  const handleOpenAddModal = (gender: 'female' | 'male' | 'unisex' = 'female') => {
    if (members.length >= 5) {
      showToast('Tối đa 5 thành viên trong một đội hình nhóm!');
      return;
    }
    setNewMemberGender(gender);
    const presetsList = gender === 'female' ? FEMALE_STARTER_PRESETS : gender === 'male' ? MALE_STARTER_PRESETS : UNISEX_STARTER_PRESETS;
    setNewMemberPresetId(presetsList[0].id);
    const newIdx = members.length + 1;
    setNewMemberName(gender === 'female' ? `Bạn Nữ ${newIdx}` : gender === 'male' ? `Bạn Nam ${newIdx}` : `Bạn Gen Z ${newIdx}`);
    setNewMemberRole('Bạn thân');
    setIsAddMemberModalOpen(true);
  };

  // Confirm addition from Modal
  const handleConfirmAddMember = () => {
    if (members.length >= 5) {
      showToast('Tối đa 5 thành viên trong một đội hình nhóm!');
      return;
    }
    const newIdx = members.length + 1;
    const presetsList = newMemberGender === 'female'
      ? FEMALE_STARTER_PRESETS
      : newMemberGender === 'male'
      ? MALE_STARTER_PRESETS
      : UNISEX_STARTER_PRESETS;

    const chosenPreset = presetsList.find(p => p.id === newMemberPresetId) || presetsList[0];
    const finalName = newMemberName.trim() || (newMemberGender === 'female' ? `Bạn Nữ ${newIdx}` : newMemberGender === 'male' ? `Bạn Nam ${newIdx}` : `Bạn Gen Z ${newIdx}`);

    const newMember: GroupMember = {
      id: `member-${Date.now()}-${newIdx}`,
      name: finalName,
      role: newMemberRole.trim() || `Thành viên ${newIdx}`,
      avatarType: newMemberGender === 'unisex' ? 'cyber' : newMemberGender,
      outfit: JSON.parse(JSON.stringify(chosenPreset.outfit))
    };

    setMembers([...members, newMember]);
    setIsAddMemberModalOpen(false);
    showToast(`Đã thêm thành viên "${newMember.name}" (${newMemberGender === 'female' ? 'Nữ' : newMemberGender === 'male' ? 'Nam' : 'Unisex'}) vào nhóm! ✨`);
  };

  // Apply gender starter outfit to an existing member
  const handleApplyGenderPresetToMember = (memberId: string, gender: 'female' | 'male' | 'unisex') => {
    const presetsList = gender === 'female' ? FEMALE_STARTER_PRESETS : gender === 'male' ? MALE_STARTER_PRESETS : UNISEX_STARTER_PRESETS;
    const starterPreset = presetsList[0];

    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          avatarType: gender === 'unisex' ? 'cyber' : gender,
          outfit: JSON.parse(JSON.stringify(starterPreset.outfit))
        };
      }
      return m;
    }));

    showToast(`Đã áp dụng set đồ ${gender === 'female' ? 'Nữ' : gender === 'male' ? 'Nam' : 'Unisex'} chuẩn cho thành viên này! ✨`);
  };

  // Remove member (minimum 2)
  const handleRemoveMember = (id: string) => {
    if (members.length <= 2) {
      showToast('Cần duy trì ít nhất 2 người để phối đồ nhóm!');
      return;
    }
    setMembers(members.filter(m => m.id !== id));
    showToast('Đã bớt một thành viên khỏi nhóm.');
  };

  // Update member properties
  const handleUpdateMember = (id: string, updates: Partial<GroupMember>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  // Copy main model outfit to member
  const handleCopyFromMain = (memberId: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          outfit: JSON.parse(JSON.stringify(mainOutfit))
        };
      }
      return m;
    }));
    showToast('Đã sao chép set đồ đang thử ở trang chính vào thành viên này! 👗');
  };

  // Apply member outfit to main model
  const handleApplyToMain = (outfit: OutfitState) => {
    onApplyOutfitToMain(outfit);
    showToast('Đã chuyển trang phục của thành viên này sang phòng Thử Đồ chính! ✨');
  };

  // Auto-harmonize colors across group
  const handleAutoHarmonizeColors = (style: 'royal' | 'pastel' | 'elemental' | 'vermilion') => {
    setMembers(prev => prev.map((m, idx) => {
      let chosenOuter = m.outfit.colors.outer;
      let chosenHeadwear = m.outfit.colors.headwear;

      if (style === 'royal') {
        const royalColors = ['#DDA032', '#1D3B53', '#5B3758', '#B82626', '#165B58'];
        chosenOuter = royalColors[idx % royalColors.length];
        chosenHeadwear = '#1A1A1E';
      } else if (style === 'pastel') {
        const pastelColors = ['#D9738A', '#F4EFE6', '#E6C687', '#165B58', '#DDA032'];
        chosenOuter = pastelColors[idx % pastelColors.length];
        chosenHeadwear = '#5B3758';
      } else if (style === 'elemental') {
        // Kim - Mộc - Thủy - Hỏa - Thổ
        const elementalColors = ['#F4EFE6', '#165B58', '#1D3B53', '#B82626', '#DDA032'];
        chosenOuter = elementalColors[idx % elementalColors.length];
      } else if (style === 'vermilion') {
        const vermilionTheme = ['#B82626', '#DDA032', '#D9738A', '#1D3B53', '#F4EFE6'];
        chosenOuter = vermilionTheme[idx % vermilionTheme.length];
      }

      return {
        ...m,
        outfit: {
          ...m.outfit,
          colors: {
            ...m.outfit.colors,
            outer: chosenOuter,
            headwear: chosenHeadwear
          }
        }
      };
    }));
    showToast('Đã tự động phối dải màu ăn ý cho cả đội hình! 🎨');
  };

  // Calculate Match Score & Detailed Analytics
  const matchResult = calculateGroupMatch(members, occasionId, itemsMap);
  const currentOccasion = GROUP_OCCASIONS.find(o => o.id === occasionId) || GROUP_OCCASIONS[0];
  const editingMember = members.find(m => m.id === editingMemberId);

  // Available garments filtered by active slot and gender in editor drawer
  const slotItems = wardrobe.filter(item => {
    if (item.category !== activeSlot) return false;
    if (drawerGenderFilter === 'female') {
      if (item.genderContext && item.genderContext !== 'female' && item.genderContext !== 'unisex') return false;
    } else if (drawerGenderFilter === 'male') {
      if (item.genderContext && item.genderContext !== 'male' && item.genderContext !== 'unisex') return false;
    } else if (drawerGenderFilter === 'unisex') {
      if (item.genderContext !== 'unisex') return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#c93b2b] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Control Zone */}
      <div
        className={`rounded-2xl border p-5 sm:p-6 shadow-sm transition-colors ${
          isLight
            ? 'bg-gradient-to-br from-white via-[#fbf9f5] to-[#f4eee2] border-[#e7e1d5] text-[#1c1917]'
            : 'bg-gradient-to-br from-[#18181f] via-[#141419] to-[#0f0f13] border-white/10 text-white'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-5 mb-5 border-black/5 dark:border-white/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#c93b2b]/10 text-[#c93b2b]">
                <Users className="w-5 h-5" />
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                Phối Đồ Cặp Đôi & Nhóm Bạn Đi Chơi
              </h2>
            </div>
            <p className={`text-xs sm:text-sm max-w-2xl ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
              Khi một nhóm đi chơi, du xuân, chụp ảnh kỷ yếu hay dự tiệc, trang phục cần phải ăn ý, hòa sắc ngũ hành và đồng điệu thời kỳ để lên hình tuyệt mỹ.
            </p>
          </div>

          {/* Mode Switcher Pills */}
          <div
            className={`p-1 rounded-xl border flex items-center gap-1 shrink-0 ${
              isLight ? 'bg-stone-100 border-[#ded6c5]' : 'bg-white/5 border-white/10'
            }`}
          >
            <button
              onClick={() => handleSwitchMode('couple')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'couple'
                  ? 'bg-[#c93b2b] text-white shadow-xs'
                  : isLight
                  ? 'text-stone-600 hover:text-stone-900'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Cặp Đôi (2 Người)</span>
            </button>
            <button
              onClick={() => handleSwitchMode('group')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'group'
                  ? 'bg-[#c93b2b] text-white shadow-xs'
                  : isLight
                  ? 'text-stone-600 hover:text-stone-900'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Nhóm Bạn ({members.length} Người)</span>
            </button>
          </div>
        </div>

        {/* Occasions Selector Bar */}
        <div className="space-y-2 mb-5">
          <label className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
            Mục Đích & Bối Cảnh Chuyến Đi Chơi:
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {GROUP_OCCASIONS.map(occ => {
              const isActive = occ.id === occasionId;
              return (
                <button
                  key={occ.id}
                  onClick={() => {
                    setOccasionId(occ.id);
                    showToast(`Bối cảnh: ${occ.name}`);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all shrink-0 text-left cursor-pointer ${
                    isActive
                      ? isLight
                        ? 'bg-[#c93b2b] text-white border-[#c93b2b] shadow-xs'
                        : 'bg-[#c93b2b] text-white border-[#c93b2b] shadow-md'
                      : isLight
                      ? 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
                  }`}
                >
                  <div className="font-semibold">{occ.name}</div>
                  <div className={`text-[10px] truncate max-w-[160px] opacity-80`}>
                    {occ.vibe}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* One-Click Presets Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-medium ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
              Gợi ý set mẫu chuẩn đẹp:
            </span>
            {GROUP_PRESET_THEMES.filter(p => p.mode === mode).map(preset => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className={`px-2.5 py-1 rounded-lg text-xs border font-medium transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-stone-100 text-stone-800 border-[#ded6c5]'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
                }`}
                title={preset.description}
              >
                {preset.title.split('(')[0].trim()}
              </button>
            ))}
          </div>

          {/* Quick Auto-Harmonize Dropdown / Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[11px] font-medium ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
              Đồng bộ màu:
            </span>
            <button
              onClick={() => handleAutoHarmonizeColors('royal')}
              className={`px-2 py-0.5 rounded text-[11px] border font-medium transition-colors cursor-pointer ${
                isLight ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200' : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/20'
              }`}
            >
              Hoàng Gia
            </button>
            <button
              onClick={() => handleAutoHarmonizeColors('pastel')}
              className={`px-2 py-0.5 rounded text-[11px] border font-medium transition-colors cursor-pointer ${
                isLight ? 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-200' : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/20'
              }`}
            >
              Pastel Sen
            </button>
            <button
              onClick={() => handleAutoHarmonizeColors('elemental')}
              className={`px-2 py-0.5 rounded text-[11px] border font-medium transition-colors cursor-pointer ${
                isLight ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/20'
              }`}
            >
              Ngũ Hành
            </button>
          </div>
        </div>
      </div>

      {/* Main Showcase Stage: Side-by-Side Multi-Avatar Canvas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className={`font-serif text-lg font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
              Đội Hình Phối Đồ Hiện Tại ({members.length} Người)
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold tabular-nums ${
              matchResult.overallScore >= 90
                ? isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : isLight ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
            }`}>
              Độ match: {matchResult.overallScore}% · {matchResult.grade}
            </span>
          </div>

          {mode === 'group' && members.length < 5 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => handleQuickAddMember('female')}
                className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                title="Thêm nhanh 1 bạn nữ với trang phục Nữ truyền thống"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Bạn Nữ 👩</span>
              </button>
              <button
                onClick={() => handleQuickAddMember('male')}
                className="px-2.5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                title="Thêm nhanh 1 bạn nam với trang phục Nam truyền thống"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Bạn Nam 👨</span>
              </button>
              <button
                onClick={() => handleOpenAddModal('female')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border shadow-xs cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-stone-100 text-stone-800 border-stone-200'
                    : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                }`}
                title="Mở bảng chọn giới tính, đặt tên và chọn set trang phục tùy chỉnh"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#c93b2b]" />
                <span>Tùy Chọn Thêm Bạn ⚙️</span>
              </button>
            </div>
          )}
        </div>

        {/* Multi-member Grid */}
        <div className={`grid grid-cols-1 ${
          members.length === 2 
            ? 'sm:grid-cols-2 max-w-4xl mx-auto' 
            : members.length === 3 
            ? 'sm:grid-cols-3' 
            : members.length === 4 
            ? 'sm:grid-cols-2 lg:grid-cols-4' 
            : 'sm:grid-cols-2 lg:grid-cols-5'
        } gap-4`}>
          {members.map((member, index) => {
            const outerItem = member.outfit.outerId ? itemsMap[member.outfit.outerId] : null;
            const headwearItem = member.outfit.headwearId ? itemsMap[member.outfit.headwearId] : null;
            const dominantEl = matchResult.memberElements.find(me => me.memberId === member.id)?.dominantElement || 'Thổ';

            return (
              <div
                key={member.id}
                className={`rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
                  editingMemberId === member.id
                    ? isLight
                      ? 'bg-white border-[#c93b2b] ring-2 ring-[#c93b2b]/20 shadow-lg'
                      : 'bg-[#181822] border-[#c93b2b] ring-2 ring-[#c93b2b]/30 shadow-xl'
                    : isLight
                    ? 'bg-white border-[#e7e1d5] hover:border-stone-400 shadow-sm'
                    : 'bg-[#141419] border-white/10 hover:border-white/20'
                }`}
              >
                {/* Member Card Header */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#c93b2b] text-white text-[11px] font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleUpdateMember(member.id, { name: e.target.value })}
                        className={`text-xs font-bold bg-transparent border-b border-transparent hover:border-current focus:border-[#c93b2b] focus:outline-none transition-colors w-28 truncate ${
                          isLight ? 'text-stone-900' : 'text-white'
                        }`}
                        title="Bấm để đổi tên thành viên"
                      />
                    </div>

                    {mode === 'group' && members.length > 2 && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className={`p-1 rounded-md text-stone-400 hover:text-rose-500 transition-colors cursor-pointer`}
                        title="Xóa thành viên này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Gender Selection & Element Pill */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1 text-[11px]">
                      {/* 3-way Gender Selector */}
                      <div className={`flex items-center gap-0.5 p-0.5 rounded-lg border ${
                        isLight ? 'bg-stone-100 border-stone-200' : 'bg-black/40 border-white/10'
                      }`}>
                        <button
                          onClick={() => handleUpdateMember(member.id, { avatarType: 'female' })}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                            member.avatarType === 'female'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900'
                          }`}
                          title="Chọn hình mẫu Nữ (Nàng thơ)"
                        >
                          👩 Nữ
                        </button>
                        <button
                          onClick={() => handleUpdateMember(member.id, { avatarType: 'male' })}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                            member.avatarType === 'male'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900'
                          }`}
                          title="Chọn hình mẫu Nam (Sĩ tử)"
                        >
                          👨 Nam
                        </button>
                        <button
                          onClick={() => handleUpdateMember(member.id, { avatarType: 'cyber' })}
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                            member.avatarType === 'cyber' || member.avatarType === 'unisex'
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900'
                          }`}
                          title="Phi giới tính / Cyber Gen Z"
                        >
                          ⚡ Unisex
                        </button>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                        dominantEl === 'Kim' ? 'bg-stone-200 text-stone-800' :
                        dominantEl === 'Mộc' ? 'bg-emerald-100 text-emerald-800' :
                        dominantEl === 'Thủy' ? 'bg-cyan-100 text-cyan-800' :
                        dominantEl === 'Hỏa' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        Hành {dominantEl}
                      </span>
                    </div>

                    {/* Quick outfit match button for member gender */}
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`truncate text-[10px] ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                        {member.role || 'Thành viên'}
                      </span>
                      <button
                        onClick={() => handleApplyGenderPresetToMember(
                          member.id, 
                          member.avatarType === 'female' ? 'female' : member.avatarType === 'male' ? 'male' : 'unisex'
                        )}
                        className={`text-[10px] underline font-medium hover:text-[#c93b2b] cursor-pointer transition-colors ${
                          isLight ? 'text-stone-600' : 'text-zinc-400'
                        }`}
                        title="Đổi toàn bộ trang phục sang set mẫu chuẩn của giới tính này"
                      >
                        Đổi set {member.avatarType === 'male' ? 'Nam' : member.avatarType === 'female' ? 'Nữ' : 'Unisex'} mẫu
                      </button>
                    </div>
                  </div>
                </div>

                {/* Avatar Visualizer Canvas for this member */}
                <div className={`relative h-[280px] w-full rounded-xl border flex items-center justify-center overflow-hidden p-2 transition-colors ${
                  isLight ? 'bg-[#fcfaf7] border-stone-200' : 'bg-[#0f0f14] border-white/5'
                }`}>
                  <MiniAvatarCanvas
                    outfit={member.outfit}
                    avatarType={member.avatarType}
                    itemsMap={itemsMap}
                    className="w-full h-full"
                  />

                  {/* Quick Color Swatch Dots on Canvas */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-1 rounded-full">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/30"
                      style={{ backgroundColor: member.outfit.colors.outer }}
                      title="Màu áo ngoài"
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/30"
                      style={{ backgroundColor: member.outfit.colors.headwear }}
                      title="Màu khăn/mấn"
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/30"
                      style={{ backgroundColor: member.outfit.colors.bottom }}
                      title="Màu quần/váy"
                    />
                  </div>
                </div>

                {/* Garments Summary */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className={`flex items-center justify-between text-[11px] ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                    <span>Áo chính:</span>
                    <span className={`font-semibold truncate max-w-[130px] ${isLight ? 'text-stone-800' : 'text-zinc-200'}`}>
                      {outerItem ? outerItem.name : 'Chưa mặc'}
                    </span>
                  </div>
                  <div className={`flex items-center justify-between text-[11px] ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                    <span>Khăn/Mấn:</span>
                    <span className={`truncate max-w-[130px] ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>
                      {headwearItem ? headwearItem.name : 'Để đầu trần'}
                    </span>
                  </div>
                </div>

                {/* Member Card Action Buttons */}
                <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 space-y-1.5">
                  <button
                    onClick={() => {
                      setEditingMemberId(member.id);
                      setActiveSlot('outer');
                    }}
                    className="w-full py-2 bg-[#c93b2b] hover:bg-[#b02f20] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Chọn Đồ & Đổi Màu</span>
                  </button>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleCopyFromMain(member.id)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                        isLight
                          ? 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
                      }`}
                      title="Lấy set đồ bạn đang thử ở trang chính cho người này"
                    >
                      <Copy className="w-3 h-3 text-[#c93b2b]" />
                      <span>Lấy đồ chính</span>
                    </button>

                    <button
                      onClick={() => handleApplyToMain(member.outfit)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                        isLight
                          ? 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
                      }`}
                      title="Mặc bộ đồ này cho model chính của bạn"
                    >
                      <ArrowRightLeft className="w-3 h-3 text-emerald-600" />
                      <span>Mặc cho tôi</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Squad Match Report & Analysis Breakdown */}
      <div
        className={`rounded-2xl border p-5 sm:p-6 transition-colors ${
          isLight ? 'bg-white border-[#e7e1d5]' : 'bg-[#181820] border-white/10'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4 mb-5 border-black/5 dark:border-white/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#c93b2b]" />
              <h3 className={`font-serif text-lg font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>
                Báo Cáo Độ Ăn Ý & Hòa Hợp Cả Đội Hình
              </h3>
            </div>
            <p className={`text-xs ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
              Đánh giá toàn diện 4 tiêu chuẩn mỹ thuật & văn hóa truyền thống khi đi chơi nhóm
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-black text-[#c93b2b] tabular-nums">
                {matchResult.overallScore}%
              </div>
              <div className={`text-[11px] font-semibold ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
                {matchResult.grade}
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Summary */}
        <div className={`p-4 rounded-xl border mb-5 text-xs sm:text-sm leading-relaxed ${
          isLight ? 'bg-[#fbf9f5] border-[#ded6c5] text-stone-800' : 'bg-white/5 border-white/5 text-zinc-300'
        }`}>
          {matchResult.summary}
        </div>

        {/* 4 Detailed Criteria Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {matchResult.criteria.map(crit => {
            const pct = Math.round((crit.score / crit.maxScore) * 100);
            return (
              <div
                key={crit.id}
                className={`p-3.5 rounded-xl border space-y-2 ${
                  isLight ? 'bg-stone-50 border-stone-200' : 'bg-white/[0.03] border-white/5'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isLight ? 'text-stone-800' : 'text-zinc-200'}`}>
                    {crit.name}
                  </span>
                  <span className="font-bold text-[#c93b2b] tabular-nums">
                    {crit.score}/{crit.maxScore}đ
                  </span>
                </div>

                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-stone-200' : 'bg-white/10'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className={`text-[11px] ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
                  {crit.comment}
                </p>
              </div>
            );
          })}
        </div>

        {/* Elemental Synergies & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Elemental Synergy Flow */}
          <div
            className={`p-4 rounded-xl border space-y-2.5 ${
              isLight ? 'bg-[#fcfaf7] border-stone-200' : 'bg-white/[0.02] border-white/5'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#c93b2b]">
              <Sparkles className="w-4 h-4" />
              <span>Dòng Chảy Tương Sinh & Hòa Sắc Giữa Các Bạn</span>
            </div>
            {matchResult.elementSynergies.length > 0 ? (
              <div className="space-y-1.5">
                {matchResult.elementSynergies.map((syn, idx) => (
                  <div
                    key={idx}
                    className={`text-xs p-2 rounded-lg border flex items-center gap-2 ${
                      isLight ? 'bg-white border-stone-200 text-stone-700' : 'bg-white/5 border-white/5 text-zinc-300'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{syn}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-xs italic ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                Các trang phục đang ở trạng thái cân bằng độc lập. Hãy thử chỉnh màu để tạo cặp tương sinh!
              </p>
            )}
          </div>

          {/* AI Stylist Recommendations */}
          <div
            className={`p-4 rounded-xl border space-y-2.5 ${
              isLight ? 'bg-[#fcfaf7] border-stone-200' : 'bg-white/[0.02] border-white/5'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Wand2 className="w-4 h-4" />
              <span>Lời Khuyên Stylist Để Nhóm Lên Hình Chuẩn 100%</span>
            </div>
            <div className="space-y-1.5">
              {matchResult.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`text-xs p-2 rounded-lg border flex items-start gap-2 ${
                    isLight ? 'bg-white border-stone-200 text-stone-700' : 'bg-white/5 border-white/5 text-zinc-300'
                  }`}
                >
                  <span className="text-[#c93b2b] font-bold">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Member Wardrobe & Color Drawer Modal */}
      {editingMember && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingMemberId(null);
          }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn ${
            isLight ? 'bg-stone-900/40' : 'bg-black/75'
          }`}
        >
          <div
            className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${
              isLight ? 'bg-white border-stone-300 text-stone-900' : 'bg-[#181820] border-white/10 text-white'
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-4 border-b flex items-center justify-between ${
                isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#1c1c24] border-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#c93b2b]" />
                <div>
                  <h4 className="font-bold text-sm">
                    Tùy Chỉnh Trang Phục: {editingMember.name}
                  </h4>
                  <p className={`text-[11px] ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                    Chọn áo, quần, nón và màu sắc ngũ hành tương thích với cả nhóm
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingMemberId(null)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'hover:bg-stone-200 text-stone-500' : 'hover:bg-white/10 text-zinc-400'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              {/* Category Slot Switcher */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {(['outer', 'headwear', 'bottom', 'inner', 'footwear', 'accessory'] as const).map(slot => (
                  <button
                    key={slot}
                    onClick={() => setActiveSlot(slot)}
                    className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer ${
                      activeSlot === slot
                        ? 'bg-[#c93b2b] text-white shadow-xs'
                        : isLight
                        ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                    }`}
                  >
                    {slot === 'outer' && 'Áo Ngoài'}
                    {slot === 'headwear' && 'Khăn / Mấn'}
                    {slot === 'bottom' && 'Quần / Váy'}
                    {slot === 'inner' && 'Áo Trong'}
                    {slot === 'footwear' && 'Giày / Guốc'}
                    {slot === 'accessory' && 'Phụ Kiện'}
                  </button>
                ))}
              </div>

              {/* Color Swatch Picker for Current Slot */}
              <div className={`p-3 rounded-xl border space-y-2 ${
                isLight ? 'bg-stone-50 border-stone-200' : 'bg-white/5 border-white/5'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#c93b2b]" />
                    <span>Màu Sắc Cổ Truyền Ngũ Hành:</span>
                  </span>
                  <span className={`text-[11px] font-medium ${isLight ? 'text-stone-600' : 'text-zinc-300'}`}>
                    Đang chọn: {editingMember.outfit.colors[activeSlot]}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {TRADITIONAL_COLORS.map(c => {
                    const isSelected = editingMember.outfit.colors[activeSlot].toUpperCase() === c.hex.toUpperCase();
                    return (
                      <button
                        key={c.hex}
                        onClick={() => {
                          const updatedOutfit = {
                            ...editingMember.outfit,
                            colors: {
                              ...editingMember.outfit.colors,
                              [activeSlot]: c.hex
                            }
                          };
                          handleUpdateMember(editingMember.id, { outfit: updatedOutfit });
                        }}
                        className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                          isSelected ? 'border-[#c93b2b] scale-110' : 'border-black/10 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={`${c.vietnameseName} (${c.element})`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Garment Items Grid for Current Slot */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs">
                      Kho Mẫu ({slotItems.length} mẫu):
                    </span>
                    {/* Gender filter chips in drawer */}
                    <div className="flex items-center gap-0.5">
                      {[
                        { id: 'all', label: 'Tất cả' },
                        { id: 'female', label: '👩 Nữ' },
                        { id: 'male', label: '👨 Nam' },
                        { id: 'unisex', label: '✨ Unisex' },
                      ].map(gf => (
                        <button
                          key={gf.id}
                          onClick={() => setDrawerGenderFilter(gf.id as any)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium border cursor-pointer ${
                            drawerGenderFilter === gf.id
                              ? 'bg-[#c93b2b] text-white border-[#c93b2b]'
                              : isLight
                              ? 'bg-stone-100 text-stone-600 border-stone-200'
                              : 'bg-white/5 text-zinc-400 border-white/10'
                          }`}
                        >
                          {gf.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {editingMember.outfit[`${activeSlot}Id` as keyof OutfitState] && (
                    <button
                      onClick={() => {
                        const updatedOutfit = {
                          ...editingMember.outfit,
                          [`${activeSlot}Id`]: undefined
                        };
                        handleUpdateMember(editingMember.id, { outfit: updatedOutfit });
                      }}
                      className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                    >
                      Bỏ chọn trang phục này
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1 scrollbar-thin">
                  {slotItems.map(item => {
                    const isEquipped = editingMember.outfit[`${activeSlot}Id` as keyof OutfitState] === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          const updatedOutfit = {
                            ...editingMember.outfit,
                            [`${activeSlot}Id`]: item.id
                          };
                          handleUpdateMember(editingMember.id, { outfit: updatedOutfit });
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          isEquipped
                            ? 'bg-[#c93b2b]/10 border-[#c93b2b] text-[#c93b2b] font-semibold'
                            : isLight
                            ? 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                            : 'bg-white/5 hover:bg-white/10 border-white/5 text-zinc-300'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-semibold text-xs truncate flex items-center gap-1">
                            <span>{item.name}</span>
                            {item.genderContext === 'female' && (
                              <span className="text-[9px] px-1 rounded bg-rose-500/10 text-rose-500 shrink-0">Nữ</span>
                            )}
                            {item.genderContext === 'male' && (
                              <span className="text-[9px] px-1 rounded bg-sky-500/10 text-sky-500 shrink-0">Nam</span>
                            )}
                          </div>
                          <div className={`text-[10px] ${isLight ? 'text-stone-500' : 'text-zinc-500'} truncate`}>
                            {item.era}
                          </div>
                        </div>

                        {isEquipped ? (
                          <span className="w-4 h-4 rounded-full bg-[#c93b2b] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        ) : (
                          <span className="text-[10px] opacity-60">Chọn</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className={`p-4 border-t flex items-center justify-end ${
                isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#1c1c24] border-white/10'
              }`}
            >
              <button
                onClick={() => setEditingMemberId(null)}
                className="px-4 py-2 bg-[#c93b2b] hover:bg-[#b02f20] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
              >
                Hoàn Tất Tùy Chỉnh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL (CHỌN GIỚI TÍNH KHI THÊM BẠN) */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div
            className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all animate-scaleUp ${
              isLight ? 'bg-white border-[#e7e1d5] text-[#1c1917]' : 'bg-[#16161c] border-white/15 text-white'
            }`}
          >
            {/* Modal Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isLight ? 'bg-[#fbf9f4] border-[#e7e1d5]' : 'bg-[#121216] border-white/10'
            }`}>
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#c93b2b]" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base">
                    Thêm Bạn Vào Đội Hình Phối Đồ
                  </h4>
                  <p className={`text-[11px] ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                    Chọn giới tính, đặt tên và chọn set trang phục chuẩn mực cho bạn mới
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              {/* Step 1: Chọn Giới Tính */}
              <div className="space-y-2">
                <label className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#c93b2b] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Chọn Giới Tính Bạn Muốn Thêm (Bắt Buộc):</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Nữ */}
                  <div
                    onClick={() => {
                      setNewMemberGender('female');
                      setNewMemberPresetId(FEMALE_STARTER_PRESETS[0].id);
                      if (!newMemberName || newMemberName.includes('Bạn')) {
                        setNewMemberName(`Bạn Nữ ${members.length + 1}`);
                      }
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      newMemberGender === 'female'
                        ? 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-500/30'
                        : isLight
                        ? 'bg-stone-50 border-stone-200 hover:border-stone-300'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">👩</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-500">
                        Nàng Thơ
                      </span>
                    </div>
                    <div className="font-bold text-xs">Bạn Nữ (Cổ Phong)</div>
                    <p className={`text-[10px] mt-1 leading-snug ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                      Áo Nhật Bình, Áo Ngũ Thân Nữ, Yếm Đào, Nón Quai Thao, Hài thêu
                    </p>
                  </div>

                  {/* Nam */}
                  <div
                    onClick={() => {
                      setNewMemberGender('male');
                      setNewMemberPresetId(MALE_STARTER_PRESETS[0].id);
                      if (!newMemberName || newMemberName.includes('Bạn')) {
                        setNewMemberName(`Bạn Nam ${members.length + 1}`);
                      }
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      newMemberGender === 'male'
                        ? 'bg-sky-500/10 border-sky-500 ring-2 ring-sky-500/30'
                        : isLight
                        ? 'bg-stone-50 border-stone-200 hover:border-stone-300'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">👨</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-500">
                        Sĩ Tử
                      </span>
                    </div>
                    <div className="font-bold text-xs">Bạn Nam (Quân Tử)</div>
                    <p className={`text-[10px] mt-1 leading-snug ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                      Áo Ngũ Thân Nam tay chẽn, Áo Tấc Nam, Khăn Đóng đen, Guốc mộc
                    </p>
                  </div>

                  {/* Unisex / Cyber */}
                  <div
                    onClick={() => {
                      setNewMemberGender('unisex');
                      setNewMemberPresetId(UNISEX_STARTER_PRESETS[0].id);
                      if (!newMemberName || newMemberName.includes('Bạn')) {
                        setNewMemberName(`Bạn Gen Z ${members.length + 1}`);
                      }
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      newMemberGender === 'unisex'
                        ? 'bg-purple-500/10 border-purple-500 ring-2 ring-purple-500/30'
                        : isLight
                        ? 'bg-stone-50 border-stone-200 hover:border-stone-300'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">⚡</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-500">
                        Remix Gen Z
                      </span>
                    </div>
                    <div className="font-bold text-xs">Phi Giới Tính / Cyber</div>
                    <p className={`text-[10px] mt-1 leading-snug ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                      Blazer độn vai remix, Yếm đào phá cách, Quần denim, Kính râm
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Tên & Vai Trò */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-xs">Tên Bạn:</label>
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Nhập tên bạn..."
                    className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:border-[#c93b2b] ${
                      isLight ? 'bg-stone-50 border-stone-200 text-stone-900' : 'bg-white/5 border-white/10 text-white'
                    }`}
                  />
                  {/* Quick Name Suggestions */}
                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    {(newMemberGender === 'female' 
                      ? ['Lan Anh', 'Minh Thư', 'Ngọc Mai', 'Thu Trang'] 
                      : newMemberGender === 'male'
                      ? ['Hoàng Nam', 'Quang Huy', 'Tuấn Kiệt', 'Đức Anh']
                      : ['Alex', 'Quân', 'Châu', 'Hải Đăng']
                    ).map(name => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setNewMemberName(name)}
                        className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                          isLight ? 'bg-stone-100 hover:bg-stone-200 text-stone-600' : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-xs">Vai Trò Trong Nhóm:</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:border-[#c93b2b] cursor-pointer ${
                      isLight ? 'bg-stone-50 border-stone-200 text-stone-900' : 'bg-[#18181e] border-white/10 text-white'
                    }`}
                  >
                    <option value="Bạn thân">Bạn thân</option>
                    <option value="Nàng thơ">Nàng thơ</option>
                    <option value="Chàng thi sĩ">Chàng thi sĩ</option>
                    <option value="Tri kỷ">Tri kỷ</option>
                    <option value="Trưởng nhóm">Trưởng nhóm</option>
                    <option value="Stylist của nhóm">Stylist của nhóm</option>
                  </select>
                </div>
              </div>

              {/* Step 3: Chọn Set Đồ Khởi Đầu Cho Giới Tính Này */}
              <div className="space-y-2">
                <label className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#c93b2b] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Chọn Set Đồ Mẫu Chuẩn Cho {newMemberGender === 'female' ? 'Nữ' : newMemberGender === 'male' ? 'Nam' : 'Unisex'}:</span>
                </label>

                <div className="space-y-1.5">
                  {(newMemberGender === 'female' 
                    ? FEMALE_STARTER_PRESETS 
                    : newMemberGender === 'male' 
                    ? MALE_STARTER_PRESETS 
                    : UNISEX_STARTER_PRESETS
                  ).map(preset => (
                    <div
                      key={preset.id}
                      onClick={() => setNewMemberPresetId(preset.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        newMemberPresetId === preset.id
                          ? 'bg-[#c93b2b]/10 border-[#c93b2b] ring-1 ring-[#c93b2b]'
                          : isLight
                          ? 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>{preset.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded border ${
                            isLight ? 'bg-white border-stone-200 text-stone-600' : 'bg-white/10 border-white/5 text-zinc-300'
                          }`}>
                            {preset.era}
                          </span>
                        </div>
                        <p className={`text-[11px] truncate mt-0.5 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                          {preset.description}
                        </p>
                      </div>

                      {newMemberPresetId === preset.id && (
                        <div className="w-4 h-4 rounded-full bg-[#c93b2b] text-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 4: Live Avatar Preview inside Modal */}
              <div className="space-y-1.5">
                <label className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#c93b2b] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>Xem Trước Bạn Mới:</span>
                </label>
                <div className={`h-48 rounded-xl border flex items-center justify-center overflow-hidden ${
                  isLight ? 'bg-[#fcfaf7] border-stone-200' : 'bg-[#0f0f14] border-white/5'
                }`}>
                  {(() => {
                    const presetsList = newMemberGender === 'female' ? FEMALE_STARTER_PRESETS : newMemberGender === 'male' ? MALE_STARTER_PRESETS : UNISEX_STARTER_PRESETS;
                    const previewPreset = presetsList.find(p => p.id === newMemberPresetId) || presetsList[0];
                    return (
                      <MiniAvatarCanvas
                        outfit={previewPreset.outfit}
                        avatarType={newMemberGender === 'unisex' ? 'cyber' : newMemberGender}
                        itemsMap={itemsMap}
                        className="w-full h-full"
                      />
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-end gap-2 ${
              isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#121216] border-white/10'
            }`}>
              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                  isLight ? 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200' : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
                }`}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmAddMember}
                className="px-4 py-1.5 bg-[#c93b2b] hover:bg-[#b02f20] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Xác Nhận Thêm Bạn Vào Nhóm ✨</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ClothingItem, 
  OutfitState, 
  EventModel, 
  UserProfile, 
  LookbookEntry 
} from './types';
import { INITIAL_WARDROBE } from './data/wardrobeData';
import { PRESET_EVENTS } from './data/presetEvents';
import { analyzeColorHarmony } from './utils/colorHarmony';
import { checkCulturalCompliance } from './utils/culturalChecker';
import { userService } from './services/userService';

import { Header } from './components/Header';
import { AvatarVisualizer } from './components/AvatarVisualizer';
import { ColorCustomizer } from './components/ColorCustomizer';
import { ColorHarmonyCard } from './components/ColorHarmonyCard';
import { CulturalWarningBanner } from './components/CulturalWarningBanner';
import { EventSelector } from './components/EventSelector';
import { WardrobeBrowser } from './components/WardrobeBrowser';
import { ItemDetailModal } from './components/ItemDetailModal';
import { CustomItemModal } from './components/CustomItemModal';
import { LookbookModal } from './components/LookbookModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ComparisonModal } from './components/ComparisonModal';
import { CommunityShowcase } from './components/CommunityShowcase';
import { AiAssistant } from './components/AiAssistant';

export default function App() {
  const [activeTab, setActiveTab] = useState<'styling' | 'wardrobe' | 'community' | 'comparison'>('styling');
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(INITIAL_WARDROBE);
  const [currentEvent, setCurrentEvent] = useState<EventModel>(PRESET_EVENTS[0]);
  const [avatarType, setAvatarType] = useState<'female' | 'male' | 'unisex' | 'cyber'>('female');
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => userService.getCurrentUser());
  const [savedLookbooks, setSavedLookbooks] = useState<LookbookEntry[]>(() => userService.getUserLookbooks());

  // Default initial outfit: Áo Ngũ Thân tay chẽn xanh chàm + Quần lụa trắng + Khăn đóng đen
  const [outfit, setOutfit] = useState<OutfitState>({
    outerId: 'ao-ngu-than-tay-chen',
    innerId: 'inner-ao-canh-trang',
    bottomId: 'bottom-quan-lua-trang',
    headwearId: 'head-khan-dong-den',
    footwearId: 'foot-guoc-moc-nhung',
    accessoryId: 'acc-kieng-bac-cham-sen',
    colors: {
      outer: '#1D3B53', // Xanh chàm
      inner: '#F4EFE6', // Trắng ngà
      bottom: '#F4EFE6', // Trắng ngà
      headwear: '#1A1A1E', // Đen mun
      footwear: '#B82626', // Đỏ son
      accessory: '#F4EFE6', // Bạc sáng
    }
  });

  // Alternative look for comparison mode
  const [lookB, setLookB] = useState<OutfitState>({
    outerId: 'remix-oversized-blazer',
    innerId: 'inner-yem-dao-lua',
    bottomId: 'bottom-raw-denim-wide',
    headwearId: 'head-non-quai-thao',
    footwearId: 'foot-chunky-loafer',
    accessoryId: 'acc-kinh-ram-cyber',
    colors: {
      outer: '#1A1A1E',
      inner: '#D9738A',
      bottom: '#1D3B53',
      headwear: '#DDA032',
      footwear: '#1A1A1E',
      accessory: '#1A1A1E'
    }
  });

  // Modals state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<ClothingItem | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isLookbookModalOpen, setIsLookbookModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  // Items dictionary
  const itemsMap = useMemo(() => {
    const map: Record<string, ClothingItem> = {};
    wardrobe.forEach((item) => {
      map[item.id] = item;
    });
    return map;
  }, [wardrobe]);

  // Calculations
  const harmony = useMemo(() => analyzeColorHarmony(outfit), [outfit]);
  const warnings = useMemo(
    () => checkCulturalCompliance(outfit, itemsMap, currentEvent),
    [outfit, itemsMap, currentEvent]
  );

  // Handlers
  const handleEquipItem = (item: ClothingItem) => {
    setOutfit((prev) => {
      const next = { ...prev };
      const catKey = `${item.category}Id` as keyof OutfitState;
      (next as any)[catKey] = item.id;
      next.colors = {
        ...next.colors,
        [item.category]: item.defaultColor,
      };
      return next;
    });
  };

  const handleUnequipItem = (category: keyof OutfitState['colors']) => {
    setOutfit((prev) => {
      const next = { ...prev };
      const catKey = `${category}Id` as keyof OutfitState;
      delete (next as any)[catKey];
      return next;
    });
  };

  const handleColorChange = (category: keyof OutfitState['colors'], colorHex: string) => {
    setOutfit((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [category]: colorHex,
      },
    }));
  };

  const handleRandomize = () => {
    const outers = wardrobe.filter((w) => w.category === 'outer');
    const inners = wardrobe.filter((w) => w.category === 'inner');
    const bottoms = wardrobe.filter((w) => w.category === 'bottom');
    const headwears = wardrobe.filter((w) => w.category === 'headwear' && w.id !== 'head-khan-dong-trang-tang');
    const footwears = wardrobe.filter((w) => w.category === 'footwear');
    const accessories = wardrobe.filter((w) => w.category === 'accessory');

    const randomPick = (arr: ClothingItem[]) => arr[Math.floor(Math.random() * arr.length)];

    const rOuter = randomPick(outers);
    const rInner = randomPick(inners);
    const rBottom = randomPick(bottoms);
    const rHead = Math.random() > 0.3 ? randomPick(headwears) : undefined;
    const rFoot = randomPick(footwears);
    const rAcc = Math.random() > 0.3 ? randomPick(accessories) : undefined;

    setOutfit({
      outerId: rOuter?.id,
      innerId: rInner?.id,
      bottomId: rBottom?.id,
      headwearId: rHead?.id,
      footwearId: rFoot?.id,
      accessoryId: rAcc?.id,
      colors: {
        outer: rOuter?.defaultColor || '#1D3B53',
        inner: rInner?.defaultColor || '#F4EFE6',
        bottom: rBottom?.defaultColor || '#F4EFE6',
        headwear: rHead?.defaultColor || '#1A1A1E',
        footwear: rFoot?.defaultColor || '#1A1A1E',
        accessory: rAcc?.defaultColor || '#DDA032',
      },
    });
  };

  const handleReset = () => {
    setOutfit({
      outerId: undefined,
      innerId: 'inner-ao-canh-trang',
      bottomId: 'bottom-quan-lua-trang',
      headwearId: undefined,
      footwearId: 'foot-guoc-moc-nhung',
      accessoryId: undefined,
      colors: {
        outer: '#1D3B53',
        inner: '#F4EFE6',
        bottom: '#F4EFE6',
        headwear: '#1A1A1E',
        footwear: '#B82626',
        accessory: '#DDA032',
      },
    });
  };

  const handleApplyPresetOutfit = (event: EventModel) => {
    const next: OutfitState = {
      colors: { ...outfit.colors },
    };

    event.suggestedItems.forEach((itemId) => {
      const it = itemsMap[itemId];
      if (it) {
        const catKey = `${it.category}Id` as keyof OutfitState;
        (next as any)[catKey] = it.id;
        next.colors[it.category] = it.defaultColor;
      }
    });

    setOutfit((prev) => ({
      ...prev,
      ...next,
      colors: { ...prev.colors, ...next.colors },
    }));
  };

  const handleAddCustomItem = (newItem: ClothingItem) => {
    setWardrobe((prev) => [newItem, ...prev]);
    handleEquipItem(newItem);
  };

  const handleAddCustomEvent = (newEvent: EventModel) => {
    setCurrentEvent(newEvent);
  };

  const handleViewItemDetails = (item: ClothingItem) => {
    setSelectedDetailItem(item);
    setIsDetailModalOpen(true);
  };

  const handleApplyOutfitActionFromAi = (payload: any) => {
    if (payload?.applyEventPresets) {
      handleApplyPresetOutfit(currentEvent);
    } else if (payload) {
      setOutfit((prev) => ({
        ...prev,
        ...payload,
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0e11] text-[#f4f2ee]">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        lookbookCount={savedLookbooks.length}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenSaveLookbook={() => setIsLookbookModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {/* TAB 1: STYLING & AVATAR CANVAS */}
        {activeTab === 'styling' && (
          <div className="space-y-5">
            {/* Cultural Warning Banner (if violations detected) */}
            {currentUser.preferences.enableCulturalTips && (
              <CulturalWarningBanner
                warnings={warnings}
                onApplyFix={(fixFn) => setOutfit((prev) => fixFn(prev))}
              />
            )}

            {/* Event & Weather Banner */}
            <EventSelector
              currentEvent={currentEvent}
              onSelectEvent={setCurrentEvent}
              onApplyPresetOutfit={handleApplyPresetOutfit}
              onAddCustomEvent={handleAddCustomEvent}
            />

            {/* Stage Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Avatar Try-On Stage */}
              <div className="lg:col-span-7 h-[680px]">
                <AvatarVisualizer
                  outfit={outfit}
                  itemsMap={itemsMap}
                  onUnequip={handleUnequipItem}
                  onRandomize={handleRandomize}
                  onReset={handleReset}
                  avatarType={avatarType}
                  setAvatarType={setAvatarType}
                  userPhotoUrl={userPhotoUrl}
                  setUserPhotoUrl={setUserPhotoUrl}
                />
              </div>

              {/* Right Column: Customization Controls & Analysis */}
              <div className="lg:col-span-5 space-y-4">
                {/* Traditional Color Palette Customizer */}
                <ColorCustomizer
                  outfit={outfit}
                  onColorChange={handleColorChange}
                />

                {/* Ngũ Hành & Visual Harmony Score Card */}
                <ColorHarmonyCard harmony={harmony} />

                {/* Quick Wardrobe Swapper Ribbon */}
                <div className="bg-[#18181e] rounded-2xl border border-white/10 p-4 shadow-lg space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white">Gợi Ý Mặc Nhanh Phù Hợp:</h4>
                    <button
                      onClick={() => setActiveTab('wardrobe')}
                      className="text-[11px] text-[#ff7566] hover:underline cursor-pointer"
                    >
                      Xem toàn bộ 56+ món →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {wardrobe.slice(0, 4).map((it) => (
                      <button
                        key={it.id}
                        onClick={() => handleEquipItem(it)}
                        className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/20"
                            style={{ backgroundColor: it.defaultColor }}
                          />
                          <span className="text-[10px] text-zinc-400 truncate">{it.era}</span>
                        </div>
                        <p className="text-xs font-semibold text-white group-hover:text-[#ff7566] truncate">
                          {it.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WARDROBE BROWSER */}
        {activeTab === 'wardrobe' && (
          <WardrobeBrowser
            wardrobe={wardrobe}
            outfit={outfit}
            onEquipItem={handleEquipItem}
            onUnequipItem={handleUnequipItem}
            onViewItemDetails={handleViewItemDetails}
            onOpenCustomItemModal={() => setIsCustomModalOpen(true)}
          />
        )}

        {/* TAB 3: COMMUNITY SHOWCASE */}
        {activeTab === 'community' && (
          <CommunityShowcase
            onApplyOutfit={(newOutfit) => {
              setOutfit(newOutfit);
              setActiveTab('styling');
            }}
            onOpenSubmitModal={() => setIsLookbookModalOpen(true)}
          />
        )}

        {/* TAB 4: COMPARISON MODE */}
        {activeTab === 'comparison' && (
          <div className="py-4">
            <ComparisonModal
              isOpen={true}
              onClose={() => setActiveTab('styling')}
              lookA={outfit}
              lookB={lookB}
              itemsMap={itemsMap}
              onApplyLook={(selectedLook) => {
                setOutfit(selectedLook);
                setActiveTab('styling');
              }}
              onSaveAsLookB={() => setLookB({ ...outfit })}
            />
          </div>
        )}
      </main>

      {/* Floating Cultural Item Detail Modal */}
      <ItemDetailModal
        item={selectedDetailItem}
        onClose={() => setIsDetailModalOpen(false)}
        onEquip={handleEquipItem}
        isEquipped={selectedDetailItem ? Object.values(outfit).includes(selectedDetailItem.id) : false}
      />

      {/* Custom Garment Modal */}
      <CustomItemModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddItem={handleAddCustomItem}
      />

      {/* Save Lookbook & Share Modal */}
      <LookbookModal
        isOpen={isLookbookModalOpen}
        onClose={() => setIsLookbookModalOpen(false)}
        outfit={outfit}
        itemsMap={itemsMap}
        currentEvent={currentEvent}
        harmony={harmony}
        onLookbookSaved={() => setSavedLookbooks(userService.getUserLookbooks())}
      />

      {/* User Profile & Account Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        savedLookbooks={savedLookbooks}
        onApplyLookbook={(savedOutfit) => {
          setOutfit(savedOutfit);
          setActiveTab('styling');
        }}
        onDeleteLookbook={(id) => {
          const updated = userService.deleteUserLookbook(id);
          setSavedLookbooks(updated);
        }}
      />

      {/* Embedded / Floating AI Stylist Assistant */}
      <AiAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        outfit={outfit}
        currentEvent={currentEvent}
        itemsMap={itemsMap}
        warnings={warnings}
        harmony={harmony}
        onApplyOutfitAction={handleApplyOutfitActionFromAi}
        onFixWarning={() => {
          if (warnings[0]?.fixAction) {
            setOutfit((prev) => warnings[0].fixAction!.applyFix(prev));
          }
        }}
        onShowTab={(tab) => {
          if (tab === 'harmony' || tab === 'styling') setActiveTab('styling');
          else if (tab === 'community') setActiveTab('community');
          else if (tab === 'wardrobe') setActiveTab('wardrobe');
        }}
      />
    </div>
  );
}

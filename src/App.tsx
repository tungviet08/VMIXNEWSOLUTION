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
import { LiveWardrobePicker } from './components/LiveWardrobePicker';
import { ItemDetailModal } from './components/ItemDetailModal';
import { CustomItemModal } from './components/CustomItemModal';
import { LookbookModal } from './components/LookbookModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ComparisonModal } from './components/ComparisonModal';
import { CommunityShowcase } from './components/CommunityShowcase';
import { GroupCoordinationView } from './components/GroupCoordinationView';
import { AiAssistant } from './components/AiAssistant';
import { LiveWeatherModal } from './components/LiveWeatherModal';
import { weatherService, CULTURAL_CITIES } from './services/weatherService';
import { useOutfitHistory } from './hooks/useOutfitHistory';
import { LiveWeatherData, WeatherCity } from './types';
import { Shirt, Palette } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'styling' | 'wardrobe' | 'community' | 'comparison' | 'group'>('styling');
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(INITIAL_WARDROBE);
  const [currentEvent, setCurrentEvent] = useState<EventModel>(PRESET_EVENTS[0]);
  const [avatarType, setAvatarType] = useState<'female' | 'male' | 'unisex' | 'cyber'>('female');
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [stylingPanelTab, setStylingPanelTab] = useState<'wardrobe' | 'colors'>('wardrobe');

  // Live Weather State (Open-Meteo Real-time)
  const [currentWeather, setCurrentWeather] = useState<LiveWeatherData | null>(null);
  const [selectedWeatherCity, setSelectedWeatherCity] = useState<WeatherCity>(CULTURAL_CITIES[0]); // Default: Hà Nội
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const stored = localStorage.getItem('vietphuc_remix_theme');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) {
      console.warn('Failed to read theme from storage', e);
    }
    return 'dark';
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('vietphuc_remix_theme', next);
      } catch (e) {}
      return next;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('bg-[#0e0e11]', 'text-[#f4f2ee]');
      body.classList.add('bg-[#fcfaf7]', 'text-[#1c1917]');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      body.classList.remove('bg-[#fcfaf7]', 'text-[#1c1917]');
      body.classList.add('bg-[#0e0e11]', 'text-[#f4f2ee]');
    }
  }, [theme]);

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => userService.getCurrentUser());
  const [savedLookbooks, setSavedLookbooks] = useState<LookbookEntry[]>(() => userService.getUserLookbooks());

  // Default initial outfit: Áo Ngũ Thân tay chẽn xanh chàm + Quần lụa trắng + Khăn đóng đen
  const INITIAL_OUTFIT_STATE: OutfitState = {
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
  };

  const {
    outfit,
    setOutfit,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useOutfitHistory(INITIAL_OUTFIT_STATE);

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

  const handleQuickGenderOutfit = (gender: 'female' | 'male') => {
    if (gender === 'male') {
      setOutfit({
        outerId: 'ao-ngu-than-tay-chen',
        innerId: 'inner-ao-canh-trang',
        bottomId: 'bottom-quan-lua-trang',
        headwearId: 'head-khan-dong-den',
        footwearId: 'foot-guoc-moc-nhung',
        accessoryId: 'acc-quat-xep-ha-dong',
        colors: {
          outer: '#1D3B53', // Xanh chàm
          inner: '#F4EFE6', // Trắng ngà
          bottom: '#F4EFE6', // Trắng ngà
          headwear: '#1A1A1E', // Đen mun
          footwear: '#754B2D', // Nâu gỗ
          accessory: '#F4EFE6',
        }
      });
    } else {
      setOutfit({
        outerId: 'ao-nhat-binh',
        innerId: 'inner-yem-dao-lua',
        bottomId: 'bottom-quan-lua-trang',
        headwearId: 'head-non-quai-thao',
        footwearId: 'foot-hai-theu-hoa-sen',
        accessoryId: 'acc-kieng-bac-cham-sen',
        colors: {
          outer: '#165B58', // Xanh ngọc
          inner: '#D9738A', // Hồng sen
          bottom: '#F4EFE6', // Trắng ngà
          headwear: '#DDA032', // Vàng kim
          footwear: '#B82626', // Đỏ son
          accessory: '#F4EFE6',
        }
      });
    }
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

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDetailItem(null);
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

  // Fetch real-time live weather whenever selected city changes
  useEffect(() => {
    let isSubscribed = true;
    const fetchWeather = async () => {
      setIsWeatherLoading(true);
      try {
        const data = await weatherService.getLiveWeather(selectedWeatherCity);
        if (isSubscribed) {
          setCurrentWeather(data);
        }
      } catch (err) {
        console.warn('Weather fetch error', err);
      } finally {
        if (isSubscribed) {
          setIsWeatherLoading(false);
        }
      }
    };

    fetchWeather();
    return () => {
      isSubscribed = false;
    };
  }, [selectedWeatherCity]);

  const handleRefreshWeather = async () => {
    setIsWeatherLoading(true);
    try {
      const data = await weatherService.getLiveWeather(selectedWeatherCity);
      setCurrentWeather(data);
    } catch (e) {
      console.warn('Refresh weather error', e);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const handleSelectWeatherCity = (city: WeatherCity) => {
    setSelectedWeatherCity(city);
  };

  const handleUseGpsLocation = () => {
    if (!navigator.geolocation) {
      return;
    }
    setIsWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await weatherService.getWeatherByCoordinates(
            position.coords.latitude,
            position.coords.longitude
          );
          setCurrentWeather(data);
        } catch (e) {
          console.warn('GPS weather error', e);
        } finally {
          setIsWeatherLoading(false);
        }
      },
      (err) => {
        console.warn('GPS permission denied or timeout', err);
        setIsWeatherLoading(false);
      },
      { timeout: 9000 }
    );
  };

  const handleApplyWeatherOutfit = (recommendation: LiveWeatherData['outfitRecommendation']) => {
    const next: OutfitState = {
      colors: { ...outfit.colors },
    };

    recommendation.suggestedItems.forEach((itemId) => {
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

  const handleSyncWeatherWithEvent = (weather: LiveWeatherData) => {
    setCurrentEvent((prev) => ({
      ...prev,
      weather: {
        temp: Math.round(weather.temperature),
        condition: weather.weatherCondition,
        label: `${weather.weatherDescription} · ${Math.round(weather.temperature)}°C tại ${weather.cityName}`,
      },
      vibe: weather.outfitRecommendation.summary,
    }));
  };

  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        isLight ? 'bg-[#fcfaf7] text-[#1c1917]' : 'bg-[#0e0e11] text-[#f4f2ee]'
      }`}
    >
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        lookbookCount={savedLookbooks.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenSaveLookbook={() => setIsLookbookModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenWeather={() => setIsWeatherModalOpen(true)}
        currentWeather={currentWeather}
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
              theme={theme}
              currentWeather={currentWeather}
              onOpenWeatherReport={() => setIsWeatherModalOpen(true)}
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
                  theme={theme}
                  onUndo={undo}
                  onRedo={redo}
                  canUndo={canUndo}
                  canRedo={canRedo}
                  onApplyQuickPreset={handleQuickGenderOutfit}
                />
              </div>

              {/* Right Column: Customization Controls & Analysis */}
              <div className="lg:col-span-5 space-y-4">
                {/* Mode Switcher: Chọn Đồ Trực Tiếp vs Bảng Màu & Hòa Sắc Ngũ Hành */}
                <div
                  className={`p-1 rounded-2xl border flex items-center gap-1 transition-colors ${
                    isLight ? 'bg-white border-[#e7e1d5] shadow-xs' : 'bg-[#18181e] border-white/10'
                  }`}
                >
                  <button
                    onClick={() => setStylingPanelTab('wardrobe')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      stylingPanelTab === 'wardrobe'
                        ? 'bg-[#c93b2b] text-white shadow-sm'
                        : isLight
                        ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Shirt className="w-3.5 h-3.5" />
                    <span>Chọn Đồ Xem Ngay</span>
                  </button>

                  <button
                    onClick={() => setStylingPanelTab('colors')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      stylingPanelTab === 'colors'
                        ? 'bg-[#c93b2b] text-white shadow-sm'
                        : isLight
                        ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Màu Sắc & Hòa Sắc ({harmony.score}đ)</span>
                  </button>
                </div>

                {stylingPanelTab === 'wardrobe' ? (
                  <LiveWardrobePicker
                    wardrobe={wardrobe}
                    outfit={outfit}
                    onEquipItem={handleEquipItem}
                    onUnequipItem={handleUnequipItem}
                    onColorChange={handleColorChange}
                    onViewItemDetails={handleViewItemDetails}
                    theme={theme}
                    harmony={harmony}
                    onSwitchToColorTab={() => setStylingPanelTab('colors')}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    avatarType={avatarType}
                    setAvatarType={setAvatarType}
                  />
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Traditional Color Palette Customizer */}
                    <ColorCustomizer
                      outfit={outfit}
                      onColorChange={handleColorChange}
                      theme={theme}
                    />

                    {/* Ngũ Hành & Visual Harmony Score Card */}
                    <ColorHarmonyCard harmony={harmony} theme={theme} />
                  </div>
                )}
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
            theme={theme}
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
            theme={theme}
          />
        )}

        {/* TAB 4: GROUP & COUPLE COORDINATION */}
        {activeTab === 'group' && (
          <GroupCoordinationView
            wardrobe={wardrobe}
            itemsMap={itemsMap}
            mainOutfit={outfit}
            onApplyOutfitToMain={(newOutfit) => {
              setOutfit(newOutfit);
              setActiveTab('styling');
            }}
            theme={theme}
          />
        )}

        {/* TAB 5: COMPARISON MODE */}
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
              theme={theme}
            />
          </div>
        )}
      </main>

      {/* Floating Cultural Item Detail Modal */}
      <ItemDetailModal
        isOpen={isDetailModalOpen && !!selectedDetailItem}
        item={selectedDetailItem}
        onClose={handleCloseDetailModal}
        onEquip={handleEquipItem}
        isEquipped={selectedDetailItem ? Object.values(outfit).includes(selectedDetailItem.id) : false}
        theme={theme}
      />

      {/* Custom Garment Modal */}
      <CustomItemModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddItem={handleAddCustomItem}
        theme={theme}
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
        theme={theme}
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
        theme={theme}
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
        theme={theme}
      />

      {/* Real-time Live Weather Report & Outfit Advisor Modal */}
      <LiveWeatherModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        currentWeather={currentWeather}
        onSelectCity={handleSelectWeatherCity}
        onUseGpsLocation={handleUseGpsLocation}
        onRefreshWeather={handleRefreshWeather}
        isLoading={isWeatherLoading}
        onApplyWeatherOutfit={handleApplyWeatherOutfit}
        onSyncWithEvent={handleSyncWeatherWithEvent}
        theme={theme}
      />
    </div>
  );
}

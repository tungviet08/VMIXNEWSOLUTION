export type GarmentCategory =
  | 'outer'
  | 'inner'
  | 'bottom'
  | 'headwear'
  | 'footwear'
  | 'accessory';

export type CulturalEra =
  | 'Triều Lý - Trần (1009–1400)'
  | 'Triều Lê (1428–1789)'
  | 'Triều Nguyễn (1802–1945)'
  | 'Dân gian Đồng bằng Bắc Bộ'
  | 'Dân gian Nam Bộ'
  | 'Tân thời (1930–1950s)'
  | 'Sài Gòn thập niên 1960–1970'
  | 'Hiện đại / Remix'
  | 'Tùy chỉnh';

export type ElementType = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

export interface TraditionalColor {
  name: string;
  vietnameseName: string;
  hex: string;
  element: ElementType;
  story: string;
}

export interface ClothingItem {
  id: string;
  name: string;
  category: GarmentCategory;
  subType?: 'ao_dai' | 'ngu_than' | 'tu_than' | 'nhat_binh' | 'giao_linh' | 'headwear' | 'modern_top' | 'bottom' | 'footwear' | 'accessory';
  isTraditional: boolean;
  era: CulturalEra;
  defaultColor: string;
  description: string;
  historicalOrigin: string;
  symbolism: string;
  traditionalEtiquette: string;
  remixTips: string;
  silhouetteSvgType: string;
  genderContext?: 'unisex' | 'female' | 'male';
  isCustom?: boolean;
}

export interface EventModel {
  id: string;
  name: string;
  type: 'tet' | 'wedding' | 'graduation' | 'festival' | 'exhibition' | 'street' | 'custom';
  weather: {
    temp: number;
    condition: 'cool' | 'sunny' | 'chilly' | 'rainy';
    label: string;
  };
  vibe: string;
  suggestedPalettes: string[];
  suggestedItems: string[];
}

export interface WeatherCity {
  id: string;
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  culturalNote: string;
}

export interface LiveWeatherData {
  cityName: string;
  province: string;
  latitude: number;
  longitude: number;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  weatherDescription: string;
  weatherCondition: 'sunny' | 'cool' | 'chilly' | 'rainy';
  isDay: boolean;
  windSpeed: number;
  updatedAt: string;
  isLiveGps?: boolean;
  hourlyForecast: Array<{
    time: string;
    temperature: number;
    weatherCode: number;
  }>;
  dailyForecast: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    weatherCode: number;
  }>;
  outfitRecommendation: {
    title: string;
    summary: string;
    fabricAdvice: string;
    layerAdvice: string;
    suggestedPalettes: string[];
    suggestedItems: string[];
  };
}

export interface OutfitState {
  outerId?: string;
  innerId?: string;
  bottomId?: string;
  headwearId?: string;
  footwearId?: string;
  accessoryId?: string;
  colors: {
    outer: string;
    inner: string;
    bottom: string;
    headwear: string;
    footwear: string;
    accessory: string;
  };
}

export interface CulturalWarning {
  id: string;
  severity: 'high' | 'medium' | 'info';
  title: string;
  explanation: string;
  historicalContext: string;
  recommendation: string;
  fixAction?: {
    label: string;
    applyFix: (current: OutfitState) => OutfitState;
  };
}

export interface HarmonyCriterion {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  weight: string;
  status: 'excellent' | 'good' | 'average' | 'improve';
  comment: string;
}

export interface ColorHarmonyResult {
  score: number;
  grade: 'Tuyệt mỹ' | 'Hài hòa' | 'Khá' | 'Xung đột nhẹ' | 'Cần điều chỉnh';
  dominantElement: ElementType;
  supportingElement?: ElementType;
  elementRelation: string;
  feedback: string;
  tips: string[];
  criteria: HarmonyCriterion[];
}

export interface LookbookEntry {
  id: string;
  title: string;
  createdAt: string;
  eventName: string;
  weatherLabel: string;
  outfit: OutfitState;
  items: ClothingItem[];
  colorHarmonyScore: number;
  notes: string;
  avatarSeed?: string;
  likes: number;
  authorId?: string;
  authorName?: string;
  isPublic?: boolean;
}

export interface CommunityLookbook extends LookbookEntry {
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  tags: string[];
  styleCategory: 'traditional' | 'remix' | 'experimental';
  likedByCurrentUser?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  title: string;
  joinedDate: string;
  preferences: {
    favoriteEra: CulturalEra;
    preferredVibe: 'Cổ phong thuần túy' | 'Remix đường phố' | 'Vị lai Minimalist';
    defaultAvatar: 'female' | 'male' | 'unisex' | 'cyber';
    enableCulturalTips: boolean;
  };
  savedLookbookIds: string[];
  likedLookbookIds: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    actionType: 'applyOutfit' | 'viewItem' | 'showTab' | 'fixWarning';
    payload?: any;
  }[];
}

// ==========================================
// COUPLE & SQUAD COORDINATION (PHỐI ĐỒ ĐÔI & NHÓM BẠN)
// ==========================================
export type CoordinationMode = 'couple' | 'group';

export type GroupOccasionId =
  | 'xuan_hoi'        // Du Xuân & Trẩy Hội Đầu Năm
  | 'co_cung_ky_yeu'  // Chụp Ảnh Cố Cung & Kỷ Yếu (Huế / Hoàng Thành)
  | 'pho_co_dao_choi' // Dạo Phố Cổ Hội An & Phố Đi Bộ Hồ Gươm
  | 'hy_su_cuoi'      // Dự Tiệc Cưới & Hỷ Sự Cổ Phong
  | 'tra_chieu_nha';  // Trà Chiều Phong Vị Xưa

export interface GroupOccasionInfo {
  id: GroupOccasionId;
  name: string;
  vibe: string;
  recommendedPalette: string[];
  recommendedEra: CulturalEra[];
  description: string;
}

export interface GroupMember {
  id: string;
  name: string;
  role: string;
  avatarType: 'female' | 'male' | 'unisex' | 'cyber';
  outfit: OutfitState;
}

export interface GroupMatchCriteria {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  weight: string;
  status: 'excellent' | 'good' | 'average' | 'improve';
  comment: string;
}

export interface GroupMatchResult {
  overallScore: number;
  grade: 'Tuyệt Mỹ Ăn Ý' | 'Rất Hòa Hợp' | 'Khá Đồng Điệu' | 'Cần Cân Đối Lại';
  summary: string;
  criteria: GroupMatchCriteria[];
  memberElements: Array<{
    memberId: string;
    memberName: string;
    dominantElement: ElementType;
    era: string;
    outerName?: string;
  }>;
  elementSynergies: string[];
  recommendations: string[];
}

export interface GroupPresetTheme {
  id: string;
  title: string;
  mode: CoordinationMode;
  occasionId: GroupOccasionId;
  description: string;
  tag: string;
  members: Array<{
    name: string;
    role: string;
    avatarType: 'female' | 'male' | 'unisex' | 'cyber';
    outfit: OutfitState;
  }>;
}


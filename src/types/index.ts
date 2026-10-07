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

export interface ColorHarmonyResult {
  score: number;
  grade: 'Tuyệt mỹ' | 'Hài hòa' | 'Khá' | 'Xung đột nhẹ' | 'Cần điều chỉnh';
  dominantElement: ElementType;
  supportingElement?: ElementType;
  elementRelation: string;
  feedback: string;
  tips: string[];
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

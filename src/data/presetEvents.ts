import { EventModel } from '../types';

export const PRESET_EVENTS: EventModel[] = [
  {
    id: 'event-tet-nguyen-dan',
    name: 'Tết Nguyên Đán & Du Xuân Phố Cổ',
    type: 'tet',
    weather: {
      temp: 20,
      condition: 'cool',
      label: 'Mưa xuân lất phất · 20°C Hà Nội'
    },
    vibe: 'Rực rỡ sắc xuân, may mắn, sum họp gia đình & lễ chùa đầu năm',
    suggestedPalettes: ['#B82626', '#DDA032', '#165B58', '#F4EFE6'],
    suggestedItems: ['ao-tac-ngu-than-tay-thung', 'head-khan-dong-den', 'bottom-quan-lua-trang', 'acc-kieng-bac-cham-sen', 'foot-guoc-moc-nhung']
  },
  {
    id: 'event-dam-cuoi-co-phong',
    name: 'Đám Cưới Bạn Thân - Concept Cổ Phong',
    type: 'wedding',
    weather: {
      temp: 26,
      condition: 'sunny',
      label: 'Nắng ấm hoàng hôn · 26°C Sài Gòn'
    },
    vibe: 'Trang trọng, chúc phúc, thanh lịch, kiêng kỵ màu tang chế',
    suggestedPalettes: ['#D9738A', '#5B3758', '#165B58', '#F4EFE6'],
    suggestedItems: ['ao-nhat-binh', 'head-khan-dong-den', 'bottom-quan-lua-trang', 'acc-ngoc-boi-tua-rua', 'foot-chunky-loafer']
  },
  {
    id: 'event-le-tot-nghiep',
    name: 'Lễ Trao Bằng Tốt Nghiệp Đại Học',
    type: 'graduation',
    weather: {
      temp: 24,
      condition: 'sunny',
      label: 'Trời quang gió nhẹ · 24°C'
    },
    vibe: 'Đĩnh đạc, tri thức, tự hào văn hóa nguồn cội trong ngày trưởng thành',
    suggestedPalettes: ['#1D3B53', '#165B58', '#F4EFE6', '#1A1A1E'],
    suggestedItems: ['ao-ngu-than-tay-chen', 'head-khan-dong-den', 'bottom-quan-lua-trang', 'foot-chelsea-boots', 'acc-quat-xep-ha-dong']
  },
  {
    id: 'event-monsoon-art-festival',
    name: 'Monsoon Music & Art Fair',
    type: 'festival',
    weather: {
      temp: 18,
      condition: 'chilly',
      label: 'Gió mùa se lạnh · 18°C Hoàng Thành'
    },
    vibe: 'Gen Z Experimental, Cyber-Heritage, năng động quẩy hết mình',
    suggestedPalettes: ['#1A1A1E', '#B82626', '#1D3B53', '#F4EFE6'],
    suggestedItems: ['ao-giao-linh', 'remix-oversized-blazer', 'bottom-raw-denim-wide', 'acc-kinh-ram-cyber', 'foot-chunky-loafer']
  },
  {
    id: 'event-trien-lam-art',
    name: 'Triển Lãm Nghệ Thuật Đương Đại',
    type: 'exhibition',
    weather: {
      temp: 22,
      condition: 'cool',
      label: 'Không gian máy lạnh triển lãm · 22°C'
    },
    vibe: 'Tối giản, Avant-Garde, chiều sâu ý niệm và phong cách nghệ sĩ',
    suggestedPalettes: ['#1D3B53', '#6D432F', '#F4EFE6', '#5B3758'],
    suggestedItems: ['ao-tu-than', 'inner-yem-dao-lua', 'bottom-raw-denim-wide', 'foot-chelsea-boots', 'acc-kieng-bac-cham-sen']
  },
  {
    id: 'event-street-photo-walk',
    name: 'Chụp Ảnh Lookbook Đường Phố Cuối Tuần',
    type: 'street',
    weather: {
      temp: 28,
      condition: 'sunny',
      label: 'Nắng vàng bóng râm · 28°C'
    },
    vibe: 'Trẻ trung, bắt mắt, trendy trên từng khung hình Instagram/TikTok',
    suggestedPalettes: ['#D9738A', '#DDA032', '#165B58', '#F4EFE6'],
    suggestedItems: ['ao-dai-lemur-retro', 'head-non-quai-thao', 'bottom-pleated-maxi', 'acc-quat-xep-ha-dong', 'foot-guoc-moc-nhung']
  }
];

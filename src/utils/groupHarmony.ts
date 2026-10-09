import { 
  GroupMember, 
  GroupOccasionId, 
  GroupOccasionInfo, 
  GroupMatchResult, 
  GroupPresetTheme, 
  ClothingItem, 
  ElementType,
  CulturalEra,
  OutfitState
} from '../types';
import { getColorElement } from './colorHarmony';

export const GROUP_OCCASIONS: GroupOccasionInfo[] = [
  {
    id: 'xuan_hoi',
    name: 'Du Xuân & Trẩy Hội',
    vibe: 'Rực rỡ, may mắn, hỷ khí đầu năm',
    recommendedPalette: ['#B82626', '#DDA032', '#D9738A', '#F4EFE6', '#165B58'],
    recommendedEra: ['Triều Nguyễn (1802–1945)', 'Tân thời (1930–1950s)'],
    description: 'Chuyến du xuân trẩy hội đền chùa, Hồ Gươm, ngắm hoa mai hoa đào. Trang phục chuộng sắc đỏ son, vàng hoàng yến, hồng cánh sen tươi tắn cát tường.'
  },
  {
    id: 'co_cung_ky_yeu',
    name: 'Chụp Ảnh Cố Cung & Kỷ Yếu',
    vibe: 'Đoan trang, vương giả, uy nghiêm di sản',
    recommendedPalette: ['#DDA032', '#1D3B53', '#5B3758', '#F4EFE6', '#165B58'],
    recommendedEra: ['Triều Nguyễn (1802–1945)', 'Triều Lê (1428–1789)'],
    description: 'Bối cảnh Hoàng thành Thăng Long, Cố đô Huế, Văn Miếu. Thích hợp nhất cho Áo Nhật Bình ngũ sắc, Áo Tấc tay thụng, Áo Ngũ Thân trang nghiêm.'
  },
  {
    id: 'pho_co_dao_choi',
    name: 'Dạo Phố Cổ & Phố Đi Bộ',
    vibe: 'Trẻ trung, thanh thoát, thoải mái di chuyển',
    recommendedPalette: ['#F4EFE6', '#165B58', '#D9738A', '#1D3B53', '#E6C687'],
    recommendedEra: ['Tân thời (1930–1950s)', 'Sài Gòn thập niên 1960–1970', 'Hiện đại / Remix'],
    description: 'Dạo bước phố cổ Hội An bên dòng sông Hoài hoặc phố đi bộ Hà Nội, Sài Gòn. Ưu tiên tà áo lụa tơ nhẹ tênh, áo dài cách tân năng động phối phụ kiện quạt nan, nón lá.'
  },
  {
    id: 'hy_su_cuoi',
    name: 'Dự Tiệc Cưới & Hỷ Sự Cổ Phong',
    vibe: 'Sang trọng, chúc phúc, hài hòa không lấn át gia chủ',
    recommendedPalette: ['#D9738A', '#DDA032', '#F4EFE6', '#165B58', '#5B3758'],
    recommendedEra: ['Triều Nguyễn (1802–1945)', 'Tân thời (1930–1950s)'],
    description: 'Tiệc hỷ sự, lễ thành hôn phong vị xưa. Nhóm bạn diện đồ thanh tao, trang nhã, tương sinh vượng khí mà vẫn tôn vinh nhân vật chính.'
  },
  {
    id: 'tra_chieu_nha',
    name: 'Trà Chiều & Đàm Đạo Cổ Phong',
    vibe: 'Thanh tao, tĩnh tại, tri kỷ tao nhã',
    recommendedPalette: ['#F4EFE6', '#165B58', '#5B3758', '#1D3B53', '#B8860B'],
    recommendedEra: ['Triều Lê (1428–1789)', 'Triều Nguyễn (1802–1945)'],
    description: 'Không gian quán trà cổ, thưởng hương trầm và đàm đạo tao nhã. Chuộng gam màu pastel, ngọc bích, trắng ngà mềm mại của tơ tằm nguyên bản.'
  }
];

// Presets for Couples & Squads
export interface GenderStarterOutfit {
  id: string;
  name: string;
  description: string;
  era: string;
  outfit: OutfitState;
}

export const FEMALE_STARTER_PRESETS: GenderStarterOutfit[] = [
  {
    id: 'female_ngu_than',
    name: 'Tiểu Thư Kinh Kỳ (Áo Ngũ Thân Hồng Sen)',
    description: 'Áo Ngũ Thân tay chẽn phối Yếm Đào tơ tằm và Mấn Nhung đính ngọc',
    era: 'Triều Nguyễn',
    outfit: {
      outerId: 'ao-ngu-than-tay-chen',
      innerId: 'inner-yem-dao-lua',
      bottomId: 'bottom-quan-lua-trang',
      headwearId: 'head-man-nhung-ngoc-trai',
      footwearId: 'foot-hai-theu-hoa-sen',
      accessoryId: 'acc-quat-xep-ha-dong',
      colors: {
        outer: '#D9738A',
        inner: '#B82626',
        bottom: '#F4EFE6',
        headwear: '#5B3758',
        footwear: '#D9738A',
        accessory: '#DDA032'
      }
    }
  },
  {
    id: 'female_nhat_binh',
    name: 'Công Chúa Cố Đô (Áo Nhật Bình Xanh Ngọc)',
    description: 'Áo Nhật Bình viền ngũ sắc trang trọng hoàng gia phối Mấn Kim Tuyến',
    era: 'Triều Nguyễn',
    outfit: {
      outerId: 'ao-nhat-binh',
      innerId: 'inner-ao-canh-trang',
      bottomId: 'bottom-quan-lua-trang',
      headwearId: 'head-man-kim-tuyen-hoang-gia',
      footwearId: 'foot-hai-theu-hoa-sen',
      accessoryId: 'acc-ngoc-boi-cung-dinh',
      colors: {
        outer: '#165B58',
        inner: '#F4EFE6',
        bottom: '#F4EFE6',
        headwear: '#DDA032',
        footwear: '#165B58',
        accessory: '#F4EFE6'
      }
    }
  },
  {
    id: 'female_lemur',
    name: 'Tân Thời Hà Thành (Áo Dài Lemur Cát Tường)',
    description: 'Áo dài Lemur cách tân thanh tao, nón quai thao Triều Khúc duyên dáng',
    era: 'Tân thời',
    outfit: {
      outerId: 'ao-dai-lemur-retro',
      innerId: 'inner-ao-canh-trang',
      bottomId: 'bottom-quan-lua-trang',
      headwearId: 'head-non-quai-thao',
      footwearId: 'foot-guoc-moc-nhung',
      accessoryId: 'acc-kieng-bac-cham-sen',
      colors: {
        outer: '#D9738A',
        inner: '#F4EFE6',
        bottom: '#F4EFE6',
        headwear: '#DDA032',
        footwear: '#B82626',
        accessory: '#F4EFE6'
      }
    }
  }
];

export const MALE_STARTER_PRESETS: GenderStarterOutfit[] = [
  {
    id: 'male_ngu_than',
    name: 'Nho Sinh Tràng An (Áo Ngũ Thân Xanh Chàm)',
    description: 'Áo Ngũ Thân Nam tay chẽn đĩnh đạc, Khăn Đóng đen mun, Guốc mộc',
    era: 'Triều Nguyễn',
    outfit: {
      outerId: 'ao-ngu-than-tay-chen',
      innerId: 'inner-ao-canh-trang',
      bottomId: 'bottom-quan-lua-trang',
      headwearId: 'head-khan-dong-den',
      footwearId: 'foot-guoc-moc-nhung',
      accessoryId: 'acc-quat-xep-ha-dong',
      colors: {
        outer: '#1D3B53',
        inner: '#F4EFE6',
        bottom: '#F4EFE6',
        headwear: '#1A1A1E',
        footwear: '#754B2D',
        accessory: '#F4EFE6'
      }
    }
  },
  {
    id: 'male_ao_tac',
    name: 'Đại Lễ Cung Đình (Áo Tấc Đỏ Son Nam)',
    description: 'Áo Tấc tay thụng đỏ son uy nghi, Khăn Đóng gấm, Quạt xếp Hà Đông',
    era: 'Triều Nguyễn',
    outfit: {
      outerId: 'ao-tac-ngu-than-tay-thung',
      innerId: 'inner-ao-canh-trang',
      bottomId: 'bottom-quan-lua-trang',
      headwearId: 'head-khan-dong-den',
      footwearId: 'foot-guoc-moc-nhung',
      accessoryId: 'acc-quat-xep-ha-dong',
      colors: {
        outer: '#B82626',
        inner: '#F4EFE6',
        bottom: '#F4EFE6',
        headwear: '#1A1A1E',
        footwear: '#754B2D',
        accessory: '#DDA032'
      }
    }
  },
  {
    id: 'male_gam',
    name: 'Quân Tử Đô Thị (Áo Dài Gấm Nam & Loafer)',
    description: 'Áo Dài Gấm hoa cúc xanh ngọc, Chunky loafer hiện đại',
    era: 'Hiện đại / Remix',
    outfit: {
      outerId: 'ao-dai-gam-hoa-cuc-nam',
      innerId: 'inner-ao-canh-trang',
      bottomId: 'bottom-quan-lua-trang',
      headwearId: 'head-khan-dong-den',
      footwearId: 'foot-chunky-loafer',
      accessoryId: 'acc-kieng-bac-cham-sen',
      colors: {
        outer: '#165B58',
        inner: '#F4EFE6',
        bottom: '#F4EFE6',
        headwear: '#1A1A1E',
        footwear: '#1A1A1E',
        accessory: '#F4EFE6'
      }
    }
  }
];

export const UNISEX_STARTER_PRESETS: GenderStarterOutfit[] = [
  {
    id: 'unisex_cyber',
    name: 'Cyber Heritage Gen Z (Blazer Oversized & Yếm Đào)',
    description: 'Blazer độn vai cách tân, Yếm đào tương phản, Quần raw denim và Kính râm',
    era: 'Hiện đại / Remix',
    outfit: {
      outerId: 'remix-oversized-blazer',
      innerId: 'inner-yem-dao-lua',
      bottomId: 'bottom-raw-denim-wide',
      headwearId: 'head-khan-dong-den',
      footwearId: 'foot-chunky-loafer',
      accessoryId: 'acc-kinh-ram-cyber',
      colors: {
        outer: '#1A1A1E',
        inner: '#D9738A',
        bottom: '#1D3B53',
        headwear: '#1A1A1E',
        footwear: '#1A1A1E',
        accessory: '#1A1A1E'
      }
    }
  }
];

export const GROUP_PRESET_THEMES: GroupPresetTheme[] = [
  {
    id: 'couple-royal-nguyen',
    title: 'Song Phụng Triều Nguyễn (Chàng & Nàng)',
    mode: 'couple',
    occasionId: 'co_cung_ky_yeu',
    description: 'Bộ đôi uy nghi Cố đô: Nàng diện Áo Nhật Bình Hoàng Gia ngũ sắc quý phái, Chàng diện Áo Tấc Xanh Chàm đĩnh đạc quân tử.',
    tag: 'Hoàng Gia Cố Đô',
    members: [
      {
        name: 'Nàng (Mỹ Nhân)',
        role: 'Nàng',
        avatarType: 'female',
        outfit: {
          outerId: 'ao-nhat-binh',
          innerId: 'inner-ao-canh-trang',
          bottomId: 'bottom-quan-lua-trang',
          headwearId: 'head-man-nhung-ngoc-trai',
          footwearId: 'foot-hai-theu-hoa-sen',
          accessoryId: 'acc-ngoc-boi-cung-dinh',
          colors: {
            outer: '#DDA032',
            inner: '#F4EFE6',
            bottom: '#F4EFE6',
            headwear: '#5B3758',
            footwear: '#B82626',
            accessory: '#165B58'
          }
        }
      },
      {
        name: 'Chàng (Quân Tử)',
        role: 'Chàng',
        avatarType: 'male',
        outfit: {
          outerId: 'ao-tac-ngu-than-tay-thung',
          innerId: 'inner-ao-canh-trang',
          bottomId: 'bottom-quan-lua-trang',
          headwearId: 'head-khan-dong-den',
          footwearId: 'foot-guoc-moc-nhung',
          accessoryId: 'acc-quat-xep-ha-dong',
          colors: {
            outer: '#1D3B53',
            inner: '#F4EFE6',
            bottom: '#F4EFE6',
            headwear: '#1A1A1E',
            footwear: '#754B2D',
            accessory: '#DDA032'
          }
        }
      }
    ]
  },
  {
    id: 'couple-kinh-ky-thanh-lich',
    title: 'Kinh Kỳ Thanh Lịch (Áo Ngũ Thân Đôi)',
    mode: 'couple',
    occasionId: 'xuan_hoi',
    description: 'Cặp đôi thanh lịch kinh kỳ Tràng An: Nàng yểu điệu trong sắc Hồng Sen Hà Thành, Chàng điềm đạm với Xanh Cổ Vịt tôn quý.',
    tag: 'Thanh Nhã Kinh Kỳ',
    members: [
      {
        name: 'Nàng (Tiểu Thư)',
        role: 'Nàng',
        avatarType: 'female',
        outfit: {
          outerId: 'ao-ngu-than-tay-chen',
          innerId: 'inner-yem-dao-lua',
          bottomId: 'bottom-quan-lua-trang',
          headwearId: 'head-khan-dong-den',
          footwearId: 'foot-hai-theu-hoa-sen',
          accessoryId: 'acc-quat-xep-ha-dong',
          colors: {
            outer: '#D9738A',
            inner: '#B82626',
            bottom: '#F4EFE6',
            headwear: '#1A1A1E',
            footwear: '#D9738A',
            accessory: '#DDA032'
          }
        }
      },
      {
        name: 'Chàng (Nho Sinh)',
        role: 'Chàng',
        avatarType: 'male',
        outfit: {
          outerId: 'ao-ngu-than-tay-chen',
          innerId: 'inner-ao-canh-trang',
          bottomId: 'bottom-quan-lua-trang',
          headwearId: 'head-khan-dong-den',
          footwearId: 'foot-guoc-moc-nhung',
          accessoryId: 'acc-quat-xep-ha-dong',
          colors: {
            outer: '#165B58',
            inner: '#F4EFE6',
            bottom: '#F4EFE6',
            headwear: '#1A1A1E',
            footwear: '#754B2D',
            accessory: '#F4EFE6'
          }
        }
      }
    ]
  },
  {
    id: 'couple-giao-linh-le-so',
    title: 'Giao Lĩnh Duyên Dáng (Thời Lê Sơ)',
    mode: 'couple',
    occasionId: 'tra_chieu_nha',
    description: 'Phong vị cổ kính đại ngàn thời Lê Sơ: Hai tà áo Giao Lĩnh cổ chéo kết hợp hài hòa giữa Trắng Ngà và Xanh Rêu Trầm Mặc.',
    tag: 'Đại Việt Cổ Kính',
    members: [
      {
        name: 'Nàng (Giai Nhân)',
        role: 'Nàng',
        avatarType: 'female',
        outfit: {
          outerId: 'ao-giao-linh-le-so',
          innerId: 'yem-dao-to-tam',
          bottomId: 'chan-vay-xep-ly-maxi',
          headwearId: 'non-quai-thao-kinh-bac',
          footwearId: 'giay-theu-phuong',
          accessoryId: 'ngoc-boi-hoang-gia',
          colors: {
            outer: '#F4EFE6',
            inner: '#D9738A',
            bottom: '#1A1A1E',
            headwear: '#E6C687',
            footwear: '#D9738A',
            accessory: '#165B58'
          }
        }
      },
      {
        name: 'Chàng (Hiệp Khách)',
        role: 'Chàng',
        avatarType: 'male',
        outfit: {
          outerId: 'ao-giao-linh-le-so',
          innerId: 'ao-ngu-than-inner',
          bottomId: 'quan-lua-trang',
          headwearId: 'khan-dong-ngu-than-nam',
          footwearId: 'guoc-moc-truyen-thong',
          accessoryId: 'ngoc-boi-hoang-gia',
          colors: {
            outer: '#165B58',
            inner: '#F4EFE6',
            bottom: '#F4EFE6',
            headwear: '#1A1A1E',
            footwear: '#754B2D',
            accessory: '#DDA032'
          }
        }
      }
    ]
  },
  {
    id: 'couple-remix-streetwear',
    title: 'Remix Phố Cổ Hiện Đại (Couple Streetwear)',
    mode: 'couple',
    occasionId: 'pho_co_dao_choi',
    description: 'Phong cách đương đại trẻ trung: Áo dài Lemur phối phụ kiện hiện đại sánh đôi cùng Áo dài Raglan cách tân phóng khoáng.',
    tag: 'Gen Z Remix',
    members: [
      {
        name: 'Bạn Nữ',
        role: 'Nữ',
        avatarType: 'female',
        outfit: {
          outerId: 'ao-dai-lemur-retro',
          innerId: 'yem-dao-to-tam',
          bottomId: 'quan-jeans-ong-rong-denim',
          headwearId: 'khan-dong-truyen-thong',
          footwearId: 'sneaker-chunky-remix',
          accessoryId: 'kinh-ram-cyber-retro',
          colors: {
            outer: '#B82626',
            inner: '#F4EFE6',
            bottom: '#1D3B53',
            headwear: '#B82626',
            footwear: '#F4EFE6',
            accessory: '#1A1A1E'
          }
        }
      },
      {
        name: 'Bạn Nam',
        role: 'Nam',
        avatarType: 'male',
        outfit: {
          outerId: 'ao-dai-raglan-1960',
          innerId: 'ao-ngu-than-inner',
          bottomId: 'quan-jeans-ong-rong-denim',
          headwearId: 'khan-dong-ngu-than-nam',
          footwearId: 'sneaker-chunky-remix',
          accessoryId: 'kinh-ram-cyber-retro',
          colors: {
            outer: '#165B58',
            inner: '#F4EFE6',
            bottom: '#1A1A1E',
            headwear: '#1A1A1E',
            footwear: '#F4EFE6',
            accessory: '#1A1A1E'
          }
        }
      }
    ]
  },
  {
    id: 'squad-tu-quy-dong-trieu',
    title: 'Tứ Quý Đông Triều (Nhóm 4 Bạn)',
    mode: 'group',
    occasionId: 'xuan_hoi',
    description: 'Bốn đóa hoa Mai - Lan - Cúc - Trúc: Nhóm 4 người đại diện 4 sắc tố mùa xuân Hồng Đào, Xanh Ngọc, Vàng Kim và Trắng Tuyết.',
    tag: 'Nhóm 4 Người Ăn Ý',
    members: [
      {
        name: 'Mai (Hồng Sen)',
        role: 'Thành viên 1',
        avatarType: 'female',
        outfit: {
          outerId: 'ao-ngu-than-nu-tay-chen',
          innerId: 'yem-dao-to-tam',
          bottomId: 'quan-lua-trang',
          headwearId: 'man-nhung-dinh-ngoc',
          footwearId: 'giay-theu-phuong',
          accessoryId: 'quat-xep-ha-dong',
          colors: {
            outer: '#D9738A',
            inner: '#B82626',
            bottom: '#F4EFE6',
            headwear: '#5B3758',
            footwear: '#D9738A',
            accessory: '#DDA032'
          }
        }
      },
      {
        name: 'Lan (Xanh Ngọc)',
        role: 'Thành viên 2',
        avatarType: 'female',
        outfit: {
          outerId: 'ao-nhat-binh-hoang-hau',
          innerId: 'ao-ngu-than-inner',
          bottomId: 'quan-lua-trang',
          headwearId: 'khan-dong-truyen-thong',
          footwearId: 'giay-theu-phuong',
          accessoryId: 'ngoc-boi-hoang-gia',
          colors: {
            outer: '#165B58',
            inner: '#F4EFE6',
            bottom: '#F4EFE6',
            headwear: '#165B58',
            footwear: '#F4EFE6',
            accessory: '#DDA032'
          }
        }
      },
      {
        name: 'Cúc (Hoàng Yến)',
        role: 'Thành viên 3',
        avatarType: 'female',
        outfit: {
          outerId: 'ao-tac-tay-thung-nam',
          innerId: 'ao-ngu-than-inner',
          bottomId: 'quan-lua-trang',
          headwearId: 'man-nhung-dinh-ngoc',
          footwearId: 'giay-theu-phuong',
          accessoryId: 'quat-xep-ha-dong',
          colors: {
            outer: '#DDA032',
            inner: '#F4EFE6',
            bottom: '#F4EFE6',
            headwear: '#DDA032',
            footwear: '#B82626',
            accessory: '#DDA032'
          }
        }
      },
      {
        name: 'Trúc (Trắng Ngà)',
        role: 'Thành viên 4',
        avatarType: 'male',
        outfit: {
          outerId: 'ao-ngu-than-nam-truyen-thong',
          innerId: 'ao-ngu-than-inner',
          bottomId: 'quan-lua-trang',
          headwearId: 'khan-dong-ngu-than-nam',
          footwearId: 'guoc-moc-truyen-thong',
          accessoryId: 'quat-xep-ha-dong',
          colors: {
            outer: '#F4EFE6',
            inner: '#F4EFE6',
            bottom: '#1A1A1E',
            headwear: '#1A1A1E',
            footwear: '#754B2D',
            accessory: '#165B58'
          }
        }
      }
    ]
  },
  {
    id: 'squad-ngu-hanh-hoi-tu',
    title: 'Ngũ Hành Hội Tụ (Nhóm 5 Bạn)',
    mode: 'group',
    occasionId: 'co_cung_ky_yeu',
    description: 'Năm hành Kim - Mộc - Thủy - Hỏa - Thổ: Mỗi thành viên đại diện cho một sắc hành tạo nên vòng tương sinh hoàn mỹ khi đứng chung khung hình.',
    tag: 'Nhóm 5 Người Tuyệt Phẩm',
    members: [
      {
        name: 'Hành Kim (Bạch Tinh)',
        role: 'Kim',
        avatarType: 'female',
        outfit: {
          outerId: 'ao-giao-linh-le-so',
          innerId: 'ao-ngu-than-inner',
          bottomId: 'quan-lua-trang',
          headwearId: 'man-nhung-dinh-ngoc',
          footwearId: 'giay-theu-phuong',
          accessoryId: 'ngoc-boi-hoang-gia',
          colors: {
            outer: '#F4EFE6',
            inner: '#F4EFE6',
            bottom: '#F4EFE6',
            headwear: '#DDA032',
            footwear: '#F4EFE6',
            accessory: '#DDA032'
          }
        }
      },
      {
        name: 'Hành Mộc (Thanh Mộc)',
        role: 'Mộc',
        avatarType: 'female',
        outfit: {
          outerId: 'ao-nhat-binh-hoang-hau',
          innerId: 'ao-ngu-than-inner',
          bottomId: 'quan-lua-trang',
          headwearId: 'khan-dong-truyen-thong',
          footwearId: 'giay-theu-phuong',
          accessoryId: 'quat-xep-ha-dong',
          colors: {
            outer: '#165B58',
            inner: '#F4EFE6',
            bottom: '#F4EFE6',
            headwear: '#165B58',
            footwear: '#165B58',
            accessory: '#F4EFE6'
          }
        }
      },
      {
        name: 'Hành Thủy (Huyền Thủy)',
        role: 'Thủy',
        avatarType: 'male',
        outfit: {
          outerId: 'ao-tac-tay-thung-nam',
          innerId: 'ao-ngu-than-inner',
          bottomId: 'quan-lua-trang',
          headwearId: 'khan-dong-ngu-than-nam',
          footwearId: 'guoc-moc-truyen-thong',
          accessoryId: 'quat-xep-ha-dong',
          colors: {
            outer: '#1D3B53',
            inner: '#F4EFE6',
            bottom: '#F4EFE6',
            headwear: '#1A1A1E',
            footwear: '#754B2D',
            accessory: '#F4EFE6'
          }
        }
      },
      {
        name: 'Hành Hỏa (Xích Hỏa)',
        role: 'Hỏa',
        avatarType: 'female',
        outfit: {
          outerId: 'ao-ngu-than-nu-tay-chen',
          innerId: 'yem-dao-to-tam',
          bottomId: 'quan-lua-trang',
          headwearId: 'khan-dong-truyen-thong',
          footwearId: 'giay-theu-phuong',
          accessoryId: 'quat-xep-ha-dong',
          colors: {
            outer: '#B82626',
            inner: '#D9738A',
            bottom: '#F4EFE6',
            headwear: '#B82626',
            footwear: '#B82626',
            accessory: '#DDA032'
          }
        }
      },
      {
        name: 'Hành Thổ (Hoàng Thổ)',
        role: 'Thổ',
        avatarType: 'female',
        outfit: {
          outerId: 'ao-nhat-binh-hoang-hau',
          innerId: 'ao-ngu-than-inner',
          bottomId: 'quan-lua-trang',
          headwearId: 'man-nhung-dinh-ngoc',
          footwearId: 'giay-theu-phuong',
          accessoryId: 'ngoc-boi-hoang-gia',
          colors: {
            outer: '#DDA032',
            inner: '#F4EFE6',
            bottom: '#F4EFE6',
            headwear: '#5B3758',
            footwear: '#DDA032',
            accessory: '#165B58'
          }
        }
      }
    ]
  }
];

// Helper: Elemental synergy rules
const GENERATING_PAIRS: Record<ElementType, ElementType> = {
  Mộc: 'Hỏa',
  Hỏa: 'Thổ',
  Thổ: 'Kim',
  Kim: 'Thủy',
  Thủy: 'Mộc'
};

const OVERCOMING_PAIRS: Record<ElementType, ElementType> = {
  Mộc: 'Thổ',
  Thổ: 'Thủy',
  Thủy: 'Hỏa',
  Hỏa: 'Kim',
  Kim: 'Mộc'
};

// Calculate Group Matching & Synergy Score
export function calculateGroupMatch(
  members: GroupMember[],
  occasionId: GroupOccasionId,
  itemsMap: Record<string, ClothingItem>
): GroupMatchResult {
  if (members.length === 0) {
    return {
      overallScore: 80,
      grade: 'Khá Đồng Điệu',
      summary: 'Chưa có thành viên nào trong nhóm.',
      criteria: [],
      memberElements: [],
      elementSynergies: [],
      recommendations: ['Hãy thêm ít nhất 2 thành viên để bắt đầu phân tích độ ăn ý.']
    };
  }

  const occasion = GROUP_OCCASIONS.find(o => o.id === occasionId) || GROUP_OCCASIONS[0];

  // 1. Analyze dominant element and era for each member
  const memberElements = members.map(m => {
    const outerItem = m.outfit.outerId ? itemsMap[m.outfit.outerId] : null;
    const dominantElement = getColorElement(m.outfit.colors.outer);
    const era = outerItem ? outerItem.era : 'Truyền thống';
    return {
      memberId: m.id,
      memberName: m.name,
      dominantElement,
      era,
      outerName: outerItem?.name
    };
  });

  // 2. Elemental Synergy Analysis
  let generatingCount = 0;
  let overcomingCount = 0;
  let sameElementCount = 0;
  const elementSynergies: string[] = [];

  for (let i = 0; i < memberElements.length; i++) {
    for (let j = i + 1; j < memberElements.length; j++) {
      const e1 = memberElements[i].dominantElement;
      const e2 = memberElements[j].dominantElement;
      const name1 = memberElements[i].memberName;
      const name2 = memberElements[j].memberName;

      if (GENERATING_PAIRS[e1] === e2) {
        generatingCount++;
        elementSynergies.push(`${name1} (${e1}) tương sinh thúc đẩy ${name2} (${e2}) - Dòng năng lượng cát tường.`);
      } else if (GENERATING_PAIRS[e2] === e1) {
        generatingCount++;
        elementSynergies.push(`${name2} (${e2}) tương sinh nâng đỡ ${name1} (${e1}) - Sự gắn kết bền vững.`);
      } else if (e1 === e2) {
        sameElementCount++;
        elementSynergies.push(`${name1} & ${name2} cùng hành ${e1} - Ton-sur-ton đồng điệu.`);
      } else if (OVERCOMING_PAIRS[e1] === e2 || OVERCOMING_PAIRS[e2] === e1) {
        overcomingCount++;
      }
    }
  }

  // Criterion 1: Ngũ Hành & Bảng Màu Cả Nhóm (30đ max)
  let scorePalette = 24;
  scorePalette += Math.min(generatingCount * 3, 5);
  scorePalette += Math.min(sameElementCount * 2, 4);
  scorePalette -= Math.min(overcomingCount * 2, 4);
  scorePalette = Math.max(18, Math.min(30, scorePalette));

  // Criterion 2: Đồng Bộ Triều Đại & Phong Cách (25đ max)
  const eras = memberElements.map(m => m.era);
  const uniqueEras = new Set(eras);
  let scoreEra = 25;
  if (uniqueEras.size === 1) {
    scoreEra = 25; // Cực kỳ đồng nhất
  } else if (uniqueEras.size === 2) {
    scoreEra = 22; // Giao thoa 2 thời kỳ hòa hợp
  } else {
    scoreEra = 18; // Hơi nhiều thời kỳ khác nhau
  }

  // Criterion 3: Cân Bằng Bố Cục Thị Giác & Tránh Xung Đột (25đ max)
  // Check contrast between members
  const colors = members.map(m => m.outfit.colors.outer.toUpperCase());
  const uniqueColors = new Set(colors);
  let scoreVisual = 23;
  if (members.length === 2) {
    // For couple: contrast or harmonious match is best
    scoreVisual = 24;
  } else if (uniqueColors.size >= members.length - 1) {
    scoreVisual = 24; // Phong phú sắc thái
  } else {
    scoreVisual = 21;
  }

  // Criterion 4: Thích Ứng Bối Cảnh Chuyến Đi (20đ max)
  let scoreOccasion = 18;
  const recommendedEras = occasion.recommendedEra;
  const matchEraCount = memberElements.filter(m => 
    recommendedEras.some(re => m.era.includes(re))
  ).length;
  if (matchEraCount === members.length) {
    scoreOccasion = 20;
  } else if (matchEraCount > 0) {
    scoreOccasion = 18;
  } else {
    scoreOccasion = 16;
  }

  const totalScore = Math.min(100, Math.round(scorePalette + scoreEra + scoreVisual + scoreOccasion));

  let grade: GroupMatchResult['grade'] = 'Tuyệt Mỹ Ăn Ý';
  if (totalScore >= 92) grade = 'Tuyệt Mỹ Ăn Ý';
  else if (totalScore >= 82) grade = 'Rất Hòa Hợp';
  else if (totalScore >= 70) grade = 'Khá Đồng Điệu';
  else grade = 'Cần Cân Đối Lại';

  // Summary narration
  let summary = '';
  if (members.length === 2) {
    summary = `Cặp đôi ${members[0].name} & ${members[1].name} đạt độ hòa hợp ${totalScore}% khi diện trang phục cho dịp "${occasion.name}". Sắc thái giữa hai người bổ trợ hài hòa, tạo ấn tượng sang trọng và gắn kết.`;
  } else {
    summary = `Nhóm bạn ${members.length} người đạt chỉ số tương thích ${totalScore}%. Toàn bộ đội hình tạo nên dải màu đồng điệu, nổi bật khí chất khi xuất hiện cùng nhau trong chuyến đi "${occasion.name}".`;
  }

  // Recommendations
  const recommendations: string[] = [];
  if (scorePalette < 26) {
    recommendations.push('Có thể điều chỉnh màu áo ngoài của một thành viên sang tone Vàng Hoàng Yến hoặc Trắng Ngà để khép kín chu trình tương sinh ngũ hành.');
  }
  if (scoreEra < 23) {
    recommendations.push('Nên ưu tiên các bộ trang phục cùng thời kỳ Triều Nguyễn (Áo Tấc, Nhật Bình) hoặc cùng phong cách Remix để tăng độ kết nối di sản.');
  }
  if (members.length >= 3 && uniqueColors.size === 1) {
    recommendations.push('Cả nhóm đang mặc cùng một màu áo. Hãy tạo điểm nhấn bằng các phụ kiện khác màu như Quạt Hà Đông, Khăn Đóng tương phản.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Đội hình hiện tại đã đạt độ đồng điệu xuất sắc, cực kỳ ăn ảnh và tự nhiên khi đi chơi cùng nhau!');
  }

  return {
    overallScore: totalScore,
    grade,
    summary,
    memberElements,
    elementSynergies,
    recommendations,
    criteria: [
      {
        id: 'palette_synergy',
        name: 'Hòa Sắc Ngũ Hành & Bảng Màu Nhóm',
        score: scorePalette,
        maxScore: 30,
        weight: '30%',
        status: scorePalette >= 26 ? 'excellent' : scorePalette >= 22 ? 'good' : 'average',
        comment: generatingCount > 0 ? `Có ${generatingCount} cặp tương sinh cát tường giữa các thành viên.` : 'Bảng màu cơ bản ổn định.'
      },
      {
        id: 'era_cohesion',
        name: 'Đồng Điệu Triều Đại & Di Sản',
        score: scoreEra,
        maxScore: 25,
        weight: '25%',
        status: scoreEra >= 23 ? 'excellent' : scoreEra >= 20 ? 'good' : 'average',
        comment: uniqueEras.size === 1 ? 'Tuyệt đối nhất quán về dòng thời gian lịch sử.' : `Kết hợp giữa ${uniqueEras.size} phong cách thời kỳ.`
      },
      {
        id: 'visual_balance',
        name: 'Cân Bằng Thị Giác & Bố Cục Ảnh',
        score: scoreVisual,
        maxScore: 25,
        weight: '25%',
        status: scoreVisual >= 23 ? 'excellent' : scoreVisual >= 20 ? 'good' : 'average',
        comment: 'Tỷ lệ tương phản và độ sáng giữa các bộ trang phục vừa vặn, không ai bị chìm.'
      },
      {
        id: 'occasion_fit',
        name: `Phù Hợp Bối Cảnh "${occasion.name}"`,
        score: scoreOccasion,
        maxScore: 20,
        weight: '20%',
        status: scoreOccasion >= 18 ? 'excellent' : 'good',
        comment: occasion.vibe
      }
    ]
  };
}

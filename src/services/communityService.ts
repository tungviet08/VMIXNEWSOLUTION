import { CommunityLookbook, OutfitState, ClothingItem } from '../types';
import { INITIAL_WARDROBE } from '../data/wardrobeData';
import { userService } from './userService';

const STORAGE_KEY_COMMUNITY = 'vietphuc_community_showcase';

const itemsMap: Record<string, ClothingItem> = {};
INITIAL_WARDROBE.forEach((item) => {
  itemsMap[item.id] = item;
});

const SEEDED_COMMUNITY_LOOKS: CommunityLookbook[] = [
  {
    id: 'comm_look_01',
    title: 'Neo-Scholar Hanoi Autumn 2026',
    authorId: 'user_genz_01',
    authorName: 'An Cổ Phong',
    authorTitle: 'Gen Z Cổ Phong Stylist',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    eventName: 'Triển Lãm Nghệ Thuật Đương Đại',
    weatherLabel: 'Se lạnh mùa thu · 19°C',
    createdAt: '2 giờ trước',
    likes: 142,
    colorHarmonyScore: 96,
    styleCategory: 'remix',
    tags: ['#NeoScholar', '#ÁoNgũThân', '#RawDenim', '#ChunkyLoafer'],
    notes: 'Remix áo ngũ thân tay chẽn xanh chàm cùng raw denim và chunky loafer. Vừa giữ trọn 5 cúc Ngũ Thường vừa cực kỳ thoải mái dạo bước trong gallery.',
    outfit: {
      outerId: 'ao-ngu-than-tay-chen',
      innerId: 'inner-modern-fitted-tee',
      bottomId: 'bottom-raw-denim-wide',
      headwearId: 'head-khan-dong-den',
      footwearId: 'foot-chunky-loafer',
      accessoryId: 'acc-kinh-ram-cyber',
      colors: {
        outer: '#1D3B53',
        inner: '#1A1A1E',
        bottom: '#1D3B53',
        headwear: '#1A1A1E',
        footwear: '#1A1A1E',
        accessory: '#1A1A1E'
      }
    },
    items: [
      itemsMap['ao-ngu-than-tay-chen'],
      itemsMap['inner-modern-fitted-tee'],
      itemsMap['bottom-raw-denim-wide'],
      itemsMap['head-khan-dong-den'],
      itemsMap['foot-chunky-loafer'],
      itemsMap['acc-kinh-ram-cyber']
    ].filter(Boolean)
  },
  {
    id: 'comm_look_02',
    title: 'Dạ Khúc Cung Đình Huế - Nhật Bình Hoàng Tộc',
    authorId: 'user_huong_giang',
    authorName: 'Minh Thảo Cố Đô',
    authorTitle: 'Nhà Nghiên Cứu Trang Phục Cổ',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    eventName: 'Đám Cưới Bạn Thân - Concept Cổ Phong',
    weatherLabel: 'Nắng ấm hoàng hôn · 25°C',
    createdAt: '5 giờ trước',
    likes: 218,
    colorHarmonyScore: 98,
    styleCategory: 'traditional',
    tags: ['#NhậtBình', '#MấnNhung', '#CổPhụcThuầnViệt', '#LễCướiCổPhong'],
    notes: 'Phục dựng chuẩn nếp cổ truyền: Nhật Bình đỏ son thêu phượng ngũ sắc, kết hợp mấn nhung đính ngọc trai và kiềng bạc hoa sen. Tôn nghiêm và rạng ngời phúc khí.',
    outfit: {
      outerId: 'ao-nhat-binh-menh-phu-do',
      innerId: 'inner-ao-canh-trang',
      bottomId: 'bottom-quan-lua-trang',
      headwearId: 'head-man-nhung-ngoc-trai',
      footwearId: 'foot-guoc-moc-nhung',
      accessoryId: 'acc-kieng-bac-cham-sen',
      colors: {
        outer: '#B82626',
        inner: '#F4EFE6',
        bottom: '#F4EFE6',
        headwear: '#B82626',
        footwear: '#B82626',
        accessory: '#F4EFE6'
      }
    },
    items: [
      itemsMap['ao-nhat-binh-menh-phu-do'],
      itemsMap['inner-ao-canh-trang'],
      itemsMap['bottom-quan-lua-trang'],
      itemsMap['head-man-nhung-ngoc-trai'],
      itemsMap['foot-guoc-moc-nhung'],
      itemsMap['acc-kieng-bac-cham-sen']
    ].filter(Boolean)
  },
  {
    id: 'comm_look_03',
    title: 'Cyberpunk Giao Lĩnh - Hoàng Thành Đêm',
    authorId: 'user_vinh_tech',
    authorName: 'Quang Vinh Retro',
    authorTitle: 'Streetwear Concept Artist',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    eventName: 'Monsoon Music & Art Fair',
    weatherLabel: 'Gió mùa se lạnh · 18°C',
    createdAt: '1 ngày trước',
    likes: 310,
    colorHarmonyScore: 92,
    styleCategory: 'experimental',
    tags: ['#GiaoLĩnh', '#CyberCổPhong', '#CargoTechwear', '#MatrixVibes'],
    notes: 'Áo giao lĩnh triều Lê cài vạt hữu huyền bí, mix cùng quần cargo techwear và bốt chelsea da đen. Đêm nhạc festival ngoài trời bao ngầu và ấm áp.',
    outfit: {
      outerId: 'ao-giao-linh',
      innerId: 'inner-modern-fitted-tee',
      bottomId: 'bottom-cargo-techwear',
      headwearId: 'head-khan-dong-den',
      footwearId: 'foot-chelsea-boots',
      accessoryId: 'acc-kinh-ram-cyber',
      colors: {
        outer: '#1A1A1E',
        inner: '#1A1A1E',
        bottom: '#1A1A1E',
        headwear: '#1A1A1E',
        footwear: '#1A1A1E',
        accessory: '#1A1A1E'
      }
    },
    items: [
      itemsMap['ao-giao-linh'],
      itemsMap['inner-modern-fitted-tee'],
      itemsMap['bottom-cargo-techwear'],
      itemsMap['head-khan-dong-den'],
      itemsMap['foot-chelsea-boots'],
      itemsMap['acc-kinh-ram-cyber']
    ].filter(Boolean)
  },
  {
    id: 'comm_look_04',
    title: 'Duyên Kinh Bắc - Tứ Thân & Nón Quai Thao Dạo Phố',
    authorId: 'user_linh_dan',
    authorName: 'Linh Đan Quan Họ',
    authorTitle: 'Nghệ Sĩ Trẻ Di Sản',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    eventName: 'Chụp Ảnh Lookbook Đường Phố Cuối Tuần',
    weatherLabel: 'Nắng thu dịu nhẹ · 26°C',
    createdAt: '2 ngày trước',
    likes: 185,
    colorHarmonyScore: 94,
    styleCategory: 'traditional',
    tags: ['#ÁoTứThân', '#YếmĐào', '#NónQuaiThao', '#KinhBắc'],
    notes: 'Áo tứ thân lụa đào kết hợp yếm thêu hoa sen Tây Hồ, thắt lưng dải lụa mềm và nón quai thao Triều Khúc bản rộng. Từng bước đi như bước ra từ câu hát Quan họ.',
    outfit: {
      outerId: 'ao-tu-than-lua-dao-sen',
      innerId: 'inner-yem-dao-lua',
      bottomId: 'bottom-vay-dup-xep-ly',
      headwearId: 'head-non-quai-thao',
      footwearId: 'foot-guoc-moc-nhung',
      accessoryId: 'acc-quat-xep-ha-dong',
      colors: {
        outer: '#D9738A',
        inner: '#D9738A',
        bottom: '#1A1A1E',
        headwear: '#DDA032',
        footwear: '#B82626',
        accessory: '#DDA032'
      }
    },
    items: [
      itemsMap['ao-tu-than-lua-dao-sen'],
      itemsMap['inner-yem-dao-lua'],
      itemsMap['bottom-vay-dup-xep-ly'],
      itemsMap['head-non-quai-thao'],
      itemsMap['foot-guoc-moc-nhung'],
      itemsMap['acc-quat-xep-ha-dong']
    ].filter(Boolean)
  }
];

export const communityService = {
  getCommunityLookbooks(): CommunityLookbook[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COMMUNITY);
      const currentUser = userService.getCurrentUser();
      let looks: CommunityLookbook[] = stored ? JSON.parse(stored) : SEEDED_COMMUNITY_LOOKS;

      // Populate liked status from current user
      looks = looks.map(look => ({
        ...look,
        likedByCurrentUser: currentUser.likedLookbookIds?.includes(look.id) || false
      }));

      return looks;
    } catch (e) {
      console.warn('Failed to load community looks', e);
      return SEEDED_COMMUNITY_LOOKS;
    }
  },

  submitLookbook(look: CommunityLookbook): CommunityLookbook[] {
    const current = this.getCommunityLookbooks();
    const existingIndex = current.findIndex(l => l.id === look.id);
    if (existingIndex >= 0) {
      current[existingIndex] = look;
    } else {
      current.unshift(look);
    }

    try {
      localStorage.setItem(STORAGE_KEY_COMMUNITY, JSON.stringify(current));
    } catch (e) {
      console.warn('Failed to persist community lookbook', e);
    }
    return current;
  },

  toggleLike(lookbookId: string): { look: CommunityLookbook | undefined; isLiked: boolean } {
    const looks = this.getCommunityLookbooks();
    const look = looks.find(l => l.id === lookbookId);
    if (!look) return { look: undefined, isLiked: false };

    const { isLiked } = userService.toggleLike(lookbookId);
    look.likes = isLiked ? look.likes + 1 : Math.max(0, look.likes - 1);
    look.likedByCurrentUser = isLiked;

    try {
      localStorage.setItem(STORAGE_KEY_COMMUNITY, JSON.stringify(looks));
    } catch (e) {
      console.warn('Failed to save liked state in community showcase', e);
    }

    return { look, isLiked };
  }
};

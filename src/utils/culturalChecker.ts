import { OutfitState, ClothingItem, EventModel, CulturalWarning } from '../types';

export function checkCulturalCompliance(
  outfit: OutfitState,
  itemsMap: Record<string, ClothingItem>,
  currentEvent: EventModel
): CulturalWarning[] {
  const warnings: CulturalWarning[] = [];

  const headwear = outfit.headwearId ? itemsMap[outfit.headwearId] : null;
  const outer = outfit.outerId ? itemsMap[outfit.outerId] : null;
  const bottom = outfit.bottomId ? itemsMap[outfit.bottomId] : null;
  const footwear = outfit.footwearId ? itemsMap[outfit.footwearId] : null;

  // 1. CẢNH BÁO NẶNG: Khăn đóng màu trắng / tang chế mặc trong dịp hỷ sự hoặc lễ hội
  const isWhiteHeadwear = headwear?.id === 'head-khan-dong-trang-tang' || 
    (headwear?.id === 'head-khan-dong-den' && outfit.colors.headwear.toUpperCase() === '#FFFFFF');

  if (isWhiteHeadwear && (currentEvent.type === 'tet' || currentEvent.type === 'wedding' || currentEvent.type === 'graduation' || currentEvent.type === 'festival')) {
    warnings.push({
      id: 'warn-white-turban-mourning',
      severity: 'high',
      title: 'Kiêng kỵ văn hóa: Khăn đóng trắng trong dịp Hỷ sự / Tết',
      explanation: `Bạn đang phối khăn đóng màu trắng trong sự kiện "${currentEvent.name}". Trong văn hóa cổ truyền Việt Nam, khăn trắng bằng vải sô hay lụa trơn thuần túy là dấu hiệu của Đại tang (tang lễ, hiếu đạo).`,
      historicalContext: 'Từ thời Lê - Nguyễn, người Việt tối kỵ đội khăn màu trắng tuyết đến các dịp hỷ sự, lễ tết hoặc chúc thọ, vì tượng trưng cho sự mất mát chia ly.',
      recommendation: 'Chuyển sang Khăn Đóng the màu đen nếp chữ "Nhất" (truyền thống chuẩn mực) hoặc khăn xanh chàm để giữ trọn vẹn sự tôn nghiêm và điềm lành.',
      fixAction: {
        label: 'Đổi sang Khăn Đóng đen truyền thống',
        applyFix: (prev) => ({
          ...prev,
          headwearId: 'head-khan-dong-den',
          colors: { ...prev.colors, headwear: '#1A1A1E' }
        })
      }
    });
  }

  // 2. CẢNH BÁO: Áo Tấc (Đại lễ phục) không mặc quần hoặc phối thiếu tôn nghiêm
  if (outer?.id === 'ao-tac-ngu-than-tay-thung') {
    if (!bottom) {
      warnings.push({
        id: 'warn-ao-tac-no-bottom',
        severity: 'high',
        title: 'Quy chuẩn lễ phục: Áo Tấc bắt buộc đi cùng Quần dài',
        explanation: 'Áo Tấc là Đại lễ phục tôn nghiêm hàng đầu triều Nguyễn. Tuyệt đối không thể mặc thiếu phần quần dài phủ kín chân.',
        historicalContext: 'Trong nghi lễ cung đình và gia lễ thời Nguyễn, Áo Tấc được quy định ngặt nghèo trong Khâm định Đại Nam hội điển sự lệ, luôn mặc cùng quần lụa trắng dài chấm gót.',
        recommendation: 'Trang bị ngay Quần lụa trắng ống rộng hoặc Quần âu tối màu thanh lịch.',
        fixAction: {
          label: 'Mặc Quần lụa trắng chuẩn nếp',
          applyFix: (prev) => ({
            ...prev,
            bottomId: 'bottom-quan-lua-trang',
            colors: { ...prev.colors, bottom: '#F4EFE6' }
          })
        }
      });
    }
  }

  // 3. CẢNH BÁO TINH TẾ: Áo Tứ Thân phối nhầm với Khăn Đóng thời Nguyễn
  if (outer?.id === 'ao-tu-than' && headwear?.id === 'head-khan-dong-den') {
    warnings.push({
      id: 'warn-tu-than-khan-dong-mismatch',
      severity: 'medium',
      title: 'Lệch phong cách vùng miền & thời kỳ: Áo Tứ Thân và Khăn Đóng',
      explanation: 'Áo Tứ thân mang bản sắc văn hóa dân gian đồng bằng Bắc Bộ (liền chị Quan họ, hội Lim), theo truyền thống đi cùng Nón Quai Thao, khăn mỏ quạ hoặc tóc vấn trần.',
      historicalContext: 'Khăn đóng (khăn xếp) nếp chữ Nhất là quy chuẩn của người Đàng Trong và phổ biến sau cuộc cải cách thời Nguyễn, thường kết hợp với Áo Ngũ Thân.',
      recommendation: 'Để chuẩn nét duyên Kinh Bắc, hãy thử đổi sang Nón Quai Thao hoặc để tóc tự nhiên cài trâm lụa.',
      fixAction: {
        label: 'Đổi sang Nón Quai Thao Kinh Bắc',
        applyFix: (prev) => ({
          ...prev,
          headwearId: 'head-non-quai-thao',
          colors: { ...prev.colors, headwear: '#DDA032' }
        })
      }
    });
  }

  // 4. LƯU Ý: Vàng Hoàng Yến phối trong sự kiện bình dân
  if (outer && outfit.colors.outer === '#DDA032' && outer.isTraditional && outer.id === 'ao-tac-ngu-than-tay-thung') {
    warnings.push({
      id: 'warn-imperial-yellow-context',
      severity: 'info',
      title: 'Gợi mở lịch sử: Sắc Vàng Hoàng Yến cung đình',
      explanation: 'Dưới thời nhà Nguyễn, sắc vàng chính hoàng (vàng tươi rực rỡ) từng là màu sắc độc quyền của Hoàng đế. Thứ dân và quan lại chỉ được dùng màu đỏ tía, xanh chàm hoặc vàng thổ đậm.',
      historicalContext: 'Ngày nay thế hệ trẻ Gen Z hoàn toàn có thể tự do sáng tạo màu sắc, nhưng hiểu được ý nghĩa xuất phát điểm sẽ giúp bạn tự tin thuyết minh trang phục hơn.',
      recommendation: 'Giữ nguyên nếu bạn muốn phong thái quyền quý, hoặc thử sắc Xanh Cổ Vịt / Đỏ Son để gần gũi với phong thái sĩ tử.',
    });
  }

  // 5. LƯU Ý: Yếm Đào mặc ngoài mà không có lớp che chắn trong sự kiện trang trọng
  if (outer === null && outfit.innerId === 'inner-yem-dao-lua' && (currentEvent.type === 'graduation' || currentEvent.type === 'wedding')) {
    warnings.push({
      id: 'warn-yem-only-formal-event',
      severity: 'medium',
      title: 'Nhắc nhở nghi thức: Yếm Đào trong không gian trang nghiêm',
      explanation: `Sự kiện "${currentEvent.name}" đòi hỏi tính trang trọng lễ nghi. Mặc yếm đào mà không có áo khoác ngoài (như Áo Tứ thân hoặc Áo Blazer hiện đại) có thể bị coi là thiếu chỉn chu.`,
      historicalContext: 'Yếm là trang phục lót (nội y truyền thống). Phụ nữ xưa khi bước ra ngõ luôn khoác áo cánh hoặc tứ thân bên ngoài.',
      recommendation: 'Hãy khoác thêm một chiếc Blazer oversized hiện đại (Remix cực chất) hoặc Áo Tứ Thân mềm mại.',
      fixAction: {
        label: 'Khoác thêm Blazer hiện đại',
        applyFix: (prev) => ({
          ...prev,
          outerId: 'remix-oversized-blazer',
          colors: { ...prev.colors, outer: '#1A1A1E' }
        })
      }
    });
  }

  return warnings;
}

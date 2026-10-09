import { OutfitState, ColorHarmonyResult, ElementType } from '../types';
import { TRADITIONAL_COLORS, ELEMENT_RELATIONS } from '../data/colorsData';

export function getColorElement(hexColor: string): ElementType {
  const normalized = hexColor.toUpperCase();
  const matched = TRADITIONAL_COLORS.find(c => c.hex.toUpperCase() === normalized);
  if (matched) return matched.element;

  // Fallback heuristic based on RGB
  let hex = normalized.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;

  if (r > 200 && g > 200 && b > 200) return 'Kim'; // White / Light
  if (r < 40 && g < 40 && b < 40) return 'Thủy'; // Black
  if (r > 150 && g < 100 && b < 100) return 'Hỏa'; // Red
  if (g > r && g > b) return 'Mộc'; // Green
  if (b > r && b > g) return 'Thủy'; // Blue
  if (r > 160 && g > 130 && b < 80) return 'Thổ'; // Yellow / Earth
  if (r > 180 && g < 150 && b > 120) return 'Hỏa'; // Pink
  return 'Thổ';
}

export function analyzeColorHarmony(outfit: OutfitState): ColorHarmonyResult {
  const elementsPresent: ElementType[] = [];
  
  if (outfit.outerId) elementsPresent.push(getColorElement(outfit.colors.outer));
  if (outfit.innerId) elementsPresent.push(getColorElement(outfit.colors.inner));
  if (outfit.bottomId) elementsPresent.push(getColorElement(outfit.colors.bottom));
  if (outfit.headwearId) elementsPresent.push(getColorElement(outfit.colors.headwear));
  if (outfit.accessoryId) elementsPresent.push(getColorElement(outfit.colors.accessory));

  if (elementsPresent.length === 0) {
    return {
      score: 75,
      grade: 'Hài hòa',
      dominantElement: 'Thổ',
      elementRelation: 'Cân bằng tự nhiên',
      feedback: 'Chưa có trang phục được chọn để phân tích hòa sắc.',
      tips: ['Hãy chọn ít nhất áo và quần để khởi động phân tích ngũ hành.'],
      criteria: [
        {
          id: 'ngu_hanh',
          name: 'Quy Luật Ngũ Hành',
          score: 22,
          maxScore: 30,
          weight: '30%',
          status: 'good',
          comment: 'Chờ trang bị thêm trang phục để luận ngũ hành'
        },
        {
          id: 'contrast_ratio',
          name: 'Tương Phản & Tỷ Lệ Màu',
          score: 19,
          maxScore: 25,
          weight: '25%',
          status: 'good',
          comment: 'Cần phối lớp màu áo trong - ngoài'
        },
        {
          id: 'heritage_authenticity',
          name: 'Bản Sắc Di Sản Cổ Truyền',
          score: 19,
          maxScore: 25,
          weight: '25%',
          status: 'good',
          comment: 'Ưu tiên màu sắc tự nhiên Việt Nam'
        },
        {
          id: 'modern_aesthetic',
          name: 'Hòa Hợp & Cảm Quan Gen Z',
          score: 15,
          maxScore: 20,
          weight: '20%',
          status: 'average',
          comment: 'Outfit đang ở cấu hình mặc định'
        }
      ]
    };
  }

  // Count occurrences
  const countMap: Record<ElementType, number> = {
    Kim: 0,
    Mộc: 0,
    Thủy: 0,
    Hỏa: 0,
    Thổ: 0
  };

  elementsPresent.forEach(el => {
    countMap[el] = (countMap[el] || 0) + 1;
  });

  // Find dominant element
  let dominantElement: ElementType = 'Thủy';
  let maxCount = -1;
  (Object.keys(countMap) as ElementType[]).forEach(el => {
    if (countMap[el] > maxCount) {
      maxCount = countMap[el];
      dominantElement = el;
    }
  });

  // Check relations
  const uniqueElements = Array.from(new Set(elementsPresent));
  let sinhCount = 0;
  let khacCount = 0;

  for (let i = 0; i < uniqueElements.length; i++) {
    for (let j = i + 1; j < uniqueElements.length; j++) {
      const elA = uniqueElements[i];
      const elB = uniqueElements[j];
      if (ELEMENT_RELATIONS.tươngSinh[elA] === elB || ELEMENT_RELATIONS.tươngSinh[elB] === elA) {
        sinhCount++;
      }
      if (ELEMENT_RELATIONS.tươngKhắc[elA] === elB || ELEMENT_RELATIONS.tươngKhắc[elB] === elA) {
        khacCount++;
      }
    }
  }

  let baseScore = 78;
  if (uniqueElements.length === 1) {
    // Monochrome elegance
    baseScore = 88;
  } else if (sinhCount > 0 && khacCount === 0) {
    baseScore = 94 + Math.min(sinhCount * 2, 4);
  } else if (sinhCount >= khacCount) {
    baseScore = 85 + sinhCount * 3 - khacCount * 2;
  } else {
    baseScore = 70 - khacCount * 4 + sinhCount * 2;
  }

  baseScore = Math.max(50, Math.min(99, baseScore));

  let grade: ColorHarmonyResult['grade'] = 'Hài hòa';
  if (baseScore >= 92) grade = 'Tuyệt mỹ';
  else if (baseScore >= 82) grade = 'Hài hòa';
  else if (baseScore >= 70) grade = 'Khá';
  else if (baseScore >= 60) grade = 'Xung đột nhẹ';
  else grade = 'Cần điều chỉnh';

  let relationText = '';
  const tips: string[] = [];

  if (sinhCount > 0 && khacCount === 0) {
    relationText = `Ngũ Hành Tương Sinh (${uniqueElements.join(' ➔ ')})`;
    tips.push('Màu sắc tuần hoàn thuận theo quy luật đất trời, toát lên vẻ tao nhã, sang trọng tự nhiên.');
    tips.push('Điểm nhấn phụ kiện sáng màu (như kiềng bạc hành Kim) sẽ làm tăng thêm sinh khí.');
  } else if (khacCount > 0 && sinhCount > 0) {
    relationText = 'Giao thoa Tương Sinh & Tương Phản';
    tips.push('Sự xuất hiện của yếu tố tương khắc tạo độ tương phản thị giác mạnh mẽ rất hợp phong cách Gen Z avant-garde.');
    tips.push('Nên dùng một màu trung tính (Trắng ngà / Đen mực) làm cầu nối làm dịu sự va đập.');
  } else if (khacCount > 0) {
    relationText = 'Tương Khắc Cần Tiết Chế';
    tips.push('Các sắc độ có xung đột năng lượng quang học cao, dễ gây cảm giác nặng nề hoặc lóa mắt.');
    tips.push('Thử chuyển màu quần hoặc phụ kiện sang sắc trung tính để cân bằng thị giác.');
  } else {
    relationText = 'Đồng Hành Nhất Quán (Đơn Sắc)';
    tips.push('Phong cách phối đồ đơn sắc (Ton-sur-ton) mang lại chiều sâu thanh lịch và hơi thở tối giản high-end.');
    tips.push('Tận dụng sự khác biệt về chất liệu (lụa bóng kết hợp vải thô mờ) để outfit không bị phẳng.');
  }

  const feedback = baseScore >= 88
    ? `Bảng phối đạt độ hài hòa xuất sắc ${baseScore}/100 với hành ${dominantElement} làm chủ đạo. Khí chất vừa giữ được nét trầm mặc phương Đông vừa thời thượng.`
    : `Bảng phối đạt ${baseScore}/100. Đang có sự cạnh tranh ánh nhìn giữa các lớp màu. Bạn có thể thêm phụ kiện trung hòa.`;

  // Detailed Criteria Breakdown (Bảng Tiêu Chí Đánh Giá Chi Tiết)
  let scoreNguHanh = 24;
  let commentNguHanh = 'Ngũ Hành tương phối đạt mức cân bằng.';
  let statusNguHanh: 'excellent' | 'good' | 'average' | 'improve' = 'good';

  if (sinhCount > 0 && khacCount === 0) {
    scoreNguHanh = 29;
    commentNguHanh = 'Tuyệt vời: Các hành tương sinh tuần hoàn thuận khí tự nhiên.';
    statusNguHanh = 'excellent';
  } else if (uniqueElements.length === 1) {
    scoreNguHanh = 27;
    commentNguHanh = 'Đơn sắc thuần khiết, đồng hành nhất quán thanh tao.';
    statusNguHanh = 'excellent';
  } else if (khacCount > 0 && sinhCount === 0) {
    scoreNguHanh = 18;
    commentNguHanh = 'Xuất hiện tương khắc quang học, nên gia giảm sắc độ.';
    statusNguHanh = 'improve';
  } else {
    scoreNguHanh = 23;
    commentNguHanh = 'Đan xen tương sinh và tương phản tạo điểm nhấn thị giác.';
    statusNguHanh = 'good';
  }

  // Criterion 2: Tỷ Lệ & Tương Phản Thị Giác (Max 25)
  const isOuterContrastBottom = outfit.outerId && outfit.bottomId && outfit.colors.outer.toUpperCase() !== outfit.colors.bottom.toUpperCase();
  const scoreContrast = isOuterContrastBottom ? 24 : 21;
  const commentContrast = isOuterContrastBottom 
    ? 'Tỷ lệ mảng màu chính - phụ phân bổ rõ ràng, tôn dáng phục trang.'
    : 'Bảng màu an toàn, có thể tăng thêm tương phản nhẹ ở lớp lót hoặc khăn.';
  const statusContrast = isOuterContrastBottom ? 'excellent' : 'good';

  // Criterion 3: Bản Sắc Di Sản Cổ Truyền (Max 25)
  const traditionalColorCount = [outfit.colors.outer, outfit.colors.inner, outfit.colors.bottom, outfit.colors.headwear]
    .filter(c => TRADITIONAL_COLORS.some(tc => tc.hex.toUpperCase() === c.toUpperCase())).length;
  const scoreHeritage = traditionalColorCount >= 3 ? 24 : 22;
  const commentHeritage = traditionalColorCount >= 3
    ? 'Ứng dụng thuần thục các sắc độ sơn mài, chàm, ngọc bích chuẩn nếp xưa.'
    : 'Màu sắc hiện đại kết hợp hài hòa với phom dáng truyền thống.';
  const statusHeritage = 'excellent';

  // Criterion 4: Hòa Hợp & Cảm Quan Gen Z (Max 20)
  const scoreModern = Math.round(Math.max(14, Math.min(20, baseScore - (scoreNguHanh + scoreContrast + scoreHeritage) + 18)));
  const commentModern = scoreModern >= 18
    ? 'Bản phối cực kỳ thời thượng, đậm tinh thần Gen Z Remix tự tin tỏa sáng.'
    : 'Tổng thể ưa nhìn, thích hợp diện trong các dịp chụp ảnh kỷ niệm.';
  const statusModern = scoreModern >= 18 ? 'excellent' : 'good';

  // Recalculate baseScore from sum of criteria
  baseScore = scoreNguHanh + scoreContrast + scoreHeritage + scoreModern;
  baseScore = Math.max(50, Math.min(99, baseScore));

  if (baseScore >= 92) grade = 'Tuyệt mỹ';
  else if (baseScore >= 82) grade = 'Hài hòa';
  else if (baseScore >= 70) grade = 'Khá';
  else if (baseScore >= 60) grade = 'Xung đột nhẹ';
  else grade = 'Cần điều chỉnh';

  return {
    score: baseScore,
    grade,
    dominantElement,
    supportingElement: uniqueElements.find(e => e !== dominantElement),
    elementRelation: relationText,
    feedback,
    tips,
    criteria: [
      {
        id: 'ngu_hanh',
        name: 'Quy Luật Ngũ Hành',
        score: scoreNguHanh,
        maxScore: 30,
        weight: '30%',
        status: statusNguHanh,
        comment: commentNguHanh
      },
      {
        id: 'contrast_ratio',
        name: 'Tương Phản & Tỷ Lệ Màu',
        score: scoreContrast,
        maxScore: 25,
        weight: '25%',
        status: statusContrast,
        comment: commentContrast
      },
      {
        id: 'heritage_authenticity',
        name: 'Bản Sắc Di Sản Cổ Truyền',
        score: scoreHeritage,
        maxScore: 25,
        weight: '25%',
        status: statusHeritage,
        comment: commentHeritage
      },
      {
        id: 'modern_aesthetic',
        name: 'Hòa Hợp & Cảm Quan Gen Z',
        score: scoreModern,
        maxScore: 20,
        weight: '20%',
        status: statusModern,
        comment: commentModern
      }
    ]
  };
}

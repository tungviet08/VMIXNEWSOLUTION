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
      tips: ['Hãy chọn ít nhất áo và quần để khởi động phân tích ngũ hành.']
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

  return {
    score: baseScore,
    grade,
    dominantElement,
    supportingElement: uniqueElements.find(e => e !== dominantElement),
    elementRelation: relationText,
    feedback,
    tips
  };
}

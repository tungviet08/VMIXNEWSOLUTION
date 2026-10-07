import { OutfitState, EventModel, ClothingItem, ChatMessage, CulturalWarning, ColorHarmonyResult } from '../types';

interface AiContext {
  outfit: OutfitState;
  currentEvent: EventModel;
  itemsMap: Record<string, ClothingItem>;
  warnings: CulturalWarning[];
  harmony: ColorHarmonyResult;
}

export function generateStylistResponse(userPrompt: string, context: AiContext): { text: string; suggestedActions?: ChatMessage['suggestedActions'] } {
  const query = userPrompt.toLowerCase().trim();
  const { outfit, currentEvent, itemsMap, warnings, harmony } = context;

  const currentOuter = outfit.outerId ? itemsMap[outfit.outerId]?.name : 'Chưa chọn áo ngoài';
  const currentBottom = outfit.bottomId ? itemsMap[outfit.bottomId]?.name : 'Chưa chọn quần/váy';
  const currentHead = outfit.headwearId ? itemsMap[outfit.headwearId]?.name : 'Không đội khăn/nón';

  // 1. If there's an active cultural warning and user asks about taboos or advice
  if (warnings.length > 0 && (query.includes('cảnh báo') || query.includes('kiêng') || query.includes('lỗi') || query.includes('sao lại') || query.includes('warning'))) {
    const topWarn = warnings[0];
    return {
      text: `⚠️ **Lưu ý văn hóa quan trọng**: ${topWarn.title}.\n\n${topWarn.explanation}\n\n💡 **Gợi ý của Stylist**: ${topWarn.recommendation}`,
      suggestedActions: topWarn.fixAction ? [{
        label: topWarn.fixAction.label,
        actionType: 'fixWarning'
      }] : undefined
    };
  }

  // 2. Questions about Áo Tấc / Áo Ngũ Thân
  if (query.includes('áo tấc') || query.includes('tay thụng')) {
    return {
      text: `👘 **Về Áo Tấc (Ngũ Thân Tay Thụng)**:\nÁo Tấc là Đại lễ phục tôn nghiêm triều Nguyễn với tay thụng buông rủ 1 thước. Khi chắp tay trước ngực hành lễ tạo thành thế "bái tấc" cực kỳ trang trọng.\n\n✨ **Gen Z Remix Tips**: Để outfit trẻ trung mà không mất chất trang nghiêm, bạn có thể kết hợp áo tấc tơ tằm với giày Chelsea Boots da đen hoặc Chunky Loafer, đeo kiềng bạc chạm khắc tối giản.`,
      suggestedActions: [
        { label: 'Thử mặc Áo Tấc ngay', actionType: 'applyOutfit', payload: { outerId: 'ao-tac-ngu-than-tay-thung', headwearId: 'head-khan-dong-den', bottomId: 'bottom-quan-lua-trang' } }
      ]
    };
  }

  if (query.includes('áo ngũ thân') || query.includes('ngũ thân') || query.includes('cúc') || query.includes('vạt')) {
    return {
      text: `🏛️ **Quy tắc vàng của Áo Ngũ Thân**:\n1. **Cấu trúc**: 5 thân tượng trưng cho "Tứ thân phụ mẫu" và chính mình (thân thứ 5 bên trong).\n2. **5 Cúc áo**: Tượng trưng cho Ngũ Thường (Nhân - Lễ - Nghĩa - Trí - Tín).\n3. **Cài vạt**: Luôn cài vạt hữu (vạt sang phải). Cài vạt tả (sang trái) là kiêng kỵ chỉ dùng cho người đã khuất.\n\n🔥 **Remix Hack**: Mở 1 cúc cổ, lót áo thun cổ lọ mỏng bên trong và phối quần raw denim ống đứng suông!`,
      suggestedActions: [
        { label: 'Thử set Neo-Scholar (Ngũ Thân + Denim)', actionType: 'applyOutfit', payload: { outerId: 'ao-ngu-than-tay-chen', bottomId: 'bottom-raw-denim-wide', footwearId: 'foot-chunky-loafer' } }
      ]
    };
  }

  // 3. Questions about weather / event outfit suggestion
  if (query.includes('thời tiết') || query.includes('trời') || query.includes('mặc gì') || query.includes('gợi ý') || query.includes('sự kiện') || query.includes('event')) {
    return {
      text: `🌤️ Cho sự kiện **"${currentEvent.name}"** (${currentEvent.weather.label}):\n\n📌 **Phong cách khuyên dùng**: ${currentEvent.vibe}.\n\n🎨 **Bảng màu đề xuất**: Đỏ son may mắn, Xanh chàm điềm đạm, hoặc Trắng ngà thanh lịch. Hiện outfit của bạn đang có độ hài hòa đạt **${harmony.score}/100 (${harmony.grade})**.\n\nBạn có muốn mình tự động hoàn thiện một set đồ chuẩn bài cho sự kiện này không?`,
      suggestedActions: [
        { label: `Áp dụng outfit chuẩn "${currentEvent.name}"`, actionType: 'applyOutfit', payload: { applyEventPresets: true } }
      ]
    };
  }

  // 4. Questions about color / Ngũ Hành
  if (query.includes('màu') || query.includes('ngũ hành') || query.includes('phối màu') || query.includes('hợp mệnh') || query.includes('color')) {
    return {
      text: `🔮 **Đánh giá Hòa sắc Ngũ Hành**:\n- Điểm hòa sắc hiện tại: **${harmony.score}/100** (${harmony.grade}).\n- Hành chủ đạo: **${harmony.dominantElement}**.\n- Quan hệ màu: ${harmony.elementRelation}.\n\n✨ **Lời khuyên**: ${harmony.tips[0] || 'Phối hợp các màu tương sinh giúp thị giác dễ chịu và thu hút năng lượng tích cực.'}`,
      suggestedActions: [
        { label: 'Xem chi tiết hòa sắc', actionType: 'showTab', payload: 'harmony' }
      ]
    };
  }

  // 5. Questions about Nón Quai Thao / Áo Tứ Thân
  if (query.includes('nón quai thao') || query.includes('áo tứ thân') || query.includes('tứ thân') || query.includes('yếm')) {
    return {
      text: `🌸 **Nét duyên Bắc Bộ - Áo Tứ Thân & Nón Quai Thao**:\nÁo Tứ thân không cài cúc mà buông hai vạt mềm mại hoặc thắt vạt trước bụng, để lộ dải yếm đào hàm tiếu e ấp. Nón quai thao (nón ba tầm) tròn vằng vặc với quai tơ tằm buông rủ.\n\n✨ **Gen Z Twist**: Phối áo tứ thân khoác ngoài bralette hoặc áo yếm hiện đại, đi cùng chân váy xếp ly maxi hoặc quần suông linen!`,
      suggestedActions: [
        { label: 'Thử set Tứ Thân Kinh Bắc Modern', actionType: 'applyOutfit', payload: { outerId: 'ao-tu-than', innerId: 'inner-yem-dao-lua', headwearId: 'head-non-quai-thao', bottomId: 'bottom-vay-dup-xep-ly' } }
      ]
    };
  }

  // 6. Questions about modern remix tips / streetwear
  if (query.includes('remix') || query.includes('streetwear') || query.includes('hiện đại') || query.includes('blazer') || query.includes('sneaker') || query.includes('boot')) {
    return {
      text: `⚡ **Công thức Remix Việt Phục chuẩn Gen Z 2026**:\n1. **Quy tắc 70/30**: 70% trang phục giữ đúng tinh thần & cấu trúc truyền thống (cổ áo, vạt áo, chất liệu lụa); 30% phá cách bằng phụ kiện hiện đại (giày da chunky, kính râm góc cạnh, túi bao tử).\n2. **Tương phản chất liệu**: Lụa tơ tằm mềm rủ đối thoại cùng denim thô ráp hoặc da thuộc đứng dáng.\n3. **Giữ sự tôn trọng**: Không cắt xén vạt áo lễ phục cúng tế hoặc biến tướng phản cảm.`,
      suggestedActions: [
        { label: 'Thử set Cyber-Cổ Phục Unisex', actionType: 'applyOutfit', payload: { outerId: 'ao-giao-linh', bottomId: 'bottom-raw-denim-wide', accessoryId: 'acc-kinh-ram-cyber', footwearId: 'foot-chunky-loafer' } }
      ]
    };
  }

  // Default thoughtful contextual answer
  return {
    text: `Chào bạn! Mình là **An - AI Cố Vấn Việt Phục Remix**. ✨\n\nHiện tại outfit của bạn đang kết hợp:\n- Áo ngoài: **${currentOuter}**\n- Quần/Váy: **${currentBottom}**\n- Phụ kiện đầu: **${currentHead}**\n\nĐiểm hòa sắc Ngũ Hành đang là **${harmony.score}/100** (${harmony.grade}). Bạn có thể hỏi mình về: lịch sử từng món trang phục, cách phối đồ đi tiệc/lễ Tết, cách tránh các lỗi kiêng kỵ cổ phong, hoặc phối streetwear hiện đại nhé!`,
    suggestedActions: [
      { label: 'Gợi ý set Tết Nguyên Đán', actionType: 'applyOutfit', payload: { outerId: 'ao-tac-ngu-than-tay-thung', headwearId: 'head-khan-dong-den', bottomId: 'bottom-quan-lua-trang' } },
      { label: 'Kiểm tra hòa sắc trang phục', actionType: 'showTab', payload: 'harmony' }
    ]
  };
}

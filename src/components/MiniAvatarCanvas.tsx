import React from 'react';
import { OutfitState, ClothingItem } from '../types';

interface MiniAvatarCanvasProps {
  outfit: OutfitState;
  avatarType: 'female' | 'male' | 'unisex' | 'cyber';
  itemsMap: Record<string, ClothingItem>;
  className?: string;
}

export const MiniAvatarCanvas: React.FC<MiniAvatarCanvasProps> = ({
  outfit,
  avatarType,
  itemsMap,
  className = 'w-full h-full'
}) => {
  const outerItem = outfit.outerId ? itemsMap[outfit.outerId] : null;
  const innerItem = outfit.innerId ? itemsMap[outfit.innerId] : null;
  const bottomItem = outfit.bottomId ? itemsMap[outfit.bottomId] : null;
  const headwearItem = outfit.headwearId ? itemsMap[outfit.headwearId] : null;
  const footwearItem = outfit.footwearId ? itemsMap[outfit.footwearId] : null;
  const accessoryItem = outfit.accessoryId ? itemsMap[outfit.accessoryId] : null;

  const outerColor = outfit.colors.outer || '#DDA032';
  const innerColor = outfit.colors.inner || '#F4EFE6';
  const bottomColor = outfit.colors.bottom || '#F4EFE6';
  const headwearColor = outfit.colors.headwear || '#1A1A1E';
  const footwearColor = outfit.colors.footwear || '#754B2D';
  const accessoryColor = outfit.colors.accessory || '#DDA032';

  // Skin tone
  let skinColor = '#F6DBC6';
  if (avatarType === 'male') skinColor = '#E8C5A8';
  if (avatarType === 'cyber') skinColor = '#D8D4DB';

  return (
    <svg
      viewBox="0 0 380 560"
      className={`${className} drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] select-none`}
    >
      <defs>
        {/* Silk texture */}
        <pattern id={`mini-silk-${avatarType}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 0 10 L 10 0 L 20 10 L 10 20 Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
        </pattern>
        {/* Brocade cloud */}
        <pattern id={`mini-brocade-${avatarType}`} width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
          <path d="M 5 15 Q 15 5 25 15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />
        </pattern>
      </defs>

      {/* --- 0. LONG FLOWING HAIR BACK LAYER (NỮ CỔ PHONG - SAU LƯNG) --- */}
      {avatarType === 'female' && (
        <g id="mini-female-hair-back">
          <path
            d="M 154 85 C 130 130 118 220 120 355 C 130 375 160 375 170 330 C 174 260 176 160 178 120 Z"
            fill="#141316"
          />
          <path
            d="M 226 85 C 250 130 262 220 260 355 C 250 375 220 375 210 330 C 206 260 204 160 202 120 Z"
            fill="#141316"
          />
          <path
            d="M 156 82 C 138 130 128 220 130 365 C 148 385 232 385 250 365 C 252 220 242 130 224 82 Z"
            fill="#1a181c"
          />
          <path d="M 136 150 C 130 240 134 320 140 350" stroke="rgba(255,255,255,0.12)" strokeWidth="1.8" fill="none" />
          <path d="M 244 150 C 250 240 246 320 240 350" stroke="rgba(255,255,255,0.12)" strokeWidth="1.8" fill="none" />
        </g>
      )}

      {/* --- 1. BASE MANNEQUIN BODY --- */}
      <g id="mini-body">
        {/* Legs */}
        <path d="M 162 340 L 158 485 L 174 485 L 178 340 Z" fill={skinColor} />
        <path d="M 202 340 L 206 485 L 222 485 L 218 340 Z" fill={skinColor} />

        {/* Torso & Neck */}
        <path d="M 154 145 Q 190 152 226 145 L 222 345 L 158 345 Z" fill={skinColor} />
        <path d="M 180 114 L 178 148 L 202 148 L 200 114 Z" fill={skinColor} />

        {/* Arms */}
        <path d="M 152 148 Q 126 215 132 300 L 144 298 Q 138 225 162 165 Z" fill={skinColor} />
        <path d="M 228 148 Q 254 215 248 300 L 236 298 Q 242 225 218 165 Z" fill={skinColor} />
        {/* Hands */}
        <path d="M 128 300 C 126 314 132 322 138 318 C 142 314 144 308 144 300 Z" fill={skinColor} />
        <path d="M 252 300 C 254 314 248 322 242 318 C 238 314 236 308 236 300 Z" fill={skinColor} />

        {/* Head / Face */}
        <g id="mini-head">
          <ellipse cx="190" cy="95" rx="27" ry="35" fill={skinColor} />

          {/* NỮ CỔ PHONG: TÓC DÀI QUÝ PHÁI, KHÔNG CHE MẶT */}
          {avatarType === 'female' && (
            <g id="mini-female-front-hair">
              <ellipse cx="190" cy="62" rx="26" ry="12" fill="#141316" />
              {/* Trâm hoa */}
              <line x1="162" y1="58" x2="182" y2="52" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
              <circle cx="162" cy="58" r="3.2" fill="#c93b2b" />
              <circle cx="164" cy="57" r="1.5" fill="#fef08a" />
              {/* Chân tóc trên trán (không che mặt) */}
              <path
                d="M 163 84 C 164 68 178 71 190 71 C 202 71 216 68 217 84 C 224 74 220 58 190 56 C 160 58 156 74 163 84 Z"
                fill="#141316"
              />
              <path d="M 163 84 C 158 98 160 116 164 126 C 163 112 161 98 166 85 Z" fill="#141316" />
              <path d="M 217 84 C 222 98 220 116 216 126 C 217 112 219 98 214 85 Z" fill="#141316" />
            </g>
          )}

          {avatarType === 'male' && (
            <g id="mini-male-hair">
              <ellipse cx="190" cy="66" rx="26" ry="14" fill="#151417" />
              <path
                d="M 162 88 C 162 66 178 72 190 72 C 202 72 218 66 218 88 C 220 74 216 64 190 62 C 164 64 160 74 162 88 Z"
                fill="#151417"
              />
            </g>
          )}

          {avatarType === 'cyber' && (
            <g id="mini-cyber-hair">
              <path d="M 160 85 C 160 55 220 55 220 85 L 226 102 L 216 92 L 164 92 L 154 102 Z" fill="#2b2d35" />
              <line x1="165" y1="75" x2="215" y2="75" stroke="#00f2fe" strokeWidth="1.5" />
            </g>
          )}

          {/* Delicate Facial Features */}
          <path d="M 173 82 Q 180 79 187 82" stroke="#2c2422" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M 193 82 Q 200 79 207 82" stroke="#2c2422" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M 174 91 Q 180 87 186 91" stroke="#1c1615" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M 194 91 Q 200 87 206 91" stroke="#1c1615" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="180" cy="92" r="1.3" fill="#1c1615" />
          <circle cx="200" cy="92" r="1.3" fill="#1c1615" />
          <path d="M 189 94 L 190 102 Q 192 105 188 106" stroke="#946b5c" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 182 115 Q 190 119 198 115" stroke="#b04245" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M 184 115 Q 190 112 196 115" stroke="#b04245" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle cx="172" cy="102" r="4.5" fill="#fca5a5" opacity="0.4" />
          <circle cx="208" cy="102" r="4.5" fill="#fca5a5" opacity="0.4" />
        </g>
      </g>

      {/* --- 2. BOTTOM LAYER --- */}
      {bottomItem && (
        <g id="mini-bottom">
          {bottomItem.silhouetteSvgType === 'vay_dup' ? (
            <path d="M 152 290 Q 190 300 228 290 L 260 485 Q 190 500 120 485 Z" fill={bottomColor} />
          ) : bottomItem.silhouetteSvgType === 'modern_denim' ? (
            <path d="M 150 280 L 132 485 L 178 485 L 190 335 L 202 485 L 248 485 L 230 280 Z" fill={bottomColor} />
          ) : bottomItem.silhouetteSvgType === 'modern_pleat' ? (
            <path d="M 155 270 Q 190 275 225 270 L 270 495 Q 190 505 110 495 Z" fill={bottomColor} />
          ) : (
            /* Quần lụa mặc định */
            <g>
              <path d="M 150 300 L 125 490 L 175 490 L 190 350 L 205 490 L 255 490 L 230 300 Z" fill={bottomColor} />
              <line x1="190" y1="350" x2="190" y2="480" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
            </g>
          )}
        </g>
      )}

      {/* --- 3. FOOTWEAR LAYER --- */}
      {footwearItem && (
        <g id="mini-footwear">
          {footwearItem.silhouetteSvgType === 'guoc_moc' ? (
            <g>
              <rect x="145" y="490" width="30" height="10" rx="3" fill="#825139" />
              <rect x="205" y="490" width="30" height="10" rx="3" fill="#825139" />
              <path d="M 148 490 Q 160 482 172 490" stroke={footwearColor} strokeWidth="4" fill="none" />
              <path d="M 208 490 Q 220 482 232 490" stroke={footwearColor} strokeWidth="4" fill="none" />
            </g>
          ) : footwearItem.silhouetteSvgType === 'modern_boot' ? (
            <g>
              <path d="M 146 465 L 174 465 L 176 502 L 140 502 Z" fill={footwearColor} />
              <path d="M 206 465 L 234 465 L 240 502 L 204 502 Z" fill={footwearColor} />
            </g>
          ) : (
            /* Giày thêu hoặc sneaker */
            <g>
              <path d="M 148 480 Q 160 472 174 480 L 174 500 L 142 500 Z" fill={footwearColor} />
              <path d="M 206 480 Q 220 472 232 480 L 238 500 L 206 500 Z" fill={footwearColor} />
            </g>
          )}
        </g>
      )}

      {/* --- 4. INNER LAYER --- */}
      {innerItem && (
        <g id="mini-inner">
          {innerItem.silhouetteSvgType === 'yem_dao' ? (
            <g>
              <path d="M 172 135 Q 190 144 208 135 L 226 240 L 154 240 Z" fill={innerColor} />
              <path d="M 172 135 Q 190 144 208 135" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
            </g>
          ) : innerItem.silhouetteSvgType === 'inner_turtleneck' ? (
            <g>
              <path d="M 172 115 L 208 115 L 210 148 L 170 148 Z" fill={innerColor} />
              <path d="M 150 148 L 230 148 L 228 275 L 152 275 Z" fill={innerColor} />
            </g>
          ) : (
            <path d="M 150 145 L 230 145 L 228 275 L 152 275 Z" fill={innerColor} />
          )}
        </g>
      )}

      {/* --- 5. OUTER GARMENT LAYER --- */}
      {outerItem && (
        <g id="mini-outer">
          {/* A. Áo Ngũ Thân Tay Chẽn */}
          {outerItem.silhouetteSvgType === 'ngu_than_chen' && (
            <g>
              <path d="M 148 145 L 110 270 L 132 276 L 158 178 Z" fill={outerColor} />
              <path d="M 232 145 L 270 270 L 248 276 L 222 178 Z" fill={outerColor} />
              <path d="M 166 128 L 214 128 L 234 380 Q 190 390 146 380 Z" fill={outerColor} />
              <path d="M 174 116 L 206 116 L 208 132 L 172 132 Z" fill={outerColor} />
              <path d="M 190 132 Q 206 142 216 160 L 216 280" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" fill="none" />
              <circle cx="190" cy="132" r="3" fill="#cfa244" />
              <circle cx="204" cy="142" r="3" fill="#cfa244" />
              <circle cx="215" cy="160" r="3" fill="#cfa244" />
              <circle cx="216" cy="195" r="3" fill="#cfa244" />
              <circle cx="216" cy="235" r="3" fill="#cfa244" />
            </g>
          )}

          {/* B. Áo Tấc (Ngũ Thân Tay Thụng) */}
          {outerItem.silhouetteSvgType === 'ao_tac' && (
            <g>
              <path d="M 148 145 L 80 250 L 90 375 L 155 350 Z" fill={outerColor} />
              <path d="M 232 145 L 300 250 L 290 375 L 225 350 Z" fill={outerColor} />
              <path d="M 166 126 L 214 126 L 238 395 Q 190 405 142 395 Z" fill={outerColor} />
              <rect x="172" y="114" width="36" height="14" rx="2" fill={outerColor} />
              <circle cx="190" cy="132" r="3.5" fill="#e5c158" />
              <circle cx="204" cy="144" r="3.5" fill="#e5c158" />
              <circle cx="215" cy="164" r="3.5" fill="#e5c158" />
              <circle cx="216" cy="205" r="3.5" fill="#e5c158" />
              <circle cx="216" cy="250" r="3.5" fill="#e5c158" />
            </g>
          )}

          {/* C. Áo Nhật Bình */}
          {outerItem.silhouetteSvgType === 'nhat_binh' && (
            <g>
              <path d="M 146 145 L 95 240 L 105 330 L 155 300 Z" fill={outerColor} />
              <path d="M 234 145 L 285 240 L 275 330 L 225 300 Z" fill={outerColor} />
              {/* Dải ngũ sắc */}
              <rect x="94" y="295" width="16" height="4" fill="#b82626" />
              <rect x="96" y="299" width="16" height="4" fill="#dda032" />
              <rect x="98" y="303" width="16" height="4" fill="#165b58" />
              <rect x="270" y="295" width="16" height="4" fill="#b82626" />
              <rect x="268" y="299" width="16" height="4" fill="#dda032" />
              <rect x="266" y="303" width="16" height="4" fill="#165b58" />
              {/* Thân áo & Cổ chữ nhật */}
              <path d="M 160 138 L 220 138 L 242 410 Q 190 415 138 410 Z" fill={outerColor} />
              <rect x="174" y="130" width="32" height="70" rx="2" fill="none" stroke="#dda032" strokeWidth="6" />
              <rect x="176" y="132" width="28" height="66" rx="1" fill="none" stroke="#b82626" strokeWidth="2" />
              <line x1="190" y1="130" x2="190" y2="410" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
            </g>
          )}

          {/* D. Áo Tứ Thân */}
          {outerItem.silhouetteSvgType === 'tu_than' && (
            <g>
              <path d="M 148 145 L 118 260 L 138 266 L 160 170 Z" fill={outerColor} />
              <path d="M 232 145 L 262 260 L 242 266 L 220 170 Z" fill={outerColor} />
              <path d="M 160 138 L 220 138 L 235 430 L 145 430 Z" fill={outerColor} />
              <path d="M 160 140 L 170 270 L 145 420 L 135 270 Z" fill={outerColor} opacity="0.95" />
              <path d="M 220 140 L 210 270 L 235 420 L 245 270 Z" fill={outerColor} opacity="0.95" />
              <path d="M 164 250 Q 190 262 216 250 L 214 266 Q 190 278 166 266 Z" fill="#d9738a" />
            </g>
          )}

          {/* E. Áo Giao Lĩnh */}
          {outerItem.silhouetteSvgType === 'giao_linh' && (
            <g>
              <path d="M 148 145 L 90 240 L 105 320 L 158 240 Z" fill={outerColor} />
              <path d="M 232 145 L 290 240 L 275 320 L 222 240 Z" fill={outerColor} />
              <path d="M 160 135 L 220 135 L 236 410 Q 190 415 144 410 Z" fill={outerColor} />
              <path d="M 165 135 L 215 235 L 210 320 L 155 320 Z" fill={outerColor} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <rect x="156" y="240" width="68" height="12" fill="#2d221e" rx="1" />
            </g>
          )}

          {/* F. Áo Dài Lemur Retro */}
          {outerItem.silhouetteSvgType === 'ao_dai_lemur' && (
            <g>
              <path d="M 148 145 L 125 285 L 140 288 L 160 180 Z" fill={outerColor} />
              <path d="M 232 145 L 255 285 L 240 288 L 220 180 Z" fill={outerColor} />
              <path d="M 166 128 L 214 128 L 222 240 L 238 450 Q 190 455 142 450 L 158 240 Z" fill={outerColor} />
              <path d="M 178 126 Q 190 138 202 126" stroke="#ffffff" strokeWidth="2" fill="none" />
            </g>
          )}

          {/* G. Modern Blazer / Outer khác */}
          {outerItem.silhouetteSvgType === 'modern_blazer' ? (
            <g>
              <path d="M 132 140 L 248 140 L 240 320 L 140 320 Z" fill={outerColor} />
              <path d="M 152 140 L 175 220 L 155 220 L 138 140 Z" fill="#24242d" />
              <path d="M 228 140 L 205 220 L 225 220 L 242 140 Z" fill="#24242d" />
              <path d="M 132 140 L 105 280 L 130 285 L 146 190 Z" fill={outerColor} />
              <path d="M 248 140 L 275 280 L 250 285 L 234 190 Z" fill={outerColor} />
            </g>
          ) : !['ngu_than_chen', 'ao_tac', 'nhat_binh', 'tu_than', 'giao_linh', 'ao_dai_lemur'].includes(outerItem.silhouetteSvgType) ? (
            /* Fallback Outer Robe */
            <g>
              <path d="M 148 145 L 115 270 L 138 275 L 158 180 Z" fill={outerColor} />
              <path d="M 232 145 L 265 270 L 242 275 L 222 180 Z" fill={outerColor} />
              <path d="M 166 128 L 214 128 L 232 380 Q 190 390 148 380 Z" fill={outerColor} />
            </g>
          ) : null}
        </g>
      )}

      {/* --- 5.5 TÓC DÀI NỮ THƯỚT THA XÕA QUA VAI (TUYỆT ĐỐI KHÔNG CHE MẶT) --- */}
      {avatarType === 'female' && (
        <g id="mini-female-flowing-front-hair" className="pointer-events-none">
          {/* Lọn tóc vai trái */}
          <path
            d="M 162 105 C 150 135 146 175 147 240 C 148 265 155 272 158 260 C 161 240 162 175 165 130 Z"
            fill="#141316"
          />
          <path d="M 152 140 C 150 180 151 225 154 250" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" fill="none" />
          {/* Lọn tóc vai phải */}
          <path
            d="M 218 105 C 230 135 234 175 233 240 C 232 265 225 272 222 260 C 219 240 218 175 215 130 Z"
            fill="#141316"
          />
          <path d="M 228 140 C 230 180 229 225 226 250" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" fill="none" />
        </g>
      )}

      {/* --- 6. ACCESSORY LAYER --- */}
      {accessoryItem && (
        <g id="mini-accessory">
          {accessoryItem.silhouetteSvgType === 'quat_xep' && (
            <g transform="translate(100, 260) rotate(-25)">
              <path d="M 0 0 L -25 -40 A 50 50 0 0 1 25 -40 Z" fill={accessoryColor} stroke="#cfa244" strokeWidth="1.5" />
              <line x1="0" y1="0" x2="-25" y2="-40" stroke="#754b2d" strokeWidth="2" />
              <line x1="0" y1="0" x2="0" y2="-45" stroke="#754b2d" strokeWidth="2" />
              <line x1="0" y1="0" x2="25" y2="-40" stroke="#754b2d" strokeWidth="2" />
            </g>
          )}

          {accessoryItem.silhouetteSvgType === 'ngoc_boi' && (
            <g transform="translate(225, 255)">
              <circle cx="0" cy="0" r="8" fill="#165b58" stroke="#d4af37" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="3" fill="#121216" />
              <path d="M 0 8 L 0 35 M -3 14 L -3 33 M 3 14 L 3 33" stroke="#b82626" strokeWidth="1.5" />
            </g>
          )}
        </g>
      )}

      {/* --- 7. HEADWEAR LAYER --- */}
      {headwearItem && (
        <g id="mini-headwear">
          {headwearItem.silhouetteSvgType === 'khan_dong' && (
            <g>
              <path d="M 158 84 Q 190 70 222 84 L 224 66 Q 190 52 156 66 Z" fill={headwearColor} />
              <path d="M 158 78 Q 190 64 222 78" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />
              <path d="M 157 72 Q 190 58 223 72" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />
              <ellipse cx="190" cy="58" rx="22" ry="8" fill={headwearColor} />
            </g>
          )}

          {headwearItem.silhouetteSvgType === 'non_quai_thao' && (
            <g>
              <ellipse cx="190" cy="62" rx="92" ry="18" fill={headwearColor} stroke="#684a24" strokeWidth="2" />
              <ellipse cx="190" cy="60" rx="42" ry="8" fill="#d99b3b" />
              <path d="M 130 68 Q 134 160 144 260" stroke="#1a1818" strokeWidth="3" fill="none" />
              <path d="M 250 68 Q 246 160 236 260" stroke="#1a1818" strokeWidth="3" fill="none" />
            </g>
          )}

          {headwearItem.silhouetteSvgType === 'non_la' && (
            <g>
              <path d="M 190 28 L 130 76 Q 190 84 250 76 Z" fill={headwearColor} stroke="#cfa244" strokeWidth="1" />
              <path d="M 148 62 Q 190 68 232 62" stroke="rgba(0,0,0,0.12)" strokeWidth="1" fill="none" />
              <path d="M 166 48 Q 190 52 214 48" stroke="rgba(0,0,0,0.12)" strokeWidth="1" fill="none" />
              <path d="M 152 76 Q 190 135 228 76" stroke="#d9738a" strokeWidth="2.5" fill="none" />
            </g>
          )}
        </g>
      )}
    </svg>
  );
};

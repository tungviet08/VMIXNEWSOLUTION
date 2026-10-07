import React, { useRef } from 'react';
import { OutfitState, ClothingItem } from '../types';
import { 
  Upload, 
  RotateCcw, 
  Shuffle, 
  Sparkles, 
  User, 
  Maximize2, 
  Minimize2, 
  X,
  Camera
} from 'lucide-react';

interface AvatarVisualizerProps {
  outfit: OutfitState;
  itemsMap: Record<string, ClothingItem>;
  onUnequip: (category: keyof OutfitState['colors']) => void;
  onRandomize: () => void;
  onReset: () => void;
  avatarType: 'female' | 'male' | 'unisex' | 'cyber';
  setAvatarType: (type: 'female' | 'male' | 'unisex' | 'cyber') => void;
  userPhotoUrl: string | null;
  setUserPhotoUrl: (url: string | null) => void;
}

export const AvatarVisualizer: React.FC<AvatarVisualizerProps> = ({
  outfit,
  itemsMap,
  onUnequip,
  onRandomize,
  onReset,
  avatarType,
  setAvatarType,
  userPhotoUrl,
  setUserPhotoUrl,
}) => {
  const [zoomMode, setZoomMode] = React.useState<'full' | 'close-up'>('full');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const outerItem = outfit.outerId ? itemsMap[outfit.outerId] : null;
  const innerItem = outfit.innerId ? itemsMap[outfit.innerId] : null;
  const bottomItem = outfit.bottomId ? itemsMap[outfit.bottomId] : null;
  const headwearItem = outfit.headwearId ? itemsMap[outfit.headwearId] : null;
  const footwearItem = outfit.footwearId ? itemsMap[outfit.footwearId] : null;
  const accessoryItem = outfit.accessoryId ? itemsMap[outfit.accessoryId] : null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const outerColor = outfit.colors.outer || outerItem?.defaultColor || '#1D3B53';
  const innerColor = outfit.colors.inner || innerItem?.defaultColor || '#F4EFE6';
  const bottomColor = outfit.colors.bottom || bottomItem?.defaultColor || '#F4EFE6';
  const headwearColor = outfit.colors.headwear || headwearItem?.defaultColor || '#1A1A1E';
  const footwearColor = outfit.colors.footwear || footwearItem?.defaultColor || '#1A1A1E';
  const accessoryColor = outfit.colors.accessory || accessoryItem?.defaultColor || '#DDA032';

  // Skin tones based on avatar
  const skinTones = {
    female: '#f7dfce',
    male: '#ecd0ba',
    unisex: '#eed6c4',
    cyber: '#d8c2b4',
  };
  const skinColor = skinTones[avatarType];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-[#18181e] to-[#121216] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Top Stage Controls */}
      <div className="w-full flex items-center justify-between gap-2 z-20">
        {/* Avatar Preset Switcher & Photo Upload */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => {
              setAvatarType('female');
              setUserPhotoUrl(null);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              !userPhotoUrl && avatarType === 'female'
                ? 'bg-[#c93b2b] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Nữ Cổ Phong
          </button>
          <button
            onClick={() => {
              setAvatarType('male');
              setUserPhotoUrl(null);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              !userPhotoUrl && avatarType === 'male'
                ? 'bg-[#c93b2b] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Nam Sĩ Tử
          </button>
          <button
            onClick={() => {
              setAvatarType('cyber');
              setUserPhotoUrl(null);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              !userPhotoUrl && avatarType === 'cyber'
                ? 'bg-[#c93b2b] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Cyber Gen Z
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
              userPhotoUrl
                ? 'bg-[#c93b2b] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Tải ảnh khuôn mặt / chân dung của bạn để thử đồ trực tiếp"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ảnh Của Bạn</span>
          </button>
        </div>

        {/* View mode & canvas tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomMode(zoomMode === 'full' ? 'close-up' : 'full')}
            className="p-2 bg-black/40 hover:bg-black/60 rounded-xl border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title={zoomMode === 'full' ? 'Xem cận cảnh thân trên' : 'Xem toàn thân'}
          >
            {zoomMode === 'full' ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onRandomize}
            className="p-2 bg-black/40 hover:bg-black/60 rounded-xl border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Phối ngẫu nhiên phong cách Gen Z Remix"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={onReset}
            className="p-2 bg-black/40 hover:bg-black/60 rounded-xl border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Làm mới trang phục"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main SVG Fashion Canvas Stage */}
      <div className="relative w-full flex-1 flex items-center justify-center my-2 select-none overflow-hidden">
        {/* Subtle decorative heritage backdrop pattern */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <div className="w-96 h-96 rounded-full border-[12px] border-white/30 flex items-center justify-center">
            <div className="w-72 h-72 rounded-full border-[4px] border-dashed border-white/40" />
          </div>
        </div>

        {/* Stage Pedestal Glow */}
        <div className="absolute bottom-6 w-56 h-12 bg-[#c93b2b]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-4 w-44 h-4 bg-white/5 rounded-full border border-white/10 pointer-events-none" />

        {/* Dynamic SVG Garment & Avatar Layers */}
        <div
          className={`relative transition-all duration-300 ease-out flex items-center justify-center ${
            zoomMode === 'close-up' ? 'scale-135 translate-y-24' : 'scale-100'
          }`}
          style={{ width: '380px', height: '560px' }}
        >
          <svg
            viewBox="0 0 380 560"
            className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
          >
            <defs>
              {/* Patterns for luxury silk texture */}
              <pattern id="silk-texture" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0 10 L 10 0 L 20 10 L 10 20 Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
              </pattern>
              {/* Pattern for gấm brocade */}
              <pattern id="brocade-cloud" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="15" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
                <path d="M 5 15 Q 15 5 25 15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />
              </pattern>
              {/* Shading gradients */}
              <linearGradient id="body-shade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
              </linearGradient>
            </defs>

            {/* --- 1. BASE MANNEQUIN BODY --- */}
            <g id="mannequin-body">
              {/* Legs */}
              <path d="M 160 340 L 155 490 L 172 490 L 180 340 Z" fill={skinColor} />
              <path d="M 200 340 L 208 490 L 225 490 L 220 340 Z" fill={skinColor} />

              {/* Torso & Neck */}
              <path d="M 150 145 Q 190 155 230 145 L 225 350 L 155 350 Z" fill={skinColor} />
              <path d="M 175 110 L 175 148 L 205 148 L 205 110 Z" fill={skinColor} />

              {/* Arms */}
              <path d="M 148 150 Q 120 220 128 310 L 142 310 Q 138 230 162 165 Z" fill={skinColor} />
              <path d="M 232 150 Q 260 220 252 310 L 238 310 Q 242 230 218 165 Z" fill={skinColor} />

              {/* Head / Face */}
              {!userPhotoUrl ? (
                <g id="mannequin-head">
                  <ellipse cx="190" cy="95" rx="30" ry="38" fill={skinColor} />
                  {/* Hair Style */}
                  {avatarType === 'female' && (
                    <path
                      d="M 158 95 C 158 55 222 55 222 95 C 225 130 210 145 210 145 C 210 145 205 110 190 110 C 175 110 170 145 170 145 C 170 145 158 130 158 95 Z"
                      fill="#1a1818"
                    />
                  )}
                  {avatarType === 'male' && (
                    <path
                      d="M 158 90 C 158 60 222 60 222 90 C 220 80 200 70 190 70 C 180 70 160 80 158 90 Z"
                      fill="#1a1818"
                    />
                  )}
                  {avatarType === 'cyber' && (
                    <path
                      d="M 155 85 C 155 50 225 50 225 85 L 230 110 L 220 100 L 160 100 L 150 110 Z"
                      fill="#2b2d35"
                    />
                  )}
                  {/* Subtle facial contours */}
                  <path d="M 188 92 L 192 98 L 187 101" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" fill="none" />
                  <ellipse cx="180" cy="88" rx="2" ry="1.5" fill="rgba(0,0,0,0.4)" />
                  <ellipse cx="200" cy="88" rx="2" ry="1.5" fill="rgba(0,0,0,0.4)" />
                  <path d="M 183 112 Q 190 116 197 112" stroke="#b04343" strokeWidth="2" fill="none" strokeLinecap="round" />
                </g>
              ) : null}
            </g>

            {/* --- 2. USER UPLOADED PHOTO AS HEAD/PORTRAIT --- */}
            {userPhotoUrl && (
              <g id="user-portrait-overlay">
                <clipPath id="avatar-clip">
                  <ellipse cx="190" cy="95" rx="36" ry="44" />
                </clipPath>
                <image
                  href={userPhotoUrl}
                  x="150"
                  y="48"
                  width="80"
                  height="94"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#avatar-clip)"
                />
                <ellipse cx="190" cy="95" rx="36" ry="44" fill="none" stroke="#c93b2b" strokeWidth="1.5" />
              </g>
            )}

            {/* --- 3. BOTTOM GARMENT LAYER --- */}
            {bottomItem && (
              <g id="layer-bottom" className="transition-all duration-300">
                {bottomItem.silhouetteSvgType === 'quan_lua' && (
                  /* Quần lụa trắng ống rộng */
                  <g>
                    <path
                      d="M 150 300 L 125 490 L 175 490 L 190 350 L 205 490 L 255 490 L 230 300 Z"
                      fill={bottomColor}
                    />
                    <path
                      d="M 150 300 L 125 490 L 175 490 L 190 350 L 205 490 L 255 490 L 230 300 Z"
                      fill="url(#silk-texture)"
                    />
                    <line x1="190" y1="350" x2="190" y2="480" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
                  </g>
                )}

                {bottomItem.silhouetteSvgType === 'vay_dup' && (
                  /* Váy đụp xếp ly */
                  <g>
                    <path
                      d="M 152 290 Q 190 300 228 290 L 260 485 Q 190 500 120 485 Z"
                      fill={bottomColor}
                    />
                    {/* Pleat creases */}
                    <path d="M 155 295 L 140 487 M 172 298 L 165 490 M 190 300 L 190 492 M 208 298 L 215 490 M 225 295 L 240 487" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  </g>
                )}

                {bottomItem.silhouetteSvgType === 'modern_denim' && (
                  /* Raw Denim ống rộng */
                  <g>
                    <path
                      d="M 150 280 L 132 485 L 178 485 L 190 335 L 202 485 L 248 485 L 230 280 Z"
                      fill={bottomColor}
                    />
                    {/* Contrast denim stitching */}
                    <line x1="190" y1="335" x2="190" y2="485" stroke="#cfa244" strokeWidth="1" strokeDasharray="3,2" />
                    <line x1="135" y1="475" x2="175" y2="475" stroke="#cfa244" strokeWidth="1.5" />
                    <line x1="205" y1="475" x2="245" y2="475" stroke="#cfa244" strokeWidth="1.5" />
                  </g>
                )}

                {bottomItem.silhouetteSvgType === 'modern_pleat' && (
                  /* Chân váy xếp ly Maxi */
                  <g>
                    <path
                      d="M 155 270 Q 190 275 225 270 L 270 495 Q 190 505 110 495 Z"
                      fill={bottomColor}
                    />
                    <path
                      d="M 155 270 Q 190 275 225 270 L 270 495 Q 190 505 110 495 Z"
                      fill="url(#silk-texture)"
                    />
                  </g>
                )}
              </g>
            )}

            {/* --- 4. FOOTWEAR LAYER --- */}
            {footwearItem && (
              <g id="layer-footwear">
                {footwearItem.silhouetteSvgType === 'guoc_moc' && (
                  <g>
                    {/* Wooden clogs with velvet straps */}
                    <rect x="145" y="490" width="30" height="10" rx="3" fill="#825139" />
                    <rect x="205" y="490" width="30" height="10" rx="3" fill="#825139" />
                    <path d="M 148 490 Q 160 482 172 490" stroke={footwearColor} strokeWidth="4" fill="none" />
                    <path d="M 208 490 Q 220 482 232 490" stroke={footwearColor} strokeWidth="4" fill="none" />
                  </g>
                )}

                {footwearItem.silhouetteSvgType === 'modern_loafer' && (
                  <g>
                    {/* Chunky loafers */}
                    <path d="M 142 485 L 176 485 L 176 502 L 138 502 Z" fill={footwearColor} />
                    <path d="M 204 485 L 238 485 L 242 502 L 204 502 Z" fill={footwearColor} />
                    <rect x="136" y="498" width="42" height="6" fill="#0c0c0e" rx="1" />
                    <rect x="202" y="498" width="42" height="6" fill="#0c0c0e" rx="1" />
                    {/* Metal bit */}
                    <line x1="150" y1="488" x2="168" y2="488" stroke="#d4af37" strokeWidth="2" />
                    <line x1="212" y1="488" x2="230" y2="488" stroke="#d4af37" strokeWidth="2" />
                  </g>
                )}

                {footwearItem.silhouetteSvgType === 'modern_boot' && (
                  <g>
                    {/* Chelsea boots */}
                    <path d="M 146 465 L 174 465 L 176 502 L 140 502 Z" fill={footwearColor} />
                    <path d="M 206 465 L 234 465 L 240 502 L 204 502 Z" fill={footwearColor} />
                    <path d="M 158 470 L 164 470 L 166 492 L 156 492 Z" fill="#2d2d35" />
                    <path d="M 218 470 L 224 470 L 226 492 L 216 492 Z" fill="#2d2d35" />
                  </g>
                )}
              </g>
            )}

            {/* --- 5. INNER WEAR LAYER --- */}
            {innerItem && (
              <g id="layer-inner">
                {innerItem.silhouetteSvgType === 'yem_dao' && (
                  /* Yếm đào cổ truyền */
                  <g>
                    <path
                      d="M 172 135 Q 190 144 208 135 L 226 240 L 154 240 Z"
                      fill={innerColor}
                    />
                    {/* Yếm neck collar & tie cord */}
                    <path d="M 172 135 Q 190 144 208 135" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
                    {/* Embroidered lotus center */}
                    <ellipse cx="190" cy="180" rx="6" ry="8" fill="rgba(255,255,255,0.25)" />
                  </g>
                )}

                {innerItem.silhouetteSvgType === 'ao_canh' && (
                  /* Áo cánh lụa trắng */
                  <g>
                    <path
                      d="M 150 145 L 230 145 L 228 275 L 152 275 Z"
                      fill={innerColor}
                    />
                    <path d="M 175 142 L 190 152 L 205 142" stroke="rgba(0,0,0,0.1)" strokeWidth="2" fill="none" />
                  </g>
                )}

                {innerItem.silhouetteSvgType === 'inner_turtleneck' && (
                  /* Áo cổ lọ mỏng */
                  <g>
                    <path
                      d="M 172 115 L 208 115 L 210 148 L 170 148 Z"
                      fill={innerColor}
                    />
                    <path d="M 150 148 L 230 148 L 228 275 L 152 275 Z" fill={innerColor} />
                  </g>
                )}
              </g>
            )}

            {/* --- 6. OUTER GARMENT LAYER (HEART OF VIỆT PHỤC) --- */}
            {outerItem && (
              <g id="layer-outer" className="transition-all duration-300">
                {/* A. Áo Ngũ Thân Tay Chẽn (Vạt Hữu, 5 Cúc, Ống Tay Ôm) */}
                {outerItem.silhouetteSvgType === 'ngu_than_chen' && (
                  <g>
                    {/* Sleeves */}
                    <path d="M 148 145 L 110 270 L 132 276 L 158 178 Z" fill={outerColor} />
                    <path d="M 232 145 L 270 270 L 248 276 L 222 178 Z" fill={outerColor} />
                    {/* Main Tunic Body (Right overlap vạt hữu) */}
                    <path
                      d="M 166 128 L 214 128 L 234 380 Q 190 390 146 380 Z"
                      fill={outerColor}
                    />
                    <path
                      d="M 166 128 L 214 128 L 234 380 Q 190 390 146 380 Z"
                      fill="url(#silk-texture)"
                    />
                    {/* Cổ Đứng Lập Lĩnh (Standing Mandarin Collar) */}
                    <path d="M 174 116 L 206 116 L 208 132 L 172 132 Z" fill={outerColor} />
                    <path d="M 174 116 L 206 116" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    {/* Vạt Hữu Seam curving to right armpit & 5 buttons */}
                    <path d="M 190 132 Q 206 142 216 160 L 216 280" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" fill="none" />
                    {/* 5 Cúc Áo (Ngũ Thường: Nhân, Lễ, Nghĩa, Trí, Tín) */}
                    <circle cx="190" cy="132" r="3" fill="#cfa244" />
                    <circle cx="204" cy="142" r="3" fill="#cfa244" />
                    <circle cx="215" cy="160" r="3" fill="#cfa244" />
                    <circle cx="216" cy="195" r="3" fill="#cfa244" />
                    <circle cx="216" cy="235" r="3" fill="#cfa244" />
                  </g>
                )}

                {/* B. Áo Tấc (Ngũ Thân Tay Thụng - Rộng 1 thước buông rủ dài) */}
                {outerItem.silhouetteSvgType === 'ao_tac' && (
                  <g>
                    {/* Immense Wide Flowing Sleeves (Tay thụng) */}
                    <path
                      d="M 148 145 L 80 250 L 90 375 L 155 350 Z"
                      fill={outerColor}
                    />
                    <path
                      d="M 232 145 L 300 250 L 290 375 L 225 350 Z"
                      fill={outerColor}
                    />
                    <path d="M 80 250 L 90 375 L 155 350 Z" fill="url(#brocade-cloud)" />
                    <path d="M 300 250 L 290 375 L 225 350 Z" fill="url(#brocade-cloud)" />
                    {/* Tunic Body */}
                    <path
                      d="M 166 126 L 214 126 L 238 395 Q 190 405 142 395 Z"
                      fill={outerColor}
                    />
                    <path
                      d="M 166 126 L 214 126 L 238 395 Q 190 405 142 395 Z"
                      fill="url(#silk-texture)"
                    />
                    {/* High Stand Collar */}
                    <rect x="172" y="114" width="36" height="14" rx="2" fill={outerColor} />
                    {/* Center buttons */}
                    <circle cx="190" cy="132" r="3.5" fill="#e5c158" />
                    <circle cx="204" cy="144" r="3.5" fill="#e5c158" />
                    <circle cx="215" cy="164" r="3.5" fill="#e5c158" />
                    <circle cx="216" cy="205" r="3.5" fill="#e5c158" />
                    <circle cx="216" cy="250" r="3.5" fill="#e5c158" />
                  </g>
                )}

                {/* C. Áo Nhật Bình (Cổ Hình Chữ Nhật, Ngũ Hành Viền Sắc) */}
                {outerItem.silhouetteSvgType === 'nhat_binh' && (
                  <g>
                    {/* Sleeves with Ngũ Sắc wrist cuffs (Dải ngũ sắc) */}
                    <path d="M 146 145 L 95 240 L 105 330 L 155 300 Z" fill={outerColor} />
                    <path d="M 234 145 L 285 240 L 275 330 L 225 300 Z" fill={outerColor} />
                    {/* Wrist bands Ngũ Sắc */}
                    <rect x="94" y="295" width="16" height="4" fill="#b82626" />
                    <rect x="96" y="299" width="16" height="4" fill="#dda032" />
                    <rect x="98" y="303" width="16" height="4" fill="#165b58" />
                    <rect x="270" y="295" width="16" height="4" fill="#b82626" />
                    <rect x="268" y="299" width="16" height="4" fill="#dda032" />
                    <rect x="266" y="303" width="16" height="4" fill="#165b58" />

                    {/* Robe body */}
                    <path
                      d="M 160 138 L 220 138 L 242 410 Q 190 415 138 410 Z"
                      fill={outerColor}
                    />
                    <path
                      d="M 160 138 L 220 138 L 242 410 Q 190 415 138 410 Z"
                      fill="url(#silk-texture)"
                    />

                    {/* Iconic Rectangular Collar (Cổ Chữ Nhật Ngũ Hành) */}
                    <rect x="174" y="130" width="32" height="70" rx="2" fill="none" stroke="#dda032" strokeWidth="6" />
                    <rect x="176" y="132" width="28" height="66" rx="1" fill="none" stroke="#b82626" strokeWidth="2" />
                    <line x1="190" y1="130" x2="190" y2="410" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
                    {/* Front chest tie ribbons (Dải kết) */}
                    <path d="M 184 200 L 176 260" stroke="#dda032" strokeWidth="3" />
                    <path d="M 196 200 L 204 260" stroke="#dda032" strokeWidth="3" />
                  </g>
                )}

                {/* D. Áo Tứ Thân (4 Vạt Mở Mềm Mại) */}
                {outerItem.silhouetteSvgType === 'tu_than' && (
                  <g>
                    {/* Sleeves */}
                    <path d="M 148 145 L 118 260 L 138 266 L 160 170 Z" fill={outerColor} />
                    <path d="M 232 145 L 262 260 L 242 266 L 220 170 Z" fill={outerColor} />
                    {/* Back flaps */}
                    <path d="M 160 138 L 220 138 L 235 430 L 145 430 Z" fill={outerColor} />
                    {/* Two front open flaps tied or parted */}
                    <path d="M 160 140 L 170 270 L 145 420 L 135 270 Z" fill={outerColor} opacity="0.95" />
                    <path d="M 220 140 L 210 270 L 235 420 L 245 270 Z" fill={outerColor} opacity="0.95" />
                    {/* Fabric sash tie (Dải lưng đào/xanh) */}
                    <path d="M 164 250 Q 190 262 216 250 L 214 266 Q 190 278 166 266 Z" fill="#d9738a" />
                    <path d="M 186 260 L 180 340 L 192 340 L 194 260 Z" fill="#d9738a" />
                  </g>
                )}

                {/* E. Áo Giao Lĩnh (Cổ Trực Lĩnh Chéo Vạt Hữu) */}
                {outerItem.silhouetteSvgType === 'giao_linh' && (
                  <g>
                    {/* Flowing sleeves */}
                    <path d="M 148 145 L 90 240 L 105 320 L 158 240 Z" fill={outerColor} />
                    <path d="M 232 145 L 290 240 L 275 320 L 222 240 Z" fill={outerColor} />
                    {/* Cross-collar Robe Body */}
                    <path d="M 160 135 L 220 135 L 236 410 Q 190 415 144 410 Z" fill={outerColor} />
                    {/* Vạt Hữu Overlap (Right over left) */}
                    <path d="M 165 135 L 215 235 L 210 320 L 155 320 Z" fill={outerColor} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                    {/* Waist belt sash */}
                    <rect x="156" y="240" width="68" height="12" fill="#2d221e" rx="1" />
                  </g>
                )}

                {/* F. Áo Dài Lemur Retro (Chiết Eo, Tà Rủ) */}
                {outerItem.silhouetteSvgType === 'ao_dai_lemur' && (
                  <g>
                    {/* Fitted sleeves */}
                    <path d="M 148 145 L 125 285 L 140 288 L 160 180 Z" fill={outerColor} />
                    <path d="M 232 145 L 255 285 L 240 288 L 220 180 Z" fill={outerColor} />
                    {/* Fitted bodice & high waist slit */}
                    <path
                      d="M 166 128 L 214 128 L 222 240 L 238 450 Q 190 455 142 450 L 158 240 Z"
                      fill={outerColor}
                    />
                    <path
                      d="M 166 128 L 214 128 L 222 240 L 238 450 Q 190 455 142 450 L 158 240 Z"
                      fill="url(#silk-texture)"
                    />
                    {/* Heart-neck / Lemur collar detail */}
                    <path d="M 178 126 Q 190 138 202 126" stroke="#ffffff" strokeWidth="2" fill="none" />
                  </g>
                )}

                {/* G. Modern Oversized Blazer */}
                {outerItem.silhouetteSvgType === 'modern_blazer' && (
                  <g>
                    {/* Structured boxy shoulders */}
                    <path d="M 132 140 L 248 140 L 240 320 L 140 320 Z" fill={outerColor} />
                    {/* Lapels */}
                    <path d="M 152 140 L 175 220 L 155 220 L 138 140 Z" fill="#24242d" />
                    <path d="M 228 140 L 205 220 L 225 220 L 242 140 Z" fill="#24242d" />
                    {/* Sleeves */}
                    <path d="M 132 140 L 105 280 L 130 285 L 146 190 Z" fill={outerColor} />
                    <path d="M 248 140 L 275 280 L 250 285 L 234 190 Z" fill={outerColor} />
                  </g>
                )}

                {/* H. Modern Cropped Bomber */}
                {outerItem.silhouetteSvgType === 'modern_cropped' && (
                  <g>
                    <path d="M 142 142 L 238 142 L 232 235 L 148 235 Z" fill={outerColor} />
                    {/* Ribbed hem */}
                    <rect x="146" y="235" width="88" height="10" fill="#2a1e17" rx="2" />
                    {/* Sleeves with volume */}
                    <path d="M 142 142 L 112 250 L 135 255 L 155 180 Z" fill={outerColor} />
                    <path d="M 238 142 L 268 250 L 245 255 L 225 180 Z" fill={outerColor} />
                  </g>
                )}
              </g>
            )}

            {/* --- 7. ACCESSORIES (JEWELRY, FANS, JADE) --- */}
            {accessoryItem && (
              <g id="layer-accessories">
                {accessoryItem.silhouetteSvgType === 'kieng_bac' && (
                  /* Kiềng Bạc Chạm Sen */
                  <g>
                    <ellipse cx="190" cy="148" rx="24" ry="16" fill="none" stroke="#e6e8ee" strokeWidth="5" />
                    <circle cx="190" cy="164" r="3.5" fill="#ffffff" />
                  </g>
                )}

                {accessoryItem.silhouetteSvgType === 'quat_xep' && (
                  /* Quạt Xếp Lụa Hà Đông trên tay */
                  <g transform="translate(100, 260) rotate(-25)">
                    <path d="M 0 0 L -25 -40 A 50 50 0 0 1 25 -40 Z" fill={accessoryColor} stroke="#cfa244" strokeWidth="1.5" />
                    <line x1="0" y1="0" x2="-25" y2="-40" stroke="#754b2d" strokeWidth="2" />
                    <line x1="0" y1="0" x2="0" y2="-45" stroke="#754b2d" strokeWidth="2" />
                    <line x1="0" y1="0" x2="25" y2="-40" stroke="#754b2d" strokeWidth="2" />
                  </g>
                )}

                {accessoryItem.silhouetteSvgType === 'ngoc_boi' && (
                  /* Ngọc Bội đeo bên hông */
                  <g transform="translate(225, 255)">
                    <circle cx="0" cy="0" r="8" fill="#165b58" stroke="#d4af37" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="3" fill="#121216" />
                    {/* Silk tassel cord */}
                    <path d="M 0 8 L 0 35 M -3 14 L -3 33 M 3 14 L 3 33" stroke="#b82626" strokeWidth="1.5" />
                  </g>
                )}

                {accessoryItem.silhouetteSvgType === 'kinh_ram' && (
                  /* Kính râm Cyber Retro */
                  <g transform="translate(190, 88)">
                    <rect x="-24" y="-5" width="20" height="9" rx="2" fill="#121214" stroke="#d4af37" strokeWidth="1" />
                    <rect x="4" y="-5" width="20" height="9" rx="2" fill="#121214" stroke="#d4af37" strokeWidth="1" />
                    <line x1="-4" y1="-1" x2="4" y2="-1" stroke="#d4af37" strokeWidth="1.5" />
                  </g>
                )}
              </g>
            )}

            {/* --- 8. HEADWEAR LAYER --- */}
            {headwearItem && (
              <g id="layer-headwear" className="transition-all duration-300">
                {headwearItem.silhouetteSvgType === 'khan_dong' && (
                  /* Khăn Đóng Nếp Chữ Nhất */
                  <g>
                    <path
                      d="M 158 84 Q 190 70 222 84 L 224 66 Q 190 52 156 66 Z"
                      fill={headwearColor}
                    />
                    {/* Folds of the turban (Nếp khăn) */}
                    <path d="M 158 78 Q 190 64 222 78" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />
                    <path d="M 157 72 Q 190 58 223 72" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />
                    {/* Top bun dome */}
                    <ellipse cx="190" cy="58" rx="22" ry="8" fill={headwearColor} />
                  </g>
                )}

                {headwearItem.silhouetteSvgType === 'non_quai_thao' && (
                  /* Nón Quai Thao (Nón Ba Tầm) Tròn Lớn */
                  <g>
                    {/* Wide brim flat hat behind / on head */}
                    <ellipse cx="190" cy="62" rx="92" ry="18" fill={headwearColor} stroke="#684a24" strokeWidth="2" />
                    <ellipse cx="190" cy="60" rx="42" ry="8" fill="#d99b3b" />
                    {/* Quai thao tơ tằm buông rủ 2 bên */}
                    <path d="M 130 68 Q 134 160 144 260" stroke="#1a1818" strokeWidth="3" fill="none" />
                    <path d="M 250 68 Q 246 160 236 260" stroke="#1a1818" strokeWidth="3" fill="none" />
                    {/* Tassel knots */}
                    <circle cx="144" cy="260" r="3" fill="#b82626" />
                    <circle cx="236" cy="260" r="3" fill="#b82626" />
                  </g>
                )}

                {headwearItem.silhouetteSvgType === 'non_la' && (
                  /* Nón Lá Làng Chuông */
                  <g>
                    <path d="M 190 28 L 130 76 Q 190 84 250 76 Z" fill={headwearColor} stroke="#cfa244" strokeWidth="1" />
                    {/* Conical concentric rings */}
                    <path d="M 148 62 Q 190 68 232 62" stroke="rgba(0,0,0,0.12)" strokeWidth="1" fill="none" />
                    <path d="M 166 48 Q 190 52 214 48" stroke="rgba(0,0,0,0.12)" strokeWidth="1" fill="none" />
                    {/* Silk ribbon chin strap */}
                    <path d="M 152 76 Q 190 135 228 76" stroke="#d9738a" strokeWidth="2.5" fill="none" />
                  </g>
                )}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Bottom Equipped Garment Pills & Unequip Actions */}
      <div className="w-full flex items-center justify-center gap-1.5 flex-wrap z-20 pt-2 border-t border-white/5">
        {outerItem && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-zinc-300">
            <span
              className="w-2.5 h-2.5 rounded-full border border-white/20"
              style={{ backgroundColor: outerColor }}
            />
            <span className="font-medium truncate max-w-[110px]">{outerItem.name}</span>
            <button
              onClick={() => onUnequip('outer')}
              className="text-zinc-500 hover:text-white ml-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {innerItem && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-zinc-300">
            <span
              className="w-2.5 h-2.5 rounded-full border border-white/20"
              style={{ backgroundColor: innerColor }}
            />
            <span className="font-medium truncate max-w-[100px]">{innerItem.name}</span>
            <button
              onClick={() => onUnequip('inner')}
              className="text-zinc-500 hover:text-white ml-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {bottomItem && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-zinc-300">
            <span
              className="w-2.5 h-2.5 rounded-full border border-white/20"
              style={{ backgroundColor: bottomColor }}
            />
            <span className="font-medium truncate max-w-[100px]">{bottomItem.name}</span>
            <button
              onClick={() => onUnequip('bottom')}
              className="text-zinc-500 hover:text-white ml-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {headwearItem && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-zinc-300">
            <span
              className="w-2.5 h-2.5 rounded-full border border-white/20"
              style={{ backgroundColor: headwearColor }}
            />
            <span className="font-medium truncate max-w-[100px]">{headwearItem.name}</span>
            <button
              onClick={() => onUnequip('headwear')}
              className="text-zinc-500 hover:text-white ml-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {accessoryItem && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-zinc-300">
            <span
              className="w-2.5 h-2.5 rounded-full border border-white/20"
              style={{ backgroundColor: accessoryColor }}
            />
            <span className="font-medium truncate max-w-[100px]">{accessoryItem.name}</span>
            <button
              onClick={() => onUnequip('accessory')}
              className="text-zinc-500 hover:text-white ml-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {footwearItem && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-zinc-300">
            <span
              className="w-2.5 h-2.5 rounded-full border border-white/20"
              style={{ backgroundColor: footwearColor }}
            />
            <span className="font-medium truncate max-w-[100px]">{footwearItem.name}</span>
            <button
              onClick={() => onUnequip('footwear')}
              className="text-zinc-500 hover:text-white ml-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

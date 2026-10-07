import { TraditionalColor } from '../types';

export const TRADITIONAL_COLORS: TraditionalColor[] = [
  {
    name: 'Đỏ Son (Vermilion)',
    vietnameseName: 'Đỏ Son Sơn Mài',
    hex: '#B82626',
    element: 'Hỏa',
    story: 'Sắc đỏ son từ khoáng vật chu sa, tượng trưng cho hỷ khí, may mắn, sinh khí mùa xuân và lễ nghi hân hoan của người Việt.'
  },
  {
    name: 'Vàng Hoàng Yến (Imperial Ochre)',
    vietnameseName: 'Vàng Hoàng Cúc / Hoàng Yến',
    hex: '#DDA032',
    element: 'Thổ',
    story: 'Màu vàng đất trung tâm, sắc hoa cúc đại đóa, từng là màu tôn quý gắn liền với tầng lớp quyền quý và hoàng gia triều Nguyễn.'
  },
  {
    name: 'Xanh Chàm (Deep Indigo)',
    vietnameseName: 'Xanh Chàm Đồng Bằng',
    hex: '#1D3B53',
    element: 'Thủy',
    story: 'Chiết xuất từ lá chàm tự nhiên, gắn bó từ đời sống làng quê đến quan viên, mang nét điềm đạm, trí tuệ sâu lắng.'
  },
  {
    name: 'Xanh Cổ Vịt (Kingfisher Teal)',
    vietnameseName: 'Xanh Cổ Vịt / Thanh Bích',
    hex: '#165B58',
    element: 'Mộc',
    story: 'Sắc xanh ngọc biếc giao thoa giữa nước và cây cỏ mùa xuân, quý phái thường thấy trên cổ áo Nhật Bình cung đình.'
  },
  {
    name: 'Trắng Ngà (Ivory Silk)',
    vietnameseName: 'Trắng Ngà Tơ Tằm',
    hex: '#F4EFE6',
    element: 'Kim',
    story: 'Sắc trắng tự nhiên của lụa tơ tằm Vạn Phúc chưa qua tẩy hóa chất, thuần khiết, thanh cao và trung tính hoàn hảo.'
  },
  {
    name: 'Hồng Cánh Sen (Lotus Blossom)',
    vietnameseName: 'Hồng Sen Hà Thành',
    hex: '#D9738A',
    element: 'Hỏa',
    story: 'Sắc hồng e ấp của sen Tây Hồ, biểu tượng của sự thanh tao, duyên dáng của phụ nữ Bắc Bộ trên dải yếm đào.'
  },
  {
    name: 'Tím Huế (Hue Royal Violet)',
    vietnameseName: 'Tím Trầm Cố Đô',
    hex: '#5B3758',
    element: 'Thủy',
    story: 'Sắc tím đặc trưng của Cố đô Huế, tạo bởi củ nâu và phẩm chàm, mang vẻ hoài niệm, kín đáo và quý phái.'
  },
  {
    name: 'Đen Mực Tàu (Ink Charcoal)',
    vietnameseName: 'Đen Mực / Mun',
    hex: '#1A1A1E',
    element: 'Thủy',
    story: 'Sắc đen tuyền của vải the, gấm đen, mực nho của các bậc túc nho và quý tộc khi lễ bái.'
  },
  {
    name: 'Nâu Củ Nâu (Earthy Bark Brown)',
    vietnameseName: 'Nâu Sồng Đồng Quê',
    hex: '#6D432F',
    element: 'Thổ',
    story: 'Màu nhuộm từ củ nâu dân dã, biểu trưng cho sự mộc mạc, bền bỉ và gắn bó keo sơn với đất mẹ phù sa.'
  },
  {
    name: 'Xanh Lục Trúc (Bamboo Green)',
    vietnameseName: 'Xanh Lá Tre',
    hex: '#3D6B42',
    element: 'Mộc',
    story: 'Sắc xanh của lũy tre làng, tượng trưng cho sức sống dẻo dai, đức tính kiên định và thanh cao.'
  }
];

export const ELEMENT_RELATIONS = {
  // Sinh: Kim -> Thuy -> Moc -> Hoa -> Tho -> Kim
  tươngSinh: {
    Kim: 'Thủy',
    Thủy: 'Mộc',
    Mộc: 'Hỏa',
    Hỏa: 'Thổ',
    Thổ: 'Kim'
  },
  // Khắc: Kim -> Moc -> Tho -> Thuy -> Hoa -> Kim
  tươngKhắc: {
    Kim: 'Mộc',
    Mộc: 'Thổ',
    Thổ: 'Thủy',
    Thủy: 'Hỏa',
    Hỏa: 'Kim'
  }
};

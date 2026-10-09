import { WeatherCity, LiveWeatherData } from '../types';

export const CULTURAL_CITIES: WeatherCity[] = [
  {
    id: 'hanoi',
    name: 'Hà Nội',
    province: 'Thủ đô ngàn năm',
    latitude: 21.0285,
    longitude: 105.8542,
    culturalNote: 'Cái nôi của Áo Dài tân thời Lemur, Áo Ngũ Thân kinh kỳ và nếp thanh lịch Tràng An.',
  },
  {
    id: 'hue',
    name: 'Huế',
    province: 'Cố đô Triều Nguyễn',
    latitude: 16.4637,
    longitude: 107.5909,
    culturalNote: 'Cội nguồn của Áo Dài, Áo Tấc hoàng gia, Áo Nhật Bình ngũ sắc và nghệ thuật phục sức cung đình.',
  },
  {
    id: 'hochiminh',
    name: 'TP. Hồ Chí Minh',
    province: 'Sài Gòn - Gia Định',
    latitude: 10.8231,
    longitude: 106.6297,
    culturalNote: 'Đô thị thời trang năng động, xuất phát điểm của Áo Dài Raglan thập niên 1960 và trào lưu Remix Streetwear.',
  },
  {
    id: 'hoian',
    name: 'Hội An',
    province: 'Quảng Nam',
    latitude: 15.8801,
    longitude: 108.3380,
    culturalNote: 'Đô thị cổ bên dòng sông Hoài, cái nôi của lụa tơ tằm tơ sống và đèn lồng ngũ sắc.',
  },
  {
    id: 'danang',
    name: 'Đà Nẵng',
    province: 'Miền Trung',
    latitude: 16.0544,
    longitude: 108.2022,
    culturalNote: 'Cửa ngõ di sản miền Trung, phong cách hòa quyện giữa hiện đại phóng khoáng và nét cổ truyền.',
  },
  {
    id: 'dalat',
    name: 'Đà Lạt',
    province: 'Lâm Đồng',
    latitude: 11.9404,
    longitude: 108.4583,
    culturalNote: 'Cao nguyên ngàn hoa sương mù se lạnh, tuyệt tác cho phong cách phối lớp Áo Tấc và Áo Khoác ấm áp.',
  },
  {
    id: 'ninhbinh',
    name: 'Ninh Bình',
    province: 'Cố đô Hoa Lư',
    latitude: 20.2506,
    longitude: 105.9745,
    culturalNote: 'Kinh đô thời Đinh - Tiền Lê, cảnh sắc Tràng An non nước gắn liền với cổ phục Giao Lĩnh và Tứ Thân.',
  },
  {
    id: 'sapa',
    name: 'Sa Pa',
    province: 'Lào Cai',
    latitude: 22.3364,
    longitude: 103.8438,
    culturalNote: 'Xứ sở mù sương Tây Bắc, khí hậu mát lạnh phù hợp diện các bộ Việt phục gấm dầy và khăn đóng sang trọng.',
  },
  {
    id: 'cantho',
    name: 'Cần Thơ',
    province: 'Tây Đô Nam Bộ',
    latitude: 10.0452,
    longitude: 105.7469,
    culturalNote: 'Vùng sông nước trù phú miền Tây, vẻ đẹp thanh tao của Áo Ngũ Thân Nam Bộ và lụa Mỹ Á trứ danh.',
  },
  {
    id: 'haiphong',
    name: 'Hải Phòng',
    province: 'Thành phố hoa phượng đỏ',
    latitude: 20.8449,
    longitude: 106.6881,
    culturalNote: 'Đô thị cảng lâu đời miền Bắc, nơi lưu giữ tinh hoa áo tứ thân và lễ hội truyền thống đồng bằng Bắc Bộ.',
  },
];

// Helper to interpret WMO weather codes into Vietnamese descriptions
function interpretWeatherCode(code: number): {
  description: string;
  condition: 'sunny' | 'cool' | 'chilly' | 'rainy';
} {
  if (code === 0) {
    return { description: 'Trời quang đãng, nắng ấm rực rỡ', condition: 'sunny' };
  } else if (code === 1 || code === 2) {
    return { description: 'Nắng nhẹ xen kẽ mây, thời tiết dễ chịu', condition: 'cool' };
  } else if (code === 3) {
    return { description: 'Trời nhiều mây, râm mát dịu dàng', condition: 'cool' };
  } else if (code === 45 || code === 48) {
    return { description: 'Sương mù bảng lảng se lạnh', condition: 'chilly' };
  } else if (code >= 51 && code <= 57) {
    return { description: 'Mưa phùn lất phất bay', condition: 'rainy' };
  } else if (code >= 61 && code <= 67) {
    return { description: 'Mưa rào rải rác, không khí ẩm mát', condition: 'rainy' };
  } else if (code >= 71 && code <= 77) {
    return { description: 'Rét buốt, sương muối giá lạnh', condition: 'chilly' };
  } else if (code >= 80 && code <= 82) {
    return { description: 'Mưa rào từng đợt', condition: 'rainy' };
  } else if (code >= 95) {
    return { description: 'Trời dông gió, có sấm sét', condition: 'rainy' };
  }
  return { description: 'Thời tiết ôn hòa', condition: 'cool' };
}

// Generate cultural outfit suggestions based on temperature and weather conditions
function generateCulturalOutfitAdvice(
  temp: number,
  condition: 'sunny' | 'cool' | 'chilly' | 'rainy',
  cityName: string
) {
  if (temp >= 28 || condition === 'sunny') {
    return {
      title: `Phong Cách Thanh Lương Nắng Ấm tại ${cityName}`,
      summary: `Nhiệt độ ${Math.round(temp)}°C khá oi ả. Ưu tiên các chất liệu tự nhiên bay bổng, tà áo thoáng mát giúp giải nhiệt và tôn dáng thanh thoát.`,
      fabricAdvice: 'Lụa tơ tằm Vạn Phúc, lụa Hà Đông dệt thoáng, tơ sống hoặc đũi tự nhiên thấm hút mồ hôi tốt.',
      layerAdvice: 'Diện Áo Dài Lemur cách tân hoặc Áo Cánh lụa mỏng + Quần lụa ống rộng. Khi ra ngoài trời nên kết hợp Nón Lá Làng Chuông hoặc Kính râm Cyber Retro để chống nắng thời thượng.',
      suggestedPalettes: ['#F4EFE6', '#165B58', '#1D3B53', '#DDA032'],
      suggestedItems: ['ao-dai-lemur-retro', 'bottom-quan-lua-trang', 'head-non-la', 'foot-guoc-moc-nhung', 'acc-kinh-ram-cyber'],
    };
  } else if (temp <= 21 || condition === 'chilly') {
    return {
      title: `Phong Cách Đa Tầng Hoàng Cung Giữ Ấm tại ${cityName}`,
      summary: `Nhiệt độ ${Math.round(temp)}°C se lạnh. Đây là cơ hội tuyệt vời để trải nghiệm nghệ thuật "mặc nhiều lớp" (layering) sang trọng như quý tộc triều đình xưa!`,
      fabricAdvice: 'Gấm dệt hoa chìm, nhung the thêu tay, dạ tweed cao cấp hoặc lụa chần bông giữ nhiệt.',
      layerAdvice: 'Mặc Áo Ngũ Thân ôm bên trong, khoác ngoài Áo Tấc tay thụng rộng hoặc Blazer Oversized hiện đại. Kết hợp Khăn Đóng đen truyền thống và Giày chunky/Boots da cá tính.',
      suggestedPalettes: ['#1D3B53', '#B82626', '#1A1A1E', '#D9738A'],
      suggestedItems: ['ao-tac-tay-thung', 'remix-oversized-blazer', 'bottom-raw-denim-wide', 'head-khan-dong-den', 'foot-chunky-loafer'],
    };
  } else if (condition === 'rainy') {
    return {
      title: `Phong Cách Dạo Phố Ngày Mưa tại ${cityName}`,
      summary: `Thời tiết ẩm ướt, có mưa. Cần lưu ý độ dài tà áo và chọn chất liệu ít thấm nước để vừa đẹp vừa thuận tiện di chuyển.`,
      fabricAdvice: 'Lụa pha sợi kháng nước nhẹ, đũi sợi đanh hoặc chất liệu denim tân thời dễ giặt ủi.',
      layerAdvice: 'Chọn Áo Dài Mini dáng ngắn hoặc Áo Ngũ Thân tay chẽn gọn gàng, phối cùng Quần Denim gấu đứng hoặc Chân váy ngắn. Đi Guốc mộc hoặc Sneaker đế cao để tránh nước đọng.',
      suggestedPalettes: ['#165B58', '#1D3B53', '#F4EFE6', '#1A1A1E'],
      suggestedItems: ['ao-dai-mini-hippie-1968', 'bottom-raw-denim-wide', 'head-khan-dong-den', 'foot-guoc-moc-nhung', 'acc-kieng-bac-cham-sen'],
    };
  } else {
    // 22 - 27C: Ideal weather for Vietnamese traditional clothes
    return {
      title: `Thời Tiết Hoàng Kim Diễn Cổ Phục tại ${cityName}`,
      summary: `Nhiệt độ ${Math.round(temp)}°C vô cùng lý tưởng! Bạn có thể thoải mái diện trọn vẹn những bộ triều phục rực rỡ nhất mà không lo nóng hay lạnh.`,
      fabricAdvice: 'Gấm ngũ sắc, lụa satin tơ tằm, sa trơn và đũi tơ tằm hoàng gia.',
      layerAdvice: 'Thời điểm vàng để diện trọn bộ Áo Nhật Bình cổ chữ nhật vạt ngũ sắc, Áo Tấc tay thụng hoặc Áo Giao Lĩnh cổ chéo. Đội Khăn Đóng trang nhã, đeo Kiềng Bạc chạm sen quý phái.',
      suggestedPalettes: ['#B82626', '#DDA032', '#165B58', '#1D3B53'],
      suggestedItems: ['ao-nhat-binh-cung-dinh', 'bottom-quan-lua-trang', 'head-khan-dong-den', 'foot-guoc-moc-nhung', 'acc-kieng-bac-cham-sen'],
    };
  }
}

export const weatherService = {
  // Fetch real-time weather from Open-Meteo
  async getLiveWeather(city: WeatherCity): Promise<LiveWeatherData> {
    const lat = city.latitude;
    const lon = city.longitude;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FBangkok`;

    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!response.ok) {
        throw new Error(`Open-Meteo API returned status ${response.status}`);
      }

      const data = await response.json();
      const current = data.current;
      const { description, condition } = interpretWeatherCode(current.weather_code);

      // Hourly preview (next 6 intervals)
      const hourlyForecast: LiveWeatherData['hourlyForecast'] = [];
      if (data.hourly?.time && data.hourly?.temperature_2m) {
        const nowIndex = 12; // midday reference
        for (let i = 0; i < 6; i++) {
          const idx = (nowIndex + i * 2) % data.hourly.time.length;
          const timeStr = data.hourly.time[idx] || '';
          const hour = timeStr.split('T')[1] || `${12 + i * 2}:00`;
          hourlyForecast.push({
            time: hour.slice(0, 5),
            temperature: Math.round(data.hourly.temperature_2m[idx]),
            weatherCode: data.hourly.weather_code?.[idx] ?? current.weather_code,
          });
        }
      }

      // Daily preview (next 4 days)
      const dailyForecast: LiveWeatherData['dailyForecast'] = [];
      if (data.daily?.time) {
        for (let i = 0; i < Math.min(4, data.daily.time.length); i++) {
          const rawDate = data.daily.time[i];
          const d = new Date(rawDate);
          const dayName = i === 0 ? 'Hôm nay' : `Thứ ${d.getDay() + 1 === 1 ? 'CN' : d.getDay() + 1}`;
          dailyForecast.push({
            date: dayName,
            tempMax: Math.round(data.daily.temperature_2m_max[i]),
            tempMin: Math.round(data.daily.temperature_2m_min[i]),
            weatherCode: data.daily.weather_code[i],
          });
        }
      }

      const temp = current.temperature_2m;
      const advice = generateCulturalOutfitAdvice(temp, condition, city.name);

      const now = new Date();
      const updatedTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      return {
        cityName: city.name,
        province: city.province,
        latitude: city.latitude,
        longitude: city.longitude,
        temperature: Math.round(temp * 10) / 10,
        apparentTemperature: Math.round(current.apparent_temperature * 10) / 10,
        humidity: Math.round(current.relative_humidity_2m),
        weatherCode: current.weather_code,
        weatherDescription: description,
        weatherCondition: condition,
        isDay: current.is_day === 1,
        windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
        updatedAt: updatedTimeStr,
        hourlyForecast,
        dailyForecast,
        outfitRecommendation: advice,
      };
    } catch (err) {
      console.warn(`Real-time weather fetch failed for ${city.name}, using simulated baseline`, err);
      return this.getFallbackWeather(city);
    }
  },

  // Fallback realistic baseline weather if network is offline
  getFallbackWeather(city: WeatherCity): LiveWeatherData {
    // Generate realistic Vietnam seasonal temperature based on latitude
    let baseTemp = 26.5;
    if (city.id === 'hanoi' || city.id === 'ninhbinh' || city.id === 'haiphong') baseTemp = 25.0;
    else if (city.id === 'dalat') baseTemp = 18.5;
    else if (city.id === 'sapa') baseTemp = 17.0;
    else if (city.id === 'hue' || city.id === 'hoian') baseTemp = 26.0;
    else if (city.id === 'hochiminh' || city.id === 'cantho') baseTemp = 31.0;

    const { description, condition } = interpretWeatherCode(baseTemp > 28 ? 0 : 2);
    const now = new Date();
    const updatedTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const advice = generateCulturalOutfitAdvice(baseTemp, condition, city.name);

    return {
      cityName: city.name,
      province: city.province,
      latitude: city.latitude,
      longitude: city.longitude,
      temperature: baseTemp,
      apparentTemperature: Math.round((baseTemp + 1.2) * 10) / 10,
      humidity: 75,
      weatherCode: baseTemp > 28 ? 0 : 2,
      weatherDescription: description,
      weatherCondition: condition,
      isDay: true,
      windSpeed: 12.5,
      updatedAt: updatedTimeStr,
      hourlyForecast: [
        { time: '09:00', temperature: Math.round(baseTemp - 1), weatherCode: 1 },
        { time: '12:00', temperature: Math.round(baseTemp + 2), weatherCode: 0 },
        { time: '15:00', temperature: Math.round(baseTemp + 1), weatherCode: 1 },
        { time: '18:00', temperature: Math.round(baseTemp - 2), weatherCode: 2 },
        { time: '21:00', temperature: Math.round(baseTemp - 3), weatherCode: 2 },
      ],
      dailyForecast: [
        { date: 'Hôm nay', tempMax: Math.round(baseTemp + 2), tempMin: Math.round(baseTemp - 3), weatherCode: 1 },
        { date: 'Ngày mai', tempMax: Math.round(baseTemp + 3), tempMin: Math.round(baseTemp - 2), weatherCode: 0 },
        { date: 'Thứ 7', tempMax: Math.round(baseTemp + 1), tempMin: Math.round(baseTemp - 3), weatherCode: 2 },
        { date: 'Chủ nhật', tempMax: Math.round(baseTemp + 2), tempMin: Math.round(baseTemp - 2), weatherCode: 1 },
      ],
      outfitRecommendation: advice,
    };
  },

  // Get live weather from browser geolocation
  async getWeatherByCoordinates(lat: number, lon: number): Promise<LiveWeatherData> {
    // Find closest cultural city
    let closest = CULTURAL_CITIES[0];
    let minDistance = Infinity;

    for (const city of CULTURAL_CITIES) {
      const d = Math.hypot(city.latitude - lat, city.longitude - lon);
      if (d < minDistance) {
        minDistance = d;
        closest = city;
      }
    }

    const customCity: WeatherCity = {
      id: 'gps_location',
      name: `Vị trí của bạn (gần ${closest.name})`,
      province: closest.province,
      latitude: lat,
      longitude: lon,
      culturalNote: `Dựa trên tọa độ GPS trực tiếp của bạn (${lat.toFixed(2)}°B, ${lon.toFixed(2)}°Đ).`,
    };

    const res = await this.getLiveWeather(customCity);
    res.isLiveGps = true;
    return res;
  },
};

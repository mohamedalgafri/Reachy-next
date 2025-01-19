// lib/ip-service.ts
import { getCountryNameByCode, getCountryFlag } from './countries';

interface GeoLocation {
  country: string;     // رمز الدولة (مثل SA)
  countryName: string; // اسم الدولة
  city: string | null; // اسم المدينة
  flag: string;        // علم الدولة
}

export async function getCountryFromIP(ip: string, locale: string = 'ar'): Promise<GeoLocation> {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,countryCode,country,city`);
    const data = await response.json();

    if (data.status === 'success') {
      const countryCode = data.countryCode;
      return {
        country: countryCode,
        countryName: getCountryNameByCode(countryCode, locale),
        city: data.city,
        flag: getCountryFlag(countryCode)
      };
    }

    // في حالة الفشل، نعيد قيم افتراضية
    return {
      country: 'UN',
      countryName: locale === 'ar' ? 'غير معروف' : 'Unknown',
      city: null,
      flag: '🌍'
    };
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    return {
      country: 'UN',
      countryName: locale === 'ar' ? 'غير معروف' : 'Unknown',
      city: null,
      flag: '🌍'
    };
  }
}
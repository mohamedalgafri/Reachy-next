// lib/countries.ts
import countries from 'world-countries';

interface CountryData {
  code: string;
  name: {
    ar: string;
    en: string;
  };
  flag: string;
}

// الحصول على قائمة الدول المنسقة
export const getFormattedCountries = (locale: string = 'ar'): CountryData[] => {
  return countries.map((country) => ({
    code: country.cca2,
    name: {
      ar: country.translations.ara?.common || country.name.common,
      en: country.name.common
    },
    flag: `https://flagcdn.com/w80/${country.cca2.toLowerCase()}.png`
  }));
};

// الحصول على اسم الدولة باستخدام الكود
export const getCountryNameByCode = (code: string, locale: string = 'ar'): string => {
  const country = countries.find(c => c.cca2 === code);
  if (!country) return locale === 'ar' ? 'غير معروف' : 'Unknown';
  
  return locale === 'ar' 
    ? (country.translations.ara?.common || country.name.common)
    : country.name.common;
};
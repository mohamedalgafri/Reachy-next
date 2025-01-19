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

// تحميل وتنظيم بيانات الدول
export const getFormattedCountries = (locale: string = 'ar'): CountryData[] => {
  return countries.map((country) => ({
    code: country.cca2,
    name: {
      ar: country.translations.ara?.common || country.name.common,
      en: country.name.common
    },
    flag: country.flag
  }));
};

// الحصول على اسم الدولة باللغة المطلوبة
export const getCountryNameByCode = (code: string, locale: string = 'ar'): string => {
  const country = countries.find(c => c.cca2 === code);
  if (!country) return locale === 'ar' ? 'دول أخرى' : 'Other Countries';
  
  return locale === 'ar' 
    ? (country.translations.ara?.common || country.name.common)
    : country.name.common;
};

// الحصول على علم الدولة
export const getCountryFlag = (code: string): string => {
  const country = countries.find(c => c.cca2 === code);
  return country?.flag || '🌍';
};
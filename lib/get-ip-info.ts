import { headers } from 'next/headers'

export async function getIpInfo() {
  try {
    const headersList = headers()
    const ip = 
      headersList.get('x-real-ip') || 
      headersList.get('x-forwarded-for')?.split(',')[0] || 
      '127.0.0.1'

      console.log('[GET_IP_INFO] Detected IP:', ip);
    // استخدام IP-API للحصول على معلومات الموقع
    const response = await fetch(`http://ip-api.com/json/${ip}`)
    const data = await response.json()
    
    if (data.status === 'success') {
      return {
        ip,
        country: data.countryCode,
        countryName: data.country,
        city: data.city,
      }
    }
    
    return {
      ip,
      country: 'Unknown',
      countryName: 'Unknown',
      city: 'Unknown',
    }
  } catch (error) {
    console.error('[GET_IP_INFO]', error)
    return {
      ip: '127.0.0.1',
      country: 'Unknown',
      countryName: 'Unknown',
      city: 'Unknown',
    }
  }
}
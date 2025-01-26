import { headers } from 'next/headers'

export async function getIpInfo() {
  try {
    const headersList = headers()
    const ip = 
      await headersList.get('x-real-ip') || 
      await headersList.get('x-forwarded-for')?.split(',')[0] || 
      '127.0.0.1'

    // console.log('[GET_IP_INFO] Detected IP:', ip);

    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await response.json()
    
    return {
      ip,
      country: data.country_code || 'Unknown',
      countryName: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
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
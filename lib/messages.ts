const messageCache = new Map();

export async function getMessages(locale: string) {
  if (messageCache.has(locale)) {
    return messageCache.get(locale);
  }
  
  const messages = await import(`@/i18n/messages/${locale}.json`)
    .then((module) => module.default)
    .catch(() => import('@/i18n/messages/ar.json').then((module) => module.default));
    
  messageCache.set(locale, messages);
  return messages;
}
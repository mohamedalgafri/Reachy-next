const FormattedContent = ({ content, locale = 'ar' }) => {
    const formatListContent = (content) => {
      // تحويل النص العادي إلى قائمة HTML إذا كان يحتوي على نقاط
      if (content.includes('•') || content.includes('-')) {
        const items = content.split('\n').filter(item => item.trim());
        return `<ul>${items.map(item => `<li>${item.replace(/^[-•]\s*/, '')}</li>`).join('')}</ul>`;
      }
      return content;
    };
  
    return (
      <div 
        dangerouslySetInnerHTML={{ 
          __html: formatListContent(content)
        }} 
        className="mt-2 text-sm prose prose-sm prose-ul:pl-5 prose-ul:pr-5 prose-li:my-0 prose-ul:my-1"
        dir={locale === 'ar' ? 'rtl' : 'ltr'} 
      />
    );
  };
  
  export default FormattedContent;
  
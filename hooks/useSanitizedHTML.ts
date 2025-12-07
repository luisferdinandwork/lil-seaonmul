// hooks/useSanitizedHTML.ts
import DOMPurify from 'dompurify';

export const useSanitizedHTML = () => {
  const createMarkup = (htmlContent: string) => {
    const cleanHTML = DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
        'p', 'br', 'hr',
        'ul', 'ol', 'li',
        'blockquote', 
        'a', 
        'strong', 'em', 'u', 's', 'del',
        'code', 'pre',
        'img',
        'div', 'span'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel']
    });
    return { __html: cleanHTML };
  };

  return { createMarkup };
};
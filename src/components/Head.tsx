
import React from 'react';
import { Helmet } from 'react-helmet';

interface HeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  children?: React.ReactNode;
}

const Head: React.FC<HeadProps> = ({ 
  title = 'منصة كودر التفاعلية - بيئة تطوير متكاملة',
  description = 'منصة تطوير متكاملة عبر الإنترنت للمبرمجين. أنشئ، طور، وشارك مشاريعك بسهولة.',
  keywords = 'تطوير, برمجة, كودر, مشاريع, تعاون, منصة تطوير, محاكاة, نشر المشاريع',
  ogImage = '/og-image.jpg',
  ogUrl = 'https://coder-platform.com',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
  children
}) => {
  // Asegurarse de que las URLs sean absolutas
  const ensureAbsoluteUrl = (url: string): string => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Usar la URL actual como base si ogUrl no es una URL completa
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://coder-platform.com';
    
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };
  
  const absoluteOgImage = ensureAbsoluteUrl(ogImage);
  const absoluteOgUrl = ensureAbsoluteUrl(ogUrl);
  const absoluteCanonicalUrl = canonicalUrl ? ensureAbsoluteUrl(canonicalUrl) : absoluteOgUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={absoluteOgUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:locale" content="ar_SA" />
      <meta property="og:site_name" content="منصة كودر التفاعلية" />
      
      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={absoluteOgUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={absoluteOgImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={absoluteCanonicalUrl} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Other important meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="ar" />
      <meta charSet="UTF-8" />
      
      {/* Additional custom tags */}
      {children}
    </Helmet>
  );
};

export default Head;

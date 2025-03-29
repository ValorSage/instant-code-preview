import React from 'react';
import { Helmet } from 'react-helmet';

interface HeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
}

const Head: React.FC<HeadProps> = ({ 
  title = 'منصة كودر التفاعلية - بيئة تطوير متكاملة',
  description = 'منصة تطوير متكاملة عبر الإنترنت للمبرمجين. أنشئ، طور، وشارك مشاريعك بسهولة.',
  keywords = 'تطوير, برمجة, كودر, مشاريع, تعاون, منصة تطوير',
  ogImage = '/og-image.jpg',
  ogUrl = 'https://coder-platform.com'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={ogUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Other important meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="ar" />
      <meta charSet="UTF-8" />
    </Helmet>
  );
};

export default Head;

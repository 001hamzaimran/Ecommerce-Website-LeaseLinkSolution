import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object; // Add support for JSON-LD schema
}

const SEO = ({ 
  title = "LeaseLink Solution | Premium Retail & Marketplace", 
  description = "Discover curated collections of premium office products, baby essentials, home & kitchen, pet supplies, and luxury perfumes. Swift delivery and quality assured at LeaseLink Solution.",
  keywords = "e-commerce, retail, office products, baby products, home decor, pet supplies, perfumes, luxury shopping",
  image = "/og-image.jpg",
  url = "https://leaselinksolution.com",
  type = "website",
  schema
}: SEOProps) => {
  const siteTitle = title.includes("LeaseLink Solution") ? title : `${title} | LeaseLink Solution`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Robots */}
      <meta name="robots" content="index, follow" />

      {/* JSON-LD Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

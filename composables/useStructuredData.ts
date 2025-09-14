export const useStructuredData = () => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "WeCodeZW",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Empowering Zimbabwe with digital skills training, IT services, and innovative products for a digital-first world.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ZW",
      "addressRegion": "Harare"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+263778456168",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://wa.me/263778456168"
    ],
    "offers": [
      {
        "@type": "Offer",
        "name": "Digital Skills Training",
        "description": "Programming, web development, cybersecurity, and hands-on learning paths"
      },
      {
        "@type": "Offer", 
        "name": "IT Services",
        "description": "Web development, cloud infrastructure, cybersecurity, and data analytics"
      },
      {
        "@type": "Offer",
        "name": "Coding Clubs for Schools",
        "description": "Launch coding and robotics clubs in schools"
      }
    ]
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "WeCodeZW",
    "url": siteUrl,
    "description": "Digital skills training, IT services, and innovative products for Zimbabwe's digital economy",
    "publisher": {
      "@type": "Organization",
      "name": "WeCodeZW"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Digital Skills Training and IT Services",
    "provider": {
      "@type": "Organization",
      "name": "WeCodeZW"
    },
    "description": "Comprehensive digital skills training for individuals, schools, and corporates, plus modern IT services",
    "serviceType": "Technology Education and IT Services",
    "areaServed": {
      "@type": "Country",
      "name": "Zimbabwe"
    },
    "offers": {
      "@type": "Offer",
      "description": "Digital skills training, IT services, and innovative products",
      "priceCurrency": "USD"
    }
  }

  return {
    organizationSchema,
    websiteSchema,
    serviceSchema
  }
}
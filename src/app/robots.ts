import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout', '/profile', '/auth', '/forgot-password'],
    },
    sitemap: 'https://glow-luxury.vercel.app/sitemap.xml',
  }
}

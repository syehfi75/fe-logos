import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SEFT Learning',
    short_name: 'SEFT Learning',
    description: 'Begin your healing and growth journey today. Release inner blocks and resolve life challenges with SEFT.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/icon-sw.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-sw.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
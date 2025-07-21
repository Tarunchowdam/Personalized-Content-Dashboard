/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
      'image.tmdb.org',
      'media.istockphoto.com'
    ],
  },
  env: {
    NEWS_API_KEY: process.env.NEWS_API_KEY,
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
}

module.exports = nextConfig 
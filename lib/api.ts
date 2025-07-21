import axios from 'axios';
import { NewsArticle, MovieRecommendation, SocialPost, SearchResult } from '@/types';

// API Configuration
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || '';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';

// News API
export const fetchNews = async (categories: string[] = []): Promise<NewsArticle[]> => {
  try {
    if (NEWS_API_KEY) {
      // Use the first selected category or 'general' as fallback
      const category = categories[0] || 'general';
      const response = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          country: 'us',
          category,
          apiKey: NEWS_API_KEY,
        },
      });
      // Map NewsAPI response to NewsArticle[]
      return (response.data.articles || []).map((item: any, idx: number) => ({
        id: item.url || String(idx),
        title: item.title,
        description: item.description || '',
        content: item.content || '',
        url: item.url,
        urlToImage: item.urlToImage || '',
        publishedAt: item.publishedAt,
        source: { id: item.source?.id || '', name: item.source?.name || '' },
        category,
        isFavorite: false,
      }));
    }
    // Mock data fallback
    const mockNews: NewsArticle[] = [
      {
        id: '1',
        title: 'Latest Technology Breakthroughs in 2024',
        description: 'Discover the most innovative technologies that are shaping the future.',
        content: 'The technology landscape is rapidly evolving with new breakthroughs in AI, quantum computing, and renewable energy...',
        url: 'https://example.com/tech-breakthroughs',
        urlToImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
        publishedAt: '2024-01-15T10:00:00Z',
        source: { id: 'tech-news', name: 'Tech News' },
        category: 'technology',
        isFavorite: false,
      },
      {
        id: '2',
        title: 'Sports: Championship Finals This Weekend',
        description: 'The biggest sports event of the year is just around the corner.',
        content: 'Fans around the world are eagerly anticipating this weekend\'s championship finals...',
        url: 'https://example.com/sports-finals',
        urlToImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        publishedAt: '2024-01-14T15:30:00Z',
        source: { id: 'sports-news', name: 'Sports Central' },
        category: 'sports',
        isFavorite: false,
      },
      {
        id: '3',
        title: 'Financial Markets: New Investment Opportunities',
        description: 'Expert analysis on emerging investment trends and market opportunities.',
        content: 'The financial markets are presenting unique opportunities for investors...',
        url: 'https://example.com/finance-opportunities',
        urlToImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        publishedAt: '2024-01-13T09:15:00Z',
        source: { id: 'finance-news', name: 'Financial Times' },
        category: 'finance',
        isFavorite: false,
      },
      {
        id: '4',
        title: 'Health: New Breakthrough in Cancer Research',
        description: 'Scientists have made a significant discovery in the fight against cancer.',
        content: 'A new treatment shows promise in early trials, offering hope to millions...',
        url: 'https://example.com/health-cancer-research',
        urlToImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
        publishedAt: '2024-01-12T11:00:00Z',
        source: { id: 'health-news', name: 'Health Daily' },
        category: 'health',
        isFavorite: false,
      },
      {
        id: '5',
        title: 'Science: Mars Rover Sends New Images',
        description: 'Stunning new images from the surface of Mars have been released.',
        content: 'The Mars rover continues its mission, sending back valuable data and breathtaking photos...',
        url: 'https://example.com/science-mars-rover',
        urlToImage: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400',
        publishedAt: '2024-01-11T13:45:00Z',
        source: { id: 'science-news', name: 'Science World' },
        category: 'science',
        isFavorite: false,
      },
      {
        id: '6',
        title: 'Business: Startups to Watch in 2024',
        description: 'A look at the most promising startups making waves this year.',
        content: 'From fintech to healthtech, these startups are set to disrupt their industries...',
        url: 'https://example.com/business-startups-2024',
        urlToImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
        publishedAt: '2024-01-10T16:20:00Z',
        source: { id: 'business-news', name: 'Business Insider' },
        category: 'business',
        isFavorite: false,
      },
      {
        id: '7',
        title: 'World: Global Leaders Meet for Climate Summit',
        description: 'World leaders gather to discuss urgent climate action.',
        content: 'The summit aims to set new targets for reducing emissions and promoting sustainability...',
        url: 'https://example.com/world-climate-summit',
        urlToImage: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400',
        publishedAt: '2024-01-09T18:10:00Z',
        source: { id: 'world-news', name: 'Global News' },
        category: 'world',
        isFavorite: false,
      },
    ];
    return mockNews.filter(news => 
      categories.length === 0 || categories.includes(news.category)
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Failed to fetch news');
  }
};

// Movies API (TMDB)
export const fetchMovies = async (categories: string[] = []): Promise<MovieRecommendation[]> => {
  try {
    if (TMDB_API_KEY) {
      // Fetch popular movies from TMDB
      const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
        params: {
          api_key: TMDB_API_KEY,
          language: 'en-US',
          page: 1,
        },
      });
      // Map TMDB response to MovieRecommendation[]
      return (response.data.results || []).map((item: any) => ({
        id: String(item.id),
        title: item.title,
        overview: item.overview,
        poster_path: item.poster_path
          ? `https://image.tmdb.org/t/p/w400${item.poster_path}`
          : '',
        release_date: item.release_date,
        vote_average: item.vote_average,
        genre_ids: item.genre_ids,
        category: 'entertainment', // TMDB does not provide category, so default
        isFavorite: false,
      }));
    }
    // Mock data fallback
    const mockMovies: MovieRecommendation[] = [
      {
        id: '1',
        title: 'The Future of Cinema',
        overview: 'A groundbreaking film that explores the intersection of technology and storytelling.',
        poster_path: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
        release_date: '2024-01-20',
        vote_average: 8.5,
        genre_ids: [28, 12, 878],
        category: 'entertainment',
        isFavorite: false,
      },
      {
        id: '2',
        title: 'Adventure Quest',
        overview: 'An epic adventure that takes viewers on a journey through uncharted territories.',
        poster_path: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        release_date: '2024-01-25',
        vote_average: 7.8,
        genre_ids: [12, 14, 28],
        category: 'adventure',
        isFavorite: false,
      },
      {
        id: '3',
        title: 'Mystery Manor',
        overview: 'A psychological thriller that keeps audiences guessing until the very end.',
        poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
        release_date: '2024-01-30',
        vote_average: 8.2,
        genre_ids: [53, 27, 9648],
        category: 'thriller',
        isFavorite: false,
      },
      {
        id: '4',
        title: 'Comedy Nights',
        overview: 'A hilarious comedy that will leave you in stitches.',
        poster_path: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3c5c?w=400',
        release_date: '2024-02-05',
        vote_average: 7.5,
        genre_ids: [35],
        category: 'entertainment',
        isFavorite: false,
      },
      {
        id: '5',
        title: 'Science Unveiled',
        overview: 'A documentary exploring the wonders of modern science.',
        poster_path: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400',
        release_date: '2024-02-10',
        vote_average: 8.7,
        genre_ids: [99],
        category: 'science',
        isFavorite: false,
      },
      {
        id: '6',
        title: 'Startup Stories',
        overview: 'Inspiring tales from the world of startups and entrepreneurship.',
        poster_path: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
        release_date: '2024-02-15',
        vote_average: 8.0,
        genre_ids: [18],
        category: 'business',
        isFavorite: false,
      },
    ];
    return mockMovies.filter(movie => 
      categories.length === 0 || categories.includes(movie.category)
    );
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Failed to fetch movies');
  }
};

// Social Posts API (Mock)
export const fetchSocialPosts = async (categories: string[] = []): Promise<SocialPost[]> => {
  try {
    // Mock data for demonstration
    const mockSocialPosts: SocialPost[] = [
      {
        id: '1',
        content: 'Just discovered an amazing new tech startup! The innovation is incredible. #TechNews #Innovation',
        author: {
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
          handle: '@sarah_tech',
        },
        timestamp: '2024-01-15T08:30:00Z',
        likes: 245,
        shares: 67,
        hashtags: ['#TechNews', '#Innovation', '#Startup'],
        category: 'technology',
        isFavorite: false,
      },
      {
        id: '2',
        content: 'What a game! The energy in the stadium was electric tonight. #Sports #Championship',
        author: {
          name: 'Mike Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          handle: '@mike_sports',
        },
        timestamp: '2024-01-14T22:15:00Z',
        likes: 189,
        shares: 34,
        hashtags: ['#Sports', '#Championship', '#GameDay'],
        category: 'sports',
        isFavorite: false,
      },
      {
        id: '3',
        content: 'Market analysis: The tech sector is showing strong growth potential. #Finance #Investing',
        author: {
          name: 'Emma Davis',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
          handle: '@emma_finance',
        },
        timestamp: '2024-01-13T14:45:00Z',
        likes: 156,
        shares: 89,
        hashtags: ['#Finance', '#Investing', '#TechStocks'],
        category: 'finance',
        isFavorite: false,
      },
      {
        id: '4',
        content: 'Excited to attend the Global Climate Summit. Important discussions ahead! #ClimateAction #World',
        author: {
          name: 'Liam Smith',
          avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100',
          handle: '@liam_world',
        },
        timestamp: '2024-01-12T19:00:00Z',
        likes: 210,
        shares: 55,
        hashtags: ['#ClimateAction', '#World', '#Summit'],
        category: 'world',
        isFavorite: false,
      },
      {
        id: '5',
        content: 'Breakthrough in cancer research gives hope to millions. #Health #Research',
        author: {
          name: 'Olivia Brown',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
          handle: '@olivia_health',
        },
        timestamp: '2024-01-11T10:30:00Z',
        likes: 175,
        shares: 40,
        hashtags: ['#Health', '#Research', '#Hope'],
        category: 'health',
        isFavorite: false,
      },
    ];

    return mockSocialPosts.filter(post => 
      categories.length === 0 || categories.includes(post.category)
    );
  } catch (error) {
    console.error('Error fetching social posts:', error);
    return [];
  }
};

// Search API
export const searchContent = async (query: string): Promise<SearchResult> => {
  try {
    // Mock search implementation
    const allNews = await fetchNews();
    const allMovies = await fetchMovies();
    const allSocial = await fetchSocialPosts();

    const searchResults: SearchResult = {
      news: allNews.filter(news => 
        news.title.toLowerCase().includes(query.toLowerCase()) ||
        news.description.toLowerCase().includes(query.toLowerCase())
      ),
      movies: allMovies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.overview.toLowerCase().includes(query.toLowerCase())
      ),
      social: allSocial.filter(post => 
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.author.name.toLowerCase().includes(query.toLowerCase())
      ),
    };

    return searchResults;
  } catch (error) {
    console.error('Error searching content:', error);
    return { news: [], movies: [], social: [] };
  }
};

// Helper to shuffle and pick top N trending items
function pickTrending<T extends { id: string; title?: string; content?: string; category: string; url?: string; poster_path?: string }>(arr: T[], n: number, type: string) {
  return arr
    .sort(() => 0.5 - Math.random())
    .slice(0, n)
    .map((item, idx) => ({
      id: `${type}-${item.id}`,
      title: item.title || (item as any).content?.slice(0, 40) || '',
      category: item.category,
      count: Math.floor(Math.random() * 1000) + 100, // random popularity
      type,
      url:
        type === 'news' ? (item as any).url :
        type === 'movie' ? `https://www.themoviedb.org/movie/${item.id}` :
        type === 'social' ? undefined : undefined,
      poster_path: type === 'movie' ? (item as any).poster_path : undefined,
    }));
}

export const fetchTrending = async () => {
  try {
    // Gather all mock data
    const news = await fetchNews();
    const movies = await fetchMovies();
    const social = await fetchSocialPosts();
    const trending = [
      ...pickTrending(news, 2, 'news'),
      ...pickTrending(movies, 1, 'movie'),
      ...pickTrending(social, 1, 'social'),
    ];
    // Shuffle trending
    return trending.sort(() => 0.5 - Math.random());
  } catch (error) {
    console.error('Error fetching trending:', error);
    return [];
  }
}; 
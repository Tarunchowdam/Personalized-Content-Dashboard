export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  categories: string[];
  darkMode: boolean;
  language: string;
  favorites: string[];
  notificationsEnabled?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  category: string;
  isFavorite: boolean;
}

export interface MovieRecommendation {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  category: string;
  isFavorite: boolean;
}

export interface SocialPost {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  timestamp: string;
  likes: number;
  shares: number;
  hashtags: string[];
  category: string;
  isFavorite: boolean;
}

export interface ContentItem {
  id: string;
  type: 'news' | 'movie' | 'social';
  data: NewsArticle | MovieRecommendation | SocialPost;
  order: number;
}

export interface SearchResult {
  news: NewsArticle[];
  movies: MovieRecommendation[];
  social: SocialPost[];
}

export interface TrendingItem {
  id: string;
  title: string;
  category: string;
  count: number;
  type: 'news' | 'movie' | 'social';
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  category?: string;
  search?: string;
}

export interface DashboardState {
  user: User | null;
  content: ContentItem[];
  favorites: ContentItem[];
  trending: TrendingItem[];
  searchResults: SearchResult | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    categories: string[];
    searchQuery: string;
  };
}

export interface Theme {
  isDark: boolean;
}

export interface DragDropState {
  isDragging: boolean;
  draggedItem: ContentItem | null;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
} 
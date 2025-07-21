import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DashboardState, ContentItem, User, SearchResult, TrendingItem } from '@/types';
import { fetchNews, fetchMovies, fetchSocialPosts, searchContent } from '@/lib/api';

const initialState: DashboardState = {
  user: null,
  content: [],
  favorites: [],
  trending: [],
  searchResults: null,
  isLoading: false,
  error: null,
  filters: {
    categories: [],
    searchQuery: '',
  },
};

export const fetchPersonalizedContent = createAsyncThunk(
  'dashboard/fetchPersonalizedContent',
  async (categories: string[]) => {
    const [news, movies, social] = await Promise.all([
      fetchNews(categories),
      fetchMovies(categories),
      fetchSocialPosts(categories),
    ]);

    const content: ContentItem[] = [
      ...news.map((item, index) => ({
        id: `news-${item.id}`,
        type: 'news' as const,
        data: item,
        order: index,
      })),
      ...movies.map((item, index) => ({
        id: `movie-${item.id}`,
        type: 'movie' as const,
        data: item,
        order: news.length + index,
      })),
      ...social.map((item, index) => ({
        id: `social-${item.id}`,
        type: 'social' as const,
        data: item,
        order: news.length + movies.length + index,
      })),
    ];

    return content;
  }
);

export const searchContentAsync = createAsyncThunk(
  'dashboard/searchContent',
  async (query: string) => {
    return await searchContent(query);
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setContent: (state, action: PayloadAction<ContentItem[]>) => {
      state.content = action.payload;
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      const item = state.content.find(item => item.id === action.payload);
      if (item && !state.favorites.find(fav => fav.id === action.payload)) {
        state.favorites.push(item);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(item => item.id !== action.payload);
    },
    reorderContent: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.content.splice(sourceIndex, 1);
      state.content.splice(destinationIndex, 0, removed);
      // Update order property for persistence
      state.content.forEach((item, idx) => {
        item.order = idx;
      });
    },
    reorderFavorites: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.favorites.splice(sourceIndex, 1);
      state.favorites.splice(destinationIndex, 0, removed);
      // Update order property for persistence
      state.favorites.forEach((item, idx) => {
        item.order = idx;
      });
    },
    setFilters: (state, action: PayloadAction<{ categories?: string[]; searchQuery?: string }>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
    },
    setTrending: (state, action: PayloadAction<TrendingItem[]>) => {
      state.trending = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersonalizedContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPersonalizedContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.content = action.payload;
      })
      .addCase(fetchPersonalizedContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch content';
      })
      .addCase(searchContentAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchContentAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchContentAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to search content';
      });
  },
});

export const {
  setUser,
  setContent,
  addToFavorites,
  removeFromFavorites,
  reorderContent,
  reorderFavorites,
  setFilters,
  clearSearchResults,
  setTrending,
} = dashboardSlice.actions;

export default dashboardSlice.reducer; 
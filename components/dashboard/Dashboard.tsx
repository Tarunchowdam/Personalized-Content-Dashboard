'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchPersonalizedContent, setUser } from '@/store/slices/dashboardSlice';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ContentFeed } from './ContentFeed';
import { TrendingSection } from './TrendingSection';
import { FavoritesSection } from './FavoritesSection';
import { SearchResults } from './SearchResults';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { PreferencesModal } from './PreferencesModal';

export function Dashboard() {
  const dispatch = useDispatch();
  const { user, content, isLoading, error, searchResults, filters } = useSelector(
    (state: RootState) => state.dashboard
  );
  const [section, setSection] = useState<'feed' | 'trending' | 'favorites' | 'search' | 'settings'>('feed');
  const [isPreferencesOpen, setPreferencesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Initialize user if not exists
    if (!user) {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        preferences: {
          categories: ['technology', 'sports', 'finance'],
          darkMode: false,
          language: 'en',
          favorites: [],
        },
      };
      dispatch(setUser(mockUser));
    }

    // Fetch content if not loaded
    if (content.length === 0 && !isLoading) {
      const categories = user?.preferences.categories || ['technology', 'sports', 'finance'];
      dispatch(fetchPersonalizedContent(categories));
    }
  }, [dispatch, user, content.length, isLoading]);

  if (isLoading && content.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Sidebar */}
        <Sidebar currentSection={section} onSectionChange={(s) => {
          setSection(s as any);
          if (s === 'settings') setPreferencesOpen(true);
        }} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-background">
            <Header />
          </div>
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              {section === 'search' && searchResults && (
                <div className="mb-8">
                  <SearchResults results={searchResults} isLoading={isLoading} error={error} searchTerm={filters.searchQuery} />
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Content Feed */}
                {section === 'feed' && (
                  <div className="lg:col-span-2">
                    <ContentFeed />
                  </div>
                )}
                {section === 'trending' && (
                  <div className="lg:col-span-2">
                    <TrendingSection />
                  </div>
                )}
                {section === 'favorites' && (
                  <div className="lg:col-span-2">
                    <FavoritesSection />
                  </div>
                )}
                {/* Sidebar Content */}
                <div className="space-y-6">
                  {/* Trending Section (sidebar) */}
                  {section === 'feed' && <TrendingSection />}
                  {/* Favorites Section (sidebar) */}
                  {section === 'feed' && <FavoritesSection />}
                </div>
              </div>
            </div>
          </main>
        </div>
        {/* Settings Modal */}
        <PreferencesModal isOpen={isPreferencesOpen} onClose={() => { setPreferencesOpen(false); setSection('feed'); }} />
      </div>
    </div>
  );
} 
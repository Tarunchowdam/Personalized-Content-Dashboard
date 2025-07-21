'use client';

import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { searchContentAsync, clearSearchResults } from '@/store/slices/dashboardSlice';
import { toggleTheme } from '@/store/slices/themeSlice';
import { Search, Moon, Sun, Bell, User } from 'lucide-react';
import { debounce } from '@/utils';
import { PreferencesModal } from './PreferencesModal';
import { AppDispatch } from '@/store';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { NotificationDropdown } from '../ui/NotificationDropdown';

export function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const isLoading = useSelector((state: RootState) => state.dashboard.isLoading);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPreferencesOpen, setPreferencesOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const debouncedSearch: (query: string) => void = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        dispatch<any>(searchContentAsync(query));
      } else {
        dispatch(clearSearchResults());
      }
    }, 500),
    [dispatch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    dispatch(clearSearchResults());
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4 relative">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search for content..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label="Search for content"
            />
            {searchQuery && !isLoading && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground text-lg font-bold focus:outline-none"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4 relative">
          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 rounded-lg hover:bg-accent transition-colors relative"
              aria-label="Notifications"
              onClick={() => setNotifOpen((open) => !open)}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>

          {/* User Menu (opens preferences) */}
          <button
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="User menu"
            onClick={() => setPreferencesOpen(true)}
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
      <PreferencesModal isOpen={isPreferencesOpen} onClose={() => setPreferencesOpen(false)} />
    </header>
  );
} 
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { FavoritesSection } from './FavoritesSection';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

const mockStore = configureStore([thunk]);
const initialState = {
  dashboard: {
    favorites: [
      {
        id: 'fav-1',
        type: 'news',
        data: { title: 'Favorite News', category: 'technology' },
        order: 0,
      },
      {
        id: 'fav-2',
        type: 'movie',
        data: { title: 'Favorite Movie', category: 'entertainment' },
        order: 1,
      },
      {
        id: 'fav-3',
        type: 'social',
        data: { content: 'Favorite Post', category: 'social' },
        order: 2,
      },
      {
        id: 'fav-4',
        type: 'news',
        data: { title: 'Another News', category: 'sports' },
        order: 3,
      },
      {
        id: 'fav-5',
        type: 'movie',
        data: { title: 'Another Movie', category: 'science' },
        order: 4,
      },
      {
        id: 'fav-6',
        type: 'news',
        data: { title: 'Sixth News', category: 'business' },
        order: 5,
      },
    ],
  },
  theme: { isDark: false },
  notification: { notifications: [] },
};

describe('FavoritesSection', () => {
  it('renders favorites and expand/collapse button', () => {
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <FavoritesSection />
      </Provider>
    );
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('Show all (6)')).toBeInTheDocument();
    expect(screen.getByText('Favorite News')).toBeInTheDocument();
    expect(screen.queryByText('Sixth News')).not.toBeInTheDocument();
  });

  it('expands and collapses favorites', () => {
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <FavoritesSection />
      </Provider>
    );
    fireEvent.click(screen.getByText(/show all/i));
    expect(screen.getByText('Sixth News')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/show less/i));
    expect(screen.queryByText('Sixth News')).not.toBeInTheDocument();
  });

  it('shows empty state when no favorites', () => {
    const store = mockStore({ ...initialState, dashboard: { favorites: [] } });
    render(
      <Provider store={store}>
        <FavoritesSection />
      </Provider>
    );
    expect(screen.getByText('No favorites yet')).toBeInTheDocument();
  });

  // Drag-and-drop and remove tests can be added with more advanced setup/mocks
}); 
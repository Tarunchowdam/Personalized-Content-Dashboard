import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { PreferencesModal } from './PreferencesModal';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

const mockStore = configureStore([thunk]);
const initialState = {
  dashboard: {
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      avatar: '',
      preferences: {
        categories: ['technology'],
        darkMode: false,
        language: 'en',
        favorites: [],
        notificationsEnabled: true,
      },
    },
  },
  theme: { isDark: false },
  notification: { notifications: [] },
};

describe('PreferencesModal', () => {
  it('renders with categories and settings', () => {
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <PreferencesModal isOpen={true} onClose={jest.fn()} />
      </Provider>
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByLabelText('Enable Notifications')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    const store = mockStore(initialState);
    const onClose = jest.fn();
    render(
      <Provider store={store}>
        <PreferencesModal isOpen={true} onClose={onClose} />
      </Provider>
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('allows selecting and deselecting categories', () => {
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <PreferencesModal isOpen={true} onClose={jest.fn()} />
      </Provider>
    );
    const sportsCheckbox = screen.getByLabelText(/sports/i);
    fireEvent.click(sportsCheckbox);
    expect(sportsCheckbox).toBeChecked();
    fireEvent.click(sportsCheckbox);
    expect(sportsCheckbox).not.toBeChecked();
  });

  it('shows loading spinner when saving', async () => {
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <PreferencesModal isOpen={true} onClose={jest.fn()} />
      </Provider>
    );
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });
}); 
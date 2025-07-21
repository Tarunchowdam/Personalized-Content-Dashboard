import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setUser, fetchPersonalizedContent } from '@/store/slices/dashboardSlice';
import { addNotification } from '@/store/slices/notificationSlice';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { setTheme } from '@/store/slices/themeSlice';

const ALL_CATEGORIES = [
  'technology',
  'sports',
  'finance',
  'entertainment',
  'health',
  'science',
  'business',
  'world',
];

const ALL_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'zh', label: 'Chinese' },
];

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.dashboard.user);
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    user?.preferences.categories || []
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(user?.preferences.language || 'en');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(user?.preferences.notificationsEnabled ?? true);
  const [profileName, setProfileName] = useState<string>(user?.name || '');
  const [profileEmail, setProfileEmail] = useState<string>(user?.email || '');
  const [profileAvatar, setProfileAvatar] = useState<string>(user?.avatar || '');
  const [darkMode, setDarkMode] = useState<boolean>(isDark);
  const [isSaving, setIsSaving] = useState(false);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    dispatch(
      setUser({
        ...user,
        name: profileName,
        email: profileEmail,
        avatar: profileAvatar,
        preferences: {
          ...user.preferences,
          categories: selectedCategories,
          language: selectedLanguage,
          notificationsEnabled,
        },
      })
    );
    dispatch(setTheme(darkMode));
    // Trigger content refresh
    await dispatch<any>(fetchPersonalizedContent(selectedCategories));
    // Show success notification
    dispatch(
      addNotification({
        type: 'success',
        message: 'Preferences saved! Your feed has been updated.',
      })
    );
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-card rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-md sm:max-w-lg md:max-w-xl border border-border relative animate-fadeIn overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-primary">Settings</h2>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="mb-6">
            <label className="block font-semibold mb-2">Profile</label>
            <div className="space-y-3">
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Name"
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                disabled={isSaving}
              />
              <input
                type="email"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Email"
                value={profileEmail}
                onChange={e => setProfileEmail(e.target.value)}
                disabled={isSaving}
              />
              <input
                type="url"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Avatar URL (optional)"
                value={profileAvatar}
                onChange={e => setProfileAvatar(e.target.value)}
                disabled={isSaving}
              />
              {profileAvatar && (
                <img src={profileAvatar} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover mt-2" />
              )}
            </div>
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-2">Content Categories</label>
            <div className="space-y-2 grid grid-cols-2 gap-2">
              {ALL_CATEGORIES.map((category) => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-accent transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="form-checkbox accent-primary"
                    disabled={isSaving}
                  />
                  <span className="capitalize text-foreground">{category}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-2">Language</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              disabled={isSaving}
            >
              {ALL_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-6 flex items-center justify-between">
            <label className="font-semibold">Enable Notifications</label>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={e => setNotificationsEnabled(e.target.checked)}
              className="form-checkbox accent-primary"
              disabled={isSaving}
            />
          </div>
          <div className="mb-6 flex items-center justify-between">
            <label className="font-semibold">Dark Mode</label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={e => setDarkMode(e.target.checked)}
              className="form-checkbox accent-primary"
              disabled={isSaving}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-muted text-foreground hover:bg-accent border border-border"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              disabled={isSaving || selectedCategories.length === 0}
            >
              {isSaving ? <LoadingSpinner /> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 
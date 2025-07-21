'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { User, Settings, Home, Heart, TrendingUp, Search, Menu, X } from 'lucide-react';
import React from 'react';

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const navigationItems = [
  { icon: Home, label: 'Dashboard', section: 'feed' },
  { icon: TrendingUp, label: 'Trending', section: 'trending' },
  { icon: Heart, label: 'Favorites', section: 'favorites' },
  { icon: Search, label: 'Search', section: 'search' },
  { icon: Settings, label: 'Settings', section: 'settings' },
];

export function Sidebar({ currentSection, onSectionChange, mobileOpen, setMobileOpen }: SidebarProps) {
  const user = useSelector((state: RootState) => state.dashboard.user);

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded bg-card border border-border shadow"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
        style={{ display: mobileOpen ? 'none' : undefined }}
      >
        <Menu className="w-6 h-6" />
      </button>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transform transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close button for mobile */}
        <button
          className="lg:hidden absolute top-4 right-4 p-2 rounded hover:bg-accent"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Personalized Content</p>
        </div>
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => { onSectionChange(item.section); setMobileOpen(false); }}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors text-left ${
                    currentSection === item.section
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  aria-current={currentSection === item.section ? 'page' : undefined}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {/* User Profile */}
        {user && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary-foreground font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Overlay for mobile */}
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black bg-opacity-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
    </>
  );
} 
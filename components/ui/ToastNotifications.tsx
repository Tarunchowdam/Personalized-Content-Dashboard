'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { removeNotification } from '@/store/slices/notificationSlice';

export const ToastNotifications: React.FC = () => {
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const dispatch = useDispatch();

  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, notification.duration || 3000);
      return () => clearTimeout(timer);
    });
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[1000] space-y-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 transition-all bg-card border border-border animate-fadeIn ${
            n.type === 'success'
              ? 'border-green-500'
              : n.type === 'error'
              ? 'border-red-500'
              : n.type === 'warning'
              ? 'border-yellow-500'
              : 'border-blue-500'
          }`}
        >
          <span className="text-xl">
            {n.type === 'success' && '✅'}
            {n.type === 'error' && '❌'}
            {n.type === 'warning' && '⚠️'}
            {n.type === 'info' && 'ℹ️'}
          </span>
          <span className="flex-1 text-foreground">{n.message}</span>
          <button
            className="ml-2 text-muted-foreground hover:text-foreground text-lg font-bold focus:outline-none"
            onClick={() => dispatch(removeNotification(n.id))}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}; 
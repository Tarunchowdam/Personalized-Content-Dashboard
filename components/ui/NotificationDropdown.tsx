'use client';
import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { removeNotification, clearNotifications } from '@/store/slices/notificationSlice';

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ open, onClose }) => {
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={ref} className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 animate-fadeIn">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <span className="font-semibold text-foreground">Notifications</span>
        <button
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={() => dispatch(clearNotifications())}
        >
          Clear all
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto divide-y divide-border">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">No notifications</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="flex items-center px-4 py-3 space-x-3">
              <span className="text-xl">
                {n.type === 'success' && '✅'}
                {n.type === 'error' && '❌'}
                {n.type === 'warning' && '⚠️'}
                {n.type === 'info' && 'ℹ️'}
              </span>
              <span className="flex-1 text-foreground text-sm">{n.message}</span>
              <button
                className="ml-2 text-muted-foreground hover:text-foreground text-lg font-bold focus:outline-none"
                onClick={() => dispatch(removeNotification(n.id))}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 
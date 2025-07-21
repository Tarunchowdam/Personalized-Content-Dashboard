'use client';

import React from 'react';
import { TrendingUp, Eye } from 'lucide-react';
import { fetchTrending } from '@/lib/api';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Newspaper, Film, MessageCircle } from 'lucide-react';

export function TrendingSection() {
  const [trendingItems, setTrendingItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setIsLoading(true);
    fetchTrending()
      .then((items) => {
        setTrendingItems(items);
        setIsLoading(false);
      })
      .catch((err) => {
        setError('Failed to load trending data');
        setIsLoading(false);
      });
  }, []);

  const getTypeIcon = (type: string) => {
    if (type === 'news') return <Newspaper className="w-5 h-5 text-blue-500" />;
    if (type === 'movie') return <Film className="w-5 h-5 text-purple-500" />;
    if (type === 'social') return <MessageCircle className="w-5 h-5 text-green-500" />;
    return null;
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="card-title">Trending</h3>
        </div>
        <p className="card-description">What&apos;s popular right now</p>
      </div>
      <div className="card-content">
        {isLoading ? (
          <div className="py-8 flex justify-center"><LoadingSpinner /></div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-3">
            {trendingItems.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer ${idx === 0 ? 'border-l-4 border-primary bg-primary/10' : ''}`}
                onClick={() => { if (item.url) window.open(item.url, '_blank', 'noopener'); }}
                tabIndex={0}
                role="button"
                aria-label={`Open trending ${item.type}: ${item.title}`}
                onKeyDown={e => { if (e.key === 'Enter' && item.url) window.open(item.url, '_blank', 'noopener'); }}
                style={{ outline: 'none' }}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  {getTypeIcon(item.type)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground capitalize">
                      {item.category}
                    </p>
                  </div>
                  {idx === 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground font-semibold">Top</span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  <span>{item.count.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
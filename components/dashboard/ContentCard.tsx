'use client';

import { ContentItem } from '@/types';
import { Heart, ExternalLink, Play, Share2 } from 'lucide-react';
import { formatRelativeTime, truncateText, getCategoryColor, getCategoryIcon } from '@/utils';

interface ContentCardProps {
  item: ContentItem;
  onToggleFavorite: (itemId: string, isFavorite: boolean) => void;
}

export function ContentCard({ item, onToggleFavorite }: ContentCardProps) {
  const { type, data } = item;
  const isFavorite = data.isFavorite;

  const handleToggleFavorite = () => {
    onToggleFavorite(item.id, isFavorite);
  };

  const renderNewsCard = () => {
    const news = data as any;
    return (
      <div className="card hover:shadow-lg transition-shadow">
        <div className="card-content">
          <div className="flex items-start space-x-4">
            <img
              src={news.urlToImage}
              alt={news.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(news.category)}`}>
                  {getCategoryIcon(news.category)} {news.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(news.publishedAt)}
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                {news.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {truncateText(news.description, 120)}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {news.source.name}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite
                        ? 'text-red-500 hover:bg-red-50'
                        : 'text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMovieCard = () => {
    const movie = data as any;
    const handlePlay = () => {
      window.open(`https://www.themoviedb.org/movie/${movie.id.replace('movie-', '')}`, '_blank', 'noopener');
    };
    return (
      <div className="card hover:shadow-lg transition-shadow">
        <div className="card-content">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button onClick={handlePlay} className="focus:outline-none">
                  <Play className="w-8 h-8 text-white" />
                </button>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(movie.category)}`}>
                  {getCategoryIcon(movie.category)} {movie.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  ⭐ {movie.vote_average}/10
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                {movie.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {truncateText(movie.overview, 120)}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {movie.release_date}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite
                        ? 'text-red-500 hover:bg-red-50'
                        : 'text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors" onClick={handlePlay}>
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSocialCard = () => {
    const social = data as any;
    return (
      <div className="card hover:shadow-lg transition-shadow">
        <div className="card-content">
          <div className="flex items-start space-x-4">
            <img
              src={social.author.avatar}
              alt={social.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-foreground">
                  {social.author.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  @{social.author.handle}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(social.timestamp)}
                </span>
              </div>
              <p className="text-sm text-foreground mb-3">
                {social.content}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>❤️ {social.likes}</span>
                  <span>🔄 {social.shares}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite
                        ? 'text-red-500 hover:bg-red-50'
                        : 'text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  switch (type) {
    case 'news':
      return renderNewsCard();
    case 'movie':
      return renderMovieCard();
    case 'social':
      return renderSocialCard();
    default:
      return null;
  }
} 
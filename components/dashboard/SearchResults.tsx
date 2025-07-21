'use client';

import { SearchResult } from '@/types';
import { Search, X } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import React, { useRef, useEffect, useState } from 'react';

interface SearchResultsProps {
  results: SearchResult;
  isLoading?: boolean;
  error?: string | null;
  searchTerm?: string;
}

function highlight(text: string, term: string) {
  if (!term) return text;
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.split(regex).map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-yellow-200 text-black px-1 rounded">{part}</mark> : part
  );
}

export function SearchResults({ results, isLoading, error, searchTerm = '' }: SearchResultsProps) {
  const totalResults = results.news.length + results.movies.length + results.social.length;
  const [visibleNews, setVisibleNews] = useState(10);
  const [visibleMovies, setVisibleMovies] = useState(10);
  const [visibleSocial, setVisibleSocial] = useState(10);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setVisibleNews(10);
    setVisibleMovies(10);
    setVisibleSocial(10);
  }, [results]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoadingMore(true);
        setTimeout(() => {
          setVisibleNews((prev) => Math.min(prev + 10, results.news.length));
          setVisibleMovies((prev) => Math.min(prev + 10, results.movies.length));
          setVisibleSocial((prev) => Math.min(prev + 10, results.social.length));
          setLoadingMore(false);
        }, 500);
      }
    }, { threshold: 1 });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [results, visibleNews, visibleMovies, visibleSocial]);

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-content py-12 flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-content py-12 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Could not load search results
          </h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-primary" />
            <h3 className="card-title">Search Results</h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {totalResults} results found
          </span>
        </div>
      </div>
      <div className="card-content">
        <div className="space-y-6">
          {/* News Results */}
          {results.news.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-3">News ({results.news.length})</h4>
              <div className="space-y-3">
                {results.news.slice(0, visibleNews).map((news) => (
                  <div key={news.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-xs">📰</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-foreground truncate">
                        {highlight(news.title, searchTerm)}
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {news.source.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Movie Results */}
          {results.movies.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-3">Movies ({results.movies.length})</h4>
              <div className="space-y-3">
                {results.movies.slice(0, visibleMovies).map((movie) => (
                  <div key={movie.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-xs">🎬</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-foreground truncate">
                        {highlight(movie.title, searchTerm)}
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        ⭐ {movie.vote_average}/10
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Results */}
          {results.social.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-3">Social Posts ({results.social.length})</h4>
              <div className="space-y-3">
                {results.social.slice(0, visibleSocial).map((post) => (
                  <div key={post.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-xs">💬</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-foreground truncate">
                        {highlight(post.author.name, searchTerm)}
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {highlight(post.content.slice(0, 50), searchTerm)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Infinite scroll loader */}
          {(visibleNews < results.news.length || visibleMovies < results.movies.length || visibleSocial < results.social.length) && (
            <div ref={loaderRef} className="flex justify-center py-4">
              {loadingMore ? <LoadingSpinner /> : <span className="text-muted-foreground">Loading more...</span>}
            </div>
          )}
          {/* End of results message */}
          {totalResults > 0 && visibleNews >= results.news.length && visibleMovies >= results.movies.length && visibleSocial >= results.social.length && (
            <div className="text-center py-4 text-muted-foreground text-xs">End of results</div>
          )}
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { reorderContent, addToFavorites, removeFromFavorites } from '@/store/slices/dashboardSlice';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ContentCard } from './ContentCard';
import { useEffect, useState, useRef } from 'react';
import { addNotification } from '@/store/slices/notificationSlice';

export function ContentFeed() {
  const dispatch = useDispatch();
  const { content, isLoading, error } = useSelector((state: RootState) => state.dashboard);
  const [visibleCount, setVisibleCount] = useState(10); // Show 10 items initially
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [showMoreLoading, setShowMoreLoading] = useState(false);
  const [lastDrag, setLastDrag] = useState<number>(0);

  // Infinite scroll logic (optional, can be removed if only using button)
  // useEffect(() => {
  //   if (!loaderRef.current) return;
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && visibleCount < content.length) {
  //         setVisibleCount((prev) => Math.min(prev + 10, content.length));
  //       }
  //     },
  //     { threshold: 1 }
  //   );
  //   observer.observe(loaderRef.current);
  //   return () => observer.disconnect();
  // }, [visibleCount, content.length]);

  // Error notification
  useEffect(() => {
    if (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: error,
        })
      );
    }
  }, [error, dispatch]);

  // Success notification for drag-and-drop
  useEffect(() => {
    if (lastDrag > 0) {
      dispatch(
        addNotification({
          type: 'success',
          message: 'Content order updated!',
        })
      );
    }
  }, [lastDrag, dispatch]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    dispatch(reorderContent({
      sourceIndex: result.source.index,
      destinationIndex: result.destination.index,
    }));
    setLastDrag((prev) => prev + 1);
  };

  const handleToggleFavorite = (itemId: string, isFavorite: boolean) => {
    if (isFavorite) {
      dispatch(removeFromFavorites(itemId));
    } else {
      dispatch(addToFavorites(itemId));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="card-content">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-1"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Could not load content
        </h3>
        <p className="text-muted-foreground">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Your Feed</h2>
        <p className="text-sm text-muted-foreground">
          {content.length} items
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="content-feed" isDropDisabled={isLoading || !!error}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-4 transition-all duration-200 ${snapshot.isDraggingOver ? 'bg-accent/40' : ''}`}
            >
              {content.slice(0, visibleCount).map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                  isDragDisabled={isLoading || !!error}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-all duration-200 ${
                        snapshot.isDragging ? 'opacity-50 rotate-2 ring-2 ring-primary' : ''
                      }`}
                    >
                      <ContentCard
                        item={item}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {/* Pagination Show More Button */}
      {visibleCount < content.length && (
        <div className="flex justify-center py-4">
          <button
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            onClick={() => {
              setShowMoreLoading(true);
              setTimeout(() => {
                setVisibleCount((prev) => Math.min(prev + 10, content.length));
                setShowMoreLoading(false);
              }, 400);
            }}
            disabled={showMoreLoading}
          >
            {showMoreLoading ? 'Loading...' : 'Show more'}
          </button>
        </div>
      )}
      {/* End of feed message */}
      {content.length > 0 && visibleCount >= content.length && (
        <div className="text-center py-4 text-muted-foreground text-xs">End of feed</div>
      )}

      {content.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No content available
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your preferences to see personalized content.
          </p>
        </div>
      )}
    </div>
  );
} 
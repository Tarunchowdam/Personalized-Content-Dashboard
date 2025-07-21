'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useDispatch } from 'react-redux';
import { removeFromFavorites } from '@/store/slices/dashboardSlice';
import { addNotification } from '@/store/slices/notificationSlice';
import { Heart, X, ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { reorderFavorites } from '@/store/slices/dashboardSlice';

export function FavoritesSection() {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.dashboard.favorites);
  const [expanded, setExpanded] = React.useState(false);
  const [lastDrag, setLastDrag] = React.useState(0);

  const handleRemove = (id: string) => {
    dispatch(removeFromFavorites(id));
    dispatch(addNotification({
      type: 'info',
      message: 'Removed from favorites',
    }));
  };

  const handleFavoriteClick = (item: any) => {
    if (item.type === 'news' && item.data.url) {
      window.open(item.data.url, '_blank', 'noopener');
    } else if (item.type === 'movie') {
      window.open(`https://www.themoviedb.org/movie/${item.id.replace('movie-', '')}`, '_blank', 'noopener');
    }
    // For social, you could show a modal or do nothing
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    dispatch(reorderFavorites({
      sourceIndex: result.source.index,
      destinationIndex: result.destination.index,
    }));
    setLastDrag((prev) => prev + 1);
  };

  React.useEffect(() => {
    if (lastDrag > 0) {
      dispatch(
        addNotification({
          type: 'success',
          message: 'Favorites order updated!',
        })
      );
    }
  }, [lastDrag, dispatch]);

  const visibleFavorites = expanded ? favorites : favorites.slice(0, 5);

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-500" />
          <h3 className="card-title">Favorites</h3>
        </div>
        <p className="card-description">Your saved content</p>
      </div>
      <div className="card-content">
        {favorites.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-6xl block mb-3">💖</span>
            <h4 className="text-lg font-semibold text-foreground mb-2">No favorites yet</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Start saving content you love by clicking the heart icon on any card!
            </p>
          </div>
        ) : (
          <>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="favorites-list">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-3 transition-all duration-200 ${snapshot.isDraggingOver ? 'bg-accent/40' : ''}`}
                  >
                    {visibleFavorites.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors ${snapshot.isDragging ? 'opacity-50 rotate-2 ring-2 ring-primary' : ''}`}
                            onClick={() => handleFavoriteClick(item)}
                            tabIndex={0}
                            role="button"
                            aria-label={`Open favorite ${item.type}: ${(item.data as any).title || (item.data as any).content}`}
                            onKeyDown={e => { if (e.key === 'Enter') handleFavoriteClick(item); }}
                            style={{ outline: 'none' }}
                          >
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                              <span className="text-primary-foreground text-xs font-medium">
                                {item.type.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate">
                                {(item.data as any).title || (item.data as any).content?.slice(0, 30)}
                              </h4>
                              <p className="text-xs text-muted-foreground capitalize">
                                {item.type}
                              </p>
                            </div>
                            <button
                              className="ml-2 p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
                              onClick={e => { e.stopPropagation(); handleRemove(item.id); }}
                              aria-label="Remove from favorites"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            {favorites.length > 5 && (
              <div className="flex justify-center pt-2">
                <button
                  className="flex items-center text-sm text-primary hover:underline focus:outline-none"
                  onClick={() => setExpanded((prev) => !prev)}
                  aria-label={expanded ? 'Collapse favorites' : 'Expand favorites'}
                >
                  {expanded ? 'Show less' : `Show all (${favorites.length})`}
                  {expanded ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 
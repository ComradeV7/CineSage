import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFavoriteIds } from '../services/favService';

export const useFavorites = () => {
  const { currentUser } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (currentUser) {
      getFavoriteIds(currentUser.uid).then(ids => {
        setFavoriteIds(new Set(ids));
      });
    } else {
      setFavoriteIds(new Set());
    }
  }, [currentUser]);

  const isFavorite = (movieId: number) => favoriteIds.has(movieId);

  const toggleFavorite = (movie: any) => {
    if (!currentUser) return;
    
    const newFavorites = new Set(favoriteIds);
    if (isFavorite(movie.id)) {
      newFavorites.delete(movie.id);
      // removeFavorite(currentUser.uid, movie.id); // This would be in favoritesService
    } else {
      newFavorites.add(movie.id);
      // addFavorite(currentUser.uid, movie); // This would be in favoritesService
    }
    setFavoriteIds(newFavorites);
  };

  return { favoriteIds, isFavorite, toggleFavorite };
};

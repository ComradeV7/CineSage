import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

// Gets a list of just the IDs of a user's favorite movies
export const getFavoriteIds = async (userId: string): Promise<number[]> => {
  const favoritesCol = collection(db, 'users', userId, 'favorites');
  const snapshot = await getDocs(favoritesCol);
  return snapshot.docs.map(doc => parseInt(doc.id));
};

// Gets the full movie objects for a user's favorites
export const getFavoriteMovies = async (userId: string) => {
  const favoritesCol = collection(db, 'users', userId, 'favorites');
  const snapshot = await getDocs(favoritesCol);
  return snapshot.docs.map(doc => doc.data());
};

// Adds a movie to a user's favorites
export const addFavorite = async (userId: string, movie: any) => {
  const movieRef = doc(db, 'users', userId, 'favorites', String(movie.id));
  await setDoc(movieRef, movie);
};

// Removes a movie from a user's favorites
export const removeFavorite = async (userId: string, movieId: number) => {
  const movieRef = doc(db, 'users', userId, 'favorites', String(movieId));
  await deleteDoc(movieRef);
};

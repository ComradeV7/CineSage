import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { MovieCard } from "../components/MovieCard";
import type { Movie } from "../types";
import { useBatchMovies } from "../hooks/useMovies";

export const FavoritesPage = () => {
  const { currentUser } = useAuth();
  const [localFavorites, setLocalFavorites] = useState<Movie[]>([]);
  const [missingIds, setMissingIds] = useState<number[]>([]);
  const [loadingFirestore, setLoadingFirestore] = useState(true);

  // 1. Listen to Firestore (Real-time)
  useEffect(() => {
    if (!currentUser) {
      setLoadingFirestore(false);
      return;
    }

    const unsub = onSnapshot(collection(db, "users", currentUser.uid, "favorites"), (snapshot) => {
      const docs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: Number(doc.id),
          title: data.title,
          poster_path: data.poster_path,
          overview: data.overview,
          release_date: data.release_date,
          vote_average: data.vote_average
        } as Movie;
      });

      setLocalFavorites(docs);

      // Check if any movies have missing data (e.g. only ID is stored)
      const incomplete = docs.filter(m => !m.title || !m.poster_path).map(m => m.id);
      if (incomplete.length > 0) {
        setMissingIds(incomplete);
      }

      setLoadingFirestore(false);
    });

    return () => unsub();
  }, [currentUser]);

  // 2. Fetch missing data in BATCH (The Improvement)
  // This automatically runs whenever 'missingIds' is updated
  const { data: fetchedMovies, isLoading: isLoadingBatch } = useBatchMovies(missingIds);

  // 3. Merge Local + Fetched Data
  const finalMovies = localFavorites.map(local => {
    // If this local movie was incomplete, try to find the full version in the batch results
    if (!local.title || !local.poster_path) {
      const found = fetchedMovies?.find((m: any) => m.id === local.id);
      if (found) return found;
    }
    return local;
  });

  if (loadingFirestore || (missingIds.length > 0 && isLoadingBatch)) {
    return <div className="status-message">Loading favorites...</div>;
  }

  return (
    <div className="favorites-page">
      <h1>My Favorites</h1>
      {finalMovies.length > 0 ? (
        <div className="movie-grid">
          {finalMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="status-message">
          You haven't added any movies to your favorites yet.
        </p>
      )}
    </div>
  );
};

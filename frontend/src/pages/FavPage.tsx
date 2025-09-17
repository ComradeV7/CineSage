import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";
import type { Movie } from "../types";
import { MovieCard } from "../components/MovieCard";

const TMDB_PROXY_BASE = "https://comradev7-movie-rec-api.hf.space/api/tmdb";

export const FavoritesPage = () => {
  const { currentUser } = useAuth();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setFavoriteMovies([]);
      setLoading(false);
      return;
    }

    const favsCollectionRef = collection(
      db,
      "users",
      currentUser.uid,
      "favorites"
    );

    // Listen for real-time updates
    const unsubscribe = onSnapshot(favsCollectionRef, async (snapshot) => {
      setLoading(true);
      const favIds = snapshot.docs.map((doc) => doc.id);
      const favDocs = snapshot.docs.map((doc) => doc.data());

      if (favIds.length === 0) {
        setFavoriteMovies([]);
        setLoading(false);
        return;
      }

      try {
        // Prefer Firestore-stored movie data immediately to avoid network stalls
        const initialMovies: Movie[] = favDocs.map(
          (data: any, index: number) => ({
            id: Number(favIds[index]),
            title: data?.title || "",
            poster_path: data?.poster_path || "",
            overview: data?.overview || "",
            release_date: data?.release_date || "",
            vote_average: String(data?.vote_average ?? ""),
          })
        );
        setFavoriteMovies(initialMovies);

        // If any items are missing key fields, fetch details with a short timeout
        const needFetch = initialMovies.filter(
          (m) => !m.title || !m.poster_path
        );
        if (needFetch.length > 0) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 7000);
          const moviePromises = needFetch.map((m) =>
            axios.get(`${TMDB_PROXY_BASE}/movie/${m.id}`, {
              signal: controller.signal,
            })
          );
          const movieResponses = await Promise.allSettled(moviePromises);
          clearTimeout(timeoutId);
          const byId: Record<number, Movie> = {};
          for (const m of initialMovies) byId[m.id] = m;
          movieResponses.forEach((res) => {
            if (res.status === "fulfilled") {
              const d = res.value.data;
              byId[d.id] = {
                id: d.id,
                title: d.title,
                poster_path: d.poster_path || "",
                overview: d.overview || "",
                release_date: d.release_date || "",
                vote_average: String(d.vote_average ?? ""),
              } as Movie;
            }
          });
          setFavoriteMovies(Object.values(byId));
        }
      } catch (e) {
        setFavoriteMovies([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [currentUser]);

  if (loading)
    return <div className="status-message">Loading favorites...</div>;

  return (
    <div className="favorites-page">
      <h1>My Favorites</h1>
      {favoriteMovies.length > 0 ? (
        <div className="movie-grid">
          {favoriteMovies.map((movie) => (
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

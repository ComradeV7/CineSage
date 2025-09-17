import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getFavoriteIds } from "../services/favService";
import { MovieCard } from "../components/MovieCard";
import { SkeletonCard } from "../components/SkeletonCard";
import { ErrorDisplay } from "../components/ErrorDisplay";
import type { Movie } from "../types";

// Backend POST endpoint for recommendations
const API_URL = "https://comradev7-movie-rec-api.hf.space/api/recommendations";

// Define a type for the recommendation objects we expect from the backend
type Recommendation = {
  tmdbId: number;
  title: string;
  score: number;
  type: "Collaborative" | "Content-Based";
};

export const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [detailsById, setDetailsById] = useState<
    Record<number, Partial<Movie>>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const TMDB_PROXY_BASE = "https://comradev7-movie-rec-api.hf.space/api/tmdb";

  useEffect(() => {
    const fetchRecs = async () => {
      if (!currentUser) {
        setLoading(false);
        setError("Please log in to see your recommendations.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // 1. Get the user's favorite movie IDs from Firebase
        const favoriteIds = await getFavoriteIds(currentUser.uid);

        if (favoriteIds.length === 0) {
          setError("Add some movies to your favorites to get recommendations!");
          setLoading(false);
          return;
        }

        // 2. Send these IDs to your live Python backend on Hugging Face
        // Allow tuning via query params
        const params = new URLSearchParams({
          limit: "35",
          alpha: "0.85", // favor content-based
          diversity_penalty: "0.55",
          cb_sim_weight: "0.65", // overview/theme
          cb_genre_weight: "0.2",
          cb_popularity_weight: "0.05",
          cb_recency_weight: "0.1", // stronger recency in content score
          blend_popularity_weight: "0.1",
          blend_recency_weight: "0.08", // slight recency in blend
        }).toString();
        const response = await axios.post(`${API_URL}?${params}`, {
          favorite_movie_ids: favoriteIds,
        });

        // 3. Store the results from the backend in state
        setRecommendations(response.data.recommendations || []);
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
        setError(
          "Sorry, we couldn't fetch your recommendations right now. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecs();
  }, [currentUser]);

  // Fetch TMDB details (poster_path, release_date, vote_average) for each recommended movie
  useEffect(() => {
    const fetchDetails = async () => {
      const idsToFetch = recommendations
        .map((r) => r.tmdbId)
        .filter((id) => !(id in detailsById));
      if (idsToFetch.length === 0) return;

      try {
        const requests = idsToFetch.map((id) =>
          axios.get(`${TMDB_PROXY_BASE}/movie/${id}`)
        );
        const responses = await Promise.allSettled(requests);
        const next: Record<number, Partial<Movie>> = { ...detailsById };
        responses.forEach((res, idx) => {
          const id = idsToFetch[idx];
          if (res.status === "fulfilled") {
            const data = res.value.data;
            next[id] = {
              poster_path: data.poster_path || "",
              release_date: data.release_date || "",
              vote_average: String(data.vote_average ?? ""),
              title: data.title,
              id,
              overview: data.overview || "",
            };
          }
        });
        setDetailsById(next);
      } catch {
        // ignore; placeholders will be shown
      }
    };

    if (recommendations.length > 0) {
      fetchDetails();
    }
  }, [recommendations, detailsById]);

  const [trending, setTrending] = useState<Movie[]>([]);

  // Fallback: fetch trending when recommendations are empty
  useEffect(() => {
    const loadTrending = async () => {
      if (recommendations.length > 0) return;
      try {
        const res = await axios.get(`${TMDB_PROXY_BASE}/trending/movie/week`);
        const items: Movie[] = (res.data.results || []).map((m: any) => ({
          id: m.id,
          title: m.title,
          poster_path: m.poster_path || "",
          overview: m.overview || "",
          release_date: m.release_date || "",
          vote_average: String(m.vote_average ?? ""),
        }));
        setTrending(items.slice(0, 20));
      } catch {
        // ignore
      }
    };
    loadTrending();
  }, [recommendations]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="movie-grid">
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return <ErrorDisplay message={error} />;
    }

    const moviesToDisplay: Movie[] = recommendations.map((rec) => ({
      id: rec.tmdbId,
      title: detailsById[rec.tmdbId]?.title || rec.title,
      poster_path: detailsById[rec.tmdbId]?.poster_path || "",
      overview:
        detailsById[rec.tmdbId]?.overview ||
        `Match Score: ${Math.round(rec.score * 100)}%`,
      release_date: detailsById[rec.tmdbId]?.release_date || "",
      vote_average: detailsById[rec.tmdbId]?.vote_average || "",
    }));

    // If no recs, show trending fallback
    if (recommendations.length === 0 && trending.length > 0) {
      return (
        <>
          <h2 className="recommendation-type-header">Trending now</h2>
          <div className="movie-grid">
            {trending.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        {recommendations.length > 0 && (
          <h2 className="recommendation-type-header">You also might like</h2>
        )}
        <div className="movie-grid">
          {moviesToDisplay.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="recommendations-page">
      <h1>For You</h1>
      {renderContent()}
    </div>
  );
};

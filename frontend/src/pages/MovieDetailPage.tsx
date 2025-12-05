import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { addFavorite, removeFavorite } from '../services/favService';
import type { MovieDetails } from "../types";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Update 1: Define your backend base URL (Centralize this later!)
// If developing locally, this might be http://localhost:5001/api
// In production, it's your Hugging Face URL.
const BACKEND_API_BASE = "https://comradev7-movie-rec-api.hf.space/api";

export const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  //State Management
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentUser } = useAuth();
  const { favoriteIds, toggleFavorite } = useFavorites(); // Use the hook

  const handleFavorite = () => {
    if (!currentUser || !movie) return;
    const isCurrentlyFavorite = favoriteIds.has(movie.id);

    if (isCurrentlyFavorite) {
      removeFavorite(currentUser.uid, movie.id);
    } else {
      addFavorite(currentUser.uid, movie);
    }
    toggleFavorite(movie); // Update local state instantly
  };

  //API CALL
  useEffect(() => {
    if (!id) return; // Don't do anything if there's no ID

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        // Update 2: Change the URL to point to YOUR backend
        // OLD: `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}...`
        // NEW:
        const API_URL = `${BACKEND_API_BASE}/movie/${id}`;
        const response = await axios.get<MovieDetails>(API_URL);
        setMovie(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch movie details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  //Condtional Rendering 
  if (loading) {
    return <div className="status-message">Loading details...</div>;
  }
  if (error) {
    return <div className="status-message error">{error}</div>;
  }
  if (!movie) {
    return <div className="status-message">Movie not found.</div>;
  }

  //WEBPAGE Rendering
  return (
    <div className="movie-detail-page">
      <Link to="/" className="back-link">Back to Home</Link>
      <div className="detail-container">
        <div className="poster">
            <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/500x750/333/FFF?text=No+Image'; }}
            />
        </div>
        <div className="info">
            <h1>{movie.title}</h1>
            {currentUser && (
                <button onClick={handleFavorite} className="favorite-btn">
                    {favoriteIds.has(movie.id) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                </button>
            )}
            {movie.tagline && <p className="tagline"><em>"{movie.tagline}"</em></p>}
            <div className="meta-info">
                <span>{movie.release_date}</span>
                <span>•</span>
                <span>{movie.runtime} min</span>
            </div>
            <div className="genres">
                {movie.genres.map(genre => <span key={genre.id} className="genre-tag">{genre.name}</span>)}
            </div>
            <h3>Overview</h3>
            <p>{movie.overview}</p>
            <div className="rating">
                Rating: {Number(movie.vote_average).toFixed(1)} / 10
            </div>
        </div>
      </div>
    </div>
  );
};

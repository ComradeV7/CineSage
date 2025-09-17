import { useState, useEffect } from "react";
import axios from "axios";
import type { Movie } from "../types";
import { useOutletContext } from "react-router-dom";
import { MovieCard } from "../components/MovieCard";
import { SkeletonCard } from "../components/SkeletonCard";
import { ErrorDisplay } from "../components/ErrorDisplay";

const TMDB_PROXY_BASE = "https://comradev7-movie-rec-api.hf.space/api/tmdb";
const API_URL_BASE = `${TMDB_PROXY_BASE}/movie/popular?language=en-US`;
const SEARCH_URL_BASE = `${TMDB_PROXY_BASE}/search/movie?language=en-US`;

type HomePageContext = { searchQuery: string };

export const HomePage = () => {
  //State Management
  const { searchQuery } = useOutletContext<HomePageContext>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1); //Page
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchMovies = async () => {
      const url = searchQuery
        ? `${SEARCH_URL_BASE}&query=${encodeURIComponent(
            searchQuery
          )}&page=${page}`
        : `${API_URL_BASE}&page=${page}`;
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const response = await axios.get(url);
        setMovies(response.data.results);
        setHasNextPage(page < response.data.total_pages);
        setError(null);
      } catch (err) {
        setError("Failed to fetch movies. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery, page]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(1, prevPage - 1));
  };

  //JSX Rendering
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="home-page">
      <h1>
        {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Movies"}
      </h1>

      {loading && (
        <div className="movie-grid">
          {/* Create an array of 10 items to map over for the skeletons */}
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {!loading && movies.length === 0 && (
        <div className="status-message">No movies found.</div>
      )}
      {!loading && movies.length > 0 && (
        <>
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/*Pagination Controls */}
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page}</span>
            <button onClick={handleNextPage} disabled={!hasNextPage}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

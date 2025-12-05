import { useQuery, keepPreviousData } from '@tanstack/react-query';
import axios from 'axios';
import type { MovieDetails } from '../types';

// Use your actual backend URL here
const BACKEND_API = "https://comradev7-movie-rec-api.hf.space/api";
// OR if testing locally: "http://127.0.0.1:5001/api"

// --- Fetcher Functions ---

const fetchPopularOrSearch = async (page: number, searchQuery: string) => {
    // Logic to switch between search and popular
    // Note: Ensure your app.py has these routes or proxies them! 
    // If you haven't centralized 'search' and 'popular' yet, you might need to updates those routes in app.py too.
    // Assuming standard TMDB proxy structure:
    const endpoint = searchQuery
        ? `/tmdb/search/movie`
        : `/tmdb/movie/popular`;

    const { data } = await axios.get(`${BACKEND_API}${endpoint}`, {
        params: { page, query: searchQuery }
    });
    return data;
};

const fetchMovieDetails = async (id: number) => {
    const { data } = await axios.get<MovieDetails>(`${BACKEND_API}/tmdb/movie/${id}`);
    return data;
};

const fetchBatchMovies = async (ids: number[]) => {
    const { data } = await axios.post(`${BACKEND_API}/movies/batch`, { movie_ids: ids });
    return data;
};

// --- Exported Hooks ---

export const useMoviesList = (page: number, searchQuery: string) => {
    return useQuery({
        queryKey: ['movies', page, searchQuery],
        queryFn: () => fetchPopularOrSearch(page, searchQuery),
        placeholderData: keepPreviousData, // Keeps UI stable during page switches
    });
};

export const useMovieDetails = (id: number | undefined) => {
    return useQuery({
        queryKey: ['movie', id],
        queryFn: () => fetchMovieDetails(id!),
        enabled: !!id, // Only run if ID is provided
    });
};

export const useBatchMovies = (ids: number[]) => {
    return useQuery({
        queryKey: ['movies', 'batch', ids],
        queryFn: () => fetchBatchMovies(ids),
        enabled: ids.length > 0,
        staleTime: 1000 * 60 * 10, // Keep favorite data fresh for 10 mins
    });
};

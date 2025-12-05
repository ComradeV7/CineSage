import { Link } from 'react-router-dom';
import type { Movie } from '../types';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER_IMAGE = 'https://placehold.co/500x750/222/FFF?text=No+Image';

type MovieCardProps = {
    movie: Movie;
};

export const MovieCard = ({ movie }: MovieCardProps) => {

    const imageUrl = movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : PLACEHOLDER_IMAGE;

    return (
        <Link to={`/movie/${movie.id}`} className="movie-card">
            <img
                src={imageUrl}
                alt={movie.title}
                onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_IMAGE;
                }}
            />
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <span>{movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</span>
            </div>
        </Link>

    );
};
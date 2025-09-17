export interface Movie {
    id : number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
    vote_average: string;
}

export interface MovieDetails extends Movie {
    genres: { id : number; name: string}[];
    runtime: number;
    tagline: string;
}
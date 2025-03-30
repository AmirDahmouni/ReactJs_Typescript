import React from "react";
import { MovieStatus, Movie, useMovies } from "../context/MovieContext";

const MovieItem: React.FC<{ movie: Movie }> = ({ movie }) => {
  const { updateMovie, deleteMovie } = useMovies();

  return (
    <li>
      <strong>{movie.title}</strong> ({movie.year}) - {movie.director} [{movie.status}]

      {movie.status !== MovieStatus.Watched && (
        <button onClick={() => updateMovie(movie.id, { status: MovieStatus.Watched })}>
          Mark Watched
        </button>
      )}

      <button
        onClick={() => {
          if (window.confirm(`Are you sure you want to delete "${movie.title}"?`)) {
            deleteMovie(movie.id);
          }
        }}
      >
        Delete
      </button>
    </li>
  );
};

export default MovieItem;

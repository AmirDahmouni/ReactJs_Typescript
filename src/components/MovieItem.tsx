import React, { useContext } from "react";
import { Movie } from "../types/movieType";
import { MovieContext } from "../context/MovieContext";

const MovieItem: React.FC<{ movie: Movie }> = ({ movie }) => {
  const movieCtx = useContext(MovieContext);
  if (!movieCtx) return null;

  return (
    <li>
      <strong>{movie.title}</strong> ({movie.year}) - {movie.director} [{movie.status}]
      <button onClick={() => movieCtx.updateMovie(movie.id, { status: "Watched" })}>Mark Watched</button>
      <button onClick={() => movieCtx.deleteMovie(movie.id)}>Delete</button>
    </li>
  );
};

export default MovieItem;

import React, { useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import MovieItem from "./MovieItem";

const MovieList: React.FC = () => {
  const movieCtx = useContext(MovieContext);
  if (!movieCtx) return null;

  return (
    <ul>
      {movieCtx.movies.map((movie) => (
        <MovieItem key={movie.id} movie={movie} />
      ))}
    </ul>
  );
};

export default MovieList;

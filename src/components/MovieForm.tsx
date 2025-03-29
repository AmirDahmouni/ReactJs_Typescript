import React, { useState, useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import { NewMovie, MovieStatus } from "../types/movieType";

const MovieForm: React.FC = () => {
  const movieCtx = useContext(MovieContext);
  if (!movieCtx) return null;

  const { addMovie } = movieCtx;

  const [movie, setMovie] = useState<NewMovie>({
    title: "",
    director: "",
    year: new Date().getFullYear(),
    status: MovieStatus.Unwatched,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMovie(movie);
    setMovie({ title: "", director: "", year: new Date().getFullYear(), status: MovieStatus.Unwatched });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Movie Title" value={movie.title} onChange={handleChange} required />
      <input name="director" placeholder="Director" value={movie.director} onChange={handleChange} required />
      <input type="number" name="year" value={movie.year} onChange={handleChange} required />
      <select name="status" value={movie.status} onChange={handleChange}>
        {Object.values(MovieStatus).map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <button type="submit">Add Movie</button>
    </form>
  );
};

export default MovieForm;

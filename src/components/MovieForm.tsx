import React, { useState } from "react";
import { useMovies, NewMovie, MovieStatus } from "../context/MovieContext";

const MovieForm: React.FC = () => {
  const { addMovie } = useMovies();

  const [movie, setMovie] = useState<NewMovie>({
    title: "",
    director: "",
    year: new Date().getFullYear(),
    status: MovieStatus.Unwatched,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setMovie((prev) => ({
      ...prev,
      [name]: name === "year" ? Number(value) || new Date().getFullYear() : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!movie.title.trim() || !movie.director.trim()) {
      alert("Title and Director fields cannot be empty!");
      return;
    }

    if (movie.year < 1900 || movie.year > new Date().getFullYear()) {
      alert("Please enter a valid year.");
      return;
    }

    addMovie({ ...movie, title: movie.title.trim(), director: movie.director.trim() });

    setMovie({ title: "", director: "", year: new Date().getFullYear(), status: MovieStatus.Unwatched });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Movie Title"
        value={movie.title}
        onChange={handleChange}
        required
      />
      <input
        name="director"
        placeholder="Director"
        value={movie.director}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="year"
        value={movie.year}
        onChange={handleChange}
        min="1900"
        max={new Date().getFullYear()}
        required
      />
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

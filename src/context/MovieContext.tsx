import React, { createContext, useState, ReactNode } from "react";
import { Movie, NewMovie, MovieStatus } from "../types/movieType";

interface MovieContextType {
  movies: Movie[];
  addMovie: (movie: NewMovie) => void;
  updateMovie: (id: number, data: Partial<Movie>) => void;
  deleteMovie: (id: number) => void;
}

export const MovieContext = createContext<MovieContextType | null>(null);

const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010, status: MovieStatus.Watched },
  ]);

  // Create movie
  const addMovie = (movie: NewMovie) => {
    setMovies([...movies, { id: Date.now(), ...movie }]);
  };

  // Update movie
  const updateMovie = (id: number, data: Partial<Movie>) => {
    setMovies(movies.map((m) => (m.id === id ? { ...m, ...data } : m)));
  };

  // Delete movie
  const deleteMovie = (id: number) => {
    setMovies(movies.filter((m) => m.id !== id));
  };

  return (
    <MovieContext.Provider value={{ movies, addMovie, updateMovie, deleteMovie }}>
      {children}
    </MovieContext.Provider>
  );
};

export default MovieProvider;

import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

// Movie Status Enum
export enum MovieStatus {
  Watched = "Watched",
  Unwatched = "Unwatched",
}

// Movie Type Definitions
export interface Movie {
  readonly id: number;
  title: string;
  director: string;
  year: number;
  status: MovieStatus;
}

export type NewMovie = Omit<Movie, "id">;

// Context Type
interface MovieContextType {
  movies: Movie[];
  addMovie: (movie: NewMovie) => void;
  updateMovie: (id: number, data: Partial<Movie>) => void;
  deleteMovie: (id: number) => void;
}

// Create Context
const MovieContext = createContext<MovieContextType | null>(null);

// MovieProvider Component
const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>(() => {
    const storedMovies = localStorage.getItem("movies");
    return storedMovies ? JSON.parse(storedMovies) : [];
  });

  // Persist movies in local storage
  useEffect(() => {
    localStorage.setItem("movies", JSON.stringify(movies));
  }, [movies]);

  // Create movie
  const addMovie = (movie: NewMovie) => {
    if (movies.some((m) => m.title.toLowerCase() === movie.title.toLowerCase())) {
      alert("This movie is already in the list.");
      return;
    }
    setMovies([...movies, { id: Date.now(), ...movie }]);
  };

  // Update movie
  const updateMovie = (id: number, data: Partial<Movie>) => {
    setMovies((prevMovies) =>
      prevMovies.map((m) => (m.id === id ? { ...m, ...data } : m))
    );
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

// Custom Hook for MovieContext
export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) throw new Error("useMovies must be used within a MovieProvider");
  return context;
};

export { MovieContext, MovieProvider };

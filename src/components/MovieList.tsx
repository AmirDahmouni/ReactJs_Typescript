import React, { useState } from "react";
import MovieItem from "./MovieItem";
import { useMovies, MovieStatus } from "../context/MovieContext";

const MovieList: React.FC = () => {
  const { movies } = useMovies();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<MovieStatus | "All">("All");
  const [sortOrder, setSortOrder] = useState<"Newest" | "Oldest">("Newest");

  // 🔎 Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // 📋 Filter & Sort movies dynamically
  const filteredMovies = movies
    .filter((movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((movie) => (filter === "All" ? true : movie.status === filter))
    .sort((a, b) =>
      sortOrder === "Newest" ? b.year - a.year : a.year - b.year
    );

  return (
    <div>
      <h2>🎥 Your Movie List</h2>

      {/* 🔎 Search & Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={handleSearch}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
          <option value="All">All</option>
          <option value={MovieStatus.Watched}>Watched</option>
          <option value={MovieStatus.Unwatched}>Unwatched</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)}>
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
        </select>
      </div>

      {/* 🎬 Render Movies */}
      {filteredMovies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <ul>
          {filteredMovies.map((movie) => (
            <MovieItem key={movie.id} movie={movie} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MovieList;

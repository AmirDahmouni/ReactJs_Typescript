import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MovieList from "../components/MovieList";
import { MovieStatus } from "../context/MovieContext";

// Mock useMovies hook to control movies data
jest.mock("../context/MovieContext", () => ({
  useMovies: () => ({
    movies: [
      {
        id: 1,
        title: "Inception",
        director: "Christopher Nolan",
        year: 2010,
        status: MovieStatus.Watched,
      },
      {
        id: 2,
        title: "Interstellar",
        director: "Christopher Nolan",
        year: 2014,
        status: MovieStatus.Unwatched,
      },
      {
        id: 3,
        title: "Dunkirk",
        director: "Christopher Nolan",
        year: 2017,
        status: MovieStatus.Unwatched,
      },
    ],
  }),
  MovieStatus: {
    Watched: "Watched",
    Unwatched: "Unwatched",
  },
}));

// Mock the MovieItem component for simplicity
jest.mock("./MovieItem", () => ({ movie }: { movie: any }) => (
  <li data-testid="movie-item">{movie.title}</li>
));

describe("MovieList Component", () => {
  test("renders header and control inputs", () => {
    render(<MovieList />);

    expect(screen.getByText(/your movie list/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search movies/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("All")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Newest")).toBeInTheDocument();
  });

  test("renders a list of movies", () => {
    render(<MovieList />);
    // We expect 3 movie items from the mocked context
    const movieItems = screen.getAllByTestId("movie-item");
    expect(movieItems).toHaveLength(3);
    expect(movieItems[0]).toHaveTextContent("Inception");
    expect(movieItems[1]).toHaveTextContent("Interstellar");
    expect(movieItems[2]).toHaveTextContent("Dunkirk");
  });

  test("filters movies by search input", () => {
    render(<MovieList />);
    const searchInput = screen.getByPlaceholderText(/search movies/i);

    // Type a query that should only match one movie
    fireEvent.change(searchInput, { target: { value: "inception" } });
    const movieItems = screen.getAllByTestId("movie-item");
    expect(movieItems).toHaveLength(1);
    expect(movieItems[0]).toHaveTextContent("Inception");

    // Type a query that matches no movies
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });
    expect(screen.queryByTestId("movie-item")).toBeNull();
    expect(screen.getByText(/no movies found/i)).toBeInTheDocument();
  });

  test("filters movies by status", () => {
    render(<MovieList />);
    const filterSelect = screen.getByDisplayValue("All");

    // Select Watched movies only
    fireEvent.change(filterSelect, { target: { value: MovieStatus.Watched } });
    const movieItems = screen.getAllByTestId("movie-item");
    expect(movieItems).toHaveLength(1);
    expect(movieItems[0]).toHaveTextContent("Inception");

    // Select Unwatched movies only
    fireEvent.change(filterSelect, { target: { value: MovieStatus.Unwatched } });
    const unwatchedItems = screen.getAllByTestId("movie-item");
    expect(unwatchedItems).toHaveLength(2);
    expect(unwatchedItems[0]).toHaveTextContent("Interstellar");
    expect(unwatchedItems[1]).toHaveTextContent("Dunkirk");
  });

  test("sorts movies by year", () => {
    render(<MovieList />);
    const sortSelect = screen.getByDisplayValue("Newest");

    // Check initial sort order ("Newest" should sort descending by year)
    let movieItems = screen.getAllByTestId("movie-item");
    // Expected order: Dunkirk (2017), Interstellar (2014), Inception (2010)
    expect(movieItems[0]).toHaveTextContent("Dunkirk");
    expect(movieItems[1]).toHaveTextContent("Interstellar");
    expect(movieItems[2]).toHaveTextContent("Inception");

    // Change sort order to "Oldest"
    fireEvent.change(sortSelect, { target: { value: "Oldest" } });
    movieItems = screen.getAllByTestId("movie-item");
    // Expected order: Inception (2010), Interstellar (2014), Dunkirk (2017)
    expect(movieItems[0]).toHaveTextContent("Inception");
    expect(movieItems[1]).toHaveTextContent("Interstellar");
    expect(movieItems[2]).toHaveTextContent("Dunkirk");
  });
});

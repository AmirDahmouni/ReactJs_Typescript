import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MovieItem from "../components/MovieItem";
import { Movie, MovieStatus, useMovies } from "../context/MovieContext";

jest.mock("../context/MovieContext", () => ({
  useMovies: jest.fn(),
  MovieStatus: {
    Watched: "Watched",
    Unwatched: "Unwatched",
  },
}));

describe("MovieItem Component", () => {
  let updateMovieMock: jest.Mock;
  let deleteMovieMock: jest.Mock;

  // Set up the mock functions and override window.confirm
  beforeEach(() => {
    updateMovieMock = jest.fn();
    deleteMovieMock = jest.fn();
    (useMovies as jest.Mock).mockReturnValue({
      updateMovie: updateMovieMock,
      deleteMovie: deleteMovieMock,
    });
    jest.spyOn(window, "confirm").mockImplementation(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const movie: Movie = {
    id: 1,
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
    status: MovieStatus.Unwatched,
  };

  test("renders movie details correctly", () => {
    render(<MovieItem movie={movie} />);
    expect(screen.getByText(/Inception/i)).toBeInTheDocument();
    expect(screen.getByText(/Christopher Nolan/i)).toBeInTheDocument();
    expect(screen.getByText(/\(2010\)/i)).toBeInTheDocument();
    expect(screen.getByText(/\[Unwatched\]/i)).toBeInTheDocument();
  });

  test('displays "Mark Watched" button if the movie is not watched', () => {
    render(<MovieItem movie={movie} />);
    expect(screen.getByRole("button", { name: /mark watched/i })).toBeInTheDocument();
  });

  test('does not display "Mark Watched" button if the movie is already watched', () => {
    const watchedMovie: Movie = { ...movie, status: MovieStatus.Watched };
    render(<MovieItem movie={watchedMovie} />);
    expect(screen.queryByRole("button", { name: /mark watched/i })).toBeNull();
  });

  test('calls updateMovie with correct arguments when "Mark Watched" button is clicked', async () => {
    render(<MovieItem movie={movie} />);
    userEvent.click(screen.getByRole("button", { name: /mark watched/i }));
    await waitFor(() => {
      expect(updateMovieMock).toHaveBeenCalledWith(movie.id, { status: MovieStatus.Watched });
    });
  });

  test('calls deleteMovie when "Delete" button is clicked and user confirms', async () => {
    render(<MovieItem movie={movie} />);
    userEvent.click(screen.getByRole("button", { name: /delete/i }));
    await waitFor(() => {
      expect(deleteMovieMock).toHaveBeenCalledWith(movie.id);
    });
  });

  test('does not call deleteMovie when "Delete" button is clicked and user cancels', async () => {
    // Override window.confirm to simulate user canceling the confirmation
    (window.confirm as jest.Mock).mockImplementationOnce(() => false);
    render(<MovieItem movie={movie} />);
    userEvent.click(screen.getByRole("button", { name: /delete/i }));
    await waitFor(() => {
      expect(deleteMovieMock).not.toHaveBeenCalled();
    });
  });
});

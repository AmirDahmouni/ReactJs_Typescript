import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MovieForm from "../components/MovieForm";
import { MovieStatus } from "../types/movieType";
import { useMovies } from "../context/MovieContext";
import userEvent from "@testing-library/user-event";

// Mock the useMovies context hook
jest.mock("../context/MovieContext", () => ({
  useMovies: jest.fn(),
}));

describe("MovieForm Component", () => {
  let addMovieMock: jest.Mock;

  beforeEach(() => {
    addMovieMock = jest.fn();

    // Mock the context provider with a mock addMovie function
    (useMovies as jest.Mock).mockReturnValue({
      addMovie: addMovieMock,
    });
  });

  test("renders form correctly", () => {
    render(<MovieForm />);

    expect(screen.getByPlaceholderText(/movie title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/director/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add movie/i })).toBeInTheDocument();
  });

  test("should call addMovie with correct data on submit", async () => {
    render(<MovieForm />);

    // Input movie title, director, and year
    userEvent.type(screen.getByPlaceholderText(/movie title/i), "Inception");
    userEvent.type(screen.getByPlaceholderText(/director/i), "Christopher Nolan");
    userEvent.type(screen.getByLabelText(/year/i), "2010");

    // Submit form
    userEvent.click(screen.getByRole("button", { name: /add movie/i }));

    await waitFor(() => {
      expect(addMovieMock).toHaveBeenCalledTimes(1);
      expect(addMovieMock).toHaveBeenCalledWith({
        title: "Inception",
        director: "Christopher Nolan",
        year: 2010,
        status: MovieStatus.Unwatched,
      });
    });
  });

  test("should show alert if title or director is empty", async () => {
    render(<MovieForm />);

    userEvent.click(screen.getByRole("button", { name: /add movie/i }));

    // Expecting an alert to be shown because fields are empty
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Title and Director fields cannot be empty!");
    });
  });

  test("should show alert if year is invalid", async () => {
    render(<MovieForm />);

    // Input invalid year (less than 1900)
    userEvent.type(screen.getByLabelText(/year/i), "1800");
    userEvent.click(screen.getByRole("button", { name: /add movie/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please enter a valid year.");
    });
  });

  test("should reset form after successful submit", async () => {
    render(<MovieForm />);

    // Input movie details
    userEvent.type(screen.getByPlaceholderText(/movie title/i), "Interstellar");
    userEvent.type(screen.getByPlaceholderText(/director/i), "Christopher Nolan");
    userEvent.type(screen.getByLabelText(/year/i), "2014");

    // Submit form
    userEvent.click(screen.getByRole("button", { name: /add movie/i }));

    await waitFor(() => {
      expect(addMovieMock).toHaveBeenCalledTimes(1);
    });

    // After successful submit, check that the form is reset
    expect(screen.getByPlaceholderText(/movie title/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/director/i)).toHaveValue("");
    expect(screen.getByLabelText(/year/i)).toHaveValue(new Date().getFullYear());
    expect(screen.getByRole("button", { name: /add movie/i })).toBeInTheDocument();
  });
});

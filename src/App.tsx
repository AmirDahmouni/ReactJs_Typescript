import React from "react";
import MovieProvider from "./context/MovieContext";
import MovieForm from "./components/MovieForm";
import MovieList from "./components/MovieList";

const App: React.FC = () => {
  return (
    <MovieProvider>
      <h1>🎬 Movie To-Do List</h1>
      <MovieForm />
      <MovieList />
    </MovieProvider>
  );
};

export default App;

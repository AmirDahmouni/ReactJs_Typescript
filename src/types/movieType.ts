export enum MovieStatus {
  Watched = "Watched",
  Unwatched = "Unwatched",
}

export interface Movie {
  id: number;
  title: string;
  director: string;
  year: number;
  status: MovieStatus;
}

export type NewMovie = Omit<Movie, "id">;
export type UpdateMovie = Partial<Movie>;

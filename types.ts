
export interface StreamingPlatform {
  name: string;
  url: string;
  logoPath: string;
}

export interface UserReview {
  username: string;
  date: string;
  comment: string;
}

export interface Movie {
  title: string;
  year: number;
  director: string;
  actors: string[];
  tmdbRating: number;
  plotSummary: string;
  userReviews: UserReview[];
  streamingLinks: StreamingPlatform[];
  posterPath: string | null;
}

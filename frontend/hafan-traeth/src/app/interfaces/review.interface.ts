export interface Review {
  name: string;
  location: string;
  rating: number;
  title: string;
  text: string;
  date: Date;
  avatar?: string;
  expanded?: boolean;
  highlights?: { icon: string; text: string; }[];
}

export interface RatingCategory {
  name: string;
  score: number;
}
export interface GalleryImage {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  alt: string;
  category: string;
}

export interface Category {
  key: string;
  name: string;
  icon: string;
  count: number;
}
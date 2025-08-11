export interface MapLocation {
  name: string;
  location: { lat: number; lng: number };
  type: string;
  description: string;
  icon: string;
  links?: MapLocationLink[];
  website?: string;
}

export interface MapLocationLink {
  text: string;
  url: string | undefined;
  type: 'pdf' | 'external';
}

export interface AttractionCategory {
  name: string;
  icon: string;
  attractions: MapLocation[];
}
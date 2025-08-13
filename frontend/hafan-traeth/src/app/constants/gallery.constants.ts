import { GalleryImage, Category } from '../interfaces/gallery.interface';

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 1,
    title: 'Master Bedroom',
    description: 'Comfortable King-size master bedroom with quality furnishings',
    url: 'img/GalleryImages/1.jpg',
    thumbnail: 'img/GalleryImages/1.jpg',
    alt: 'Master bedroom with comfortable bedding',
    category: 'interior'
  },
  {
    id: 2,
    title: 'Bathroom',
    description: 'Modern bathroom with all amenities',
    url: 'img/GalleryImages/2.jpg',
    thumbnail: 'img/GalleryImages/2.jpg',
    alt: 'Clean modern bathroom',
    category: 'interior'
  },
  {
    id: 3,
    title: 'Living Room',
    description: 'Spacious living area perfect for relaxation',
    url: 'img/GalleryImages/3.jpg',
    thumbnail: 'img/GalleryImages/3.jpg',
    alt: 'Comfortable living room',
    category: 'interior'
  },
  {
    id: 4,
    title: 'Kitchen',
    description: 'Fully equipped kitchen for all your cooking needs',
    url: 'img/GalleryImages/4.jpg',
    thumbnail: 'img/GalleryImages/4.jpg',
    alt: 'Well-appointed kitchen',
    category: 'interior'
  },
  {
    id: 5,
    title: 'Garden',
    description: 'Private garden space for outdoor relaxation',
    url: 'img/GalleryImages/5.jpg',
    thumbnail: 'img/GalleryImages/5.jpg',
    alt: 'Peaceful garden area',
    category: 'exterior'
  },
  {
    id: 6,
    title: 'Master Bedroom',
    description: 'Another view of the master bedroom',
    url: 'img/GalleryImages/6.jpg',
    thumbnail: 'img/GalleryImages/6.jpg',
    alt: 'Master bedroom alternative view',
    category: 'interior'
  },
  {
    id: 8,
    title: 'Shower',
    description: 'Modern shower facilities in the bathroom',
    url: 'img/GalleryImages/8.jpg',
    thumbnail: 'img/GalleryImages/8.jpg',
    alt: 'Shower in bathroom',
    category: 'interior'
  },
  {
    id: 9,
    title: 'Front Garden View',
    description: 'View of Prestatyn Hillside from the front garden of the property',
    url: 'img/GalleryImages/9.jpg',
    thumbnail: 'img/GalleryImages/9.jpg',
    alt: 'View from front garden',
    category: 'views'
  },
  {
    id: 10,
    title: 'Living Room',
    description: 'Another perspective of the relaxing living space',
    url: 'img/GalleryImages/10.jpg',
    thumbnail: 'img/GalleryImages/10.jpg',
    alt: 'Living room different angle',
    category: 'interior'
  },
  {
    id: 11,
    title: 'Living Room',
    description: 'Additional view of the comfortable living area',
    url: 'img/GalleryImages/11.jpg',
    thumbnail: 'img/GalleryImages/11.jpg',
    alt: 'Living room third view',
    category: 'interior'
  },
  {
    id: 12,
    title: 'Front of House',
    description: 'Exterior view showing the front of Hafan Traeth',
    url: 'img/GalleryImages/12.jpg',
    thumbnail: 'img/GalleryImages/12.jpg',
    alt: 'Front exterior of property',
    category: 'exterior'
  },
  {
    id: 13,
    title: 'Second Bedroom',
    description: 'Second bedroom with two single beds',
    url: 'img/GalleryImages/13.jpg',
    thumbnail: 'img/GalleryImages/13.jpg',
    alt: 'Second bedroom with twin beds',
    category: 'interior'
  },
  {
    id: 14,
    title: 'Entrance Hallway',
    description: 'Welcoming entrance hallway with fold-out sofabed',
    url: 'img/GalleryImages/14.jpg',
    thumbnail: 'img/GalleryImages/14.jpg',
    alt: 'Entrance hall',
    category: 'interior'
  },
  {
    id: 15,
    title: 'Entrance Hallway',
    description: 'Another view of the entrance hallway',
    url: 'img/GalleryImages/15.jpg',
    thumbnail: 'img/GalleryImages/15.jpg',
    alt: 'Entrance hallway alternative view',
    category: 'interior'
  },
  {
    id: 16,
    title: 'Kitchen',
    description: 'Additional view of the well-equipped kitchen',
    url: 'img/GalleryImages/16.jpg',
    thumbnail: 'img/GalleryImages/16.jpg',
    alt: 'Kitchen different perspective',
    category: 'interior'
  },
  {
    id: 17,
    title: 'Garden Eating Area',
    description: 'Outdoor dining space in the garden',
    url: 'img/GalleryImages/17.jpg',
    thumbnail: 'img/GalleryImages/17.jpg',
    alt: 'Garden dining area',
    category: 'exterior'
  }
];

export const GALLERY_CATEGORIES: Category[] = [
  { key: 'all', name: 'All Photos', icon: 'fas fa-camera', count: 0 },
  { key: 'interior', name: 'Interior', icon: 'fas fa-home', count: 0 },
  { key: 'exterior', name: 'Exterior', icon: 'fas fa-tree', count: 0 },
  { key: 'views', name: 'Views', icon: 'fas fa-mountain', count: 0 }
];
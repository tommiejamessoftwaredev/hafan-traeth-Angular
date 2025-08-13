import { Review, RatingCategory } from '../interfaces/review.interface';

export const GUEST_REVIEWS: Review[] = [
  {
    name: 'David',
    location: 'United Kingdom',
    rating: 10.0,
    title: 'Cleanliness of the house it\'s location all on one level WiFi',
    text: 'Cleanliness of the house it\'s location all on one level WiFi',
    date: new Date('2025-08-08'),
    highlights: [
      { icon: 'fas fa-broom', text: 'Spotlessly clean' },
      { icon: 'fas fa-home', text: 'Single level' },
      { icon: 'fas fa-wifi', text: 'Great WiFi' }
    ]
  },
  {
    name: 'Lottiedot',
    location: 'United Kingdom',
    rating: 10.0,
    title: 'Comfortable clean bungalow, loved all the little extra touches',
    text: 'Comfortable clean bungalow, loved all the little extra touches like welcome basket, towels, toiletries, dog biscuits. Good communication from owners and value for money. Will definitely stay again',
    date: new Date('2025-08-01'),
    highlights: [
      { icon: 'fas fa-gift', text: 'Welcome basket' },
      { icon: 'fas fa-dog', text: 'Dog friendly' },
      { icon: 'fas fa-comments', text: 'Great communication' }
    ]
  },
  {
    name: 'Mulhaney',
    location: 'United Kingdom',
    rating: 9.0,
    title: 'Good location and comfortable stay',
    text: 'Clean, comfortable bungalow. Excellent communication.',
    date: new Date('2025-07-26'),
    highlights: [
      { icon: 'fas fa-map-marker-alt', text: 'Great location' },
      { icon: 'fas fa-bed', text: 'Comfortable' },
      { icon: 'fas fa-phone', text: 'Excellent communication' }
    ]
  },
  {
    name: 'Margaret',
    location: 'United Kingdom',
    rating: 10.0,
    title: 'Perfect location. Nice clean, comfortable, near the cycle track',
    text: 'Perfect location. Nice clean, comfortable, near the cycle track.',
    date: new Date('2025-07-20'),
    highlights: [
      { icon: 'fas fa-bicycle', text: 'Near cycle track' },
      { icon: 'fas fa-broom', text: 'Clean' },
      { icon: 'fas fa-map-marker-alt', text: 'Perfect location' }
    ]
  },
  {
    name: 'Kathleen',
    location: 'United Kingdom',
    rating: 10.0,
    title: 'We had a lovely comfy short break which was just what we wanted',
    text: 'Really comfy & well equipped bungalow. Great location & walking distance to the sea.',
    date: new Date('2025-07-09'),
    highlights: [
      { icon: 'fas fa-couch', text: 'Very comfortable' },
      { icon: 'fas fa-tools', text: 'Well equipped' },
      { icon: 'fas fa-walking', text: 'Walk to sea' }
    ]
  },
  {
    name: 'David',
    location: 'United Kingdom',
    rating: 10.0,
    title: 'Relaxing peaceful shops near by pub walking distance',
    text: 'The location is excellent, beach was easy to reach, dog friendly, excellent facilities, great wifi, host was excellent, have stayed before, will be staying again thank you',
    date: new Date('2025-07-07'),
    highlights: [
      { icon: 'fas fa-umbrella-beach', text: 'Easy beach access' },
      { icon: 'fas fa-dog', text: 'Dog friendly' },
      { icon: 'fas fa-redo', text: 'Repeat guest' }
    ]
  },
  {
    name: 'Nicola',
    location: 'United Kingdom',
    rating: 10.0,
    title: 'Fabulous - We\'ve stayed before and love this bungalow',
    text: 'We\'ve stayed before and love this bungalow. Clean and well maintained, everything we need and close to the beach',
    date: new Date('2025-06-14'),
    highlights: [
      { icon: 'fas fa-heart', text: 'Love this place' },
      { icon: 'fas fa-redo', text: 'Repeat guest' },
      { icon: 'fas fa-umbrella-beach', text: 'Close to beach' }
    ]
  },
  {
    name: 'Leah',
    location: 'United Kingdom',
    rating: 10.0,
    title: 'Lovely Family Break',
    text: 'The place is so clean and comfortable. Love the decking that has been added to the garden. The little touches like jams and tea were so thoughtful. The beds were really comfortable and the shower pressure was amazing. We will definitely be coming back.',
    date: new Date('2025-06-14'),
    highlights: [
      { icon: 'fas fa-home-lg-alt', text: 'Garden decking' },
      { icon: 'fas fa-gift', text: 'Thoughtful touches' },
      { icon: 'fas fa-shower', text: 'Amazing shower' }
    ]
  }
];

export const RATING_CATEGORIES: RatingCategory[] = [
  { name: 'Cleanliness', score: 10.0 },
  { name: 'Location', score: 10.0 },
  { name: 'Communication', score: 10.0 },
  { name: 'Value for money', score: 9.8 },
  { name: 'Comfort', score: 10.0 },
  { name: 'Facilities', score: 9.9 }
];

export const OVERALL_RATING = 9.9;
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService, AppConfig } from '../../services/config.service';

interface Review {
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

interface RatingCategory {
  name: string;
  score: number;
}

@Component({
  selector: 'app-guest-reviews',
  imports: [CommonModule],
  templateUrl: './guest-reviews.component.html',
  styleUrl: './guest-reviews.component.scss'
})
export class GuestReviewsComponent implements OnInit {
  config: AppConfig | null = null;
  overallRating = 9.7;

  reviews: Review[] = [
    {
      name: 'Sarah Johnson',
      location: 'Manchester, UK',
      rating: 5.0,
      title: 'Perfect coastal getaway!',
      text: 'Hafan Traeth exceeded all our expectations. The property was spotlessly clean, beautifully decorated, and just a 2-minute walk from the gorgeous Ffrith Beach. The hosts were incredibly welcoming and provided everything we needed for a perfect family holiday. The kitchen was fully equipped, the WiFi was excellent for remote work, and the private garden was perfect for morning coffee. We will definitely be returning!',
      date: new Date('2024-11-15'),
      highlights: [
        { icon: 'fas fa-umbrella-beach', text: 'Beach proximity' },
        { icon: 'fas fa-home', text: 'Beautiful property' },
        { icon: 'fas fa-users', text: 'Family friendly' }
      ]
    },
    {
      name: 'David Williams',
      location: 'Birmingham, UK',
      rating: 5.0,
      title: 'Outstanding hospitality',
      text: 'Kerie and her family have created something truly special at Hafan Traeth. From the self check-in process to the thoughtful touches throughout the property, everything was perfect. The location is unbeatable - you can hear the waves from the garden! The property was recently refurbished and it shows in every detail. Highly recommended for couples or families.',
      date: new Date('2024-10-28'),
      highlights: [
        { icon: 'fas fa-star', text: 'Exceptional hosts' },
        { icon: 'fas fa-water', text: 'Ocean views' },
        { icon: 'fas fa-key', text: 'Easy check-in' }
      ]
    },
    {
      name: 'Emma Thompson',
      location: 'London, UK',
      rating: 4.8,
      title: 'Lovely Welsh retreat',
      text: 'We had a wonderful week at Hafan Traeth. The property is exactly as described - clean, comfortable, and perfectly located for exploring the Welsh coast. The master bedroom was spacious and comfortable, and having a washing machine made our extended stay much more convenient. The local pub within walking distance was a nice bonus for evening meals.',
      date: new Date('2024-10-10'),
      highlights: [
        { icon: 'fas fa-mountain', text: 'Great location' },
        { icon: 'fas fa-bed', text: 'Comfortable beds' },
        { icon: 'fas fa-glass-cheers', text: 'Local amenities' }
      ]
    },
    {
      name: 'Michael Brown',
      location: 'Liverpool, UK',
      rating: 5.0,
      title: 'Dog-friendly paradise',
      text: 'As dog owners, we were delighted to find such a welcoming property. Our small dog was made to feel at home, and the enclosed garden was perfect for morning runs. The beach is literally on your doorstep, and the coastal walks are spectacular. The property itself is modern, clean, and has everything you need. The hosts even provided dog waste bags - such thoughtful touches!',
      date: new Date('2024-09-22'),
      highlights: [
        { icon: 'fas fa-dog', text: 'Dog friendly' },
        { icon: 'fas fa-tree', text: 'Private garden' },
        { icon: 'fas fa-walking', text: 'Coastal walks' }
      ]
    },
    {
      name: 'Lisa Davies',
      location: 'Cardiff, UK',
      rating: 4.9,
      title: 'Perfect for families',
      text: 'Hafan Traeth was ideal for our family of four plus baby. The sofa bed in the porch area was surprisingly comfortable, and having all bedding and towels provided made packing so much easier. The beach is incredibly close - perfect for daily trips with the children. The property felt safe and secure, and the hosts were always available when needed.',
      date: new Date('2024-09-05'),
      highlights: [
        { icon: 'fas fa-baby', text: 'Baby friendly' },
        { icon: 'fas fa-concierge-bell', text: 'All amenities provided' },
        { icon: 'fas fa-lock', text: 'Safe and secure' }
      ]
    }
  ];

  ratingCategories: RatingCategory[] = [
    { name: 'Cleanliness', score: 9.8 },
    { name: 'Location', score: 9.9 },
    { name: 'Check-in', score: 9.7 },
    { name: 'Value for money', score: 9.5 },
    { name: 'Communication', score: 9.8 },
    { name: 'Facilities', score: 9.6 }
  ];

  bookingComReviewsUrl = '';
  airbnbReviewsUrl = '';

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.configService.getConfig().subscribe(config => {
      this.config = config;
      this.bookingComReviewsUrl = config.bookingComReviewsUrl;
      this.airbnbReviewsUrl = config.airbnbReviewsUrl;
    });
  }

  getStarsArray(rating: number) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push({ icon: 'fas fa-star', class: 'full' });
    }
    
    if (hasHalfStar) {
      stars.push({ icon: 'fas fa-star-half-alt', class: 'half' });
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push({ icon: 'far fa-star', class: 'empty' });
    }
    
    return stars;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}

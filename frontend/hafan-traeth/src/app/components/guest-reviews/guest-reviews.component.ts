import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../services/config.service';
import { AppConfig } from '../../interfaces/config.interface';
import { Review, RatingCategory } from '../../interfaces/review.interface';
import { GUEST_REVIEWS, RATING_CATEGORIES, OVERALL_RATING } from '../../constants/reviews.constants';


@Component({
  selector: 'app-guest-reviews',
  imports: [CommonModule],
  templateUrl: './guest-reviews.component.html',
  styleUrl: './guest-reviews.component.scss'
})
export class GuestReviewsComponent implements OnInit {
  config: AppConfig | null = null;
  overallRating = OVERALL_RATING;
  reviews: Review[] = GUEST_REVIEWS;
  ratingCategories: RatingCategory[] = RATING_CATEGORIES;

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
    // Scale rating from 0-10 to 0-5 for star display
    const scaledRating = rating / 2;
    const fullStars = Math.floor(scaledRating);
    const hasHalfStar = scaledRating % 1 !== 0;
    
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

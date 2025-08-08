import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AvailabilityCalendarComponent } from './components/availability-calendar/availability-calendar.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { PropertyGalleryComponent } from './components/property-gallery/property-gallery.component';
import { GuestReviewsComponent } from './components/guest-reviews/guest-reviews.component';
import { AmenitiesListComponent } from './components/amenities-list/amenities-list.component';
import { FaqSectionComponent } from './components/faq-section/faq-section.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AvailabilityCalendarComponent, GoogleMapComponent, PropertyGalleryComponent, GuestReviewsComponent, AmenitiesListComponent, FaqSectionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Hafan Traeth - Your Coastal Retreat';
  heroTitleVisible = true;

  ngOnInit() {
    // Initial check on page load
    this.checkHeroVisibility();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.checkHeroVisibility();
  }

  private checkHeroVisibility() {
    const availabilitySection = document.getElementById('availability');
    if (availabilitySection) {
      const rect = availabilitySection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Hide hero title when availability section is 50% visible
      this.heroTitleVisible = rect.top > windowHeight * 0.5;
    }
  }

  scrollToAvailability(): void {
    const element = document.getElementById('availability');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }
}

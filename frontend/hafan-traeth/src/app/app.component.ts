import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  
  title = 'Hafan Traeth - Your Coastal Retreat';
  heroTitleVisible = true;

  ngOnInit() {
    this.checkHeroVisibility();
    this.initializeVideo();
  }

  private initializeVideo() {
    setTimeout(() => {
      if (this.heroVideo?.nativeElement) {
        const video = this.heroVideo.nativeElement;
        
        // Ensure video properties are set
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        
        // Attempt to play the video
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video autoplay started successfully');
            })
            .catch(error => {
              console.log('Video autoplay failed:', error);
              // Fallback: Try to play on user interaction
              this.setupFallbackAutoplay(video);
            });
        }
      }
    }, 100);
  }

  private setupFallbackAutoplay(video: HTMLVideoElement) {
    const playOnInteraction = () => {
      video.play()
        .then(() => {
          console.log('Video started on user interaction');
          // Remove listeners after successful play
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('scroll', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
        })
        .catch(console.error);
    };

    // Add listeners for various user interactions
    document.addEventListener('click', playOnInteraction, { once: true });
    document.addEventListener('scroll', playOnInteraction, { once: true });
    document.addEventListener('touchstart', playOnInteraction, { once: true });
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

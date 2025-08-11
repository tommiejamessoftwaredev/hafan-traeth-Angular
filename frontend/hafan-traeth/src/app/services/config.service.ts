import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface AppConfig {
  googleMapsApiKey: string;
  apiUrl: string;
  bookingComUrl: string;
  bookingComReviewsUrl: string;
  airbnbUrl: string;
  airbnbReviewsUrl: string;
  icalUrl: string;
  busRoute35PdfUrl: string;
  busRoute36PdfUrl: string;
  busRoute35PlannerUrl: string;
  busRoute36PlannerUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config$?: Observable<AppConfig>;
  private fallbackConfig: AppConfig = {
    googleMapsApiKey: '',
    apiUrl: 'http://localhost:7071/api',
    bookingComUrl: 'https://www.booking.com/hotel/gb/hafan-traeth.en-gb.html',
    bookingComReviewsUrl: 'https://www.booking.com/hotel/gb/hafan-traeth.en-gb.html#tab-reviews',
    airbnbUrl: 'https://www.airbnb.co.uk/rooms/920441523710400719',
    airbnbReviewsUrl: 'https://www.airbnb.co.uk/rooms/920441523710400719/reviews',
    icalUrl: 'https://ical.booking.com/v1/export?t=32f37ade-b2ed-48b9-9e49-573b6dcc4660',
    busRoute35PdfUrl: '/36-Rhyl-Circular-from-26-Jan-2025.pdf',
    busRoute36PdfUrl: '/35-Rhyl-Circular-from-26-Jan-2025.pdf',
    busRoute35PlannerUrl: 'https://www.arrivabus.co.uk/find-a-service/35-rhyl-circular',
    busRoute36PlannerUrl: 'https://www.arrivabus.co.uk/find-a-service/36-rhyl-circular'
  };

  constructor(private http: HttpClient) {}

  getConfig(): Observable<AppConfig> {
    if (!this.config$) {
      // Determine API URL based on environment
      const apiBaseUrl = window.location.origin.includes('localhost') 
        ? 'http://localhost:7071/api' 
        : `${window.location.origin}/api`;

      this.config$ = this.http.get<AppConfig>(`${apiBaseUrl}/GetConfiguration`).pipe(
        catchError(error => {
          console.warn('Failed to load configuration from backend, using fallback:', error);
          return of(this.fallbackConfig);
        }),
        shareReplay(1)
      );
    }
    return this.config$;
  }
}
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../services/config.service';
import { of } from 'rxjs';
import { AppConfig } from '../interfaces/config.interface';

export const mockConfig: AppConfig = {
  googleMapsApiKey: 'test-maps-key',
  apiUrl: 'https://test-api.com',
  bookingComUrl: 'https://booking.com/test',
  bookingComReviewsUrl: 'https://booking.com/test/reviews',
  airbnbUrl: 'https://airbnb.com/test',
  airbnbReviewsUrl: 'https://airbnb.com/test/reviews',
  icalUrl: 'https://test.com/ical',
  busRoute35PdfUrl: '/test-route-35.pdf',
  busRoute36PdfUrl: '/test-route-36.pdf',
  busRoute35PlannerUrl: 'https://test-planner-35.com',
  busRoute36PlannerUrl: 'https://test-planner-36.com'
};

export function createMockConfigService(): jasmine.SpyObj<ConfigService> {
  const spy = jasmine.createSpyObj('ConfigService', ['getConfig']);
  spy.getConfig.and.returnValue(of(mockConfig));
  return spy;
}

export function setupComponentTest(componentType: any, additionalProviders: any[] = []) {
  return TestBed.configureTestingModule({
    imports: [componentType, HttpClientTestingModule],
    providers: [
      { provide: ConfigService, useValue: createMockConfigService() },
      ...additionalProviders
    ]
  }).compileComponents();
}
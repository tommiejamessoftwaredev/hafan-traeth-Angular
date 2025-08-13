import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { GuestReviewsComponent } from './guest-reviews.component';
import { ConfigService } from '../../services/config.service';
import { AppConfig } from '../../interfaces/config.interface';

describe('GuestReviewsComponent', () => {
  let component: GuestReviewsComponent;
  let fixture: ComponentFixture<GuestReviewsComponent>;
  let configService: jasmine.SpyObj<ConfigService>;

  const mockConfig: AppConfig = {
    googleMapsApiKey: 'test-key',
    apiUrl: 'https://test.com',
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

  beforeEach(async () => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['getConfig']);

    await TestBed.configureTestingModule({
      imports: [GuestReviewsComponent, HttpClientTestingModule],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GuestReviewsComponent);
    component = fixture.componentInstance;
    configService = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    configService.getConfig.and.returnValue(of(mockConfig));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.overallRating).toBe(9.9);
    expect(component.reviews.length).toBeGreaterThan(0);
    expect(component.ratingCategories.length).toBe(6);
  });

  it('should load configuration on init', () => {
    component.ngOnInit();

    expect(configService.getConfig).toHaveBeenCalled();
    expect(component.config).toEqual(mockConfig);
    expect(component.bookingComReviewsUrl).toBe(mockConfig.bookingComReviewsUrl);
    expect(component.airbnbReviewsUrl).toBe(mockConfig.airbnbReviewsUrl);
  });

  describe('getStarsArray', () => {
    it('should return correct stars for whole number rating', () => {
      const stars = component.getStarsArray(10.0);
      
      expect(stars.length).toBe(5);
      expect(stars.filter(s => s.class === 'full').length).toBe(5);
      expect(stars.filter(s => s.class === 'empty').length).toBe(0);
      expect(stars.filter(s => s.class === 'half').length).toBe(0);
    });

    it('should return correct stars for half rating', () => {
      const stars = component.getStarsArray(9.0);
      
      expect(stars.length).toBe(5);
      expect(stars.filter(s => s.class === 'full').length).toBe(4);
      expect(stars.filter(s => s.class === 'half').length).toBe(1);
      expect(stars.filter(s => s.class === 'empty').length).toBe(0);
    });

    it('should return correct stars for decimal rating', () => {
      const stars = component.getStarsArray(7.4);
      
      expect(stars.length).toBe(5);
      expect(stars.filter(s => s.class === 'full').length).toBe(3);
      expect(stars.filter(s => s.class === 'half').length).toBe(1);
      expect(stars.filter(s => s.class === 'empty').length).toBe(1);
    });

    it('should handle zero rating', () => {
      const stars = component.getStarsArray(0);
      
      expect(stars.length).toBe(5);
      expect(stars.filter(s => s.class === 'full').length).toBe(0);
      expect(stars.filter(s => s.class === 'half').length).toBe(0);
      expect(stars.filter(s => s.class === 'empty').length).toBe(5);
    });

    it('should handle maximum rating', () => {
      const stars = component.getStarsArray(10.0);
      
      expect(stars.length).toBe(5);
      expect(stars.filter(s => s.class === 'full').length).toBe(5);
    });
  });

  describe('getInitials', () => {
    it('should return initials for single name', () => {
      expect(component.getInitials('David')).toBe('D');
    });

    it('should return initials for full name', () => {
      expect(component.getInitials('David Williams')).toBe('DW');
    });

    it('should return initials for multiple names', () => {
      expect(component.getInitials('John Michael Smith')).toBe('JMS');
    });

    it('should handle empty string', () => {
      expect(component.getInitials('')).toBe('');
    });

    it('should handle names with extra spaces', () => {
      expect(component.getInitials('  David   Williams  ')).toBe('DW');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const testDate = new Date('2025-08-08');
      const formatted = component.formatDate(testDate);
      
      expect(formatted).toContain('2025');
      expect(formatted).toContain('August');
      expect(formatted).toContain('8');
    });

    it('should handle different dates', () => {
      const testDate = new Date('2025-01-15');
      const formatted = component.formatDate(testDate);
      
      expect(formatted).toContain('2025');
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render review author names', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const firstReview = component.reviews[0];
      
      expect(compiled.textContent).toContain(firstReview.name);
    });

    it('should render review locations', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const firstReview = component.reviews[0];
      
      expect(compiled.textContent).toContain(firstReview.location);
    });

    it('should render review titles', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const firstReview = component.reviews[0];
      
      expect(compiled.textContent).toContain(firstReview.title);
    });

    it('should render category scores', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      component.ratingCategories.forEach(category => {
        expect(compiled.textContent).toContain(category.name);
        expect(compiled.textContent).toContain(category.score.toString());
      });
    });
  });

  describe('error handling', () => {
    it('should handle config service errors gracefully', () => {
      const errorSpy = spyOn(console, 'warn');
      configService.getConfig.and.returnValue(of({} as AppConfig));
      
      component.ngOnInit();
      
      // Component should not crash
      expect(component).toBeTruthy();
    });
  });
});

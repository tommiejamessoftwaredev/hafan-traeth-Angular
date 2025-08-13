import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from './config.service';
import { AppConfig } from '../interfaces/config.interface';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpMock: HttpTestingController;

  const mockConfig: AppConfig = {
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService]
    });

    service = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getConfig', () => {
    it('should fetch configuration from API', () => {
      service.getConfig().subscribe(config => {
        expect(config).toEqual(mockConfig);
      });

      const req = httpMock.expectOne(req => req.url.includes('/api/GetConfiguration'));
      expect(req.request.method).toBe('GET');
      req.flush(mockConfig);
    });

    it('should cache configuration after first request', () => {
      // First request
      service.getConfig().subscribe(config => {
        expect(config).toEqual(mockConfig);
      });

      const req1 = httpMock.expectOne(req => req.url.includes('/api/GetConfiguration'));
      req1.flush(mockConfig);

      // Second request should use cached data
      service.getConfig().subscribe(config => {
        expect(config).toEqual(mockConfig);
      });

      // No additional HTTP request should be made
      // No additional HTTP request should be made (cached)
    });

    it('should handle HTTP errors by returning fallback config', () => {
      const errorMessage = 'Configuration fetch failed';

      service.getConfig().subscribe(config => {
        // Should return fallback config, not throw error
        expect(config).toBeDefined();
        expect(config.apiUrl).toBe('http://localhost:7071/api'); // fallback value
      });

      const req = httpMock.expectOne(req => req.url.includes('/api/GetConfiguration'));
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network errors by returning fallback config', () => {
      const errorEvent = new ErrorEvent('Network error');

      service.getConfig().subscribe(config => {
        // Should return fallback config, not throw error
        expect(config).toBeDefined();
        expect(config.apiUrl).toBe('http://localhost:7071/api'); // fallback value
      });

      const req = httpMock.expectOne(req => req.url.includes('/api/GetConfiguration'));
      req.error(errorEvent);
    });

    it('should make new request if cache is cleared', () => {
      // First request
      service.getConfig().subscribe();
      const req1 = httpMock.expectOne(req => req.url.includes('/api/GetConfiguration'));
      req1.flush(mockConfig);

      // Clear cache (simulate service restart or cache invalidation)
      (service as any).config$ = undefined;

      // Second request should make new HTTP call
      service.getConfig().subscribe(config => {
        expect(config).toEqual(mockConfig);
      });

      const req2 = httpMock.expectOne(req => req.url.includes('/api/GetConfiguration'));
      req2.flush(mockConfig);
    });
  });

  describe('error handling', () => {
    it('should handle 404 errors by returning fallback config', () => {
      service.getConfig().subscribe(config => {
        expect(config).toBeDefined();
        expect(config.apiUrl).toBe('http://localhost:7071/api');
      });

      const req = httpMock.expectOne(req => req.url.includes('/api/GetConfiguration'));
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle timeout errors by returning fallback config', () => {
      service.getConfig().subscribe(config => {
        expect(config).toBeDefined();
        expect(config.apiUrl).toBe('http://localhost:7071/api');
      });

      const req = httpMock.expectOne(req => req.url.includes('/api/GetConfiguration'));
      req.error(new ErrorEvent('TimeoutError', { error: new Error('Request timeout') }));
    });
  });

  describe('configuration validation', () => {
    it('should handle partial configuration', () => {
      const partialConfig = {
        googleMapsApiKey: 'test-key',
        apiUrl: 'https://test.com'
        // Missing other properties
      } as AppConfig;

      service.getConfig().subscribe(config => {
        expect(config.googleMapsApiKey).toBe('test-key');
        expect(config.apiUrl).toBe('https://test.com');
      });

      const req = httpMock.expectOne(req => req.url.includes('/api/GetConfiguration'));
      req.flush(partialConfig);
    });

    it('should handle empty configuration', () => {
      const emptyConfig = {} as AppConfig;

      service.getConfig().subscribe(config => {
        expect(config).toEqual(emptyConfig);
      });

      const req = httpMock.expectOne(req => req.url.includes('/api/GetConfiguration'));
      req.flush(emptyConfig);
    });
  });
});
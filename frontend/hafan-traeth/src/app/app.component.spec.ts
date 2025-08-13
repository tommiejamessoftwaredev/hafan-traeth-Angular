import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    expect(component.title).toBe('Hafan Traeth - Your Coastal Retreat');
  });

  it('should initialize with heroTitleVisible as true', () => {
    expect(component.heroTitleVisible).toBe(true);
  });

  it('should render hero section with correct content', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    const heroTitle = compiled.querySelector('h1');
    expect(heroTitle?.textContent).toBe('Hafan Traeth');
    
    const heroSubtitle = compiled.querySelector('.hero-content p');
    expect(heroSubtitle?.textContent).toBe('Your perfect coastal retreat in North Wales');
  });

  it('should render CTA button', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    const ctaButton = compiled.querySelector('.cta-button');
    expect(ctaButton?.textContent?.trim()).toBe('Check Availability');
  });

  it('should call scrollToAvailability when CTA button is clicked', () => {
    spyOn(component, 'scrollToAvailability');
    fixture.detectChanges();
    
    const ctaButton = debugElement.query(By.css('.cta-button'));
    ctaButton.triggerEventHandler('click', null);
    
    expect(component.scrollToAvailability).toHaveBeenCalled();
  });

  it('should render all main sections', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('.hero-section')).toBeTruthy();
    expect(compiled.querySelector('.availability-section')).toBeTruthy();
    expect(compiled.querySelector('.location-section')).toBeTruthy();
    expect(compiled.querySelector('.gallery-section')).toBeTruthy();
    expect(compiled.querySelector('.reviews-section')).toBeTruthy();
    expect(compiled.querySelector('.amenities-section')).toBeTruthy();
    expect(compiled.querySelector('.faq-section')).toBeTruthy();
  });

  it('should include all component selectors', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('app-availability-calendar')).toBeTruthy();
    expect(compiled.querySelector('app-google-map')).toBeTruthy();
    expect(compiled.querySelector('app-property-gallery')).toBeTruthy();
    expect(compiled.querySelector('app-guest-reviews')).toBeTruthy();
    expect(compiled.querySelector('app-amenities-list')).toBeTruthy();
    expect(compiled.querySelector('app-faq-section')).toBeTruthy();
  });

  describe('scrollToAvailability', () => {
    it('should scroll to availability section when element exists', () => {
      // Create a mock availability element
      const mockElement = document.createElement('div');
      mockElement.id = 'availability';
      mockElement.scrollIntoView = jasmine.createSpy('scrollIntoView');
      
      spyOn(document, 'getElementById').and.returnValue(mockElement);
      
      component.scrollToAvailability();
      
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      });
    });

    it('should handle case when availability element does not exist', () => {
      spyOn(document, 'getElementById').and.returnValue(null);
      
      expect(() => component.scrollToAvailability()).not.toThrow();
    });
  });

  describe('checkHeroVisibility', () => {
    it('should set heroTitleVisible to false when availability section is 50% visible', () => {
      const mockElement = {
        getBoundingClientRect: jasmine.createSpy('getBoundingClientRect').and.returnValue({
          top: 250 // 50% of a 500px window
        })
      };
      
      spyOn(document, 'getElementById').and.returnValue(mockElement as any);
      Object.defineProperty(window, 'innerHeight', { value: 500, writable: true });
      
      component['checkHeroVisibility']();
      
      expect(component.heroTitleVisible).toBe(false);
    });

    it('should set heroTitleVisible to true when availability section is less than 50% visible', () => {
      const mockElement = {
        getBoundingClientRect: jasmine.createSpy('getBoundingClientRect').and.returnValue({
          top: 300 // More than 50% of a 500px window
        })
      };
      
      spyOn(document, 'getElementById').and.returnValue(mockElement as any);
      Object.defineProperty(window, 'innerHeight', { value: 500, writable: true });
      
      component['checkHeroVisibility']();
      
      expect(component.heroTitleVisible).toBe(true);
    });
  });

  describe('video initialization', () => {
    it('should call initializeVideo on ngOnInit', () => {
      spyOn(component as any, 'initializeVideo');
      spyOn(component as any, 'checkHeroVisibility');
      
      component.ngOnInit();
      
      expect(component['initializeVideo']).toHaveBeenCalled();
      expect(component['checkHeroVisibility']).toHaveBeenCalled();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PropertyGalleryComponent } from './property-gallery.component';

describe('PropertyGalleryComponent', () => {
  let component: PropertyGalleryComponent;
  let fixture: ComponentFixture<PropertyGalleryComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyGalleryComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyGalleryComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.selectedImage).toBeNull();
    expect(component.selectedCategory).toBe('all');
    expect(component.lightboxImage).toBeNull();
    expect(component.currentImageIndex).toBe(0);
  });

  it('should have gallery images loaded', () => {
    expect(component.galleryImages.length).toBeGreaterThan(0);
    expect(component.categories.length).toBe(4);
  });

  describe('ngOnInit', () => {
    it('should update category counts and filter images on init', () => {
      spyOn(component as any, 'updateCategoryCounts');
      spyOn(component, 'filterByCategory');

      component.ngOnInit();

      expect(component['updateCategoryCounts']).toHaveBeenCalled();
      expect(component.filterByCategory).toHaveBeenCalledWith('all');
    });

    it('should set first image as selected after init', () => {
      fixture.detectChanges(); // This triggers ngOnInit
      
      expect(component.selectedImage).not.toBeNull();
      expect(component.filteredImages.length).toBeGreaterThan(0);
    });
  });

  describe('updateCategoryCounts', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should correctly count all images', () => {
      const allCategory = component.categories.find(c => c.key === 'all');
      expect(allCategory?.count).toBe(component.galleryImages.length);
    });

    it('should correctly count interior images', () => {
      const interiorCategory = component.categories.find(c => c.key === 'interior');
      const interiorCount = component.galleryImages.filter(img => img.category === 'interior').length;
      expect(interiorCategory?.count).toBe(interiorCount);
    });

    it('should correctly count exterior images', () => {
      const exteriorCategory = component.categories.find(c => c.key === 'exterior');
      const exteriorCount = component.galleryImages.filter(img => img.category === 'exterior').length;
      expect(exteriorCategory?.count).toBe(exteriorCount);
    });

    it('should correctly count view images', () => {
      const viewsCategory = component.categories.find(c => c.key === 'views');
      const viewsCount = component.galleryImages.filter(img => img.category === 'views').length;
      expect(viewsCategory?.count).toBe(viewsCount);
    });
  });

  describe('selectImage', () => {
    it('should set selectedImage when selectImage is called', () => {
      const testImage = component.galleryImages[0];
      
      component.selectImage(testImage);
      
      expect(component.selectedImage).toEqual(testImage);
    });
  });

  describe('filterByCategory', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show all images when category is "all"', () => {
      component.filterByCategory('all');
      
      expect(component.selectedCategory).toBe('all');
      expect(component.filteredImages.length).toBe(component.galleryImages.length);
      expect(component.selectedImage).toBe(component.filteredImages[0]);
    });

    it('should filter interior images correctly', () => {
      component.filterByCategory('interior');
      
      expect(component.selectedCategory).toBe('interior');
      expect(component.filteredImages.every(img => img.category === 'interior')).toBe(true);
      expect(component.selectedImage?.category).toBe('interior');
    });

    it('should filter exterior images correctly', () => {
      component.filterByCategory('exterior');
      
      expect(component.selectedCategory).toBe('exterior');
      expect(component.filteredImages.every(img => img.category === 'exterior')).toBe(true);
      expect(component.selectedImage?.category).toBe('exterior');
    });

    it('should filter view images correctly', () => {
      component.filterByCategory('views');
      
      expect(component.selectedCategory).toBe('views');
      expect(component.filteredImages.every(img => img.category === 'views')).toBe(true);
      expect(component.selectedImage?.category).toBe('views');
    });

    it('should handle empty filter results', () => {
      component.filterByCategory('nonexistent');
      
      expect(component.selectedCategory).toBe('nonexistent');
      expect(component.filteredImages.length).toBe(0);
    });
  });

  describe('lightbox functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should open lightbox with correct image', () => {
      const testImage = component.galleryImages[5];
      const originalOverflow = document.body.style.overflow;
      
      component.openLightbox(testImage);
      
      expect(component.lightboxImage).toEqual(testImage);
      expect(component.currentImageIndex).toBe(component.filteredImages.findIndex(img => img.id === testImage.id));
      expect(document.body.style.overflow).toBe('hidden');
      
      // Cleanup
      document.body.style.overflow = originalOverflow;
    });

    it('should close lightbox and restore scroll', () => {
      const testImage = component.galleryImages[0];
      const originalOverflow = document.body.style.overflow;
      
      component.openLightbox(testImage);
      component.closeLightbox();
      
      expect(component.lightboxImage).toBeNull();
      expect(document.body.style.overflow).toBe('auto');
      
      // Cleanup
      document.body.style.overflow = originalOverflow;
    });

    it('should navigate to next image', () => {
      component.filterByCategory('all');
      component.openLightbox(component.filteredImages[0]);
      const nextImage = component.filteredImages[1];
      
      component.nextImage();
      
      expect(component.currentImageIndex).toBe(1);
      expect(component.lightboxImage).toEqual(nextImage);
    });

    it('should navigate to previous image', () => {
      component.filterByCategory('all');
      component.openLightbox(component.filteredImages[2]);
      const prevImage = component.filteredImages[1];
      
      component.previousImage();
      
      expect(component.currentImageIndex).toBe(1);
      expect(component.lightboxImage).toEqual(prevImage);
    });

    it('should not navigate beyond first image', () => {
      component.filterByCategory('all');
      component.openLightbox(component.filteredImages[0]);
      
      component.previousImage();
      
      expect(component.currentImageIndex).toBe(0);
      expect(component.lightboxImage).toEqual(component.filteredImages[0]);
    });

    it('should not navigate beyond last image', () => {
      component.filterByCategory('all');
      const lastIndex = component.filteredImages.length - 1;
      component.openLightbox(component.filteredImages[lastIndex]);
      
      component.nextImage();
      
      expect(component.currentImageIndex).toBe(lastIndex);
      expect(component.lightboxImage).toEqual(component.filteredImages[lastIndex]);
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render gallery header', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const header = compiled.querySelector('.gallery-header h3');
      
      expect(header?.textContent).toBe('Property Gallery');
    });

    it('should render featured image when selectedImage is set', () => {
      expect(component.selectedImage).not.toBeNull();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const featuredImage = compiled.querySelector('.featured-image img');
      
      expect(featuredImage).toBeTruthy();
    });

    it('should render thumbnail grid', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const thumbnails = compiled.querySelectorAll('.thumbnail');
      
      expect(thumbnails.length).toBeGreaterThan(0);
    });

    it('should render category filters', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const categoryButtons = compiled.querySelectorAll('.category-btn');
      
      expect(categoryButtons.length).toBe(component.categories.length);
    });

    it('should handle thumbnail click', () => {
      spyOn(component, 'selectImage');
      fixture.detectChanges();
      
      const thumbnail = debugElement.query(By.css('.thumbnail'));
      thumbnail.triggerEventHandler('click', null);
      
      expect(component.selectImage).toHaveBeenCalled();
    });

    it('should handle category filter click', () => {
      spyOn(component, 'filterByCategory');
      fixture.detectChanges();
      
      const categoryButton = debugElement.query(By.css('.category-btn'));
      categoryButton.triggerEventHandler('click', null);
      
      expect(component.filterByCategory).toHaveBeenCalled();
    });

    it('should handle fullscreen button click', () => {
      spyOn(component, 'openLightbox');
      fixture.detectChanges();
      
      const fullscreenBtn = debugElement.query(By.css('.fullscreen-btn'));
      if (fullscreenBtn) {
        fullscreenBtn.triggerEventHandler('click', null);
        expect(component.openLightbox).toHaveBeenCalled();
      }
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have alt text for images', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const images = compiled.querySelectorAll('img');
      
      images.forEach(img => {
        expect(img.getAttribute('alt')).toBeTruthy();
      });
    });

    it('should have proper heading structure', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const heading = compiled.querySelector('h3, h4');
      
      expect(heading).toBeTruthy();
    });
  });
});

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryImage, Category } from '../../interfaces/gallery.interface';
import { GALLERY_IMAGES, GALLERY_CATEGORIES } from '../../constants/gallery.constants';

@Component({
  selector: 'app-property-gallery',
  imports: [CommonModule],
  templateUrl: './property-gallery.component.html',
  styleUrl: './property-gallery.component.scss'
})
export class PropertyGalleryComponent implements OnInit {
  selectedImage: GalleryImage | null = null;
  selectedCategory: string = 'all';
  lightboxImage: GalleryImage | null = null;
  currentImageIndex: number = 0;
  
  // Hafan Traeth property images
  galleryImages: GalleryImage[] = GALLERY_IMAGES;
  categories: Category[] = GALLERY_CATEGORIES;
  
  filteredImages: GalleryImage[] = [];
  
  ngOnInit() {
    this.updateCategoryCounts();
    this.filterByCategory('all');
  }
  
  private updateCategoryCounts() {
    this.categories.forEach(category => {
      if (category.key === 'all') {
        category.count = this.galleryImages.length;
      } else {
        category.count = this.galleryImages.filter(img => img.category === category.key).length;
      }
    });
  }
  
  selectImage(image: GalleryImage) {
    this.selectedImage = image;
  }
  
  filterByCategory(category: string) {
    this.selectedCategory = category;
    
    if (category === 'all') {
      this.filteredImages = [...this.galleryImages];
    } else {
      this.filteredImages = this.galleryImages.filter(img => img.category === category);
    }
    
    // Select first image from filtered results
    if (this.filteredImages.length > 0) {
      this.selectedImage = this.filteredImages[0];
    }
  }
  
  openLightbox(image: GalleryImage) {
    this.lightboxImage = image;
    this.currentImageIndex = this.filteredImages.findIndex(img => img.id === image.id);
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
  }
  
  closeLightbox() {
    this.lightboxImage = null;
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
  }
  
  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.lightboxImage = this.filteredImages[this.currentImageIndex];
    }
  }
  
  nextImage() {
    if (this.currentImageIndex < this.filteredImages.length - 1) {
      this.currentImageIndex++;
      this.lightboxImage = this.filteredImages[this.currentImageIndex];
    }
  }
}

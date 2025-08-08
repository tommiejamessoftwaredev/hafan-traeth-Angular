import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-amenities-list',
  imports: [CommonModule],
  templateUrl: './amenities-list.component.html',
  styleUrl: './amenities-list.component.scss'
})
export class AmenitiesListComponent {
  amenities = [
    { name: 'Fast Free WiFi (142 Mbps)', icon: 'fas fa-wifi', category: 'connectivity' },
    { name: 'Free On-Site Parking', icon: 'fas fa-parking', category: 'parking' },
    { name: 'Fully Equipped Kitchen', icon: 'fas fa-utensils', category: 'kitchen' },
    { name: 'Washing Machine & Tumble Dryer', icon: 'fas fa-tshirt', category: 'laundry' },
    { name: 'Private Garden with Mountain View', icon: 'fas fa-tree', category: 'outdoor' },
    { name: 'Central Heating & Electric Fire', icon: 'fas fa-fire', category: 'comfort' },
    { name: 'Flat-Screen TV', icon: 'fas fa-tv', category: 'entertainment' },
    { name: 'Small Well-Behaved Dogs Welcome', icon: 'fas fa-dog', category: 'pets' },
    { name: 'Private Bathroom with Shower', icon: 'fas fa-shower', category: 'bathroom' },
    { name: 'Outdoor Dining Area', icon: 'fas fa-chair', category: 'outdoor' },
    { name: 'King-Size Master Bedroom', icon: 'fas fa-bed', category: 'bedroom' },
    { name: 'Twin Single Bedroom', icon: 'fas fa-bed', category: 'bedroom' },
    { name: 'Sofa Bed in Porch Area', icon: 'fas fa-couch', category: 'bedroom' },
    { name: '800 ft² Property', icon: 'fas fa-expand-arrows-alt', category: 'space' },
    { name: 'Ground Floor Access', icon: 'fas fa-wheelchair', category: 'accessibility' },
    { name: 'Self Check-In with Keybox', icon: 'fas fa-key', category: 'convenience' },
    { name: 'All Bedding & Towels Provided', icon: 'fas fa-concierge-bell', category: 'convenience' },
    { name: '8-Minute Walk to Prestatyn Central Beach', icon: 'fas fa-umbrella-beach', category: 'location' }
  ];
}
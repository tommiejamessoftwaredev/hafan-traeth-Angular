import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-google-map',
  imports: [CommonModule, GoogleMap, MapInfoWindow, MapMarker],
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.scss'
})
export class GoogleMapComponent implements OnInit {
  @ViewChild(GoogleMap) map!: GoogleMap;
  
  mapLoaded = false;
  mapType: 'roadmap' | 'satellite' = 'roadmap';
  showFallback = false;
  showingDirections = false;
  showingShops = false;
  
  // Directions
  directionsService: google.maps.DirectionsService | null = null;
  directionsRenderer: google.maps.DirectionsRenderer | null = null;
  
  // Map configuration
  center: google.maps.LatLngLiteral = { lat: 53.33336569521891, lng: -3.431334999915092 };
  zoom = 15;
  
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    styles: [
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#667eea' }]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#f5f5f5' }]
      }
    ],
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true
  };
  
  // Marker configuration
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };
  
  markerPosition: google.maps.LatLngLiteral = { lat: 53.33336569521891, lng: -3.431334999915092 };
  
  // Exact beach coordinates (Ffrith Beach)
  private readonly beachLocation = {
    lat: 53.33727314564057,
    lng: -3.432135755118875
  };
  
  // Local shops and amenities
  localShops = [
    {
      name: 'Tesco Prestatyn',
      location: { lat: 53.3356, lng: -3.4254 },
      type: 'Supermarket',
      description: 'Large supermarket with groceries and essentials'
    },
    {
      name: 'Prestatyn High Street',
      location: { lat: 53.3339, lng: -3.4089 },
      type: 'Shopping Street',
      description: 'Main shopping area with various shops and cafes'
    },
    {
      name: 'Spar Express',
      location: { lat: 53.3314, lng: -3.4331 },
      type: 'Convenience Store',
      description: 'Local convenience store for daily essentials'
    },
    {
      name: 'Prestatyn Town Centre',
      location: { lat: 53.3342, lng: -3.4087 },
      type: 'Shopping Center',
      description: 'Town center with shops, restaurants, and services'
    }
  ];
  
  shopMarkers: any[] = [];
  
  constructor() {}
  
  ngOnInit() {
    // Try to load Google Maps API
    this.loadGoogleMapsAPI();
  }
  
  private loadGoogleMapsAPI() {
    // Check if we have a valid API key
    const apiKey = environment.googleMapsApiKey;
    
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey === 'AIzaSyA3C3Cg71Y7H5wIb2vC1PZU7K31xuvS2FY') {
      console.warn('Google Maps API key not configured or using example key. Showing fallback map.');
      this.showFallback = true;
      this.mapLoaded = true;
      return;
    }

    // Load Google Maps JavaScript API
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps API loaded successfully');
        this.mapLoaded = true;
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        this.showFallback = true;
        this.mapLoaded = true;
      };
      
      document.head.appendChild(script);
    } else {
      this.mapLoaded = true;
    }
  }
  
  onMapReady() {
    console.log('Map is ready');
    // Initialize directions service when map is ready
    if (window.google && window.google.maps) {
      this.directionsService = new window.google.maps.DirectionsService();
      this.directionsRenderer = new window.google.maps.DirectionsRenderer({
        draggable: false,
        suppressMarkers: false
      });
      
      if (this.map && this.map.googleMap) {
        this.directionsRenderer.setMap(this.map.googleMap);
      }
    }
  }
  
  onMapError(error: any) {
    console.error('Map loading error:', error);
    this.showFallback = true;
  }
  
  toggleMapType() {
    this.mapType = this.mapType === 'roadmap' ? 'satellite' : 'roadmap';
    this.mapOptions = { ...this.mapOptions, mapTypeId: this.mapType };
  }
  
  openDirections() {
    const destination = `${this.markerPosition.lat},${this.markerPosition.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank');
  }
  
  showBeachDirections() {
    if (this.showingDirections) {
      // If already showing directions, clear them
      this.clearDirections();
      return;
    }
    
    if (this.showFallback) {
      // Fallback to external link if Google Maps not loaded
      this.openBeachDirectionsExternal();
      return;
    }

    this.clearShops();
    
    if (!this.directionsService || !this.directionsRenderer) {
      console.error('Directions service not initialized');
      this.openBeachDirectionsExternal();
      return;
    }
    
    const request: google.maps.DirectionsRequest = {
      origin: this.markerPosition,
      destination: this.beachLocation,
      travelMode: google.maps.TravelMode.WALKING
    };

    this.directionsService.route(request, (result, status) => {
      if (status === 'OK' && result && this.directionsRenderer) {
        this.directionsRenderer.setDirections(result);
        this.showingDirections = true;
        
        console.log('Walking directions loaded successfully on embedded map');
        
        // Adjust zoom to show the route better  
        this.zoom = 16;
      } else {
        console.error('Directions request failed due to ' + status);
        this.openBeachDirectionsExternal();
      }
    });
  }
  
  private openBeachDirectionsExternal() {
    const origin = `${this.markerPosition.lat},${this.markerPosition.lng}`;
    const destination = `${this.beachLocation.lat},${this.beachLocation.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;
    window.open(url, '_blank');
  }
  
  showLocalShops() {
    if (this.showingShops) {
      // If already showing shops, clear them
      this.clearShops();
      return;
    }
    
    if (this.showFallback) return;
    
    this.clearDirections();
    this.showingShops = true;
    
    // Adjust zoom to show more area
    this.zoom = 14;
    
    // Center map to show both property and shops
    this.center = { lat: 53.3334, lng: -3.4200 };
  }
  
  clearDirections() {
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] } as any);
    }
    this.showingDirections = false;
    this.resetMapView();
  }
  
  clearShops() {
    this.showingShops = false;
    this.resetMapView();
  }
  
  private resetMapView() {
    if (!this.showingDirections && !this.showingShops) {
      this.center = this.markerPosition;
      this.zoom = 15;
    }
  }
  
  trackByShopName(_index: number, shop: any): string {
    return shop.name;
  }
  
  getShopMarkerIcon(shopType: string): string {
    let emoji = '🏪'; // Default shop emoji
    
    switch (shopType) {
      case 'Supermarket':
        emoji = '🛒';
        break;
      case 'Shopping Street':
        emoji = '🛍️';
        break;
      case 'Convenience Store':
        emoji = '🏪';
        break;
      case 'Shopping Center':
        emoji = '🏬';
        break;
    }
    
    const svg = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#ff5722" stroke="white" stroke-width="3"/>
        <text x="16" y="22" text-anchor="middle" fill="white" font-size="14">${emoji}</text>
      </svg>
    `;
    
    return btoa(svg);
  }
  
  getBeachLocation(): google.maps.LatLngLiteral {
    return this.beachLocation;
  }
}

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
  directionsMarkers: google.maps.Marker[] = [];
  directionsInfoWindow: google.maps.InfoWindow | null = null;
  shopsMarkers: google.maps.Marker[] = [];
  shopsInfoWindows: google.maps.InfoWindow[] = [];
  
  // Map configuration
  center: google.maps.LatLngLiteral = { lat: 53.33336569521891, lng: -3.431334999915092 };
  zoom = 15;
  
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
  
  // Specific shops with exact coordinates
  localShops = [
    {
      name: 'Spar',
      location: { lat: 53.33498801660247, lng: -3.427581293313341 },
      type: 'convenience_store',
      description: 'Spar convenience store on Victoria Road'
    },
    {
      name: 'Co-op',
      location: { lat: 53.33661637351705, lng: -3.4157436514852186 },
      type: 'grocery_or_supermarket',
      description: 'Co-operative Food store on Victoria Road'
    },
    {
      name: 'Tesco',
      location: { lat: 53.33673759602825, lng: -3.401879530165172 },
      type: 'grocery_or_supermarket',
      description: 'Large Tesco superstore'
    },
    {
      name: 'Home Bargains',
      location: { lat: 53.33540812533078, lng: -3.408008607890734 },
      type: 'store',
      description: 'Home Bargains discount store'
    },
    {
      name: 'Lidl',
      location: { lat: 53.33429370519122, lng: -3.405421421372873 },
      type: 'grocery_or_supermarket',
      description: 'Lidl supermarket'
    },
    {
      name: 'Aldi',
      location: { lat: 53.33097772063083, lng: -3.4028241117530307 },
      type: 'grocery_or_supermarket',
      description: 'Aldi supermarket at the top of town'
    }
  ];
  
  // Map styles to hide all POIs when showing custom shop markers
  private readonly groceryStoreMapStyle = [
    // Hide all POI labels so we can show our custom shop markers
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]
    },
    // Keep natural terrain colors and styling
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#ffffffff' }]
    },
    {
      featureType: 'road',
      stylers: [{ visibility: 'simplified' }]
    },
    {
      featureType: 'administrative',
      elementType: 'labels',
      stylers: [{ visibility: 'on' }]
    }
  ];
  
  private readonly defaultMapStyle = [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#5e7bffff' }]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#ffffffff' }]
    }
  ];
  
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    styles: this.defaultMapStyle,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true
  };

  constructor() {}
  
  ngOnInit() {
    // Try to load Google Maps API
    this.loadGoogleMapsAPI();
  }
  
  private loadGoogleMapsAPI() {
    // Check if we have a valid API key
    const apiKey = environment.googleMapsApiKey;
    
    if (!apiKey ) {
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
        suppressMarkers: true, // We'll add custom markers
        polylineOptions: {
          strokeColor: '#4285F4',
          strokeWeight: 5,
          strokeOpacity: 0.8
        }
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
    // Use embedded map directions instead of opening new tab
    this.showBeachDirections();
  }
  
  showBeachDirections() {
    if (this.showingDirections) {
      // If already showing directions, clear them
      this.clearDirections();
      return;
    }
    
    console.log('showBeachDirections called');
    console.log('showFallback:', this.showFallback);
    console.log('directionsService:', this.directionsService);
    console.log('directionsRenderer:', this.directionsRenderer);
    
    if (this.showFallback) {
      // Fallback to external link if Google Maps not loaded
      console.log('Using fallback - opening external link');
      this.openBeachDirectionsExternal();
      return;
    }

    this.clearShops();
    
    if (!this.directionsService || !this.directionsRenderer) {
      console.error('Directions service not initialized - trying to initialize now');
      
      // Try to initialize directions service if not already done
      if (window.google && window.google.maps && this.map && this.map.googleMap) {
        console.log('Attempting to initialize directions service');
        this.directionsService = new window.google.maps.DirectionsService();
        this.directionsRenderer = new window.google.maps.DirectionsRenderer({
          draggable: false,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#4285F4',
            strokeWeight: 5,
            strokeOpacity: 0.8
          }
        });
        this.directionsRenderer.setMap(this.map.googleMap);
      } else {
        console.error('Google Maps API or map not available');
        this.openBeachDirectionsExternal();
        return;
      }
    }
    
    const request: google.maps.DirectionsRequest = {
      origin: this.markerPosition,
      destination: this.beachLocation,
      travelMode: google.maps.TravelMode.WALKING
    };

    this.directionsService!.route(request, (result, status) => {
      if (status === 'OK' && result && this.directionsRenderer) {
        console.log('Directions request successful - showing on embedded map');
        
        this.directionsRenderer.setDirections(result);
        this.showingDirections = true;
        
        // Make sure the directions renderer is properly attached to the map
        if (this.map && this.map.googleMap) {
          this.directionsRenderer.setMap(this.map.googleMap);
        }
        
        // Add custom markers with info windows
        if (result.routes && result.routes.length > 0 && this.map && this.map.googleMap) {
          const route = result.routes[0];
          const leg = route.legs[0];
          
          // Create custom start marker (Hafan Traeth)
          const startMarker = new google.maps.Marker({
            position: leg.start_location,
            map: this.map.googleMap,
            title: 'Hafan Traeth',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="60" viewBox="0 0 120 60">
                  <!-- Label background -->
                  <rect x="10" y="5" width="100" height="20" rx="10" fill="white" stroke="#1a73e8" stroke-width="1"/>
                  <!-- Label text -->
                  <text x="60" y="18" text-anchor="middle" fill="#1a73e8" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Hafan Traeth</text>
                  <!-- Marker circle -->
                  <circle cx="60" cy="45" r="12" fill="#4285F4" stroke="white" stroke-width="2"/>
                  <!-- Marker text -->
                  <text x="60" y="50" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">H</text>
                </svg>
              `),
              scaledSize: new google.maps.Size(120, 60),
              anchor: new google.maps.Point(60, 57)
            }
          });
          
          // Create custom end marker (Ffrith Beach)
          const endMarker = new google.maps.Marker({
            position: leg.end_location,
            map: this.map.googleMap,
            title: 'Ffrith Beach',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="60" viewBox="0 0 120 60">
                  <!-- Label background -->
                  <rect x="15" y="5" width="90" height="20" rx="10" fill="white" stroke="#34A853" stroke-width="1"/>
                  <!-- Label text -->
                  <text x="60" y="18" text-anchor="middle" fill="#34A853" font-family="Arial, sans-serif" font-size="12" font-weight="bold">Ffrith Beach</text>
                  <!-- Marker circle -->
                  <circle cx="60" cy="45" r="12" fill="#34A853" stroke="white" stroke-width="2"/>
                  <!-- Marker text -->
                  <text x="60" y="50" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">B</text>
                </svg>
              `),
              scaledSize: new google.maps.Size(120, 60),
              anchor: new google.maps.Point(60, 57)
            }
          });
          
          // Store markers for cleanup
          this.directionsMarkers = [startMarker, endMarker];
          
          // Create info window with walking duration
          const walkingTime = leg.duration?.text || 'Unknown duration';
          const distance = leg.distance?.text || 'Unknown distance';
          
          this.directionsInfoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; font-family: Arial, sans-serif;">
                <h4 style="margin: 0 0 8px 0; color: #1a73e8;"><i class="fas fa-walking"></i> Walking Route</h4>
                <p style="margin: 4px 0;"><strong>Duration:</strong> ${walkingTime}</p>
                <p style="margin: 4px 0;"><strong>Distance:</strong> ${distance}</p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">
                  From Hafan Traeth to Ffrith Beach
                </p>
              </div>
            `
          });
          
          // Show info window on the start marker
          this.directionsInfoWindow.open(this.map.googleMap, startMarker);
          
          // Adjust view to fit the route
          const bounds = route.bounds;
          if (bounds) {
            this.map.googleMap.fitBounds(bounds);
          }
        }
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
    
    // Apply styling to hide all POI labels
    this.mapOptions = { ...this.mapOptions, styles: this.groceryStoreMapStyle };
    
    // Create custom markers for each shop
    if (this.map && this.map.googleMap) {
      this.localShops.forEach(shop => {
        const labelWidth = shop.name.length * 8 + 20; // Approximate width based on text length
        const marker = new google.maps.Marker({
          position: shop.location,
          map: this.map.googleMap,
          title: shop.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="${labelWidth + 10}" height="50" viewBox="0 0 ${labelWidth + 10} 50">
                <!-- Label background -->
                <rect x="5" y="5" width="${labelWidth}" height="18" rx="9" fill="white" stroke="#FF6B35" stroke-width="1"/>
                <!-- Label text -->
                <text x="${(labelWidth + 10) / 2}" y="16" text-anchor="middle" fill="#FF6B35" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${shop.name}</text>
                <!-- Marker circle -->
                <circle cx="${(labelWidth + 10) / 2}" cy="37" r="10" fill="#FF6B35" stroke="white" stroke-width="2"/>
                <!-- Marker text -->
                <text x="${(labelWidth + 10) / 2}" y="41" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">S</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(labelWidth + 10, 50),
            anchor: new google.maps.Point((labelWidth + 10) / 2, 47)
          }
        });
        
        // Add info window for each shop
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 4px 0; color: #FF6B35;">${shop.name}</h4>
              <p style="margin: 0; font-size: 12px; color: #666;">${shop.description}</p>
            </div>
          `
        });
        
        marker.addListener('click', () => {
          // Close any open info windows
          this.shopsInfoWindows.forEach(iw => iw.close());
          infoWindow.open(this.map.googleMap, marker);
        });
        
        this.shopsMarkers.push(marker);
        this.shopsInfoWindows.push(infoWindow);
      });
    }
    
    // Calculate bounds that include BnB and all shops
    const allLocations = [this.markerPosition, ...this.localShops.map(shop => shop.location)];
    const latitudes = allLocations.map(loc => loc.lat);
    const longitudes = allLocations.map(loc => loc.lng);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    // Center between all locations
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    this.center = { lat: centerLat, lng: centerLng };
    
    // Set appropriate zoom level to show all locations
    this.zoom = 15;
  }
  
  clearDirections() {
    // Clear the directions route
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] } as any);
    }
    
    // Clear custom markers
    this.directionsMarkers.forEach(marker => {
      marker.setMap(null);
    });
    this.directionsMarkers = [];
    
    // Clear info window
    if (this.directionsInfoWindow) {
      this.directionsInfoWindow.close();
      this.directionsInfoWindow = null;
    }
    
    this.showingDirections = false;
    this.resetMapView();
  }
  
  clearShops() {
    // Clear custom shop markers
    this.shopsMarkers.forEach(marker => {
      marker.setMap(null);
    });
    this.shopsMarkers = [];
    
    // Close all shop info windows
    this.shopsInfoWindows.forEach(infoWindow => {
      infoWindow.close();
    });
    this.shopsInfoWindows = [];
    
    this.showingShops = false;
    // Reset map styling to default
    this.mapOptions = { ...this.mapOptions, styles: this.defaultMapStyle };
    this.resetMapView();
  }
  
  private resetMapView() {
    if (!this.showingDirections && !this.showingShops) {
      this.center = this.markerPosition;
      this.zoom = 15;
      
      // Also update the Google Map directly to ensure zoom reset
      if (this.map && this.map.googleMap) {
        this.map.googleMap.setCenter(this.markerPosition);
        this.map.googleMap.setZoom(15);
      }
    }
  }
  
  getBeachLocation(): google.maps.LatLngLiteral {
    return this.beachLocation;
  }
}

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
  
  environment = environment;
  
  mapLoaded = false;
  mapType: 'roadmap' | 'satellite' = 'roadmap';
  showFallback = false;
  showingDirections = false;
  showingShops = false;
  showingTransport = false;
  showingAttractions = false;
  selectedAttraction: { categoryIndex: number, attractionIndex: number } | null = null;
  transportFilter: 'all' | 'bus' | 'train' = 'all';
  
  directionsService: google.maps.DirectionsService | null = null;
  directionsRenderer: google.maps.DirectionsRenderer | null = null;
  directionsMarkers: google.maps.Marker[] = [];
  directionsInfoWindow: google.maps.InfoWindow | null = null;
  shopsMarkers: google.maps.Marker[] = [];
  shopsInfoWindows: google.maps.InfoWindow[] = [];
  transportMarkers: google.maps.Marker[] = [];
  transportInfoWindows: google.maps.InfoWindow[] = [];
  attractionsMarkers: google.maps.Marker[] = [];
  attractionsInfoWindows: google.maps.InfoWindow[] = [];
  
  center: google.maps.LatLngLiteral = { lat: 53.33336569521891, lng: -3.431334999915092 };
  zoom = 15;
  
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };
  
  markerPosition: google.maps.LatLngLiteral = { lat: 53.33336569521891, lng: -3.431334999915092 };
  
  private readonly beachLocation = {
    lat: 53.33727314564057,
    lng: -3.432135755118875
  };
  
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
  
  transportOptions = [
    {
      name: 'Prestatyn Railway Station',
      location: { lat: 53.336151690290315, lng: -3.4074164897070847 },
      type: 'train_station',
      description: 'Direct services from Chester & Holyhead',
      icon: 'T',
      links: []
    },
    {
      name: 'Brig-Y-Don (Route 36 to Rhyl)',
      location: { lat: 53.3325831939434, lng: -3.434729270045932 },
      type: 'bus_station',
      description: 'Bus Route 36 - Rhyl Circular service',
      icon: '36',
      links: [
        {
          text: 'View Route 36 Timetable',
          url: environment.busRoute36PdfUrl,
          type: 'pdf'
        },
        {
          text: 'Route 36 Journey Planner',
          url: environment.busRoute36PlannerUrl,
          type: 'external'
        }
      ]
    },
    {
      name: 'Brig-Y-Don (Route 35 to Town)',
      location: { lat: 53.33263781742478, lng: -3.4350447197400875 },
      type: 'bus_station',
      description: 'Bus Route 35 - Rhyl Circular to Prestatyn town center',
      icon: '35',
      links: [
        {
          text: 'View Route 35 Timetable',
          url: environment.busRoute35PdfUrl,
          type: 'pdf'
        },
        {
          text: 'Route 35 Journey Planner',
          url: environment.busRoute35PlannerUrl,
          type: 'external'
        }
      ]
    }
  ];

  attractionCategories = [
    {
      name: 'Castles & Historic Sites',
      attractions: [
        {
          name: 'Rhuddlan Castle',
          location: { lat: 53.28984747153027, lng: -3.46465229345647},
          description: '13th-century castle ruins with rich Welsh history',
          links: [{ url: 'https://cadw.gov.wales/visit/places-to-visit/rhuddlan-castle', text: 'Visit Info', icon: 'fas fa-external-link-alt' }]
        },
        {
          name: 'Bodelwyddan Castle',
          location: { lat: 53.26146141185901, lng: -3.502740685134114 },
          description: 'Victorian castle with art galleries and parkland',
          links: [{ url: 'https://www.bodelwyddan-castle.co.uk/', text: 'Official Site', icon: 'fas fa-external-link-alt' }]
        },
        {
          name: 'Gwrych Castle',
          location: { lat: 53.283126350431665, lng:-3.6071014498577987 },
          description: 'Spectacular 19th-century castle, home to I\'m A Celebrity',
          links: [{ url: 'https://gwryckcastle.co.uk/', text: 'Official Site', icon: 'fas fa-external-link-alt' }]
        }
      ]
    },
    {
      name: 'Beaches',
      attractions: [
        {
          name: 'Ffrith Beach',
          location: { lat: 53.33596719394663, lng: -3.4381125994646626 },
          description: 'Beautiful sandy beach, 5-minute walk from the property',
          links: []
        },
        {
          name: 'Barkby Beach',
          location: { lat: 53.34501151962178, lng: -3.4021314919914016 },
          description: 'Quiet sandy beach perfect for relaxation',
          links: []
        }
      ]
    },
    {
      name: 'Golf & Sports',
      attractions: [
        {
          name: 'Prestatyn Golf Club',
          location: { lat:   53.34359585248063, lng: -3.399578575590329},
          description: '18-hole championship golf course',
          links: [{ url: 'https://prestatatyngolfclub.co.uk/', text: 'Book Tee Time', icon: 'fas fa-golf-ball' }]
        },
        {
          name: 'Crazy Golf',
          location: { lat:  53.341409133712176, lng: -3.4119256381834266 },
          description: 'Family-friendly mini golf course',
          links: []
        },
        {
          name: 'AstroBowl',
          location: { lat: 53.3344759338221, lng: -3.4327660688154977 },
          description: 'Traditional bowling green and club',
          links: []
        }
      ]
    },
    {
      name: 'Entertainment & Attractions',
      attractions: [
        {
          name: 'Nova Leisure Centre',
          location: { lat: 53.341928338627746, lng: -3.4130666523605555 },
          description: 'Entertainment complex with cinema and restaurants',
          links: []
        },
        { 
          name: 'SC2 Rhyl',
          location: { lat: 53.32061732066503, lng: -3.495869050296468 },
          description: 'Large waterpark and leisure complex',
          links: [{ url: 'https://www.sc2.wales/', text: 'Book Tickets', icon: 'fas fa-swimmer' }]
        },
        {
          name: 'Scala Cinema',
          location: { lat: 53.33535241551636, lng: -3.4047116610715236 },
          description: 'Local cinema showing latest films',
          links: []
        },
        {
          name: 'Pavilion Theatre',
          location: { lat: 53.32621110538621, lng: -3.4833133622145165 },
          description: 'Historic theatre with live performances',
          links: []
        }
      ]
    },
    {
      name: 'Natural Attractions',
      attractions: [
        {
          name: 'Gwaenysgor Viewpoint',
          location: { lat: 53.32546616498002, lng: -3.391042081599307 },
          description: 'Panoramic views over the Irish Sea and coastline',
          links: []
        },
        {
          name: 'Dyserth Waterfall',
          location: { lat: 53.30189854687248, lng: -3.41759212015089 },
          description: 'Beautiful 70-foot waterfall and nature walk',
          links: []
        },
        {
          name: 'Point of Ayr Lighthouse',
          location: { lat:  53.356886181192095, lng: -3.3221512539549045 },
          description: 'Historic lighthouse with stunning coastal views',
          links: []
        }
      ]
    }
  ];
  
  private readonly groceryStoreMapStyle = [
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]
    },
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
  
  private readonly transportMapStyle = [
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#ffffffff' }]
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
    this.loadGoogleMapsAPI();
  }
  
  private loadGoogleMapsAPI() {
    const apiKey = environment.googleMapsApiKey;
    
    if (!apiKey ) {
      console.warn('Google Maps API key not configured or using example key. Showing fallback map.');
      this.showFallback = true;
      this.mapLoaded = true;
      return;
    }

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
    if (window.google && window.google.maps) {
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
      
      if (this.map && this.map.googleMap) {
        this.directionsRenderer.setMap(this.map.googleMap);
      }
    }
  }
  
  onMapError(error: any) {
    console.error('Map loading error:', error);
    this.showFallback = true;
  }
  
  onMapClick(event: google.maps.MapMouseEvent) {
    if (this.selectedAttraction && this.showingAttractions) {
      this.selectedAttraction = null;
      
      this.attractionsInfoWindows.forEach(infoWindow => {
        infoWindow.close();
      });
      
      this.adjustAttractionMapView();
    }
  }
  
  toggleMapType() {
    this.mapType = this.mapType === 'roadmap' ? 'satellite' : 'roadmap';
    this.mapOptions = { ...this.mapOptions, mapTypeId: this.mapType };
  }
  
  openDirections() {
    const destination = '10 Ceri Ave, Prestatyn LL19 7YN, UK';
    const url = `https://www.google.com/maps/dir//${encodeURIComponent(destination)}`;
    window.open(url, '_blank');
  }
  
  showBeachDirections() {
    if (this.showingDirections) {
        this.clearDirections();
      return;
    }
    
    
    if (this.showFallback) {
      this.openBeachDirectionsExternal();
      return;
    }

    this.clearShops();
    this.clearTransport();
    this.clearAttractions();
    
    if (!this.directionsService || !this.directionsRenderer) {
      
      if (window.google && window.google.maps && this.map && this.map.googleMap) {
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
        
        this.directionsRenderer.setDirections(result);
        this.showingDirections = true;
        
        if (this.map && this.map.googleMap) {
          this.directionsRenderer.setMap(this.map.googleMap);
        }
        
        if (result.routes && result.routes.length > 0 && this.map && this.map.googleMap) {
          const route = result.routes[0];
          const leg = route.legs[0];
          
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
          
          this.directionsMarkers = [startMarker, endMarker];
          
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
          
          this.directionsInfoWindow.open(this.map.googleMap, startMarker);
          
          const bounds = route.bounds;
          if (bounds) {
            this.map.googleMap.fitBounds(bounds);
          }
        }
      } else {
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
        this.clearShops();
      return;
    }
    
    if (this.showFallback) return;
    
    this.clearDirections();
    this.clearTransport();
    this.showingShops = true;
    
    this.mapOptions = { ...this.mapOptions, styles: this.groceryStoreMapStyle };
    
    if (this.map && this.map.googleMap) {
      this.localShops.forEach(shop => {
        const labelWidth = shop.name.length * 8 + 20;
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
        
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 4px 0; color: #FF6B35;">${shop.name}</h4>
              <p style="margin: 0; font-size: 12px; color: #666;">${shop.description}</p>
            </div>
          `
        });
        
        marker.addListener('click', () => {
          this.shopsInfoWindows.forEach(iw => iw.close());
          infoWindow.open(this.map.googleMap, marker);
        });
        
        this.shopsMarkers.push(marker);
        this.shopsInfoWindows.push(infoWindow);
      });
    }
    
    const allLocations = [this.markerPosition, ...this.localShops.map(shop => shop.location)];
    const latitudes = allLocations.map(loc => loc.lat);
    const longitudes = allLocations.map(loc => loc.lng);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    this.center = { lat: centerLat, lng: centerLng };
    
    this.zoom = 15;
  }
  
  showLocalTransport() {
    if (this.showingTransport) {
        this.clearTransport();
      return;
    }
    
    if (this.showFallback) return;
    
    this.clearDirections();
    this.clearShops();
    this.clearAttractions();
    this.showingTransport = true;
    this.transportFilter = 'all';
    
    this.mapOptions = { ...this.mapOptions, styles: this.transportMapStyle };
    
    this.createTransportMarkers();
    this.adjustMapView();
  }
  
  filterTransport(filter: 'all' | 'bus' | 'train') {
    this.transportFilter = filter;
    if (this.showingTransport) {
      this.clearTransportMarkers();
      this.createTransportMarkers();
      this.adjustMapView();
    }
  }
  
  private clearTransportMarkers() {
    this.transportMarkers.forEach(marker => {
      marker.setMap(null);
    });
    this.transportMarkers = [];
    
    this.transportInfoWindows.forEach(infoWindow => {
      infoWindow.close();
    });
    this.transportInfoWindows = [];
  }
  
  private createTransportMarkers() {
    if (!this.map || !this.map.googleMap) return;
    
    const filteredTransport = this.transportOptions.filter(transport => {
      if (this.transportFilter === 'all') return true;
      if (this.transportFilter === 'bus') return transport.type === 'bus_station';
      if (this.transportFilter === 'train') return transport.type === 'train_station';
      return false;
    });

    filteredTransport.forEach(transport => {
      const labelWidth = transport.name.length * 7 + 20;
      const iconColor = transport.type === 'train_station' ? '#1976D2' : '#8E24AA';
      
      const marker = new google.maps.Marker({
        position: transport.location,
        map: this.map.googleMap,
        title: transport.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="${labelWidth + 10}" height="50" viewBox="0 0 ${labelWidth + 10} 50">
              <!-- Label background -->
              <rect x="5" y="5" width="${labelWidth}" height="18" rx="9" fill="white" stroke="${iconColor}" stroke-width="1"/>
              <!-- Label text -->
              <text x="${(labelWidth + 10) / 2}" y="16" text-anchor="middle" fill="${iconColor}" font-family="Arial, sans-serif" font-size="11" font-weight="bold">${transport.name}</text>
              <!-- Marker circle -->
              <circle cx="${(labelWidth + 10) / 2}" cy="37" r="10" fill="${iconColor}" stroke="white" stroke-width="2"/>
              <!-- Marker text -->
              <text x="${(labelWidth + 10) / 2}" y="41" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="9" font-weight="bold">${transport.icon}</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(labelWidth + 10, 50),
          anchor: new google.maps.Point((labelWidth + 10) / 2, 47)
        }
      });
      
      const linksHtml = transport.links?.map(link => 
        `<a href="${link.url}" target="${link.type === 'external' ? '_blank' : '_self'}" 
           style="display: inline-block; margin: 2px 4px 2px 0; padding: 4px 8px; 
                  background: ${iconColor}; color: white; text-decoration: none; 
                  border-radius: 4px; font-size: 11px;">
           <i class="fas ${link.type === 'pdf' ? 'fa-file-pdf' : 'fa-external-link-alt'}"></i> ${link.text}
         </a>`
      ).join('') || '';

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: Arial, sans-serif; min-width: 200px;">
            <h4 style="margin: 0 0 4px 0; color: ${iconColor};">${transport.name}</h4>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${transport.description}</p>
            ${linksHtml ? `<div style="margin-top: 8px;">${linksHtml}</div>` : ''}
          </div>
        `
      });
      
      marker.addListener('click', () => {
        this.transportInfoWindows.forEach(iw => iw.close());
        infoWindow.open(this.map.googleMap, marker);
      });
      
      this.transportMarkers.push(marker);
      this.transportInfoWindows.push(infoWindow);
    });
  }
  
  private adjustMapView() {
    const filteredTransport = this.transportOptions.filter(transport => {
      if (this.transportFilter === 'all') return true;
      if (this.transportFilter === 'bus') return transport.type === 'bus_station';
      if (this.transportFilter === 'train') return transport.type === 'train_station';
      return false;
    });

    const allLocations = [this.markerPosition, ...filteredTransport.map(transport => transport.location)];
    const latitudes = allLocations.map(loc => loc.lat);
    const longitudes = allLocations.map(loc => loc.lng);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    this.center = { lat: centerLat, lng: centerLng };
    
    this.zoom = this.transportFilter === 'bus' ? 17 : 15;
  }
  
  clearTransport() {
    this.clearTransportMarkers();
    this.showingTransport = false;
    this.transportFilter = 'all';
    this.mapOptions = { ...this.mapOptions, styles: this.defaultMapStyle };
    this.resetMapView();
  }
  
  clearDirections() {
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] } as any);
    }
    
    this.directionsMarkers.forEach(marker => {
      marker.setMap(null);
    });
    this.directionsMarkers = [];
    
    if (this.directionsInfoWindow) {
      this.directionsInfoWindow.close();
      this.directionsInfoWindow = null;
    }
    
    this.showingDirections = false;
    this.resetMapView();
  }
  
  clearShops() {
    this.shopsMarkers.forEach(marker => {
      marker.setMap(null);
    });
    this.shopsMarkers = [];
    
    this.shopsInfoWindows.forEach(infoWindow => {
      infoWindow.close();
    });
    this.shopsInfoWindows = [];
    
    this.showingShops = false;
    this.mapOptions = { ...this.mapOptions, styles: this.defaultMapStyle };
    this.resetMapView();
  }
  
  private resetMapView() {
    if (!this.showingDirections && !this.showingShops && !this.showingTransport && !this.showingAttractions) {
      this.center = this.markerPosition;
      this.zoom = 15;
      
      if (this.map && this.map.googleMap) {
        this.map.googleMap.setCenter(this.markerPosition);
        this.map.googleMap.setZoom(15);
      }
    }
  }
  
  showLocalAttractions() {
    if (this.showingAttractions) {
        this.clearAttractions();
      return;
    }
    
    if (this.showFallback) return;
    
    this.clearDirections();
    this.clearShops();
    this.clearTransport();
    this.showingAttractions = true;
    this.selectedAttraction = null;
    
    this.createAttractionMarkers();
    this.adjustAttractionMapView();
  }
  
  private createAttractionMarkers() {
    if (!this.map || !this.map.googleMap) return;
    
    const allAttractions = this.attractionCategories.flatMap(category => category.attractions);
    
    allAttractions.forEach(attraction => {
      const labelWidth = attraction.name.length * 7 + 20;
      const iconColor = '#FF6B35';
      
      const marker = new google.maps.Marker({
        position: attraction.location,
        map: this.map.googleMap,
        title: attraction.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="${labelWidth + 10}" height="50" viewBox="0 0 ${labelWidth + 10} 50">
              <!-- Label background -->
              <rect x="5" y="5" width="${labelWidth}" height="18" rx="9" fill="white" stroke="${iconColor}" stroke-width="1"/>
              <!-- Label text -->
              <text x="${(labelWidth + 10) / 2}" y="16" text-anchor="middle" fill="${iconColor}" font-family="Arial, sans-serif" font-size="11" font-weight="bold">${attraction.name}</text>
              <!-- Marker circle -->
              <circle cx="${(labelWidth + 10) / 2}" cy="37" r="10" fill="${iconColor}" stroke="white" stroke-width="2"/>
              <!-- Marker text -->
              <text x="${(labelWidth + 10) / 2}" y="41" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="8" font-weight="bold">★</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(labelWidth + 10, 50),
          anchor: new google.maps.Point((labelWidth + 10) / 2, 47)
        }
      });
      
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: Arial, sans-serif; min-width: 200px;">
            <h4 style="margin: 0 0 4px 0; color: ${iconColor};">${attraction.name}</h4>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${attraction.description}</p>
          </div>
        `
      });
      
      marker.addListener('click', () => {
        this.attractionsInfoWindows.forEach(iw => iw.close());
        infoWindow.open(this.map.googleMap, marker);
      });
      
      this.attractionsMarkers.push(marker);
      this.attractionsInfoWindows.push(infoWindow);
    });
  }
  
  private adjustAttractionMapView() {
    const allAttractions = this.attractionCategories.flatMap(category => category.attractions);
    
    const allLocations = [this.markerPosition, ...allAttractions.map(attraction => attraction.location)];
    const latitudes = allLocations.map(loc => loc.lat);
    const longitudes = allLocations.map(loc => loc.lng);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    this.center = { lat: centerLat, lng: centerLng };
    this.zoom = 11;
  }
  
  clearAttractions() {
    this.attractionsMarkers.forEach(marker => {
      marker.setMap(null);
    });
    this.attractionsMarkers = [];
    
    this.attractionsInfoWindows.forEach(infoWindow => {
      infoWindow.close();
    });
    this.attractionsInfoWindows = [];
    
    this.showingAttractions = false;
    this.selectedAttraction = null;
    this.resetMapView();
  }
  
  zoomToAttraction(categoryIndex: number, attractionIndex: number) {
    const category = this.attractionCategories[categoryIndex];
    if (!category || !category.attractions[attractionIndex] || !this.map || !this.map.googleMap) return;
    
    const attraction = category.attractions[attractionIndex];
    
    if (this.selectedAttraction?.categoryIndex === categoryIndex && 
        this.selectedAttraction?.attractionIndex === attractionIndex) {
      this.selectedAttraction = null;
      this.adjustAttractionMapView();
      return;
    }
    
    this.selectedAttraction = { categoryIndex, attractionIndex };
    
    this.center = attraction.location;
    this.zoom = 16;
    
    this.map.googleMap.setCenter(attraction.location);
    this.map.googleMap.setZoom(16);
    
    const allAttractions = this.attractionCategories.flatMap(cat => cat.attractions);
    const globalAttractionIndex = this.attractionCategories.slice(0, categoryIndex)
      .reduce((sum, cat) => sum + cat.attractions.length, 0) + attractionIndex;
    
    if (this.attractionsInfoWindows[globalAttractionIndex]) {
      this.attractionsInfoWindows.forEach(iw => iw.close());
      this.attractionsInfoWindows[globalAttractionIndex].open(this.map.googleMap, this.attractionsMarkers[globalAttractionIndex]);
    }
  }

  getBeachLocation(): google.maps.LatLngLiteral {
    return this.beachLocation;
  }
}

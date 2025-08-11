export const MAP_STYLES = {
  grocery: [
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
  ],
  
  transport: [
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#ffffffff' }]
    }
  ],
  
  default: [
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
  ]
};

export const DEFAULT_MAP_OPTIONS: google.maps.MapOptions = {
  mapTypeId: 'roadmap',
  styles: MAP_STYLES.default,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
  zoomControl: true
};
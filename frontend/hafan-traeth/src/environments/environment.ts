export const environment = {
  production: false,
  // Google Maps API Key - Get yours at: https://console.cloud.google.com/apis/credentials
  // Enable Maps JavaScript API and Geocoding API for your key
  // For production, restrict the key to your domain
  googleMapsApiKey: 'YOUR_DEVELOPMENT_GOOGLE_MAPS_API_KEY_HERE',
  apiUrl: 'http://localhost:7071/api', // Local Azure Functions URL
  bookingComUrl: 'https://www.booking.com/hotel/gb/hafan-traeth.en-gb.html',
  bookingComReviewsUrl: 'https://www.booking.com/hotel/gb/hafan-traeth.en-gb.html#tab-reviews',
  airbnbUrl: 'https://www.airbnb.co.uk/rooms/920441523710400719',
  airbnbReviewsUrl: 'https://www.airbnb.co.uk/rooms/920441523710400719/reviews',
  icalUrl: 'https://ical.booking.com/v1/export?t=32f37ade-b2ed-48b9-9e49-573b6dcc4660',
  // Bus route information
  busRoute35PdfUrl: '/36-Rhyl-Circular-from-26-Jan-2025.pdf', // Route to Prestatyn town
  busRoute36PdfUrl: '/35-Rhyl-Circular-from-26-Jan-2025.pdf', // Route to Rhyl
  busRoute35PlannerUrl: 'https://www.arrivabus.co.uk/find-a-service/35-rhyl-circular',
  busRoute36PlannerUrl: 'https://www.arrivabus.co.uk/find-a-service/36-rhyl-circular'
};
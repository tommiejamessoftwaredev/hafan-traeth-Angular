export const environment = {
  production: true,
  // Google Maps API Key - Get yours at: https://console.cloud.google.com/apis/credentials
  // Enable Maps JavaScript API and Geocoding API for your key
  // For production, restrict the key to your domain
  googleMapsApiKey: 'YOUR_PRODUCTION_GOOGLE_MAPS_API_KEY_HERE',
  apiUrl: 'https://your-function-app.azurewebsites.net/api', // Production Azure Functions URL
  bookingComUrl: 'https://www.booking.com/hotel/gb/hafan-traeth.en-gb.html',
  bookingComReviewsUrl: 'https://www.booking.com/hotel/gb/hafan-traeth.en-gb.html#tab-reviews',
  airbnbUrl: 'https://www.airbnb.co.uk/rooms/920441523710400719',
  airbnbReviewsUrl: 'https://www.airbnb.co.uk/rooms/920441523710400719/reviews',
  icalUrl: 'https://ical.booking.com/v1/export?t=YOUR_ICAL_TOKEN_HERE'
};
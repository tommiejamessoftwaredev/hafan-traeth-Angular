# Google Maps API Setup

## Getting Your API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API (optional, for address lookups)

4. Go to "Credentials" and create a new API key
5. Copy your API key

## Configuration

1. Open `src/environments/environment.ts`
2. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key:

```typescript
export const environment = {
  production: false,
  googleMapsApiKey: 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Your actual key here
  // ... other config
};
```

## Security (Production)

For production, restrict your API key:

1. In Google Cloud Console, go to your API key
2. Under "Application restrictions", select "HTTP referrers"
3. Add your domain(s):
   - `https://yourdomain.com/*`
   - `https://www.yourdomain.com/*`

## API Limits

- Google Maps provides a free tier with generous limits
- Monitor usage in Google Cloud Console
- Set up billing alerts if needed

## Fallback

If no API key is configured, the component automatically shows an OpenStreetMap fallback instead of Google Maps.
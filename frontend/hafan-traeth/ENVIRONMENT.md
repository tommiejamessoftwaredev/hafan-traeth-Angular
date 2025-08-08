# Environment Configuration

This document explains how to configure environment variables for the Hafan Traeth application.

## Environment Files

The application uses Angular's built-in environment system with the following files:

- `src/environments/environment.ts` - Development environment
- `src/environments/environment.prod.ts` - Production environment

## Configuration Variables

### Google Maps API Key
- **Variable**: `googleMapsApiKey`
- **Purpose**: Enables interactive Google Maps functionality
- **Required**: Yes
- **How to get**: [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials

### API URLs
- **Variable**: `apiUrl`
- **Purpose**: Backend API endpoint for calendar and pricing data
- **Development**: `http://localhost:7071/api` (Azure Functions local)
- **Production**: `https://your-function-app.azurewebsites.net/api`

### Booking Platform URLs
- **Variable**: `bookingComUrl`, `airbnbUrl`
- **Purpose**: Direct booking links for availability calendar
- **Format**: Full booking platform URLs with property ID

## Security Notes

1. **Never commit API keys to version control**
2. **Use different keys for development/production**
3. **Restrict API keys to specific domains in production**
4. **Monitor API key usage in Google Cloud Console**

## Setup Instructions

1. Update the API key in both environment files:
   ```typescript
   // src/environments/environment.ts
   googleMapsApiKey: 'your-development-api-key'
   
   // src/environments/environment.prod.ts  
   googleMapsApiKey: 'your-production-api-key'
   ```

2. Configure your booking platform URLs with actual property IDs

3. Set up your backend API endpoints when ready

## Building for Different Environments

- **Development**: `ng serve` (uses environment.ts)
- **Production**: `ng build --configuration=production` (uses environment.prod.ts)
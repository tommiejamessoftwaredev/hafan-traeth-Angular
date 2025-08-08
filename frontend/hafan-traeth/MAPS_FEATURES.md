# Google Maps Enhanced Features

## New Interactive Features

### 1. Beach Access Walking Directions
- **Click** the Beach Access feature to show/hide walking directions on the map
- Displays the walking route from Hafan Traeth to Ffrith Beach
- Shows estimated walking time and distance
- Toggle on/off without opening new windows

### 2. Local Shops Highlighting
- **Click** the Local Shops feature to show/hide nearby shops on the map
- Displays markers for:
  - 🛒 Tesco Prestatyn (Supermarket)
  - 🛍️ Prestatyn High Street (Shopping Street) 
  - 🏪 Spar Express (Convenience Store)
  - 🏬 Prestatyn Town Centre (Shopping Center)
- Each marker shows shop details when clicked
- Adjusts map zoom to show all locations

### 3. Interactive Features
- **Active State**: Features show blue highlighting when active
- **Toggle Functionality**: Click again to hide directions/shops
- **Smart Switching**: Only one feature active at a time
- **Fallback Support**: Works with or without Google Maps API key

## Technical Implementation

- Uses Google Maps Directions API for walking routes
- Custom shop markers with emoji icons
- Responsive map controls and zoom adjustments  
- Graceful fallback to OpenStreetMap when API unavailable

## Usage
1. Ensure Google Maps API key is configured in environment
2. Click "Beach Access" to see walking directions to beach
3. Click "Local Shops" to see nearby shopping options
4. Click active features again to clear and return to normal view
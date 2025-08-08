// Simple test script to verify iCal functionality
const https = require('https');

function fetchWithRedirects(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      reject(new Error('Too many redirects'));
      return;
    }

    console.log('Fetching:', url);
    
    https.get(url, (res) => {
      console.log('Status Code:', res.statusCode);
      
      if (res.statusCode === 302 || res.statusCode === 301) {
        const location = res.headers.location;
        console.log('Redirecting to:', location);
        fetchWithRedirects(location, maxRedirects - 1).then(resolve).catch(reject);
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
}

const icalUrl = 'https://admin.booking.com/hotel/hoteladmin/ical.html?t=32f37ade-b2ed-48b9-9e49-573b6dcc4660';

console.log('Testing iCal access with redirect handling...');

fetchWithRedirects(icalUrl)
  .then(data => {
    console.log('Response length:', data.length);
    console.log('First 500 chars:', data.substring(0, 500));
    
    // Basic iCal validation
    if (data.includes('BEGIN:VCALENDAR')) {
      console.log('✅ Valid iCal data received');
      
      // Count events
      const eventMatches = data.match(/BEGIN:VEVENT/g);
      console.log('Number of events found:', eventMatches ? eventMatches.length : 0);
    } else {
      console.log('❌ Invalid iCal data - missing VCALENDAR');
      console.log('Data preview:', data.substring(0, 200));
    }
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
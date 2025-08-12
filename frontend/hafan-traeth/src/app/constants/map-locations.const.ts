import { MapLocation, AttractionCategory } from '../interfaces/map.interface';

export const LOCAL_SHOPS: MapLocation[] = [
  {
    name: 'Spar',
    location: { lat: 53.33498801660247, lng: -3.427581293313341 },
    type: 'convenience_store',
    description: 'Spar convenience store on Victoria Road',
    icon: 'shop'
  },
  {
    name: 'Co-op',
    location: { lat: 53.33661637351705, lng: -3.4157436514852186 },
    type: 'grocery_or_supermarket',
    description: 'Co-operative Food store on Victoria Road',
    icon: 'shop'
  },
  {
    name: 'Tesco',
    location: { lat: 53.33673759602825, lng: -3.401879530165172 },
    type: 'grocery_or_supermarket',
    description: 'Large Tesco superstore',
    icon: 'shop'
  },
  {
    name: 'Home Bargains',
    location: { lat: 53.33540812533078, lng: -3.408008607890734 },
    type: 'store',
    description: 'Home Bargains discount store',
    icon: 'shop'
  },
  {
    name: 'Lidl',
    location: { lat: 53.33429370519122, lng: -3.405421421372873 },
    type: 'grocery_or_supermarket',
    description: 'Lidl supermarket',
    icon: 'shop'
  },
  {
    name: 'Aldi',
    location: { lat: 53.33097772063083, lng: -3.4028241117530307 },
    type: 'grocery_or_supermarket',
    description: 'Aldi supermarket at the top of town',
    icon: 'shop'
  }
];

export const ATTRACTION_CATEGORIES: AttractionCategory[] = [
  {
    name: 'Castles & Historic Sites',
    icon: 'castle',
    attractions: [
      {
        name: 'Rhuddlan Castle',
        location: { lat: 53.28984747153027, lng: -3.46465229345647},
        type: 'castle',
        description: '13th-century castle ruins with rich Welsh history',
        icon: 'castle',
        links: [{ url: 'https://cadw.gov.wales/visit/places-to-visit/rhuddlan-castle', text: 'Visit Info', type: 'external', icon: 'fas fa-external-link-alt' }],
        website: 'https://cadw.gov.wales/visit/places-to-visit/rhuddlan-castle'
      },
      {
        name: 'Bodelwyddan Castle',
        location: { lat: 53.26146141185901, lng: -3.502740685134114 },
        type: 'castle',
        description: 'Victorian castle with art galleries and parkland',
        icon: 'castle',
        links: [{ url: 'https://www.warnerhotels.co.uk/hotels/bodelwyddan-castle-hotel', text: 'Official Site', type: 'external', icon: 'fas fa-external-link-alt' }],
        website: 'https://www.warnerhotels.co.uk/hotels/bodelwyddan-castle-hotel'
      },
      {
        name: 'Gwrych Castle',
        location: { lat: 53.283126350431665, lng:-3.6071014498577987 },
        type: 'castle',
        description: 'Spectacular 19th-century castle, home to I\'m A Celebrity',
        icon: 'castle',
        links: [{ url: 'https://www.gwrychcastle.co.uk/', text: 'Official Site', type: 'external', icon: 'fas fa-external-link-alt' }],
        website: 'https://www.gwrychcastle.co.uk/'
      }
    ]
  },
  {
    name: 'Beaches',
    icon: 'beach',
    attractions: [
      {
        name: 'Ffrith Beach',
        location: { lat: 53.33596719394663, lng: -3.4381125994646626 },
        type: 'beach',
        description: 'Beautiful sandy beach, 5-minute walk from the property',
        icon: 'beach',
        links: []
      },
      {
        name: 'Barkby Beach',
        location: { lat: 53.34501151962178, lng: -3.4021314919914016 },
        type: 'beach',
        description: 'Quiet sandy beach perfect for relaxation',
        icon: 'beach',
        links: []
      }
    ]
  },
  {
    name: 'Golf & Sports',
    icon: 'golf',
    attractions: [
      {
        name: 'Prestatyn Golf Club',
        location: { lat: 53.34359585248063, lng: -3.399578575590329},
        type: 'golf_course',
        description: '18-hole championship golf course',
        icon: 'golf',
        links: [{ url: 'https://prestatyngolfclub.co.uk/visitors.html', text: 'Visit Info', type: 'external', icon: 'fas fa-golf-ball' }],
        website: 'https://prestatyngolfclub.co.uk/visitors.html'
      },
      {
        name: 'Crazy Golf',
        location: { lat: 53.341409133712176, lng: -3.4119256381834266 },
        type: 'amusement_park',
        description: 'Family-friendly mini golf course',
        icon: 'golf',
        links: []
      },
      {
        name: 'AstroBowl',
        location: { lat: 53.3344759338221, lng: -3.4327660688154977 },
        type: 'bowling_alley',
        description: 'Traditional bowling green and club',
        icon: 'bowling',
        links: []
      }
    ]
  },
  {
    name: 'Entertainment & Attractions',
    icon: 'entertainment',
    attractions: [
      {
        name: 'Nova Leisure Centre',
        location: { lat: 53.341928338627746, lng: -3.4130666523605555 },
        type: 'movie_theater',
        description: 'Entertainment complex with cinema and restaurants',
        icon: 'cinema',
        links: []
      },
      { 
        name: 'SC2 Rhyl',
        location: { lat: 53.32061732066503, lng: -3.495869050296468 },
        type: 'amusement_park',
        description: 'Large waterpark and leisure complex',
        icon: 'waterpark',
        links: [{ url: 'https://sc2rhyl.co.uk/', text: 'Book Tickets', type: 'external', icon: 'fas fa-swimmer' }],
        website: 'https://sc2rhyl.co.uk/'
      },
      {
        name: 'Scala Cinema',
        location: { lat: 53.33535241551636, lng: -3.4047116610715236 },
        type: 'movie_theater',
        description: 'Local cinema showing latest films',
        icon: 'cinema',
        links: [{ url: 'https://www.merlincinemas.co.uk/', text: 'View Films', type: 'external', icon: 'fas fa-film' }],
        website: 'https://www.merlincinemas.co.uk/'
      },
      {
        name: 'Pavilion Theatre',
        location: { lat: 53.32621110538621, lng: -3.4833133622145165 },
        type: 'performing_arts_theater',
        description: 'Historic theatre with live performances',
        icon: 'theatre',
        links: [{ url: 'https://rhylpavilion.co.uk/', text: 'Show Times', type: 'external', icon: 'fas fa-theater-masks' }],
        website: 'https://rhylpavilion.co.uk/'
      }
    ]
  },
  {
    name: 'Natural Attractions',
    icon: 'nature',
    attractions: [
      {
        name: 'Gwaenysgor Viewpoint',
        location: { lat: 53.32546616498002, lng: -3.391042081599307 },
        type: 'tourist_attraction',
        description: 'Panoramic views over the Irish Sea and coastline',
        icon: 'viewpoint',
        links: []
      },
      {
        name: 'Dyserth Waterfall',
        location: { lat: 53.30189854687248, lng: -3.41759212015089 },
        type: 'natural_feature',
        description: 'Beautiful 70-foot waterfall and nature walk',
        icon: 'waterfall',
        links: []
      },
      {
        name: 'Point of Ayr Lighthouse',
        location: { lat: 53.356886181192095, lng: -3.3221512539549045 },
        type: 'lighthouse',
        description: 'Historic lighthouse with stunning coastal views',
        icon: 'lighthouse',
        links: []
      }
    ]
  }
];
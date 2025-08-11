import { MapLocation } from '../interfaces/map.interface';

// This will be initialized with config values in the component
export const getTransportOptions = (config: any): MapLocation[] => [
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
        url: config?.busRoute36PdfUrl,
        type: 'pdf'
      },
      {
        text: 'Route 36 Journey Planner',
        url: config?.busRoute36PlannerUrl,
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
        url: config?.busRoute35PdfUrl,
        type: 'pdf'
      },
      {
        text: 'Route 35 Journey Planner',
        url: config?.busRoute35PlannerUrl,
        type: 'external'
      }
    ]
  }
];
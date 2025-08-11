# Hafan Traeth - Holiday Property Website

A modern, responsive Angular application showcasing a holiday property rental business in North Wales. This project demonstrates front-end development skills, interactive mapping functionality, and clean UI/UX design principles.

## Live Demo
*[Add your deployed application URL here]*

## Project Overview

**Hafan Traeth** is a sophisticated single-page application built for a coastal holiday rental property. The website provides guests with comprehensive information about the property, local attractions, and booking availability through an intuitive, visually appealing interface.

### Key Features

- **Interactive Google Maps Integration** with custom markers and filtering
- **Dynamic Availability Calendar** for booking management
- **Responsive Image Gallery** with modern layout
- **Local Attractions Guide** with categorized points of interest
- **Guest Reviews Section** showcasing customer feedback
- **Comprehensive Amenities Display**
- **FAQ Section** with expandable content
- **Mobile-First Responsive Design**

## Technology Stack

### Frontend
- **Angular**
- **SCSS**
- **Google Maps JavaScript API**
- **Google Fonts** 
- **Font Awesome**

### Development Tools
- **TypeScript** - Type-safe development
- **Angular CLI** - Development and build tooling
- **ESLint** - Code quality and consistency

## Architecture & Components

### Component Structure
```
src/app/
├── components/
│   ├── availability-calendar/    # Booking calendar widget
│   ├── google-map/              # Interactive map with attractions
│   ├── property-gallery/        # Responsive image gallery
│   ├── guest-reviews/          # Customer testimonials
│   ├── amenities-list/         # Property features display
│   └── faq-section/            # Expandable FAQ content
├── environments/               # Configuration management
└── styles/                    # Global SCSS styling
```

### Key Technical Implementations

#### Google Maps Integration
- **Custom Markers** with SVG icons and dynamic labeling
- **Multi-layer Filtering** (Transport, Shops, Attractions, Directions)
- **Interactive Info Windows** with rich content
- **Dynamic Zoom Controls** based on selected content
- **Fallback Support** for API failures

#### Interactive Features
- **Category-based Attraction Filtering** with 15+ local points of interest
- **Transport Information** with live departure links and timetables
- **Walking Directions** with custom route rendering
- **Responsive Map Controls** with touch-friendly interface

#### Responsive Design
- **Mobile-First Approach** with breakpoint-specific layouts
- **Flexible Grid Systems** adapting to screen sizes
- **Touch-Optimized Controls** for mobile interaction
- **Progressive Enhancement** ensuring functionality across devices

## Design Features

### Visual Design
- **Modern Typography** combining serif and sans-serif fonts
- **Cohesive Color Palette** with CSS custom properties
- **Smooth Animations** and micro-interactions
- **Professional Photography Integration**
- **Clean, Minimalist Layout** focusing on content

### User Experience
- **Intuitive Navigation** with clear visual hierarchy
- **Fast Loading Times** with optimized assets
- **Accessibility Considerations** with semantic HTML
- **Cross-browser Compatibility**

## Responsive Implementation

The application is fully responsive across all device types:

- **Desktop** (1200px+): Full-featured layout with side-by-side content
- **Tablet** (768px-1199px): Adapted grid layouts with optimized spacing
- **Mobile** (320px-767px): Single-column layout with touch-friendly controls

## Development Highlights

### Code Quality
- **TypeScript Integration** for type safety and better developer experience
- **Modular Component Architecture** following Angular best practices
- **SCSS Organization** with variables, mixins, and component-scoped styles
- **Clean Code Principles** with descriptive naming and minimal comments

### Performance Optimizations
- **Lazy Loading** for images and components
- **Efficient Change Detection** with OnPush strategies
- **Optimized Bundle Size** through tree shaking
- **Responsive Image Loading** based on viewport

### API Integration
- **Google Maps JavaScript API** for mapping functionality
- **Error Handling** with graceful fallbacks
- **Environment Configuration** for different deployment stages
- **External Link Integration** for booking and information services

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Google Maps API key

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd hafan-traeth-Angular/frontend/hafan-traeth

# Install dependencies
npm install

# Set up environment variables
cp src/environments/environment.template.ts src/environments/environment.ts
# Add your Google Maps API key to environment.ts

# Start development server
ng serve
```

### Build for Production
```bash
# Build the application
ng build --prod

# Serve the built application
npx http-server dist/hafan-traeth
```

## Professional Showcase

This project demonstrates proficiency in:

### Technical Skills
- **Modern Angular Development** with latest features and best practices
- **Advanced TypeScript** usage with complex type definitions
- **Google Maps API Integration** with custom functionality
- **Responsive Web Design** with mobile-first approach
- **SCSS/CSS Architecture** with maintainable, scalable styling
- **Component-Based Architecture** with reusable, modular design

### Problem-Solving Abilities
- **Complex State Management** across multiple interactive components
- **API Integration Challenges** with error handling and fallbacks
- **Performance Optimization** for maps and media-rich content
- **Cross-Browser Compatibility** solutions
- **Accessibility Implementation** following web standards

### Industry Best Practices
- **Clean Code Principles** with maintainable, readable codebase
- **Version Control** with meaningful commit messages
- **Documentation** for future maintenance and collaboration
- **Responsive Design** prioritizing user experience across devices
- **SEO Considerations** with semantic HTML structure

---

# Stella Lodge Tahiti - User Interface Design Document

## Layout Structure

### Overall Approach: Immersive Tropical Retreat
The Stella Lodge Tahiti landing page follows a single-page application (SPA) structure with smooth scrolling between clearly defined sections. The layout prioritizes immersive imagery and creates an immediate emotional connection to the tropical, serene atmosphere of the property.

### Page Sections (in order)
1. **Hero Section** - Full-width panoramic view with minimal text overlay
2. **Introduction** - Brief property overview with key highlights
3. **Gallery** - Showcase of interior and exterior spaces
4. **Amenities** - Available utilities and equipment
5. **Location** - Map and nearby attractions
6. **Pricing & Availability** - Rates and booking calendar
7. **Contact & FAQ** - Additional information
8. **Footer** - Essential links and information

### Navigation
- Subtle, fixed-position navigation bar that becomes semi-transparent when scrolling
- Quick-jump links to each major section
- Persistent "Book Now" button in a contrasting color

## Core Components

### Hero Section
- Full-width, high-resolution panoramic image of the property with Tahitian waters visible
- Minimal text overlay with property name and a single-line tagline
- Subtle scroll indicator encouraging visitors to explore further
- Optional: Gentle wave animation at the bottom edge transitioning to the next section

### Floating Booking Widget
- Clean white card with subtle shadow that travels with the user through certain sections
- Simplified date selection with clear availability indicators
- Minimalist form requiring only essential information
- Clear pricing display with breakdown when applicable
- Prominent "Reserve Now" button in Tahitian blue

### Image Gallery
- Mixed layout combining:
  - Full-width showcase images for key spaces
  - Tiled gallery with hover expansion for secondary spaces
- Subtle transition effects between images
- Optional lightbox view for enlarged images
- Navigation indicators using small dots or preview thumbnails
- Auto-scroll option with manual override

### Amenities Display
- Icon-based grid presentation with white icons on blue circular backgrounds
- Simple hover effects revealing brief descriptions
- Organized into logical categories (Bedroom, Kitchen, Outdoor, etc.)
- Visual indicators for standout amenities

### Location Module
- Interactive Google Maps integration with custom property marker
- Visually appealing list of nearby attractions with distances and estimated travel times
- Toggle options to filter points of interest (Restaurants, Beaches, Shopping, etc.)
- Simple directions interface from common arrival points

### Testimonials Display
- Clean cards with guest quotes and ratings
- Subtle tropical design elements as separators
- Automatic rotation with manual browsing option

## Interaction Patterns

### Scrolling Behavior
- Smooth, controlled scrolling between sections
- Subtle parallax effects on select background images to create depth
- Auto-highlighting of navigation items based on current section
- Gentle fade-in animations as content sections enter the viewport

### Booking Process
1. Date selection with immediate availability feedback
2. Room/accommodation options (if applicable)
3. Guest information with minimal required fields
4. Payment processing with security reassurances
5. Confirmation screen with shareable details

### Responsive Interactions
- Image galleries adapt from grid to single-column on smaller screens
- Navigation collapses to hamburger menu on mobile
- Booking widget adjusts from floating card to inline form on mobile
- Touch-friendly controls with appropriate tap targets on mobile

### Micro-interactions
- Gentle wave animation on hover for primary buttons
- Subtle scaling effects on image hover
- Calm blue pulse effect on booking confirmation
- Smooth transitions between form steps

## Visual Design Elements & Color Scheme

### Primary Color Palette
- **Pure White (#FFFFFF)** - Primary background color, creating an airy, clean canvas
- **Tahitian Blue (#4FB0AE)** - Primary accent color for CTAs, highlights, and key information
- **Light Sand (#F9F7F2)** - Secondary background color for content cards
- **Deep Blue (#005A87)** - Used sparingly for text and emphasis

### Secondary Elements
- **Tropical Gradient** - Subtle gradient from light to deep blue for special elements
- **Translucent Overlays** - White overlays with 85-90% opacity for text on images
- **Natural Textures** - Subtle patterns inspired by palm fronds or waves for section dividers

### Imagery Style
- High-contrast, bright photographs highlighting natural light
- Consistent color treatment emphasizing blues and whites
- Focus on serene, uncluttered spaces
- Mix of wide establishing shots and detail images

### Iconography
- Simple, line-based icons with 2px stroke width
- Rounded corners for a friendly feel
- Consistent blue color with white when on colored backgrounds
- Subtle animation on hover/interaction

## Mobile, Web App, Desktop Considerations

### Mobile Experience (Portrait)
- Vertically stacked layout optimized for scrolling
- Full-width images and content sections
- Simplified booking process with step indicators
- Fixed booking button that expands to full form when tapped
- Bottom navigation bar for essential actions

### Tablet Experience (Portrait/Landscape)
- Two-column layouts for certain content sections
- Side-by-side comparison for room options
- Expanded gallery views with more visible thumbnails
- Floating booking widget repositioned to sidebar on landscape

### Desktop Experience
- Widescreen layouts utilizing horizontal space effectively
- Multi-column content where appropriate
- Expanded navigation with visible section labels
- Persistent sidebar for booking widget
- Immersive gallery experiences with larger viewing areas

### Progressive Enhancement
- Base functionality works on all devices
- Enhanced animations and transitions on more capable devices
- Fallbacks for older browsers that maintain essential functionality
- Optimized image loading based on connection quality

## Typography

### Font Selections
- **Primary Headings**: Montserrat Light (lightweight, modern sans-serif)
- **Body Text**: Open Sans (highly readable across devices)
- **Accent Text**: Montserrat Medium (for emphasis and subheadings)

### Type Scale
- **Hero Title**: 48px/36px/28px (Desktop/Tablet/Mobile)
- **Section Headings**: 36px/28px/24px
- **Subheadings**: 24px/20px/18px
- **Body Text**: 16px/16px/15px
- **Small Text/Captions**: 14px/14px/13px

### Text Treatments
- Generous line height (1.5-1.6) for body text
- Ample letter spacing for headings (+5%)
- Clear hierarchy with consistent spacing patterns
- Limited text on images with appropriate contrast

## Accessibility

### Color Considerations
- Minimum contrast ratio of 4.5:1 for all text
- Non-color indicators for all state changes
- Alternative text-based version of all color-coded information

### Navigation & Interaction
- Keyboard navigable interface with visible focus states
- Skip-to-content link for screen readers
- ARIA labels for all interactive elements
- Logical tab order following visual hierarchy

### Content Design
- Alt text for all images describing both content and mood
- Captions for video content
- Transcripts for any audio elements
- Properly structured headings in logical order (H1 → H6)

### Technical Implementation
- Semantic HTML structure
- ARIA landmarks for major sections
- Proper form labels and error handling
- Support for screen readers and assistive technologies
- Respects user preferences for reduced motion

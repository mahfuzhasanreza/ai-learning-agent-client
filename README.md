# AIDA - AI Learning Agent Client

A modern, professional AI-powered learning platform with advanced animations and interactive features.

## 🚀 Features

### Landing Page
- **Professional Hero Section** with animated gradient backgrounds
- **Interactive Features Section** showcasing platform capabilities
- **Quick Start Prompts** with smooth navigation to chat
- **Animated Statistics Section** with counting animations
- **Responsive Navigation** with smooth scrolling

### Chat Interface
- **AI-Powered Conversations** with context awareness
- **Voice Recognition** for hands-free interaction
- **Real-time Responses** with typing animations
- **Conversation History** with persistent storage
- **Enhanced UI** with modern design and animations

## 📁 File Structure

```
src/
├── components/
│   ├── LandingPage/
│   │   ├── LandingPage.jsx          # Main landing page component
│   │   ├── LandingPage.css          # Landing page styles
│   │   ├── components/
│   │   │   └── Navigation.jsx       # Navigation component
│   │   └── sections/
│   │       ├── HeroSection.jsx      # Hero section with animations
│   │       ├── FeaturesSection.jsx  # Features showcase
│   │       ├── QuickPromptsSection.jsx # Quick start prompts
│   │       └── StatsSection.jsx     # Statistics with counters
│   ├── Main/
│   │   ├── Main.jsx                 # Chat interface component
│   │   └── Main.css                 # Chat interface styles
│   └── Sidebar/
│       ├── Sidebar.jsx              # Sidebar navigation
│       └── Sidebar.css              # Sidebar styles
├── pages/
│   ├── LandingPage.jsx              # Landing page route
│   └── ChatPage.jsx                 # Chat page route
├── context/
│   └── Context.jsx                  # React context for state management
├── config/
│   └── chatResponse.js              # API configuration
├── assets/
│   └── assets.js                    # Asset imports
├── App.jsx                          # Main app with routing
└── main.jsx                         # App entry point
```

## 🎨 Technologies Used

- **React 19** - Modern React with hooks
- **Framer Motion** - Advanced animations and transitions
- **React Spring** - Physics-based animations
- **React Router** - Client-side routing
- **React Icons** - Icon library
- **Tailwind CSS** - Utility-first CSS framework
- **React Intersection Observer** - Scroll-triggered animations

## 🎯 Key Features

### Animation Libraries
- **Framer Motion** for smooth, physics-based animations
- **React Spring** for spring-based transitions
- **Intersection Observer** for scroll-triggered effects

### Professional Design
- **Modern UI/UX** with glass-morphism effects
- **Responsive Design** optimized for all devices
- **Gradient Backgrounds** with animated color shifts
- **Interactive Elements** with hover effects and feedback

### Performance Optimized
- **Lazy Loading** for better performance
- **Optimized Animations** with hardware acceleration
- **Efficient Re-renders** with proper React patterns
- **Mobile-First** responsive design

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:5174`

## 📱 Routes

- `/` - Landing page with sections and navigation
- `/chat` - Main chat interface with AI assistant
- `/*` - Redirects to landing page

## 🎨 Customization

### Colors
The application uses a consistent color scheme with gradients:
- Primary: `#667eea` to `#764ba2`
- Secondary: Various color combinations for features
- Background: Clean whites and light grays

### Animations
- **Entrance Animations** - Elements slide in from bottom
- **Hover Effects** - Cards lift and scale on hover
- **Scroll Animations** - Triggered by intersection observer
- **Loading States** - Smooth transitions between states

## 🔧 Development

### Adding New Sections
1. Create a new component in `src/components/LandingPage/sections/`
2. Import and add to `LandingPage.jsx`
3. Add corresponding styles to `LandingPage.css`

### Adding New Routes
1. Create a new page in `src/pages/`
2. Add route to `App.jsx`
3. Update navigation if needed

## 📄 License

This project is licensed under the MIT License.

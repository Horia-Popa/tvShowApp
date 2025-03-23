## 📖 Project Overview

- **Purpose**: A fan app for the popular TV show "Ted Lasso" providing information about the show, its episodes, and cast
- **Core Features**:
  - General show details
  - Episodes browser with season filtering
  - Episode details with favorites functionality
  - Cast members listing
  - Favorites management with local persistence

## ADD IMAGES

## 🚀 Getting Started

### Prerequisites

- Have Xcode or Android Studio installed and an emulator set-up
- For iOS have Cocoapods installed. For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

### Installation

1. Clone the repository
2. cd [/tvShowApp]
3. npm install
4. npm start

# For Android

```
npm run android
```

# For iOS

```
cd ios
pod install
cd ..
npm run ios
```

If it doesn't run, please open Xcode and open the `tvShowApp.xcworkspace` file inside the ios folder.

## Technologies & Design Decisions

### Tech Stack

- **Frontend**: React Native CLI (TypeScript)
- **State Management**: Zustand
- **API Integration**: Custom fetch wrapper
- **Navigation**: React Navigation
- **Persistence**: AsyncStorage
- **Styling**: StyleSheet
- **Icons**: FontAwesome
- **Testing**: Jest with React Native Testing Library

## Key Design Decisions

### Architecture:

The app follows a modular component-based approach with clear separation of concerns between UI, data fetching, and state management. This increases the maintainability and testability of the codebase.

#### Folder structure rationale

```bash
tvShowApp/
├── android/
├── ios/
├── src/
│   ├── api/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── showService.ts
│   ├── components/
│   │   ├── common/
│   │   ├── episode/
│   ├── navigation/
│   ├── screens/
│   ├── stores/
│   │   ├── useShowStore.ts
│   │   └── useFavoriteStore.ts
│   ├── tests
├── __tests__/
├── App.tsx
├── jest.config.js
└── package.json
```

### State Management:

Zustand was chosen for state management because of its simplicity and light footprint. Two main stores were implemented:

1. **ShowStore**: Manages show data, episodes, and cast information fetched from the TVMaze API
2. **FavoriteStore**: Handles user favorites with persistence using AsyncStorage

### Data Fetching:

The app uses a custom wrapper around the Fetch API to handle data retrieval from the TVMaze API. The implementation includes:

- Type-safe API responses
- Error handling
- Loading state management
- Caching strategies for improved performance

### UI/UX:

The UI design focuses on showcasing the rich visual content from the show with:

- Large hero images for the show and episodes
- Horizontal scrolling lists for easy browsing
- Season filters for quick navigation
- Visually distinct favorites functionality
- Clean typography and spacing for readability

### Testing:

The application includes comprehensive unit tests for:

- Zustand stores (showStore and favoriteStore)
- API service functions

### Persistence:

User favorites are persisted locally using AsyncStorage via Zustand's persist middleware, ensuring favorites remain available across app restarts.

## Future Improvements

To enhance the app further, potential improvements include:

- Adding search functionality for episodes and cast
- Implementing episode filtering by various criteria (rating, favorites)
- Creating a more detailed cast member profile screen
- Implementing push notifications for encouragement to watch again favorite episodes
- Adding a dark mode theme option
- Expanding test coverage to include more UI components
- Adding end-to-end tests with Detox

## API Integration

The app connects to the TVMaze API to fetch show data:

- Show info: https://api.tvmaze.com/shows/44458
- Episode list: https://api.tvmaze.com/shows/44458/episodes
- Cast: https://api.tvmaze.com/shows/44458/cast
- Episode by Id: https://api.tvmaze.com/episodes/1874762

import AsyncStorage from '@react-native-async-storage/async-storage';
import useFavoriteStore from '../../stores/useFavoriteStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock Date.now() to return a fixed timestamp for testing
const mockTimestamp = 1647425000000; // March 16, 2022 10:30:00 AM UTC
jest.spyOn(Date, 'now').mockImplementation(() => mockTimestamp);

describe('useFavoriteStore', () => {
  // Reset the store and clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    useFavoriteStore.setState({favorites: [], isLoading: false});
  });

  // Helper to create mock episodes
  const createMockEpisode = (
    id: number,
    name: string,
    season: number,
    number: number,
  ) => ({
    id,
    name,
    season,
    number,
    image: {
      medium: `https://example.com/episode${id}_medium.jpg`,
      original: `https://example.com/episode${id}_original.jpg`,
    },
    summary: `Test summary for episode ${id}`,
    url: `https://example.com/episode/${id}`,
    type: 'regular',
    airdate: '2022-03-16',
    airtime: '21:00',
    airstamp: '2022-03-16T21:00:00+00:00',
    runtime: 30,
    rating: {average: 8.5},
    _links: {
      self: {href: `https://api.tvmaze.com/episodes/${id}`},
    },
  });

  describe('toggleFavorite', () => {
    test('should add an episode to favorites when not already favorited', () => {
      // Arrange
      const mockEpisode = createMockEpisode(1, 'Test Episode', 1, 1);

      // Act - directly call the store method
      useFavoriteStore.getState().toggleFavorite(mockEpisode);

      // Assert
      const {favorites} = useFavoriteStore.getState();
      expect(favorites).toHaveLength(1);
      expect(favorites[0]).toEqual({
        id: 1,
        name: 'Test Episode',
        season: 1,
        number: 1,
        imageUrl: 'https://example.com/episode1_medium.jpg',
        dateAdded: mockTimestamp,
      });
    });

    test('should remove an episode from favorites when already favorited', () => {
      // Arrange
      const mockEpisode = createMockEpisode(1, 'Test Episode', 1, 1);

      // First add the episode
      useFavoriteStore.getState().toggleFavorite(mockEpisode);

      // Confirm it was added
      expect(useFavoriteStore.getState().favorites).toHaveLength(1);

      // Act - toggle again to remove
      useFavoriteStore.getState().toggleFavorite(mockEpisode);

      // Assert
      expect(useFavoriteStore.getState().favorites).toHaveLength(0);
    });

    test('should handle episode without image property', () => {
      // Arrange
      const mockEpisode = {
        ...createMockEpisode(1, 'Test Episode', 1, 1),
        image: null,
      };

      // Act
      useFavoriteStore.getState().toggleFavorite(mockEpisode);

      // Assert
      const {favorites} = useFavoriteStore.getState();
      expect(favorites).toHaveLength(1);
      expect(favorites[0].imageUrl).toBeUndefined();
    });
  });

  describe('isFavorite', () => {
    test('should return true for favorited episode', () => {
      // Arrange
      const mockEpisode = createMockEpisode(1, 'Test Episode', 1, 1);

      // Add episode to favorites
      useFavoriteStore.getState().toggleFavorite(mockEpisode);

      // Act
      const result = useFavoriteStore.getState().isFavorite(1);

      // Assert
      expect(result).toBe(true);
    });

    test('should return false for non-favorited episode', () => {
      // Act
      const result = useFavoriteStore.getState().isFavorite(999);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getFavorites', () => {
    test('should return all favorited episodes', () => {
      // Arrange
      const mockEpisode1 = createMockEpisode(1, 'Test Episode 1', 1, 1);
      const mockEpisode2 = createMockEpisode(2, 'Test Episode 2', 1, 2);

      // Add episodes to favorites
      useFavoriteStore.getState().toggleFavorite(mockEpisode1);
      useFavoriteStore.getState().toggleFavorite(mockEpisode2);

      // Act
      const favorites = useFavoriteStore.getState().getFavorites();

      // Assert
      expect(favorites).toHaveLength(2);
      expect(favorites.map(f => f.id)).toEqual([1, 2]);
    });

    test('should return empty array when no favorites', () => {
      // Act
      const favorites = useFavoriteStore.getState().getFavorites();

      // Assert
      expect(favorites).toEqual([]);
    });
  });

  describe('getFavoriteIds', () => {
    test('should return IDs of all favorited episodes', () => {
      // Arrange
      const mockEpisode1 = createMockEpisode(1, 'Test Episode 1', 1, 1);
      const mockEpisode2 = createMockEpisode(2, 'Test Episode 2', 1, 2);

      // Add episodes to favorites
      useFavoriteStore.getState().toggleFavorite(mockEpisode1);
      useFavoriteStore.getState().toggleFavorite(mockEpisode2);

      // Act
      const favoriteIds = useFavoriteStore.getState().getFavoriteIds();

      // Assert
      expect(favoriteIds).toEqual([1, 2]);
    });
  });

  describe('getRecentFavorites', () => {
    test('should return favorites sorted by dateAdded with default limit', () => {
      // Arrange
      const mockEpisode1 = createMockEpisode(1, 'Test Episode 1', 1, 1);
      const mockEpisode2 = createMockEpisode(2, 'Test Episode 2', 1, 2);
      const mockEpisode3 = createMockEpisode(3, 'Test Episode 3', 1, 3);
      const mockEpisode4 = createMockEpisode(4, 'Test Episode 4', 1, 4);
      const mockEpisode5 = createMockEpisode(5, 'Test Episode 5', 1, 5);
      const mockEpisode6 = createMockEpisode(6, 'Test Episode 6', 1, 6);

      // Simulate different timestamps for different episodes
      const timestamps = [
        1647425000000, // Episode 1
        1647425100000, // Episode 2
        1647425200000, // Episode 3
        1647425300000, // Episode 4
        1647425400000, // Episode 5
        1647425500000, // Episode 6
      ];

      let timestampIndex = 0;
      jest
        .spyOn(Date, 'now')
        .mockImplementation(() => timestamps[timestampIndex++]);

      // Add episodes to favorites in chronological order
      useFavoriteStore.getState().toggleFavorite(mockEpisode1);
      useFavoriteStore.getState().toggleFavorite(mockEpisode2);
      useFavoriteStore.getState().toggleFavorite(mockEpisode3);
      useFavoriteStore.getState().toggleFavorite(mockEpisode4);
      useFavoriteStore.getState().toggleFavorite(mockEpisode5);
      useFavoriteStore.getState().toggleFavorite(mockEpisode6);

      // Act
      const recentFavorites = useFavoriteStore.getState().getRecentFavorites();

      // Assert - should be most recent 5 episodes in reverse chronological order
      expect(recentFavorites).toHaveLength(5);
      expect(recentFavorites.map(f => f.id)).toEqual([6, 5, 4, 3, 2]);
    });

    test('should respect custom limit parameter', () => {
      // Arrange
      const mockEpisode1 = createMockEpisode(1, 'Test Episode 1', 1, 1);
      const mockEpisode2 = createMockEpisode(2, 'Test Episode 2', 1, 2);
      const mockEpisode3 = createMockEpisode(3, 'Test Episode 3', 1, 3);

      // Simulate different timestamps
      const timestamps = [1647425000000, 1647425100000, 1647425200000];
      let timestampIndex = 0;
      jest
        .spyOn(Date, 'now')
        .mockImplementation(() => timestamps[timestampIndex++]);

      useFavoriteStore.getState().toggleFavorite(mockEpisode1);
      useFavoriteStore.getState().toggleFavorite(mockEpisode2);
      useFavoriteStore.getState().toggleFavorite(mockEpisode3);

      // Act
      const recentFavorites = useFavoriteStore.getState().getRecentFavorites(2);

      // Assert
      expect(recentFavorites).toHaveLength(2);
      expect(recentFavorites.map(f => f.id)).toEqual([3, 2]);
    });
  });

  describe('clearAllFavorites', () => {
    test('should remove all favorites', () => {
      // Arrange
      const mockEpisode1 = createMockEpisode(1, 'Test Episode 1', 1, 1);
      const mockEpisode2 = createMockEpisode(2, 'Test Episode 2', 1, 2);

      // Add episodes to favorites
      useFavoriteStore.getState().toggleFavorite(mockEpisode1);
      useFavoriteStore.getState().toggleFavorite(mockEpisode2);

      // Confirm episodes were added
      expect(useFavoriteStore.getState().favorites).toHaveLength(2);

      // Act
      useFavoriteStore.getState().clearAllFavorites();

      // Assert
      expect(useFavoriteStore.getState().favorites).toHaveLength(0);
    });
  });

  describe('removeFavorite', () => {
    test('should remove a specific episode from favorites', () => {
      // Arrange
      const mockEpisode1 = createMockEpisode(1, 'Test Episode 1', 1, 1);
      const mockEpisode2 = createMockEpisode(2, 'Test Episode 2', 1, 2);

      // Add episodes to favorites
      useFavoriteStore.getState().toggleFavorite(mockEpisode1);
      useFavoriteStore.getState().toggleFavorite(mockEpisode2);
      useFavoriteStore.getState().removeFavorite(1);

      // Assert
      const {favorites} = useFavoriteStore.getState();
      expect(favorites).toHaveLength(1);
      expect(favorites[0].id).toBe(2);
    });

    test('should do nothing if episode ID is not in favorites', () => {
      // Arrange
      const mockEpisode = createMockEpisode(1, 'Test Episode', 1, 1);

      useFavoriteStore.getState().toggleFavorite(mockEpisode);
      useFavoriteStore.getState().removeFavorite(999);

      // Assert
      const {favorites} = useFavoriteStore.getState();
      expect(favorites).toHaveLength(1);
      expect(favorites[0].id).toBe(1);
    });
  });

  describe('persistence', () => {
    test('should call AsyncStorage.setItem when state changes', () => {
      // Arrange
      const mockEpisode = createMockEpisode(1, 'Test Episode', 1, 1);

      useFavoriteStore.getState().toggleFavorite(mockEpisode);

      // Assert
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});

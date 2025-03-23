import {
  fetchShowInfo,
  fetchEpisodes,
  fetchCast,
  fetchEpisodeById,
} from '../../api/showService';
import useShowStore from '../../stores/useShowStore';

jest.mock('../../api/showService', () => ({
  fetchShowInfo: jest.fn(),
  fetchEpisodes: jest.fn(),
  fetchCast: jest.fn(),
  fetchEpisodeById: jest.fn(),
}));

describe('useShowStore', () => {
  // Reset store and mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    useShowStore.setState({
      showInfo: null,
      episodes: [],
      cast: [],
      isLoading: {
        showInfo: false,
        episodes: false,
        cast: false,
      },
      error: null,
    });
  });

  // Sample data for tests
  const mockShowInfo = {
    id: 44458,
    name: 'Ted Lasso',
    genres: ['Drama', 'Comedy', 'Sports'],
    status: 'Running',
    image: {
      medium: 'https://example.com/medium.jpg',
      original: 'https://example.com/original.jpg',
    },
    summary: '<p>Test summary</p>',
  };

  const mockEpisodes = [
    {
      id: 1,
      name: 'Pilot',
      season: 1,
      number: 1,
      url: 'https://www.tvmaze.com/episodes/1/ted-lasso-1x01-pilot',
      type: 'regular',
      airdate: '2020-08-14',
      airtime: '',
      airstamp: '2020-08-14T12:00:00+00:00',
      runtime: 31,
      rating: {
        average: 7.4,
      },
      image: {
        medium: 'https://example.com/ep1_medium.jpg',
        original: 'https://example.com/ep1_original.jpg',
      },
      summary: '<p>Test episode summary</p>',
      _links: {
        self: {
          href: 'https://api.tvmaze.com/episodes/1',
        },
        show: {
          href: 'https://api.tvmaze.com/shows/44458',
          name: 'Ted Lasso',
        },
      },
    },
    {
      id: 2,
      name: 'Biscuits',
      season: 1,
      number: 2,
      url: 'https://www.tvmaze.com/episodes/2/ted-lasso-1x02-biscuits',
      type: 'regular',
      airdate: '2020-08-14',
      airtime: '',
      airstamp: '2020-08-14T12:00:00+00:00',
      runtime: 29,
      rating: {
        average: 7.9,
      },
      image: {
        medium: 'https://example.com/ep2_medium.jpg',
        original: 'https://example.com/ep2_original.jpg',
      },
      summary: '<p>Another episode summary</p>',
      _links: {
        self: {
          href: 'https://api.tvmaze.com/episodes/2',
        },
        show: {
          href: 'https://api.tvmaze.com/shows/44458',
          name: 'Ted Lasso',
        },
      },
    },
  ];

  const mockCast = [
    {
      person: {
        id: 101,
        name: 'Jason Sudeikis',
        image: {
          medium: 'https://example.com/person1_medium.jpg',
          original: 'https://example.com/person1_original.jpg',
        },
      },
      character: {
        id: 201,
        name: 'Ted Lasso',
      },
    },
  ];

  describe('fetchShowInfo', () => {
    test('should fetch show info successfully', async () => {
      // Setup mock
      (fetchShowInfo as jest.Mock).mockResolvedValue(mockShowInfo);

      // Call the function
      await useShowStore.getState().fetchShowInfo();

      // Assertions
      expect(fetchShowInfo).toHaveBeenCalledTimes(1);
      expect(useShowStore.getState().showInfo).toEqual(mockShowInfo);
      expect(useShowStore.getState().isLoading.showInfo).toBe(false);
      expect(useShowStore.getState().error).toBeNull();
    });

    test('should handle error when fetching show info fails', async () => {
      // Setup mock to reject
      (fetchShowInfo as jest.Mock).mockRejectedValue(new Error('API Error'));

      // Call the function
      await useShowStore.getState().fetchShowInfo();

      // Assertions
      expect(fetchShowInfo).toHaveBeenCalledTimes(1);
      expect(useShowStore.getState().showInfo).toBeNull();
      expect(useShowStore.getState().isLoading.showInfo).toBe(false);
      expect(useShowStore.getState().error).toBe(
        'Failed to fetch show information',
      );
    });
  });

  describe('fetchEpisodes', () => {
    test('should fetch episodes successfully', async () => {
      // Setup mock
      (fetchEpisodes as jest.Mock).mockResolvedValue(mockEpisodes);

      // Call the function
      await useShowStore.getState().fetchEpisodes();

      // Assertions
      expect(fetchEpisodes).toHaveBeenCalledTimes(1);
      expect(useShowStore.getState().episodes).toEqual(mockEpisodes);
      expect(useShowStore.getState().isLoading.episodes).toBe(false);
      expect(useShowStore.getState().error).toBeNull();
    });

    test('should handle error when fetching episodes fails', async () => {
      // Setup mock to reject
      (fetchEpisodes as jest.Mock).mockRejectedValue(new Error('API Error'));

      // Call the function
      await useShowStore.getState().fetchEpisodes();

      // Assertions
      expect(fetchEpisodes).toHaveBeenCalledTimes(1);
      expect(useShowStore.getState().episodes).toEqual([]);
      expect(useShowStore.getState().isLoading.episodes).toBe(false);
      expect(useShowStore.getState().error).toBe('Failed to fetch episodes');
    });
  });

  describe('fetchCast', () => {
    test('should fetch cast successfully', async () => {
      // Setup mock
      (fetchCast as jest.Mock).mockResolvedValue(mockCast);

      // Call the function
      await useShowStore.getState().fetchCast();

      // Assertions
      expect(fetchCast).toHaveBeenCalledTimes(1);
      expect(useShowStore.getState().cast).toEqual(mockCast);
      expect(useShowStore.getState().isLoading.cast).toBe(false);
      expect(useShowStore.getState().error).toBeNull();
    });

    test('should handle error when fetching cast fails', async () => {
      // Setup mock to reject
      (fetchCast as jest.Mock).mockRejectedValue(new Error('API Error'));

      // Call the function
      await useShowStore.getState().fetchCast();

      // Assertions
      expect(fetchCast).toHaveBeenCalledTimes(1);
      expect(useShowStore.getState().cast).toEqual([]);
      expect(useShowStore.getState().isLoading.cast).toBe(false);
      expect(useShowStore.getState().error).toBe(
        'Failed to fetch cast information',
      );
    });
  });

  describe('getEpisodeById', () => {
    test('should return episode from cache if available', async () => {
      // Setup state with some episodes already loaded
      useShowStore.setState({episodes: mockEpisodes});

      // Call the function
      const result = await useShowStore.getState().getEpisodeById(1);

      // Assertions
      expect(fetchEpisodeById).not.toHaveBeenCalled();
      expect(result).toEqual(mockEpisodes[0]);
    });

    test('should fetch episode by ID if not in cache', async () => {
      // Setup mock for API call
      const mockSingleEpisode = {
        id: 3,
        name: 'New Episode',
        season: 1,
        number: 3,
        url: 'https://www.tvmaze.com/episodes/3/ted-lasso-1x03-new-episode',
        type: 'regular',
        airdate: '2020-08-21',
        airtime: '',
        airstamp: '2020-08-21T12:00:00+00:00',
        runtime: 30,
        rating: {
          average: 8.0,
        },
        image: {
          medium: 'https://example.com/ep3_medium.jpg',
          original: 'https://example.com/ep3_original.jpg',
        },
        summary: '<p>New episode summary</p>',
        _links: {
          self: {
            href: 'https://api.tvmaze.com/episodes/3',
          },
          show: {
            href: 'https://api.tvmaze.com/shows/44458',
            name: 'Ted Lasso',
          },
        },
      };
      (fetchEpisodeById as jest.Mock).mockResolvedValue(mockSingleEpisode);

      // Call the function
      const result = await useShowStore.getState().getEpisodeById(3);

      // Assertions
      expect(fetchEpisodeById).toHaveBeenCalledWith(3);
      expect(result).toEqual(mockSingleEpisode);
      expect(useShowStore.getState().isLoading.episodes).toBe(false);
    });

    test('should handle error when fetching episode by ID fails', async () => {
      // Setup mock to reject
      (fetchEpisodeById as jest.Mock).mockRejectedValue(new Error('API Error'));

      // Call the function
      const result = await useShowStore.getState().getEpisodeById(999);

      // Assertions
      expect(fetchEpisodeById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
      expect(useShowStore.getState().error).toBe(
        'Failed to fetch episode with ID 999',
      );
    });
  });

  describe('fetchAllData', () => {
    test('should call all fetch functions', async () => {
      // Setup mocks
      (fetchShowInfo as jest.Mock).mockResolvedValue(mockShowInfo);
      (fetchEpisodes as jest.Mock).mockResolvedValue(mockEpisodes);
      (fetchCast as jest.Mock).mockResolvedValue(mockCast);

      // Call the function
      await useShowStore.getState().fetchAllData();

      // Assertions
      expect(fetchShowInfo).toHaveBeenCalledTimes(1);
      expect(fetchEpisodes).toHaveBeenCalledTimes(1);
      expect(fetchCast).toHaveBeenCalledTimes(1);

      // Check that all data was loaded
      expect(useShowStore.getState().showInfo).toEqual(mockShowInfo);
      expect(useShowStore.getState().episodes).toEqual(mockEpisodes);
      expect(useShowStore.getState().cast).toEqual(mockCast);
    });

    test('should handle errors in individual fetch operations', async () => {
      // Setup mocks - one succeeds, two fail
      (fetchShowInfo as jest.Mock).mockResolvedValue(mockShowInfo);
      (fetchEpisodes as jest.Mock).mockRejectedValue(new Error('API Error'));
      (fetchCast as jest.Mock).mockRejectedValue(new Error('API Error'));

      // Call the function
      await useShowStore.getState().fetchAllData();

      // Check that the successful request worked, but failed ones didn't
      expect(useShowStore.getState().showInfo).toEqual(mockShowInfo);
      expect(useShowStore.getState().episodes).toEqual([]);
      expect(useShowStore.getState().cast).toEqual([]);

      // Error should be set to the last failed operation
      expect(useShowStore.getState().error).toBe(
        'Failed to fetch cast information',
      );
    });
  });
});

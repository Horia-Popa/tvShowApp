import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCalendar,
  faClock,
  faHeart,
  faLink,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import useShowStore from '../stores/useShowStore';
import useFavoriteStore from '../stores/useFavoriteStore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppNavigatorParamList} from '../navigation/AppNavigator';

type DetailedEpisodeScreenProps = NativeStackScreenProps<
  AppNavigatorParamList,
  'DetailedEpisodeScreen'
>;

const DetailedEpisodeScreen = ({
  route,
  navigation,
}: DetailedEpisodeScreenProps) => {
  const {episodeId} = route.params;
  const {getEpisodeById} = useShowStore();
  const {toggleFavorite, isFavorite} = useFavoriteStore();
  const [episode, setEpisode] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        setLoading(true);
        const episodeData = await getEpisodeById(episodeId);

        if (episodeData) {
          setEpisode(episodeData);
          isFavorite(episodeId);
        } else {
          setError('Episode not found');
        }
      } catch (err) {
        console.error('Error fetching episode details:', err);
        setError('Failed to load episode details');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeData();
  }, [episodeId, getEpisodeById, isFavorite]);

  const handleToggleFavorite = () => {
    toggleFavorite(episode);
    isFavorite(episode.id);
  };

  const handleOpenURL = async () => {
    if (episode?.url) {
      try {
        // Check if the URL can be opened
        const canOpen = await Linking.canOpenURL(episode.url);

        if (canOpen) {
          // Try to open the URL
          await Linking.openURL(episode.url);
        } else {
          console.log('Cannot open URL:', episode.url);
          // Try with https:// prefix if it doesn't have one
          if (!episode.url.startsWith('https://')) {
            const httpsUrl =
              'https://' + episode.url.replace(/^https?:\/\//, '');
            console.log('Trying with https:', httpsUrl);

            const canOpenHttps = await Linking.canOpenURL(httpsUrl);
            if (canOpenHttps) {
              await Linking.openURL(httpsUrl);
              return;
            }
          }

          // Added for Android
          const encodedUrl = encodeURI(episode.url);
          await Linking.openURL(encodedUrl);
          Alert.alert(
            'Cannot Open Link',
            'Your device cannot open this link. The URL is: ' + episode.url,
          );
        }
      } catch (errorText) {
        console.error('Error opening URL:', errorText);
        Alert.alert('Error', 'Failed to open URL: ' + errorText);
      }
    } else {
      Alert.alert('No URL', 'This episode has no URL available.');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const stripHtml = (html: string) => {
    return html?.replace(/<[^>]*>/g, '') || '';
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error || !episode) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Episode not found'}</Text>
        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {episode.image?.original ? (
        <Image
          source={{uri: episode.image.original}}
          style={styles.episodeImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No Image Available</Text>
        </View>
      )}
      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.episodeTitle}>{episode.name}</Text>
          <Pressable
            onPress={handleToggleFavorite}
            style={styles.favoriteButton}
            testID="favorite-button">
            <FontAwesomeIcon
              icon={faHeart}
              size={24}
              color={isFavorite(episode.id) ? '#E91E63' : '#757575'}
            />
          </Pressable>
        </View>

        <View style={styles.episodeMetaContainer}>
          <Text style={styles.episodeMeta}>
            Season {episode.season}, Episode {episode.number}
          </Text>
          {episode.rating?.average && (
            <View style={styles.ratingContainer}>
              <FontAwesomeIcon icon={faStar} size={14} color="#FFC107" />
              <Text style={styles.ratingText}>{episode.rating.average}</Text>
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <FontAwesomeIcon
              icon={faCalendar}
              size={16}
              color="#757575"
              style={styles.detailIcon}
            />
            <Text style={styles.detailText}>
              Aired: {formatDate(episode.airdate)}
            </Text>
          </View>

          {episode.runtime && (
            <View style={styles.detailItem}>
              <FontAwesomeIcon
                icon={faClock}
                size={16}
                color="#757575"
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>{episode.runtime} minutes</Text>
            </View>
          )}
        </View>
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>{stripHtml(episode.summary)}</Text>
        </View>
        <Pressable
          style={({pressed}) => [
            styles.urlButton,
            pressed && styles.urlButtonPressed,
          ]}
          onPress={handleOpenURL}
          testID="view-url-button">
          <FontAwesomeIcon
            icon={faLink}
            size={16}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
          <Text style={styles.urlButtonText}>View on TVMaze</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  episodeImage: {
    width: '100%',
    height: 240,
  },
  noImageContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 16,
    color: '#757575',
    fontStyle: 'italic',
  },
  infoContainer: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  episodeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  episodeMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  episodeMeta: {
    fontSize: 16,
    color: '#757575',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
    marginLeft: 6,
  },
  detailsContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#424242',
  },
  summaryContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
  },
  urlButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  urlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  urlButtonPressed: {
    backgroundColor: '#333333',
    transform: [{scale: 0.98}],
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
  },
});

export default DetailedEpisodeScreen;

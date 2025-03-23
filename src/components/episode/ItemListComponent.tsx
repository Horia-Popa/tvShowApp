import React, {useState, useEffect} from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import {EpisodeResponse} from '../../api/types';
import {faHeart, faStar} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import useFavoriteStore from '../../stores/useFavoriteStore';

interface ItemListComponentProps {
  episodes: EpisodeResponse[];
  onEpisodePress: (episode: EpisodeResponse) => void;
  title?: string;
  allEpisodes?: boolean;
}

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_MARGIN = 5;

const ItemListComponent = ({
  episodes,
  onEpisodePress,
  title,
  allEpisodes = false,
}: ItemListComponentProps) => {
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [filteredEpisodes, setFilteredEpisodes] = useState<EpisodeResponse[]>(
    [],
  );
  const [availableSeasons, setAvailableSeasons] = useState<number[]>([]);

  const {isFavorite} = useFavoriteStore();

  // Get all seasons from episodes
  useEffect(() => {
    if (episodes.length > 0) {
      const seasons = Array.from(new Set(episodes.map(ep => ep.season))).sort();
      setAvailableSeasons(seasons);

      // Set default selected season to the first one
      if (selectedSeason === null && seasons.length > 0) {
        setSelectedSeason(seasons[0]);
      }
    }
  }, [episodes, selectedSeason]);

  // Filter episodes by selected season
  useEffect(() => {
    if (allEpisodes && selectedSeason !== null) {
      const filtered = episodes.filter(ep => ep.season === selectedSeason);
      setFilteredEpisodes(filtered);
    } else {
      setFilteredEpisodes(episodes);
    }
  }, [episodes, selectedSeason, allEpisodes]);

  // Remove HTML tags from summary
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const renderEpisodeCard = ({item}: {item: EpisodeResponse}) => {
    const summaryText = item.summary
      ? stripHtml(item.summary)
      : 'No summary available';

    return (
      <Pressable
        style={({pressed}) => [
          styles.cardContainer,
          pressed && {opacity: 0.85, transform: [{scale: 0.98}]},
        ]}
        onPress={() => onEpisodePress(item)}>
        <View style={styles.card}>
          {item.image ? (
            <View>
              <Image
                source={{uri: item.image.medium}}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.favoriteButton}>
                <FontAwesomeIcon
                  icon={faHeart}
                  size={24}
                  color={isFavorite(item.id) ? '#E91E63' : '#757575'}
                />
              </View>
            </View>
          ) : (
            <View style={styles.noImage}>
              <Text>No Image</Text>
            </View>
          )}

          <View style={styles.episodeInfo}>
            <View style={styles.episodeHeader}>
              <Text style={styles.episodeNumber}>
                S{item.season}:E{item.number}
              </Text>
              <View style={styles.ratingContainer}>
                <FontAwesomeIcon icon={faStar} size={14} color="#FFC107" />
                <Text style={styles.rating}>
                  {item.rating?.average || 'N/A'}
                </Text>
              </View>
            </View>

            <Text style={styles.title} numberOfLines={1}>
              {item.name}
            </Text>

            <Text style={styles.summary} numberOfLines={3}>
              {summaryText}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderSeasonSelector = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.seasonButtonsContainer}>
      {availableSeasons.map(season => (
        <Pressable
          key={`season-button-${season}`}
          style={({pressed}) => [
            styles.seasonButton,
            selectedSeason === season && styles.selectedSeasonButton,
            pressed && {opacity: 0.8, transform: [{scale: 0.95}]},
          ]}
          onPress={() => setSelectedSeason(season)}>
          <Text
            style={[
              styles.seasonButtonText,
              selectedSeason === season && styles.selectedSeasonButtonText,
            ]}>
            Season {season}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {title && <Text style={styles.sectionTitle}>{title}</Text>}
      </View>

      {allEpisodes && renderSeasonSelector()}

      <FlatList
        data={filteredEpisodes}
        renderItem={renderEpisodeCard}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  headerContainer: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000',
  },
  seasonButtonsContainer: {
    paddingBottom: 12,
  },
  seasonButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  selectedSeasonButton: {
    backgroundColor: '#fff',
  },
  seasonButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedSeasonButtonText: {
    fontWeight: '600',
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  noImage: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  episodeInfo: {
    paddingTop: 8,
  },
  episodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  episodeNumber: {
    color: '#000',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 5,
  },
  title: {
    fontWeight: 600,
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#000',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 8,
  },
});

export default ItemListComponent;

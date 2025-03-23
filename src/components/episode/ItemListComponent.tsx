// src/components/episode/HorizontalEpisodeList.tsx
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {EpisodeResponse} from '../../api/types';

interface ItemListComponentProps {
  episodes: EpisodeResponse[];
  onEpisodePress: (episode: EpisodeResponse) => void;
  title?: string;
  allEpisodes?: boolean; // If true, show all episodes with season selector
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

  // Extract all seasons from episodes
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
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => onEpisodePress(item)}
        activeOpacity={0.8}>
        <View style={styles.card}>
          {item.image ? (
            <Image
              source={{uri: item.image.medium}}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImage}>
              <Text style={styles.noImageText}>No Image</Text>
            </View>
          )}

          <View style={styles.episodeInfo}>
            <View style={styles.episodeHeader}>
              <Text style={styles.episodeNumber}>
                S{item.season}:E{item.number}
              </Text>
              <Text style={styles.rating}>
                ⭐ {item.rating?.average || 'N/A'}
              </Text>
            </View>

            <Text style={styles.title} numberOfLines={1}>
              {item.name}
            </Text>

            <Text style={styles.summary} numberOfLines={3}>
              {summaryText}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSeasonSelector = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.seasonButtonsContainer}>
      {availableSeasons.map(season => (
        <TouchableOpacity
          key={`season-button-${season}`}
          style={[
            styles.seasonButton,
            selectedSeason === season && styles.selectedSeasonButton,
          ]}
          onPress={() => setSelectedSeason(season)}>
          <Text
            style={[
              styles.seasonButtonText,
              selectedSeason === season && styles.selectedSeasonButtonText,
            ]}>
            Season {season}
          </Text>
        </TouchableOpacity>
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
    // ...typography.sectionTitle,
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
    // borderColor: colors.border,
  },
  selectedSeasonButton: {
    backgroundColor: '#fff',
    // borderColor: colors.primary,
  },
  seasonButtonText: {
    fontSize: 14,
    fontWeight: '500',
    // color: colors.text,
  },
  selectedSeasonButtonText: {
    // color: colors.white,
    fontWeight: '600',
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
  },
  card: {
    // backgroundColor: colors.card,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
  },
  noImage: {
    width: '100%',
    height: 180,
    // backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    // ...typography.body,
    // color: colors.textLight,
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
    // ...typography.caption,
    color: '#000',
    fontWeight: 'bold',
  },
  rating: {
    // ...typography.caption,
  },
  title: {
    // ...typography.subtitle,
    marginBottom: 8,
  },
  summary: {
    // ...typography.body,
    fontSize: 14,
    color: '#000',
  },
});

export default ItemListComponent;

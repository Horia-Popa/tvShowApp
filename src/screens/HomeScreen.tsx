import React, {useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import LoadingIndicator from '../components/common/LoadingIndicator';
import useShowStore from '../stores/showStore';
import HeaderComponent from '../components/common/HeaderComponent';
import {SafeAreaView} from 'react-native-safe-area-context';
import {EpisodeResponse} from '../api/types';
import HorizontalEpisodeList from '../components/episode/ItemListComponent';

const HomeScreen = ({navigation}) => {
  const {showInfo, episodes, isLoading, error, fetchShowInfo, fetchEpisodes} =
    useShowStore();

  useEffect(() => {
    fetchShowInfo();
    fetchEpisodes();
  }, [fetchShowInfo, fetchEpisodes]);

  const episodesBySeason = useMemo(() => {
    return episodes.reduce<Record<number, EpisodeResponse[]>>(
      (acc, episode) => {
        const season = episode.season;
        if (!acc[season]) {
          acc[season] = [];
        }
        acc[season].push(episode);
        return acc;
      },
      {},
    );
  }, [episodes]);

  // Sort seasons in descending order (newest first)
  const seasons = useMemo(() => {
    return Object.keys(episodesBySeason)
      .map(Number)
      .sort((a, b) => a - b);
  }, [episodesBySeason]);

  if (isLoading.episodes) {
    return <LoadingIndicator />;
  }

  if (isLoading.showInfo) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!showInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No show information available</Text>
      </View>
    );
  }

  // Remove HTML tags from summary
  const cleanSummary = showInfo.summary?.replace(/<[^>]*>/g, '') || '';

  return (
    <ScrollView style={styles.container}>
      <HeaderComponent
        title={showInfo.name}
        imageUrl={showInfo.image?.original || ''}
        rating={showInfo.rating?.average || undefined}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.summary}>{cleanSummary}</Text>

        <Text style={styles.metaItem}>
          Genre: {showInfo.genres?.join(', ')}
        </Text>
        <Text style={styles.metaItem}>
          Schedule: {showInfo.schedule?.days.join(', ') || 'N/A'}{' '}
        </Text>
        {/* All Episodes with Season Selector */}
        <HorizontalEpisodeList
          title="Browse Episodes"
          episodes={episodes}
          //   onEpisodePress={handleEpisodePress}
          allEpisodes={true}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: 'white',
  },
  infoContainer: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  summary: {
    marginBottom: 20,
    lineHeight: 22,
  },
  metaInfo: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  metaItem: {
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.32,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;

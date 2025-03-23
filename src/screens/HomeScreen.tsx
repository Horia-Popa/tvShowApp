import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import useShowStore from '../stores/useShowStore';
import HeaderComponent from '../components/common/HeaderComponent';
import ItemListComponent from '../components/episode/ItemListComponent';
import CastComponent from '../components/common/CastComponent';
import {SafeAreaView} from 'react-native-safe-area-context';
import useFavoriteStore from '../stores/useFavoriteStore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppNavigatorParamList} from '../navigation/AppNavigator';
import LoadingIndicator from '../components/common/LoadingIndicator';

type HomeScreenProps = NativeStackScreenProps<
  AppNavigatorParamList,
  'HomeScreen'
>;

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const {
    showInfo,
    episodes,
    isLoading,
    error,
    cast,
    fetchCast,
    fetchShowInfo,
    fetchEpisodes,
    getEpisodeById,
  } = useShowStore();

  const {favorites} = useFavoriteStore();

  useEffect(() => {
    fetchShowInfo();
    fetchEpisodes();
    fetchCast();
  }, [fetchShowInfo, fetchEpisodes, fetchCast]);

  console.log({favorites});

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

  const handleEpisodePress = async (episodeId: number) => {
    try {
      const episode = await getEpisodeById(episodeId);

      if (episode) {
        navigation.navigate('DetailedEpisodeScreen', {episodeId: episodeId});
      } else {
        Alert.alert('Error', 'Unable to load episode details');
      }
      console.log({episodeId});
    } catch (text) {
      console.error('Error fetching episode:', text);
      Alert.alert(
        'Error',
        'Something went wrong while loading episode details',
      );
    }
  };

  // Remove HTML tags from summary
  const cleanSummary = showInfo.summary?.replace(/<[^>]*>/g, '') || '';

  console.log({episodes});

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerScrollView}>
        <View>
          <HeaderComponent
            title={showInfo.name}
            imageUrl={showInfo.image?.original || ''}
            rating={showInfo.rating?.average || undefined}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.summary}>{cleanSummary}</Text>

            <View>
              <Text style={styles.metaItem}>
                Genre: {showInfo.genres?.join(', ')}
              </Text>
              <Text style={styles.metaItem}>
                Schedule: {showInfo.schedule?.days.join(', ') || 'N/A'}{' '}
              </Text>
              <Text style={styles.metaItem}>
                Network: {showInfo.webChannel?.name}
              </Text>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <ItemListComponent
              title="Episodes"
              episodes={episodes}
              onEpisodePress={episode => handleEpisodePress(episode.id)}
              allEpisodes={true}
            />
            <CastComponent title="Main Cast" cast={cast} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
  },
  innerScrollView: {
    paddingBottom: 420,
  },
  contentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  infoContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000',
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

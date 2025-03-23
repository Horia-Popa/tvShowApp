import {faStar} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
interface ShowHeaderProps {
  title: string;
  imageUrl: string;
  rating?: number;
  summary?: string;
  genres?: string;
  schedule?: string;
}

const HeaderComponent = ({imageUrl, rating}: ShowHeaderProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={{uri: imageUrl}}
        style={styles.headerImage}
        resizeMode="cover"
      />

      <View style={styles.contentContainer}>
        {rating && (
          <View style={styles.ratingContainer}>
            <FontAwesomeIcon icon={faStar} size={18} color="#FFC107" />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '37%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    flex: 1,
    marginRight: 16,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  ratingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    margin: 8,
  },
  sectionTitle: {
    color: '#fff',
    marginVertical: 16,
  },
  summary: {
    color: 'white',
    marginBottom: 16,
    lineHeight: 22,
  },
  metaInfo: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  metaItem: {
    color: '#fff',
    marginVertical: 8,
  },
});

export default HeaderComponent;

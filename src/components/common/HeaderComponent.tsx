import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
interface ShowHeaderProps {
  title: string;
  imageUrl: string;
  rating?: number;
}

const HeaderComponent = ({imageUrl, rating}: ShowHeaderProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={{uri: imageUrl}}
        style={styles.headerImage}
        resizeMode="cover"
      />

      <View>
        <View style={styles.contentContainer}>
          {rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>⭐ {rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '30%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 8,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HeaderComponent;

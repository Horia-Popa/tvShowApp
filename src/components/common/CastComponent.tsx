import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {CastMemberResponse} from '../../api/types';

interface CastComponentProps {
  cast: CastMemberResponse[];
  title?: string;
}

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width / 4;

const CastComponent = ({cast, title}: CastComponentProps) => {
  const renderCastMember = ({item}: {item: CastMemberResponse}) => {
    return (
      <View style={styles.castItemContainer}>
        <View style={styles.imageContainer}>
          {item.person.image ? (
            <Image
              source={{uri: item.person.image.medium}}
              style={styles.castImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>
                {item.person.name.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.actorName} numberOfLines={1}>
          {item.person.name}
        </Text>

        <Text style={styles.characterName} numberOfLines={2}>
          {item.character.name}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}

      <FlatList
        data={cast}
        renderItem={renderCastMember}
        keyExtractor={item => `cast-${item.person.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  castItemContainer: {
    width: ITEM_WIDTH,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 8,
    width: ITEM_WIDTH - 16,
    height: ITEM_WIDTH - 16,
    borderRadius: (ITEM_WIDTH - 16) / 2,
    overflow: 'hidden',
  },
  castImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9E9E9E',
  },
  actorName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
    color: '#000',
  },
  characterName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
});

export default CastComponent;

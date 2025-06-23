import React, { memo } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { AnimatedPressable } from './AnimatedPressable';
import { LazyImage } from './LazyImage';
import { DESIGN_SYSTEM } from '@/constants/DesignSystem';

interface GridItem {
  id: string;
  imageUrl: string;
  aspectRatio?: number;
}

interface InstagramGridProps {
  data: GridItem[];
  onItemPress?: (item: GridItem) => void;
  numColumns?: number;
  spacing?: number;
}

const GridItemComponent = memo<{ 
  item: GridItem; 
  onPress: (item: GridItem) => void; 
  size: number; 
  spacing: number; 
}>(function GridItemComponent({ item, onPress, size, spacing }) {
  return (
  <AnimatedPressable
    onPress={() => onPress(item)}
    style={[
      styles.gridItem,
      {
        width: size,
        height: size,
        marginRight: spacing,
        marginBottom: spacing,
      }
    ]}
  >
    <LazyImage
      source={{ uri: item.imageUrl }}
      style={styles.image}
      contentFit="cover"
    />
  </AnimatedPressable>
  );
});

export const InstagramGrid = memo<InstagramGridProps>(function InstagramGrid({ 
  data, 
  onItemPress, 
  numColumns = 3, 
  spacing = 2 
}) {
  const screenWidth = Dimensions.get('window').width;
  const itemSize = (screenWidth - (spacing * (numColumns + 1))) / numColumns;

  const renderItem = ({ item }: { item: GridItem }) => (
    <GridItemComponent
      item={item}
      onPress={onItemPress || (() => {})}
      size={itemSize}
      spacing={spacing}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        scrollIndicatorInsets={{ right: 1 }}
        style={styles.list}
        contentContainerStyle={{ paddingLeft: spacing }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
        windowSize={10}
        initialNumToRender={15}
        getItemLayout={(data, index) => ({
          length: itemSize + spacing,
          offset: (itemSize + spacing) * Math.floor(index / numColumns),
          index,
        })}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  gridItem: {
    borderRadius: DESIGN_SYSTEM.RADIUS.SM,
    overflow: 'hidden',
    backgroundColor: DESIGN_SYSTEM.COLORS.GREY[200],
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
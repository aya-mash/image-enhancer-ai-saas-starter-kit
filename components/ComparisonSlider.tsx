import { Image } from 'expo-image';
import { useMemo, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from './themed-text';

interface ComparisonSliderProps {
  leftImage: string;
  rightImage: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ComparisonSlider({ leftImage, rightImage }: ComparisonSliderProps) {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const handleSize = 38;
  const pan = useRef(new Animated.Value(width / 2)).current;

  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_evt, gesture) => {
          const next = clamp(gesture.moveX, handleSize, width - handleSize);
          pan.setValue(next);
        },
      }),
    [handleSize, pan, width]
  );

  return (
    <View style={styles.wrapper}>
      <View style={[styles.labelRow]}>
        <ThemedText type="caption" style={{ color: theme.icon }}>Original</ThemedText>
        <ThemedText type="caption" style={{ color: theme.tint }}>Preview</ThemedText>
      </View>
      <View
        style={[styles.frame, { borderColor: theme.border, backgroundColor: theme.card }]}
        {...responder.panHandlers}
      >
        <Image source={{ uri: rightImage }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <Animated.View style={[StyleSheet.absoluteFill, { width: pan }]}> 
          <Image source={{ uri: leftImage }} style={StyleSheet.absoluteFill} contentFit="cover" />
        </Animated.View>
        <Animated.View
          style={[
            styles.handle,
            {
              left: pan,
              backgroundColor: theme.card,
              borderColor: theme.tint,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 400,
    marginVertical: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  frame: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  handle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    marginLeft: -2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    zIndex: 10,
  },
});

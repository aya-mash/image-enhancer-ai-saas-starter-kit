import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from './themed-text';

interface LoadingSequenceProps {
  steps: string[];
  activeIndex: number;
}

export function LoadingSequence({ steps, activeIndex }: LoadingSequenceProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const progress = steps.length === 0 ? 0 : (activeIndex + 1) / steps.length;

  return (
    <View style={styles.container}>
      <View style={[styles.progressBarTrack, { backgroundColor: theme.border }]}>
        <View 
          style={[
            styles.progressBarFill, 
            { 
              width: `${progress * 100}%`, 
              backgroundColor: theme.tint 
            }
          ]} 
        />
      </View>
      <View style={styles.steps}>
        {steps.map((step, idx) => {
          const isActive = idx === activeIndex;
          return (
            <ThemedText
              key={step}
              style={[
                styles.step,
                {
                  color: isActive ? theme.tint : theme.icon,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {step}
            </ThemedText>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 24,
  },
  progressBarTrack: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  steps: {
    alignItems: 'center',
    gap: 8,
  },
  step: {
    fontSize: 14,
    textAlign: 'center',
  },
});

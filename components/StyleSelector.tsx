import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import prompts from '@/prompt-kit/prompts.json';
import { ThemedText } from './themed-text';

interface StyleSelectorProps {
  value: string;
  onChange: (styleId: string) => void;
}

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={styles.container}>
      {prompts.map((option, index) => {
        const selected = option.id === value;
        return (
          <View key={option.id}>
            <Pressable
              onPress={() => onChange(option.id)}
              style={({ pressed }) => [
                styles.row,
                { backgroundColor: pressed ? theme.background : 'transparent' }
              ]}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={option.icon as any} size={24} color={theme.tint} />
              </View>
              <View style={styles.textContainer}>
                <ThemedText type="defaultSemiBold">{option.label}</ThemedText>
                <ThemedText type="caption" style={{ color: theme.icon, marginTop: 2 }}>{option.description}</ThemedText>
              </View>
              {selected && (
                <Ionicons name="checkmark" size={20} color={theme.tint} style={styles.check} />
              )}
            </Pressable>
            {index < prompts.length - 1 && <View style={[styles.separator, { backgroundColor: theme.border }]} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 12,
    width: 32,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  check: {
    marginLeft: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 60, 
  },
});

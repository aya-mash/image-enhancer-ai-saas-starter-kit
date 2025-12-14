import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGlowup } from '@/hooks/useGlowup';
import prompts from '@/prompt-kit/prompts.json';

export default function ResultScreen() {
  const { id, downloadUrl: downloadUrlParam } = useLocalSearchParams<{ id?: string; downloadUrl?: string }>();
  const { glowup, loading, notFound } = useGlowup(id);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const downloadUrl = downloadUrlParam?.toString() || glowup?.downloadUrl;

  const handleDownload = () => {
    if (downloadUrl) {
      Linking.openURL(downloadUrl);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color={theme.tint} />
        <ThemedText style={{ marginTop: 16 }}>Fetching unlock...</ThemedText>
      </ThemedView>
    );
  }

  if (notFound || !glowup) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText style={{ marginBottom: 16 }}>Project not found.</ThemedText>
        <Pressable
          onPress={() => router.push('/(auth)/upload' as never)}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.tint, opacity: pressed ? 0.8 : 1 }
          ]}
        >
          <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>Start new project</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const styleLabel = prompts.find(p => p.id === glowup.style)?.label || glowup.style;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <ThemedText type="largeTitle">Unlocked</ThemedText>
            <ThemedText style={{ color: theme.icon, marginTop: 4 }}>
              {styleLabel}
            </ThemedText>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardContent}>
              <ThemedText style={{ marginBottom: 12 }}>
                Your payment was verified. The download link below expires in 24 hours.
              </ThemedText>
              <View style={styles.statusRow}>
                <Ionicons name="lock-open" size={16} color={theme.success} style={{ marginRight: 6 }} />
                <ThemedText type="caption" style={{ color: theme.success }}>
                  Status: {glowup.status}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText type="defaultSemiBold" style={{ color: theme.icon, textTransform: 'uppercase', fontSize: 13 }}>
              Download Original
            </ThemedText>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardContent}>
              <ThemedText numberOfLines={2} style={{ color: theme.icon, marginBottom: 16, fontSize: 13 }}>
                {downloadUrl || 'Download link not available yet.'}
              </ThemedText>
              
              <Pressable
                onPress={handleDownload}
                disabled={!downloadUrl}
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: theme.tint, opacity: pressed || !downloadUrl ? 0.6 : 1 }
                ]}
              >
                <Ionicons name="download-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>Open download URL</ThemedText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  cardContent: {
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 24,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

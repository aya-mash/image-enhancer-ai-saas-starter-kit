import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGlowups } from '@/hooks/useGlowups';
import prompts from '@/prompt-kit/prompts.json';
import { useAuth } from '@/providers/auth-provider';
import type { Glowup } from '@/types/glowup';

function formatSince(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.round(diffMs / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function GlowupRow({ item, onPress }: { item: Glowup; onPress: () => void }) {
  const locked = item.status === 'locked';
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  
  const prompt = prompts.find(p => p.id === item.style);
  const label = prompt?.label || 'Unknown Style';
  const icon = prompt?.icon || 'image-outline';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.card, opacity: pressed ? 0.7 : 1 }
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons 
          name={icon as any} 
          size={24} 
          color={theme.tint} 
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <ThemedText type="defaultSemiBold">
            {label}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.icon }}>
            {formatSince(item.createdAt)}
          </ThemedText>
        </View>
        <ThemedText type="caption" numberOfLines={1} style={{ color: theme.icon, marginTop: 2 }}>
          {item.vision || 'Vision analysis pending'}
        </ThemedText>
        <View style={styles.statusRow}>
           {locked ? (
             <View style={styles.statusBadge}>
               <Ionicons name="lock-closed" size={10} color={theme.icon} style={{ marginRight: 4 }} />
               <ThemedText type="caption" style={{ color: theme.icon }}>Locked</ThemedText>
             </View>
           ) : (
             <View style={styles.statusBadge}>
               <Ionicons name="lock-open" size={10} color={theme.success} style={{ marginRight: 4 }} />
               <ThemedText type="caption" style={{ color: theme.success }}>Unlocked</ThemedText>
             </View>
           )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.icon} style={{ opacity: 0.5 }} />
    </Pressable>
  );
}

export default function GlowupsScreen() {
  const { glowups, loading } = useGlowups();
  const { user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const isGuest = !user || user.isAnonymous;

  const handlePress = (item: Glowup) => {
    if (item.status === 'locked') {
      router.push({ pathname: '/(auth)/preview/[id]', params: { id: item.id } } as never);
    } else {
      router.push({ pathname: '/(auth)/result/[id]', params: { id: item.id } } as never);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Loading projects...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="largeTitle">Projects</ThemedText>
        </View>

        {isGuest && (
          <View style={[styles.guestBanner, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="information-circle-outline" size={20} color={theme.icon} />
            <ThemedText type="caption" style={{ flex: 1, color: theme.icon }}>
              Sign in to save your history permanently.
            </ThemedText>
            <Pressable onPress={() => router.push('/auth/sign-in' as never)}>
              <ThemedText type="link">Sign in</ThemedText>
            </Pressable>
          </View>
        )}

        <FlatList
          data={glowups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GlowupRow item={item} onPress={() => handlePress(item)} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="images-outline" size={48} color={theme.icon} style={{ opacity: 0.5 }} />
              <ThemedText type="defaultSemiBold" style={{ marginTop: 16, color: theme.icon }}>
                No projects yet
              </ThemedText>
              <ThemedText type="caption" style={{ marginTop: 4, color: theme.icon }}>
                Start a new enhancement to see it here.
              </ThemedText>
            </View>
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(128,128,128,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
    marginRight: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(128,128,128,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
});

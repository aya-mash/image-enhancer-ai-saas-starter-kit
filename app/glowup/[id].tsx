import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Alert, Share, StyleSheet, View } from 'react-native';

import { ComparisonSlider } from '@/components/ComparisonSlider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGlowup } from '@/hooks/useGlowup';

export default function GlowupDetailScreen() {
  const { id } = useLocalSearchParams();
  const { glowup, loading, notFound } = useGlowup(id);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const handleShare = async () => {
    const url = glowup?.downloadUrl || glowup?.previewUrl;
    if (!url) return;
    try {
      await Share.share({
        url: url,
        message: 'Check out my enhanced photo!',
      });
    } catch {
      Alert.alert('Error', 'Failed to share image');
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color={theme.tint} />
      </ThemedView>
    );
  }

  if (notFound || !glowup) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Project not found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Result',
        headerRight: () => (
          <Ionicons 
            name="share-outline" 
            size={24} 
            color={theme.tint} 
            onPress={handleShare}
            style={{ marginRight: 8 }}
          />
        )
      }} />
      
      <View style={styles.imageContainer}>
        {glowup.originalPreviewUrl && glowup.previewUrl ? (
           <ComparisonSlider leftImage={glowup.originalPreviewUrl} rightImage={glowup.previewUrl} />
        ) : (
           <ThemedText>Image not available</ThemedText>
        )}
      </View>

      <View style={styles.infoContainer}>
        <ThemedText type="defaultSemiBold" style={{ marginBottom: 8 }}>Details</ThemedText>
        <ThemedText style={{ color: theme.icon }}>Status: {glowup.status}</ThemedText>
        <ThemedText style={{ color: theme.icon }}>Date: {glowup.createdAt?.toLocaleDateString()}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    height: 400,
    width: '100%',
  },
  infoContainer: {
    padding: 20,
  }
});

import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useCallback } from "react";
import { searchTracks, getTopTracks } from "../../src/services/spotify";
import TrackListItem from "../../src/components/TrackListItem";
import type { SpotifyTrack } from "../../src/types";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const tracks = await searchTracks(text.trim());
      setResults(tracks);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message || "Search failed. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function loadTopTracks() {
    setIsLoading(true);
    setError(null);
    try {
      const tracks = await getTopTracks(20);
      setResults(tracks);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message || "Failed to load top tracks.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleTrackPress(track: SpotifyTrack) {
    // Navigate to trimmer with the selected track
    // Using the tab navigator, we'll pass via a simple state approach
    // For now, just log the selection
    console.log("Selected track:", track.name);
    // In a full implementation, we'd navigate to the trimmer tab with the track data
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Find your favourite tracks</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search songs, artists, albums..."
          placeholderTextColor="#666666"
          value={query}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Text
            style={styles.clearButton}
            onPress={() => {
              setQuery("");
              setResults([]);
              setHasSearched(false);
            }}
          >
            ✕
          </Text>
        )}
      </View>

      {/* Loading indicator */}
      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#1DB954"
          style={styles.loader}
        />
      )}

      {/* Error state */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Results */}
      {!isLoading && hasSearched && results.length === 0 && !error && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>
            No tracks found for "{query}"
          </Text>
          <Text style={styles.emptyHint}>
            Try different keywords or check the spelling
          </Text>
        </View>
      )}

      {!isLoading && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TrackListItem
              track={item}
              onPress={handleTrackPress}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Initial state - suggestions */}
      {!hasSearched && !isLoading && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Browse</Text>
          <Text style={styles.suggestionsText} onPress={loadTopTracks}>
            🎧 Your Top Tracks
          </Text>
          <Text style={styles.suggestionsText}>
            🔥 Trending Now
          </Text>
          <Text style={styles.suggestionsText}>
            🆕 New Releases
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#999999",
    fontSize: 14,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    height: "100%",
  },
  clearButton: {
    color: "#999",
    fontSize: 18,
    padding: 4,
  },
  loader: {
    marginTop: 40,
  },
  errorContainer: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyHint: {
    color: "#999",
    fontSize: 13,
    textAlign: "center",
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 100,
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 16,
  },
  suggestionsTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  suggestionsText: {
    color: "#CCCCCC",
    fontSize: 16,
    paddingVertical: 8,
  },
});
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import AudioTrimmer from "../../src/components/AudioTrimmer";
import { APP_CONFIG } from "../../src/constants";
import type { SpotifyTrack, SubscriptionTier } from "../../src/types";

// Placeholder track data - in real app, this comes from search selection
const PLACEHOLDER_TRACK: SpotifyTrack = {
  id: "placeholder",
  name: "Select a track first",
  uri: "spotify:track:placeholder",
  artists: [{ id: "0", name: "Artist", uri: "spotify:artist:0" }],
  album: {
    id: "0",
    name: "Album",
    images: [],
    uri: "spotify:album:0",
  },
  duration_ms: 30000,
  preview_url: null,
  external_urls: { spotify: "" },
};

export default function TrimmerScreen() {
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(20);
  // For demo purposes, assume free tier; in production, check subscription
  const subscriptionTier: SubscriptionTier = "free";
  const maxDuration = subscriptionTier === "premium"
    ? APP_CONFIG.MAX_CLIP_DURATION_PREMIUM
    : APP_CONFIG.MAX_CLIP_DURATION_FREE;

  function handleTrimChange(newStart: number, newEnd: number) {
    setStartTime(newStart);
    setEndTime(newEnd);
  }

  function handleExport() {
    // Export logic will be implemented in a later phase
    console.log("Exporting clip:", {
      track: selectedTrack?.name,
      startTime,
      endTime,
      duration: endTime - startTime,
    });
  }

  const clipDuration = (endTime - startTime).toFixed(1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Trimmer</Text>
        <Text style={styles.subtitle}>Create your perfect ringtone clip</Text>
      </View>

      {/* Selected track info */}
      {selectedTrack ? (
        <View style={styles.trackInfo}>
          <View style={styles.trackInfoContent}>
            <Text style={styles.trackName} numberOfLines={1}>
              {selectedTrack.name}
            </Text>
            <Text style={styles.artistName} numberOfLines={1}>
              {selectedTrack.artists.map((a) => a.name).join(", ")}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => setSelectedTrack(null)}
          >
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.noTrack}>
          <Text style={styles.noTrackIcon}>🎵</Text>
          <Text style={styles.noTrackText}>
            Search for a track in the Search tab,{'\n'}then come here to trim it
          </Text>
        </View>
      )}

      {/* Audio trimmer */}
      {selectedTrack?.preview_url && (
        <AudioTrimmer
          previewUrl={selectedTrack.preview_url}
          durationMs={selectedTrack.duration_ms}
          onTrimChange={handleTrimChange}
          maxDuration={maxDuration}
        />
      )}

      {/* Export section */}
      <View style={styles.exportSection}>
        {/* Subscription info */}
        <View style={styles.subscriptionInfo}>
          <Text style={styles.subscriptionLabel}>
            {subscriptionTier === "free" ? "Free Plan" : "Premium Plan"}
          </Text>
          <Text style={styles.subscriptionDetail}>
            Max clip duration: {maxDuration}s
          </Text>
          {subscriptionTier === "free" && (
            <Text style={styles.upgradeText}>
              Upgrade to Premium for {maxDuration}s clips & unlimited exports
            </Text>
          )}
        </View>

        {/* Export button */}
        <TouchableOpacity
          style={[
            styles.exportButton,
            (!selectedTrack || !selectedTrack.preview_url) && styles.exportButtonDisabled,
          ]}
          onPress={handleExport}
          disabled={!selectedTrack || !selectedTrack.preview_url}
          activeOpacity={0.8}
        >
          <Text style={styles.exportButtonText}>
            Export Ringtone ({clipDuration}s)
          </Text>
        </TouchableOpacity>

        {/* Export options */}
        <View style={styles.exportOptions}>
          <Text style={styles.exportOptionsTitle}>Export Format</Text>
          <View style={styles.formatRow}>
            <View style={[styles.formatBadge, styles.formatActive]}>
              <Text style={styles.formatBadgeText}>iOS (.m4r)</Text>
            </View>
            <View style={styles.formatBadge}>
              <Text style={[styles.formatBadgeText, styles.formatInactiveText]}>
                Android (.mp3)
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    paddingBottom: 40,
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
  trackInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
  },
  trackInfoContent: {
    flex: 1,
  },
  trackName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  artistName: {
    color: "#999999",
    fontSize: 13,
  },
  changeButton: {
    backgroundColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  changeButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  noTrack: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 32,
  },
  noTrackIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noTrackText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  exportSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 16,
  },
  subscriptionInfo: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  subscriptionLabel: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  subscriptionDetail: {
    color: "#CCCCCC",
    fontSize: 14,
  },
  upgradeText: {
    color: "#999999",
    fontSize: 12,
    fontStyle: "italic",
  },
  exportButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
  },
  exportButtonDisabled: {
    opacity: 0.4,
  },
  exportButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  exportOptions: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  exportOptionsTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  formatRow: {
    flexDirection: "row",
    gap: 8,
  },
  formatBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#333",
  },
  formatActive: {
    backgroundColor: "#1DB95430",
    borderWidth: 1,
    borderColor: "#1DB954",
  },
  formatBadgeText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  formatInactiveText: {
    color: "#999",
  },
});
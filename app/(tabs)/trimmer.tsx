import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from "react-native";
import { useState, useEffect } from "react";
import AudioTrimmer from "../../src/components/AudioTrimmer";
import { APP_CONFIG } from "../../src/constants";
import { exportRingtoneWithAlert } from "../../src/services/ringtoneExport";
import { getPlatformFormat, getPlatformFormatName } from "../../src/services/audioProcessor";
import { checkFFmpegAvailable } from "../../src/services/audioProcessor";
import type { SpotifyTrack, SubscriptionTier } from "../../src/types";

export default function TrimmerScreen() {
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(20);
  const [isExporting, setIsExporting] = useState(false);
  const [ffmpegReady, setFfmpegReady] = useState<boolean | null>(null);
  // For demo purposes, assume free tier; in production, check subscription
  const subscriptionTier: SubscriptionTier = "free";
  const isPremium = subscriptionTier === "premium";
  const maxDuration = isPremium
    ? APP_CONFIG.MAX_CLIP_DURATION_PREMIUM
    : APP_CONFIG.MAX_CLIP_DURATION_FREE;
  const platformFormat = getPlatformFormat();
  const platformFormatName = getPlatformFormatName();

  function handleTrimChange(newStart: number, newEnd: number) {
    setStartTime(newStart);
    setEndTime(newEnd);
  }

  async function handleExport() {
    if (!selectedTrack?.preview_url) {
      return;
    }

    setIsExporting(true);
    try {
      await exportRingtoneWithAlert({
        trackId: selectedTrack.id,
        trackName: selectedTrack.name,
        previewUrl: selectedTrack.preview_url,
        startTime,
        endTime,
        isPremium,
        format: platformFormat,
        bitrate: isPremium ? "320k" : "128k",
      });
    } finally {
      setIsExporting(false);
    }
  }

  // Check FFmpeg availability on mount
  useEffect(() => {
    checkFFmpegAvailable().then(setFfmpegReady).catch(() => setFfmpegReady(false));
  }, []);

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
        {isExporting ? (
          <View style={[styles.exportButton, styles.exportButtonExporting]}>
            <ActivityIndicator color="#FFFFFF" size="small" />
            <Text style={[styles.exportButtonText, { marginLeft: 8 }]}>
              Creating ringtone...
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.exportButton,
              (!selectedTrack || !selectedTrack.preview_url || ffmpegReady === false) && styles.exportButtonDisabled,
            ]}
            onPress={handleExport}
            disabled={!selectedTrack || !selectedTrack.preview_url || ffmpegReady === false}
            activeOpacity={0.8}
          >
            <Text style={styles.exportButtonText}>
              {ffmpegReady === null
                ? "Loading audio engine..."
                : ffmpegReady === false
                ? "Audio engine unavailable"
                : `Export Ringtone (${clipDuration}s)`}
            </Text>
          </TouchableOpacity>
        )}

        {/* Export options */}
        <View style={styles.exportOptions}>
          <Text style={styles.exportOptionsTitle}>Export Format</Text>
          <View style={styles.formatRow}>
            <View style={[styles.formatBadge, styles.formatActive]}>
              <Text style={styles.formatBadgeText}>
                {Platform.OS === "ios" ? "iOS (.m4r)" : "Android (.mp3)"}
              </Text>
            </View>
            <View style={styles.formatBadge}>
              <Text style={[styles.formatBadgeText, styles.formatInactiveText]}>
                {Platform.OS === "ios" ? "Android (.mp3)" : "iOS (.m4r)"}
              </Text>
            </View>
          </View>
          <Text style={styles.formatNote}>
            Auto-detected for {Platform.OS === "ios" ? "iOS" : "Android"}. 
            Use Share to export for the other platform.
          </Text>
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
  exportButtonExporting: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8,
  },
  formatNote: {
    color: "#666",
    fontSize: 11,
    fontStyle: "italic",
    textAlign: "center",
  },
});
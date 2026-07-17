import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import type { SpotifyTrack } from "../types";

interface TrackListItemProps {
  track: SpotifyTrack;
  onPress: (track: SpotifyTrack) => void;
  showPreview?: boolean;
}

export default function TrackListItem({
  track,
  onPress,
  showPreview = true,
}: TrackListItemProps) {
  const albumArt = track.album?.images?.[0]?.url;
  const artistNames = track.artists?.map((a) => a.name).join(", ") || "Unknown Artist";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(track)}
      activeOpacity={0.7}
    >
      {albumArt ? (
        <Image source={{ uri: albumArt }} style={styles.albumArt} />
      ) : (
        <View style={[styles.albumArt, styles.placeholderArt]}>
          <Text style={styles.placeholderText}>🎵</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.trackName} numberOfLines={1}>
          {track.name}
        </Text>
        <Text style={styles.artistName} numberOfLines={1}>
          {artistNames}
        </Text>
        {showPreview && track.preview_url ? (
          <View style={styles.previewBadge}>
            <Text style={styles.previewText}>▶ Preview available</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  albumArt: {
    width: 56,
    height: 56,
    borderRadius: 6,
  },
  placeholderArt: {
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  trackName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  artistName: {
    color: "#999999",
    fontSize: 13,
    marginBottom: 4,
  },
  previewBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#1DB95420",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  previewText: {
    color: "#1DB954",
    fontSize: 11,
    fontWeight: "500",
  },
  chevron: {
    color: "#555",
    fontSize: 24,
    marginLeft: 8,
  },
});
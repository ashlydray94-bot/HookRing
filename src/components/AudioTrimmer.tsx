import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";

interface AudioTrimmerProps {
  previewUrl: string;
  durationMs: number;
  onTrimChange: (startTime: number, endTime: number) => void;
  maxDuration: number; // max clip duration in seconds
}

export default function AudioTrimmer({
  previewUrl,
  durationMs,
  onTrimChange,
  maxDuration,
}: AudioTrimmerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(
    Math.min(30, durationMs / 1000)
  );

  const durationSec = durationMs / 1000;

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  async function loadAndPlayPreview() {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: previewUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error("Failed to load preview:", error);
    }
  }

  function onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(startTime);
      }
      // Loop within the trim region
      if (status.positionMillis / 1000 >= endTime) {
        sound?.setPositionAsync(startTime * 1000);
      }
    }
  }

  function handlePlayPause() {
    if (isPlaying) {
      sound?.pauseAsync();
      setIsPlaying(false);
    } else {
      if (sound) {
        sound.playAsync();
        setIsPlaying(true);
      } else {
        loadAndPlayPreview();
      }
    }
  }

  function handleStartTimeChange(value: number) {
    const newStart = Math.min(value, endTime - 1);
    setStartTime(newStart);
    onTrimChange(newStart, endTime);
  }

  function handleEndTimeChange(value: number) {
    const maxEnd = Math.min(startTime + maxDuration, durationSec);
    const newEnd = Math.max(value, startTime + 1);
    const clampedEnd = Math.min(newEnd, maxEnd);
    setEndTime(clampedEnd);
    onTrimChange(startTime, clampedEnd);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Trim Your Ringtone</Text>

      {/* Waveform visualization placeholder */}
      <View style={styles.waveform}>
        {Array.from({ length: 40 }).map((_, i) => {
          const barHeight = 20 + Math.random() * 40;
          const barPosition = (i / 40) * durationSec;
          const isInRange = barPosition >= startTime && barPosition <= endTime;
          return (
            <View
              key={i}
              style={[
                styles.waveformBar,
                {
                  height: barHeight,
                  backgroundColor: isInRange ? "#1DB954" : "#555",
                },
              ]}
            />
          );
        })}
      </View>

      {/* Start time slider */}
      <View style={styles.sliderRow}>
        <Text style={styles.sliderLabel}>Start</Text>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={durationSec - 1}
            value={startTime}
            onValueChange={handleStartTimeChange}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#555"
            thumbTintColor="#1DB954"
          />
        </View>
        <Text style={styles.timeText}>{startTime.toFixed(1)}s</Text>
      </View>

      {/* End time slider */}
      <View style={styles.sliderRow}>
        <Text style={styles.sliderLabel}>End</Text>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={Math.min(startTime + maxDuration, durationSec)}
            value={endTime}
            onValueChange={handleEndTimeChange}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#555"
            thumbTintColor="#1DB954"
          />
        </View>
        <Text style={styles.timeText}>{endTime.toFixed(1)}s</Text>
      </View>

      {/* Clip info */}
      <View style={styles.clipInfo}>
        <Text style={styles.clipInfoText}>
          Clip duration: {(endTime - startTime).toFixed(1)}s
        </Text>
        <Text style={styles.clipInfoText}>
          Max: {maxDuration}s
        </Text>
      </View>

      {/* Playback controls */}
      <View style={styles.controls}>
        <Text
          style={styles.playButton}
          onPress={handlePlayPause}
        >
          {isPlaying ? "⏸ Pause" : "▶ Preview"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 80,
    marginBottom: 16,
    gap: 2,
  },
  waveformBar: {
    flex: 1,
    borderRadius: 2,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sliderLabel: {
    color: "#999",
    fontSize: 13,
    width: 40,
  },
  sliderContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeText: {
    color: "#1DB954",
    fontSize: 13,
    fontWeight: "600",
    width: 50,
    textAlign: "right",
  },
  clipInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  clipInfoText: {
    color: "#999",
    fontSize: 12,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  playButton: {
    color: "#FFFFFF",
    backgroundColor: "#1DB954",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    fontSize: 16,
    fontWeight: "600",
    overflow: "hidden",
  },
});
import { Alert } from "react-native";
import { downloadPreview, cleanupOldFiles } from "./audioDownload";
import {
  trimAndConvert,
  getPlatformFormat,
  getPlatformExtension,
  type AudioProcessingResult,
} from "./audioProcessor";
import { installRingtone } from "./ringtoneInstaller";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS, APP_CONFIG } from "../constants";

export interface ExportOptions {
  trackId: string;
  trackName: string;
  previewUrl: string;
  startTime: number; // seconds
  endTime: number; // seconds
  isPremium: boolean;
  format?: "m4a" | "mp3";
  bitrate?: string;
}

export interface ExportResult {
  success: boolean;
  message: string;
  details?: AudioProcessingResult;
}

/**
 * Track export usage in AsyncStorage
 */
async function incrementExportCount(): Promise<number> {
  const countStr = await AsyncStorage.getItem(STORAGE_KEYS.EXPORT_HISTORY);
  const count = countStr ? parseInt(countStr, 10) : 0;
  const newCount = count + 1;
  await AsyncStorage.setItem(STORAGE_KEYS.EXPORT_HISTORY, newCount.toString());
  return newCount;
}

/**
 * Get current month's export count
 */
export async function getExportCount(): Promise<number> {
  const countStr = await AsyncStorage.getItem(STORAGE_KEYS.EXPORT_HISTORY);
  return countStr ? parseInt(countStr, 10) : 0;
}

/**
 * Check if the user can export based on their subscription tier
 */
export async function canExport(isPremium: boolean): Promise<{ allowed: boolean; reason?: string }> {
  if (isPremium) {
    return { allowed: true };
  }

  const count = await getExportCount();
  const limit = APP_CONFIG.FREE_EXPORTS_PER_MONTH;

  if (count >= limit) {
    return {
      allowed: false,
      reason: `You've used all ${limit} free exports this month. Upgrade to Premium for unlimited exports!`,
    };
  }

  return { allowed: true };
}

/**
 * Main export pipeline: download → trim/convert → install
 *
 * This is the core export flow for HookRing.
 */
export async function exportRingtone(options: ExportOptions): Promise<ExportResult> {
  const {
    trackId,
    trackName,
    previewUrl,
    startTime,
    endTime,
    isPremium,
    format = getPlatformFormat(),
    bitrate = isPremium ? "320k" : "128k",
  } = options;

  try {
    // Step 0: Check usage limits
    const exportCheck = await canExport(isPremium);
    if (!exportCheck.allowed) {
      return {
        success: false,
        message: exportCheck.reason || "Export limit reached",
      };
    }

    // Validate clip duration
    const clipDuration = endTime - startTime;
    const maxDuration = isPremium
      ? APP_CONFIG.MAX_CLIP_DURATION_PREMIUM
      : APP_CONFIG.MAX_CLIP_DURATION_FREE;

    if (clipDuration > maxDuration) {
      return {
        success: false,
        message: `Clip duration (${clipDuration.toFixed(1)}s) exceeds the ${
          isPremium ? "Premium" : "Free"
        } limit of ${maxDuration}s`,
      };
    }

    // Step 1: Download the Spotify preview clip
    const localPath = await downloadPreview(trackId, previewUrl);

    // Step 2: Trim and convert to the target format
    const result = await trimAndConvert(
      localPath,
      trackId,
      startTime,
      endTime,
      format,
      bitrate
    );

    if (!result.success || !result.outputPath) {
      return {
        success: false,
        message: result.error || "Failed to process audio",
        details: result,
      };
    }

    // Step 3: Install the ringtone on the device
    const installed = await installRingtone(result.outputPath, trackName);

    if (!installed) {
      return {
        success: false,
        message: "Audio was processed but could not be installed as ringtone",
        details: result,
      };
    }

    // Step 4: Track the export
    await incrementExportCount();

    // Step 5: Cleanup old files (non-blocking)
    cleanupOldFiles().catch(() => {});

    return {
      success: true,
      message: `"${trackName}" ringtone created successfully!`,
      details: result,
    };
  } catch (error: any) {
    console.error("Export error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred during export",
    };
  }
}

/**
 * Export a ringtone and present the result to the user via Alert
 */
export async function exportRingtoneWithAlert(options: ExportOptions): Promise<void> {
  const result = await exportRingtone(options);

  if (result.success) {
    Alert.alert(
      "🎵 Ringtone Created!",
      result.message,
      [{ text: "Awesome!" }]
    );
  } else {
    Alert.alert(
      "Export Failed",
      result.message,
      [{ text: "OK" }]
    );
  }
}
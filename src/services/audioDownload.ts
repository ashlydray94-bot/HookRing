import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

const CACHE_DIR = `${FileSystem.cacheDirectory}hookring/`;
const DOWNLOADS_DIR = `${CACHE_DIR}downloads/`;
const EXPORTS_DIR = `${CACHE_DIR}exports/`;

/**
 * Ensure required directories exist in the cache
 */
export async function ensureDirectories(): Promise<void> {
  const dirs = [CACHE_DIR, DOWNLOADS_DIR, EXPORTS_DIR];
  for (const dir of dirs) {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  }
}

/**
 * Download a Spotify preview clip to local cache storage.
 * Returns the local file path of the downloaded audio.
 */
export async function downloadPreview(
  trackId: string,
  previewUrl: string
): Promise<string> {
  await ensureDirectories();

  const extension = previewUrl.endsWith(".mp3") ? ".mp3" : ".m4a";
  const localPath = `${DOWNLOADS_DIR}${trackId}_preview${extension}`;

  // Check if already downloaded
  const existing = await FileSystem.getInfoAsync(localPath);
  if (existing.exists) {
    return localPath;
  }

  // Download the file
  const downloadResult = await FileSystem.downloadAsync(previewUrl, localPath);

  if (!downloadResult.uri) {
    throw new Error("Failed to download preview clip");
  }

  return downloadResult.uri;
}

/**
 * Get the local file URI for a downloaded preview
 */
export function getPreviewFilePath(trackId: string): string {
  return `${DOWNLOADS_DIR}${trackId}_preview.mp3`;
}

/**
 * Get the exported ringtone file path
 */
export function getExportFilePath(
  trackId: string,
  format: "m4a" | "mp3"
): string {
  const extension = format === "m4a" ? ".m4a" : ".mp3";
  return `${EXPORTS_DIR}${trackId}_ringtone${extension}`;
}

/**
 * Clean up old files to free space
 */
export async function cleanupOldFiles(maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<void> {
  try {
    await ensureDirectories();

    const dirs = [DOWNLOADS_DIR, EXPORTS_DIR];
    for (const dir of dirs) {
      const files = await FileSystem.readDirectoryAsync(dir);
      const now = Date.now();

      for (const file of files) {
        const filePath = `${dir}${file}`;
        const info = await FileSystem.getInfoAsync(filePath, { size: false });
        if (info.exists && info.modificationTime) {
          const age = now - info.modificationTime * 1000;
          if (age > maxAgeMs) {
            await FileSystem.deleteAsync(filePath, { idempotent: true });
          }
        }
      }
    }
  } catch (error) {
    console.warn("Cleanup error:", error);
    // Non-critical, don't throw
  }
}

/**
 * Get total cache size for display
 */
export async function getCacheSize(): Promise<number> {
  try {
    await ensureDirectories();
    let totalSize = 0;

    const dirs = [DOWNLOADS_DIR, EXPORTS_DIR];
    for (const dir of dirs) {
      const files = await FileSystem.readDirectoryAsync(dir);
      for (const file of files) {
        const info = await FileSystem.getInfoAsync(`${dir}${file}`, { size: true });
        if (info.exists && info.size) {
          totalSize += info.size;
        }
      }
    }

    return totalSize;
  } catch {
    return 0;
  }
}
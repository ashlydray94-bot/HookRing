import { Platform } from "react-native";
import { getExportFilePath, ensureDirectories } from "./audioDownload";

// ffmpeg-kit-react-native provides FFmpeg execution in React Native
// https://github.com/arthenica/ffmpeg-kit
import { FFmpegKit, ReturnCode } from "ffmpeg-kit-react-native";

export type ExportFormat = "m4a" | "mp3";

export interface AudioProcessingResult {
  success: boolean;
  outputPath: string | null;
  duration: number; // actual clip duration in seconds
  fileSize: number; // file size in bytes
  format: ExportFormat;
  error?: string;
}

/**
 * Trim an audio file to the specified start/end times and convert to the target format.
 *
 * @param inputPath - Path to the source audio file (downloaded preview)
 * @param trackId - Spotify track ID for naming the output
 * @param startTime - Start time in seconds
 * @param endTime - End time in seconds
 * @param format - Export format (m4a for iOS, mp3 for Android)
 * @param bitrate - Audio bitrate (e.g., "128k", "192k", "320k")
 * @returns AudioProcessingResult with output file info
 */
export async function trimAndConvert(
  inputPath: string,
  trackId: string,
  startTime: number,
  endTime: number,
  format: ExportFormat,
  bitrate: string = "192k"
): Promise<AudioProcessingResult> {
  await ensureDirectories();
  const outputPath = getExportFilePath(trackId, format);
  const duration = endTime - startTime;

  // Build FFmpeg command:
  // -ss: start time (seeks to position)
  // -t: duration of the clip
  // -c:a: audio codec
  // -b:a: audio bitrate
  // -ar: audio sample rate (44.1kHz is standard for ringtones)
  // -ac: audio channels (mono for ringtones works well)
  // -y: overwrite output without asking

  const codec = format === "m4a" ? "aac" : "libmp3lame";
  const sampleRate = "44100";
  const channels = "1"; // mono for ringtones

  const command = `-ss ${startTime} -i "${inputPath}" -t ${duration} -c:a ${codec} -b:a ${bitrate} -ar ${sampleRate} -ac ${channels} -y "${outputPath}"`;

  try {
    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();

    if (ReturnCode.isSuccess(returnCode)) {
      // Get file info
      const fileInfo = await fetch(outputPath).catch(() => null);
      const fileSize = fileInfo?.headers?.get("content-length")
        ? parseInt(fileInfo.headers.get("content-length")!, 10)
        : 0;

      return {
        success: true,
        outputPath,
        duration,
        fileSize,
        format,
      };
    } else if (ReturnCode.isCancel(returnCode)) {
      return {
        success: false,
        outputPath: null,
        duration: 0,
        fileSize: 0,
        format,
        error: "Export was cancelled",
      };
    } else {
      const log = await session.getLogsAsString();
      return {
        success: false,
        outputPath: null,
        duration: 0,
        fileSize: 0,
        format,
        error: `FFmpeg error: ${log || "Unknown error"}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      outputPath: null,
      duration: 0,
      fileSize: 0,
      format,
      error: `Processing error: ${error.message || error}`,
    };
  }
}

/**
 * Get the appropriate export format for the current platform
 */
export function getPlatformFormat(): ExportFormat {
  return Platform.OS === "ios" ? "m4a" : "mp3";
}

/**
 * Get the file extension for the platform format
 */
export function getPlatformExtension(): string {
  return Platform.OS === "ios" ? ".m4r" : ".mp3";
}

/**
 * Get the MIME type for the platform format
 */
export function getPlatformMimeType(): string {
  return Platform.OS === "ios" ? "audio/mp4" : "audio/mpeg";
}

/**
 * Get the display name for the platform format
 */
export function getPlatformFormatName(): string {
  return Platform.OS === "ios" ? "M4R (iOS)" : "MP3 (Android)";
}

/**
 * Check if FFmpeg is available and working
 */
export async function checkFFmpegAvailable(): Promise<boolean> {
  try {
    const session = await FFmpegKit.execute("-version");
    const returnCode = await session.getReturnCode();
    return ReturnCode.isSuccess(returnCode);
  } catch {
    return false;
  }
}
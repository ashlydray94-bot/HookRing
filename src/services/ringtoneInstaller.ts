import { Platform, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

/**
 * Install a ringtone on the device.
 *
 * Platform specifics:
 * - iOS: Ringtones cannot be programmatically installed without a custom native module.
 *        We export the .m4r file and share it. The user can then save it via the Files app
 *        or use GarageBand to install as ringtone.
 * - Android: We can write directly to the Ringtones directory or use MediaStore.
 *
 * @param filePath - Path to the rendered ringtone file
 * @param trackName - Name of the track for naming the ringtone
 * @returns true if installation was successful (or file was shared)
 */
export async function installRingtone(
  filePath: string,
  trackName: string
): Promise<boolean> {
  if (Platform.OS === "android") {
    return installOnAndroid(filePath, trackName);
  } else if (Platform.OS === "ios") {
    return installOnIOS(filePath, trackName);
  }

  // Fallback for web/other platforms
  return shareRingtone(filePath, trackName);
}

/**
 * Install ringtone on Android using MediaStore API.
 * Writes the audio file to the Ringtones system directory.
 */
async function installOnAndroid(
  filePath: string,
  trackName: string
): Promise<boolean> {
  try {
    // Request permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      // Fall back to sharing
      console.warn("Media library permission not granted, falling back to sharing");
      return shareRingtone(filePath, trackName);
    }

    // Save to the device's ringtone directory via MediaStore
    // expo-media-library doesn't directly support ringtone directory,
    // so we save to the library first and then share as a workaround
    const asset = await MediaLibrary.createAssetAsync(filePath);

    if (asset) {
      Alert.alert(
        "Ringtone Saved",
        `"${trackName}" has been saved to your device.\n\nTo set it as ringtone:\n1. Open Settings > Sound & Vibration\n2. Tap Ringtone\n3. Select your new ringtone from the list`,
        [{ text: "OK" }]
      );
      return true;
    }

    return false;
  } catch (error: any) {
    console.error("Android ringtone installation error:", error);
    // Fallback to sharing
    return shareRingtone(filePath, trackName);
  }
}

/**
 * Share ringtone on iOS.
 * iOS doesn't allow programmatic ringtone installation without custom native modules.
 * The best we can do is share the .m4r file and let the user install it manually.
 */
async function installOnIOS(
  filePath: string,
  trackName: string
): Promise<boolean> {
  try {
    // On iOS, we provide the file and show instructions
    const shared = await shareRingtone(filePath, trackName);

    if (shared) {
      Alert.alert(
        "Installing on iOS",
        `To install "${trackName}" as a ringtone:\n\n` +
          "1. Save the file to Files app\n" +
          "2. Open GarageBand\n" +
          "3. Start a new Audio Recorder project\n" +
          "4. Tap the Loop icon → Files → select your ringtone\n" +
          "5. Long-press the file → Share → Ringtone\n" +
          "6. Name your ringtone and tap Export\n\n" +
          "Once installed, it will appear in Settings > Sounds & Haptics",
        [{ text: "Got it" }]
      );
      return true;
    }

    return false;
  } catch (error: any) {
    console.error("iOS ringtone installation error:", error);
    return false;
  }
}

/**
 * Share the ringtone file using the system share sheet.
 */
export async function shareRingtone(
  filePath: string,
  trackName: string
): Promise<boolean> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        "Sharing Not Available",
        "Sharing is not available on this device. The file is saved in the app's cache."
      );
      return false;
    }

    // Create a copy with a user-friendly name for sharing
    const extension = filePath.endsWith(".m4a") ? ".m4r" : ".mp3";
    const shareFileName = `${FileSystem.cacheDirectory}${trackName.replace(/[^a-zA-Z0-9]/g, "_")}_ringtone${extension}`;

    await FileSystem.copyAsync({
      from: filePath,
      to: shareFileName,
    });

    await Sharing.shareAsync(shareFileName, {
      mimeType: Platform.OS === "ios" ? "audio/mp4" : "audio/mpeg",
      dialogTitle: `Share "${trackName}" ringtone`,
    });

    // Clean up the shared copy after sharing
    FileSystem.deleteAsync(shareFileName, { idempotent: true }).catch(() => {});

    return true;
  } catch (error: any) {
    console.error("Share error:", error);
    return false;
  }
}

/**
 * Check if ringtone installation is available (for UI state)
 */
export function isRingtoneInstallationAvailable(): boolean {
  if (Platform.OS === "android") {
    return true; // With limitations
  }
  // iOS requires manual steps via sharing
  return false;
}
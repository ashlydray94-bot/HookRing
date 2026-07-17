import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useSpotifyAuth, saveTokens } from "../src/services/spotify";

export default function LoginScreen() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { request, response, promptAsync } = useSpotifyAuth();

  // Handle auth response from Spotify
  if (response?.type === "success") {
    const { code } = response.params;
    // Exchange code for tokens using the auth response
    // In a real app, you'd use the access_token from the response
    // For now, save the auth code flow
    saveTokens({
      access_token: response.params.access_token || "",
      token_type: "Bearer",
      scope: "",
      expires_in: 3600,
    }).then(() => {
      router.replace("/(tabs)");
    });
  }

  async function handleLogin() {
    setIsLoggingIn(true);
    try {
      const result = await promptAsync({ showInRecents: true });
      if (result?.type === "success") {
        // The auth response is handled above via the useEffect-like response check
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* App branding */}
      <View style={styles.branding}>
        <Text style={styles.logo}>🎵</Text>
        <Text style={styles.title}>HookRing</Text>
        <Text style={styles.subtitle}>
          Turn any Spotify track{'\n'}into a custom ringtone
        </Text>
      </View>

      {/* Feature highlights */}
      <View style={styles.features}>
        <FeatureItem icon="🔍" text="Browse Spotify's entire catalogue" />
        <FeatureItem icon="✂️" text="Trim the perfect 15-30 second clip" />
        <FeatureItem icon="📱" text="Export as iOS .m4r or Android .mp3" />
        <FeatureItem icon="✨" text="Studio-quality output, no audio skills needed" />
      </View>

      {/* Login button */}
      <View style={styles.footer}>
        {isLoggingIn ? (
          <View style={styles.loggingInContainer}>
            <Text style={styles.loggingInText}>Connecting to Spotify...</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.loginButton,
              !request && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!request}
            activeOpacity={0.8}
          >
            <Text style={styles.loginIcon}>🎧</Text>
            <Text style={styles.loginButtonText}>
              Continue with Spotify
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.disclaimer}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
          {'\n'}We only access your music data with your permission.
        </Text>
      </View>
    </View>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 32,
    justifyContent: "space-between",
    paddingTop: 80,
    paddingBottom: 40,
  },
  branding: {
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 12,
  },
  subtitle: {
    color: "#999999",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  features: {
    gap: 16,
    paddingVertical: 40,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  featureIcon: {
    fontSize: 24,
    width: 32,
    textAlign: "center",
  },
  featureText: {
    color: "#CCCCCC",
    fontSize: 15,
    flex: 1,
  },
  footer: {
    alignItems: "center",
    gap: 16,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1DB954",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 28,
    width: "100%",
    gap: 12,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginIcon: {
    fontSize: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  loggingInContainer: {
    paddingVertical: 16,
  },
  loggingInText: {
    color: "#1DB954",
    fontSize: 16,
  },
  disclaimer: {
    color: "#666666",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
});
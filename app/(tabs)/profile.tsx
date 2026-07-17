import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { clearTokens } from "../../src/services/spotify";
import { APP_CONFIG, STORAGE_KEYS } from "../../src/constants";
import type { SubscriptionTier } from "../../src/types";

export default function ProfileScreen() {
  // For demo purposes, assume free tier
  const subscriptionTier: SubscriptionTier = "free";
  const exportsUsed = 1; // This would come from async storage / backend
  const exportsLimit = APP_CONFIG.FREE_EXPORTS_PER_MONTH;

  async function handleLogout() {
    await clearTokens();
    router.replace("/login");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* Subscription card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Subscription</Text>
        <View style={styles.tierBadge}>
          <Text style={styles.tierText}>
            {subscriptionTier === "free" ? "Free Plan" : "Premium"}
          </Text>
        </View>
        <View style={styles.usageRow}>
          <Text style={styles.usageLabel}>Exports this month</Text>
          <Text style={styles.usageValue}>
            {exportsUsed} / {exportsLimit}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(exportsUsed / exportsLimit) * 100}%` },
            ]}
          />
        </View>
        {subscriptionTier === "free" && (
          <TouchableOpacity style={styles.upgradeButton} activeOpacity={0.8}>
            <Text style={styles.upgradeButtonText}>
              Upgrade to Premium — ${APP_CONFIG.PREMIUM_PRICE_MONTHLY}/mo
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Premium features */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Premium Features</Text>
        <FeatureRow
          icon="🎵"
          text="Unlimited ringtone exports"
          included={false}
        />
        <FeatureRow
          icon="⏱️"
          text="Up to 30-second clips"
          included={false}
        />
        <FeatureRow
          icon="🎚️"
          text="High bitrate audio (320kbps)"
          included={false}
        />
        <FeatureRow
          icon="📱"
          text="Both iOS & Android formats"
          included={false}
        />
        <FeatureRow
          icon="🚫"
          text="No watermark"
          included={false}
        />
      </View>

      {/* Settings */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Settings</Text>
        <TouchableOpacity style={styles.settingsRow}>
          <Text style={styles.settingsText}>Default clip duration</Text>
          <Text style={styles.settingsValue}>20s</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsRow}>
          <Text style={styles.settingsText}>Export quality</Text>
          <Text style={styles.settingsValue}>192kbps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsRow}>
          <Text style={styles.settingsText}>Add fade in/out</Text>
          <Text style={styles.settingsValue}>Off</Text>
        </TouchableOpacity>
      </View>

      {/* Export history */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Export History</Text>
        <Text style={styles.emptyText}>No exports yet. Start creating!</Text>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Disconnect from Spotify</Text>
      </TouchableOpacity>

      {/* Version */}
      <Text style={styles.version}>HookRing v{APP_CONFIG.APP_VERSION}</Text>
    </ScrollView>
  );
}

function FeatureRow({
  icon,
  text,
  included,
}: {
  icon: string;
  text: string;
  included: boolean;
}) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={[styles.featureText, !included && styles.featureLocked]}>
        {text}
      </Text>
      <Text style={[styles.featureStatus, included && styles.featureIncluded]}>
        {included ? "✓" : "Premium"}
      </Text>
    </View>
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
    paddingBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    gap: 12,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  tierBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#1DB95420",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tierText: {
    color: "#1DB954",
    fontSize: 13,
    fontWeight: "600",
  },
  usageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  usageLabel: {
    color: "#999",
    fontSize: 14,
  },
  usageValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1DB954",
    borderRadius: 3,
  },
  upgradeButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 8,
  },
  upgradeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    fontSize: 18,
    width: 28,
  },
  featureText: {
    color: "#CCCCCC",
    fontSize: 14,
    flex: 1,
  },
  featureLocked: {
    color: "#666",
  },
  featureStatus: {
    color: "#1DB954",
    fontSize: 13,
    fontWeight: "600",
  },
  featureIncluded: {
    color: "#1DB954",
  },
  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  settingsText: {
    color: "#CCCCCC",
    fontSize: 14,
  },
  settingsValue: {
    color: "#999",
    fontSize: 14,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF4444",
  },
  logoutText: {
    color: "#FF4444",
    fontSize: 16,
    fontWeight: "600",
  },
  version: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },
});
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { isAuthenticated } from "../src/services/spotify";

export default function RootLayout() {
  const [authLoaded, setAuthLoaded] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const authed = await isAuthenticated();
      setAuthenticated(authed);
    } catch {
      setAuthenticated(false);
    }
    setAuthLoaded(true);
  }

  if (!authLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#121212" },
        }}
      >
        {authenticated ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="login" />
        )}
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
});
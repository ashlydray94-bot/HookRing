import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#1DB954",
        tabBarInactiveTintColor: "#666666",
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🔍</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="trimmer"
        options={{
          title: "Trimmer",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>✂️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#1E1E1E",
    borderTopColor: "#333333",
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
    height: 60,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
});
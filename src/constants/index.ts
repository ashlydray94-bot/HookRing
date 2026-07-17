// App constants and configuration
// For production, these should come from environment variables or a config service

export const SPOTIFY_CONFIG = {
  // Client ID from Spotify Developer Dashboard
  // Register your app at https://developer.spotify.com/dashboard
  CLIENT_ID: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID || "YOUR_SPOTIFY_CLIENT_ID",
  
  // Redirect URI must match what's configured in Spotify Dashboard
  // Uses the app scheme defined in app.json
  REDIRECT_URI: "hookring://auth/callback",
  
  // Scopes requested for the app
  SCOPES: [
    "user-read-email",
    "user-read-private",
    "streaming",
    "app-remote-control",
  ].join(" "),

  // Spotify API endpoints
  AUTH_ENDPOINT: "https://accounts.spotify.com/authorize",
  TOKEN_ENDPOINT: "https://accounts.spotify.com/api/token",
  API_BASE: "https://api.spotify.com/v1",
};

export const APP_CONFIG = {
  APP_NAME: "HookRing",
  APP_VERSION: "1.0.0",

  // Subscription limits
  FREE_EXPORTS_PER_MONTH: 3,
  PREMIUM_PRICE_MONTHLY: 2.99,
  PREMIUM_PRICE_YEARLY: 19.99,
  ONE_OFF_PRICE: 0.99,

  // Audio export settings
  DEFAULT_CLIP_DURATION: 20, // seconds
  MAX_CLIP_DURATION_FREE: 20, // seconds
  MAX_CLIP_DURATION_PREMIUM: 30, // seconds
  DEFAULT_BITRATE: "192k" as const,

  // Export formats
  IOS_FORMAT: "m4a" as const,
  ANDROID_FORMAT: "mp3" as const,
};

export const STORAGE_KEYS = {
  SPOTIFY_ACCESS_TOKEN: "spotify_access_token",
  SPOTIFY_REFRESH_TOKEN: "spotify_refresh_token",
  SPOTIFY_TOKEN_EXPIRY: "spotify_token_expiry",
  SUBSCRIPTION_STATE: "subscription_state",
  USER_PREFERENCES: "user_preferences",
  EXPORT_HISTORY: "export_history",
};
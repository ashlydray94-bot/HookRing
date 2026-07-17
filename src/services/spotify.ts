import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SPOTIFY_CONFIG, STORAGE_KEYS } from "../constants";
import type {
  SpotifySearchResponse,
  SpotifyTrack,
  SpotifyTokenResponse,
} from "../types";

WebBrowser.maybeCompleteAuthSession();

// Ensure the discovery object uses the right endpoints
const discovery = {
  authorizationEndpoint: SPOTIFY_CONFIG.AUTH_ENDPOINT,
  tokenEndpoint: SPOTIFY_CONFIG.TOKEN_ENDPOINT,
};

/**
 * Hook to authenticate with Spotify using OAuth PKCE flow.
 * Returns a function to trigger login, plus auth state.
 */
export function useSpotifyAuth() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: SPOTIFY_CONFIG.CLIENT_ID,
      scopes: SPOTIFY_CONFIG.SCOPES.split(" "),
      redirectUri: makeRedirectUri({
        scheme: "hookring",
        path: "auth/callback",
      }),
      usePKCE: true,
    },
    discovery
  );

  return { request, response, promptAsync };
}

/**
 * Exchange the authorization code for tokens via the Spotify API directly.
 * expo-auth-session handles most of this, but this is a fallback for
 * manual token management.
 */
export async function exchangeCodeForToken(code: string): Promise<SpotifyTokenResponse | null> {
  try {
    const response = await fetch(SPOTIFY_CONFIG.TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: makeRedirectUri({
          scheme: "hookring",
          path: "auth/callback",
        }),
        client_id: SPOTIFY_CONFIG.CLIENT_ID,
      }).toString(),
    });

    if (!response.ok) {
      console.error("Token exchange failed:", response.status);
      return null;
    }

    const data: SpotifyTokenResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Token exchange error:", error);
    return null;
  }
}

/**
 * Save tokens to AsyncStorage for persistence
 */
export async function saveTokens(tokens: SpotifyTokenResponse): Promise<void> {
  const expiryTime = Date.now() + tokens.expires_in * 1000;
  await AsyncStorage.multiSet([
    [STORAGE_KEYS.SPOTIFY_ACCESS_TOKEN, tokens.access_token],
    [STORAGE_KEYS.SPOTIFY_TOKEN_EXPIRY, expiryTime.toString()],
    ...(tokens.refresh_token
      ? [[STORAGE_KEYS.SPOTIFY_REFRESH_TOKEN, tokens.refresh_token]]
      : []),
  ]);
}

/**
 * Get the stored access token, refreshing if necessary
 */
export async function getValidAccessToken(): Promise<string | null> {
  try {
    const [[, accessToken], [, expiryStr]] = await AsyncStorage.multiGet([
      STORAGE_KEYS.SPOTIFY_ACCESS_TOKEN,
      STORAGE_KEYS.SPOTIFY_TOKEN_EXPIRY,
    ]);

    if (!accessToken) return null;

    const expiry = parseInt(expiryStr || "0", 10);
    // If token is still valid (with 5 min buffer)
    if (Date.now() < expiry - 5 * 60 * 1000) {
      return accessToken;
    }

    // Token expired, try to refresh
    return await refreshAccessToken();
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
}

/**
 * Refresh the access token using the stored refresh token
 */
async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = await AsyncStorage.getItem(
      STORAGE_KEYS.SPOTIFY_REFRESH_TOKEN
    );

    if (!refreshToken) return null;

    const response = await fetch(SPOTIFY_CONFIG.TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: SPOTIFY_CONFIG.CLIENT_ID,
      }).toString(),
    });

    if (!response.ok) {
      console.error("Token refresh failed:", response.status);
      await clearTokens();
      return null;
    }

    const data: SpotifyTokenResponse = await response.json();
    await saveTokens(data);
    return data.access_token;
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}

/**
 * Clear all stored auth tokens
 */
export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.SPOTIFY_ACCESS_TOKEN,
    STORAGE_KEYS.SPOTIFY_REFRESH_TOKEN,
    STORAGE_KEYS.SPOTIFY_TOKEN_EXPIRY,
  ]);
}

/**
 * Search Spotify catalogue for tracks
 */
export async function searchTracks(
  query: string,
  limit: number = 20,
  offset: number = 0
): Promise<SpotifyTrack[]> {
  try {
    const token = await getValidAccessToken();
    if (!token) {
      throw new Error("Not authenticated with Spotify");
    }

    const params = new URLSearchParams({
      q: query,
      type: "track",
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await fetch(
      `${SPOTIFY_CONFIG.API_BASE}/search?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    const data: SpotifySearchResponse = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}

/**
 * Get top tracks for the current user (for browsing)
 */
export async function getTopTracks(
  limit: number = 20,
  timeRange: "short_term" | "medium_term" | "long_term" = "medium_term"
): Promise<SpotifyTrack[]> {
  try {
    const token = await getValidAccessToken();
    if (!token) {
      throw new Error("Not authenticated with Spotify");
    }

    const params = new URLSearchParams({
      limit: limit.toString(),
      time_range: timeRange,
    });

    const response = await fetch(
      `${SPOTIFY_CONFIG.API_BASE}/me/top/tracks?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get top tracks: ${response.status}`);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Top tracks error:", error);
    throw error;
  }
}

/**
 * Get a specific track by ID
 */
export async function getTrack(trackId: string): Promise<SpotifyTrack> {
  try {
    const token = await getValidAccessToken();
    if (!token) {
      throw new Error("Not authenticated with Spotify");
    }

    const response = await fetch(
      `${SPOTIFY_CONFIG.API_BASE}/tracks/${trackId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get track: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get track error:", error);
    throw error;
  }
}

/**
 * Get new releases (for browse functionality)
 */
export async function getNewReleases(
  limit: number = 20
): Promise<SpotifyTrack[]> {
  try {
    const token = await getValidAccessToken();
    if (!token) {
      throw new Error("Not authenticated with Spotify");
    }

    // New releases returns albums, let's get tracks from them
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await fetch(
      `${SPOTIFY_CONFIG.API_BASE}/browse/new-releases?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get new releases: ${response.status}`);
    }

    const data = await response.json();
    // new releases returns albums, not tracks directly
    return data.albums?.items || [];
  } catch (error) {
    console.error("New releases error:", error);
    throw error;
  }
}

/**
 * Check if the user is currently authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getValidAccessToken();
  return token !== null;
}

export default {
  useSpotifyAuth,
  exchangeCodeForToken,
  saveTokens,
  getValidAccessToken,
  clearTokens,
  searchTracks,
  getTopTracks,
  getTrack,
  getNewReleases,
  isAuthenticated,
};
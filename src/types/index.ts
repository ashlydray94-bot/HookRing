// Spotify API response types
export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  uri: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

export interface TrackClip {
  track: SpotifyTrack;
  startTime: number;   // in seconds
  endTime: number;     // in seconds
  previewUrl: string;
}

// App user preferences
export interface UserPreferences {
  defaultClipDuration: number; // in seconds
  defaultFadeIn: boolean;
  defaultFadeOut: boolean;
  exportBitrate: '128k' | '192k' | '320k';
}

// Subscription state
export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionState {
  tier: SubscriptionTier;
  exportsUsedThisMonth: number;
  exportsLimit: number;
  expiresAt: string | null;
  isActive: boolean;
}

// Navigation types
export type RootStackParamList = {
  login: undefined;
  '(tabs)': undefined;
};

export type TabParamList = {
  search: undefined;
  trimmer: { track: SpotifyTrack } | undefined;
  profile: undefined;
};
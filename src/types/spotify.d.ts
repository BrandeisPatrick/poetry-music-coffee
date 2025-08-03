
export {};

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: Spotify.PlayerOptions) => Spotify.Player;
    };
  }

  namespace Spotify {
    type PlayerEvents = 'ready' | 'not_ready' | 'player_state_changed' | 'authentication_error' | 'account_error' | 'playback_error' | 'initialization_error';

    interface PlayerOptions {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume?: number;
    }

    interface Player {
      connect: () => Promise<boolean>;
      disconnect: () => void;
      addListener(event: 'ready', cb: (data: { device_id: string }) => void): boolean;
      addListener(event: 'not_ready', cb: (data: { device_id: string }) => void): boolean;
      addListener(event: 'player_state_changed', cb: (state: PlaybackState | null) => void): boolean;
      addListener(event: 'authentication_error' | 'account_error' | 'playback_error' | 'initialization_error', cb: (error: { message: string }) => void): boolean;
      removeListener(event: PlayerEvents, cb?: (...args: any[]) => void): boolean;
      getCurrentState(): Promise<PlaybackState | null>;
      getVolume(): Promise<number>;
      setVolume(volume: number): Promise<void>;
      pause(): Promise<void>;
      resume(): Promise<void>;
      togglePlay(): Promise<void>;
      seek(pos_ms: number): Promise<void>;
      previousTrack(): Promise<void>;
      nextTrack(): Promise<void>;
    }

    interface PlaybackState {
      context: {
        uri: string | null;
        metadata: any | null;
      };
      disallows: {
        pausing?: boolean;
        peeking_next?: boolean;
        peeking_prev?: boolean;
        resuming?: boolean;
        seeking?: boolean;
        skipping_next?: boolean;
        skipping_prev?: boolean;
      };
      duration: number;
      paused: boolean;
      position: number;
      repeat_mode: number;
      shuffle: boolean;
      track_window: {
        current_track: Track;
        previous_tracks: Track[];
        next_tracks: Track[];
      };
      timestamp: number;
    }
    
    interface Track {
      uri: string;
      id: string | null;
      type: 'track' | 'episode' | 'ad';
      media_type: 'audio' | 'video';
      name: string;
      is_playable: boolean;
      album: Album;
      artists: Artist[];
    }

    interface Album {
      uri: string;
      name: string;
      images: Image[];
    }

    interface Image {
      height?: number | null;
      url: string;
      width?: number | null;
    }

    interface Artist {
      name:string;
      uri: string;
    }
  }
}


import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Album } from './types';
import { ALBUMS } from './constants';
import Scene from './components/Scene';
import CDSelector from './components/CDSelector';
import Controls from './components/Controls';
import { PlaceholderIcon } from './components/Icons';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const LoginScreen = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-[#e3d5c2]/90 to-[#d4c5b0]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-[#fcfaf5]/95 p-8 rounded-3xl shadow-2xl border border-[#c9bba8] text-center w-full max-w-md backdrop-blur-sm">
            <div className="mb-6">
                <h2 className="font-orbitron text-3xl font-bold text-pink-500 mb-2">3D CD Player</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
            </div>
            
            <p className="text-slate-600 mb-8 leading-relaxed">
                Connect your Spotify Premium account to experience music in three dimensions.
            </p>
            
            <a
                href={`${BACKEND_URL}/login`}
                className="group inline-flex items-center justify-center w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-4 px-6 rounded-xl 
                         hover:from-pink-600 hover:to-pink-700 transition-all duration-300 ease-out
                         hover:shadow-xl hover:scale-105 active:scale-95"
            >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Connect with Spotify
            </a>
            
            <p className="text-xs text-slate-500 mt-4">
                Requires Spotify Premium for playback
            </p>
        </div>
    </div>
);

export default function App() {
  const [token, setToken] = useState<string>('');
  const playerRef = useRef<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Spotify.Track | null>(null);
  const currentTrackRef = useRef(currentTrack);
  const selectedAlbumRef = useRef(selectedAlbum);
  const [isSdkReady, setIsSdkReady] = useState(false);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
    selectedAlbumRef.current = selectedAlbum;
  }, [currentTrack, selectedAlbum]);
  
  // On mount, check for access token in the URL hash
  useEffect(() => {
    const hash = window.location.hash;
    let localToken = window.localStorage.getItem("spotify_token");

    if (!localToken && hash) {
      const params = new URLSearchParams(hash.substring(1));
      localToken = params.get('access_token');
      const expiresIn = params.get('expires_in');
      
      if (localToken) {
          window.localStorage.setItem("spotify_token", localToken);
          const expiryTime = new Date().getTime() + Number(expiresIn) * 1000;
          window.localStorage.setItem("spotify_token_expiry", expiryTime.toString());
          window.location.hash = ''; // Clean the hash from the URL
      }
    }
    
    // Check if token is expired
    const expiryTime = window.localStorage.getItem("spotify_token_expiry");
    if (localToken && expiryTime && new Date().getTime() > Number(expiryTime)) {
        localToken = null;
        window.localStorage.removeItem("spotify_token");
        window.localStorage.removeItem("spotify_token_expiry");
    }

    if (localToken) {
      setToken(localToken);
    }
  }, []);

  // Effect to handle SDK readiness, runs only once.
  useEffect(() => {
    const handleSDKReady = () => {
      setIsSdkReady(true);
    };

    if (window.Spotify) {
      setIsSdkReady(true);
    } else if (window.spotifySDKReady) {
      setIsSdkReady(true);
    } else {
      window.addEventListener('spotify-sdk-ready', handleSDKReady);
    }

    return () => {
      window.removeEventListener('spotify-sdk-ready', handleSDKReady);
    };
  }, []);

  // Effect to initialize the player when SDK is ready and a token is available
  useEffect(() => {
    if (!token || !isSdkReady) {
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
      return;
    }

    const player = new window.Spotify.Player({
      name: '3D CD Player',
      getOAuthToken: cb => { cb(token); },
      volume: 0.5
    });
    
    playerRef.current = player;

    player.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id);
        setIsPlayerReady(true);
    });

    player.addListener('not_ready', () => setIsPlayerReady(false));
    
    player.addListener('authentication_error', () => {
        console.error('Authentication error: token likely expired.');
        window.localStorage.removeItem("spotify_token");
        window.localStorage.removeItem("spotify_token_expiry");
        setToken('');
    });
    
    player.addListener('account_error', () => {
        alert("This app requires a Spotify Premium account.");
        setToken('');
    });

    player.addListener('player_state_changed', (state) => {
        if (!state) {
            setIsPlaying(false);
            setCurrentTrack(null);
            return;
        }
        setIsPlaying(!state.paused);
        setCurrentTrack(state.track_window.current_track);
    });

    player.connect();

    return () => {
      player.disconnect();
      playerRef.current = null;
    };
  }, [token, isSdkReady]);

  const handleSelectAlbum = (album: Album) => {
    if (isPlaying) {
        playerRef.current?.pause();
    }
    setSelectedAlbum(album);
    if (!isTrayOpen) {
      setIsTrayOpen(true);
    }
  };

  const handleToggleTray = () => {
    if (isPlaying) {
        playerRef.current?.pause();
        setIsPlaying(false);
    }
    setIsTrayOpen(!isTrayOpen);
  };

  const handleTogglePlay = async () => {
    const player = playerRef.current;
    if (!player || !deviceId || !selectedAlbum) return;

    const currentAlbumUri = currentTrackRef.current?.album.uri;
    const selectedAlbumUri = selectedAlbumRef.current?.spotifyAlbumUri;

    if (isPlaying) {
        player.pause();
        return;
    }
    
    if (!isPlaying && currentAlbumUri === selectedAlbumUri) {
        player.resume();
        return;
    }

    try {
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            body: JSON.stringify({ context_uri: selectedAlbum.spotifyAlbumUri }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
    } catch (error) {
        console.error("Failed to start playback:", error);
    }
  };

  return (
    <main className="bg-gradient-to-br from-[#e3d5c2] to-[#d4c5b0] text-slate-800 min-h-screen p-6">
      {!token && <LoginScreen />}
      
      {/* Header */}
      <header className={`text-center mb-8 transition-opacity duration-500 ${token ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="font-orbitron text-4xl lg:text-5xl font-bold text-pink-500 tracking-wider mb-2">
          3D CD PLAYER
        </h1>
        <p className="text-slate-600 text-lg">Experience music in three dimensions</p>
      </header>

      <div className={`max-w-7xl mx-auto transition-opacity duration-500 ${token ? 'opacity-100' : 'opacity-0'}`}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
          
          {/* Main Player Section */}
          <div className="xl:col-span-2 flex flex-col order-2 xl:order-1">
            {/* 3D Scene */}
            <div className="bg-[#fcfaf5]/80 rounded-2xl p-6 border border-[#c9bba8] shadow-xl flex-1 min-h-[400px]">
              <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p>Loading 3D Scene...</p>
                    </div>
                  </div>
                }>
                  <Canvas shadows camera={{ position: [0, 3, 8], fov: 45 }}>
                    <Scene 
                      album={selectedAlbum} 
                      isTrayOpen={isTrayOpen}
                      isPlaying={isPlaying}
                    />
                  </Canvas>
                </Suspense>
              </div>
            </div>
            
            {/* Controls */}
            <div className="mt-4">
              <Controls 
                onToggleTray={handleToggleTray}
                onTogglePlay={handleTogglePlay}
                isTrayOpen={isTrayOpen}
                isPlaying={isPlaying}
                hasCD={!!selectedAlbum && isPlayerReady}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 order-1 xl:order-2">
            {/* Now Playing */}
            <div className="bg-[#fcfaf5]/80 border border-[#c9bba8] rounded-2xl p-6 shadow-xl">
              <h2 className="font-orbitron text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                NOW PLAYING
              </h2>
              <div className="flex flex-col justify-center items-center text-center min-h-[180px]">
                {isPlaying && currentTrack ? (
                  <div className="space-y-3">
                    <img 
                      src={currentTrack.album.images[0].url} 
                      alt={currentTrack.album.name} 
                      className="w-20 h-20 rounded-xl shadow-lg mx-auto" 
                    />
                    <div>
                      <p className="font-bold text-pink-600 text-lg leading-tight">{currentTrack.name}</p>
                      <p className="text-slate-600 text-sm">{currentTrack.artists.map(a => a.name).join(', ')}</p>
                      <p className="text-slate-500 text-xs mt-1">{currentTrack.album.name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <PlaceholderIcon />
                    <p className="mt-3 text-sm">{selectedAlbum && isPlayerReady ? 'Ready to Play' : 'No Disc Inserted'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Album Library */}
            <div className="flex-1">
              <CDSelector
                albums={ALBUMS}
                selectedAlbumId={selectedAlbum?.id}
                onSelectAlbum={handleSelectAlbum}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
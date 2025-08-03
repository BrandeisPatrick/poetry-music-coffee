
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
    <div className="absolute inset-0 bg-[#e3d5c2]/80 backdrop-blur-md z-50 flex items-center justify-center">
        <div className="bg-[#fcfaf5] p-8 rounded-2xl shadow-2xl border border-[#c9bba8] text-center w-full max-w-md">
            <h2 className="font-orbitron text-2xl font-bold text-pink-500 mb-4">3D CD Player</h2>
            <p className="text-slate-600 mb-6">Connect your Spotify Premium account to start playing music.</p>
            <a
                href={`${BACKEND_URL}/login`}
                className="block w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors"
            >
                Login with Spotify
            </a>
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
    <main className="bg-[#e3d5c2] text-slate-800 min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {!token && <LoginScreen />}
      <div className={`w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 transition-opacity duration-500 ${token ? 'opacity-100' : 'opacity-0'}`}>
        {/* Left Column: 3D Scene and Controls */}
        <div className="flex-grow lg:w-2/3 flex flex-col items-center justify-center bg-[#fcfaf5]/60 rounded-2xl p-4 border border-[#c9bba8] shadow-2xl shadow-orange-300/30">
          <div className="w-full h-[40vh] lg:h-[60vh] rounded-lg relative">
             <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-500">Loading 3D Scene...</div>}>
                <Canvas shadows camera={{ position: [0, 3, 8], fov: 45 }}>
                    <Scene 
                        album={selectedAlbum} 
                        isTrayOpen={isTrayOpen}
                        isPlaying={isPlaying}
                    />
                </Canvas>
             </Suspense>
          </div>
          <Controls 
            onToggleTray={handleToggleTray}
            onTogglePlay={handleTogglePlay}
            isTrayOpen={isTrayOpen}
            isPlaying={isPlaying}
            hasCD={!!selectedAlbum && isPlayerReady}
          />
        </div>

        {/* Right Column: Album Selection and Info */}
        <div className="lg:w-1/3 flex flex-col gap-6">
            <div className="bg-[#fcfaf5]/60 border border-[#c9bba8] rounded-2xl p-6 backdrop-blur-sm">
                <h1 className="font-orbitron text-3xl font-bold text-pink-500 tracking-wider">3D CD PLAYER</h1>
                <p className="mt-2 text-slate-600">Select an album to begin.</p>
            </div>
          
            <div className="bg-[#fcfaf5]/60 border border-[#c9bba8] rounded-2xl p-6 backdrop-blur-sm flex-grow">
                <h2 className="font-orbitron text-xl font-bold text-slate-700 mb-4 border-b border-slate-300 pb-2">NOW PLAYING</h2>
                <div className="h-48 flex flex-col justify-center items-center text-center">
                    {isPlaying && currentTrack ? (
                        <>
                            <img src={currentTrack.album.images[0].url} alt={currentTrack.album.name} className="w-24 h-24 rounded-md shadow-lg mb-4" />
                            <p className="font-bold text-lg text-pink-500">{currentTrack.name}</p>
                            <p className="text-slate-600">{currentTrack.artists.map(a => a.name).join(', ')}</p>
                            <p className="text-sm text-slate-500">{currentTrack.album.name}</p>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-slate-500">
                           <PlaceholderIcon />
                           <p className="mt-2">{selectedAlbum && isPlayerReady ? 'Ready to Play' : 'No Disc Inserted'}</p>
                        </div>
                    )}
                </div>
            </div>

            <CDSelector
                albums={ALBUMS}
                selectedAlbumId={selectedAlbum?.id}
                onSelectAlbum={handleSelectAlbum}
            />
        </div>
      </div>
    </main>
  );
}
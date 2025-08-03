import { Album } from './types';

// Fallback CD cover image (base64 encoded simple gradient)
const FALLBACK_COVER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImEiIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I2Y5NGM1NyIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzMzMzMyIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjIwIiBmaWxsPSIjMzMzIi8+PC9zdmc+";

export const ALBUMS: Album[] = [
  {
    id: 1,
    artist: "Daft Punk",
    title: "Discovery",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/67/9e/eb/679eebf4-db42-8755-49d8-96dcfe0e3e8c/886444889179.jpg/1200x630bb.jpg",
    spotifyAlbumUri: "spotify:album:2noRn2Aes5aoNVsU6iWThc",
  },
  {
    id: 2,
    artist: "Tame Impala",
    title: "Currents",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music71/v4/a6/5d/84/a65d84d1-0ad1-2214-8999-d8da1faf6f21/15UMGIM46710.rgb.jpg/1200x630bb.jpg",
    spotifyAlbumUri: "spotify:album:79dL7FLiJFOO0EoehUHQBv",
  },
  {
    id: 3,
    artist: "Kraftwerk",
    title: "The Man-Machine",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/77/99/1c/77991cfe-b1e6-df5c-8b8c-e2e1da4b80b3/075992632027.jpg/1200x630bb.jpg",
    spotifyAlbumUri: "spotify:album:35M18gQ1EeC93a35B30Hbt",
  },
   {
    id: 4,
    artist: "LCD Soundsystem",
    title: "Sound of Silver",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/b4/5b/c3/b45bc35b-44f7-a6e9-1bae-b4b2b2c8b4e2/dj.qvaxdmjc.jpg/1200x630bb.jpg",
    spotifyAlbumUri: "spotify:album:1R8V4l8MavRqpXG9AaZ49s",
  },
   {
    id: 5,
    artist: "Boards of Canada",
    title: "Music Has The Right To Children",
    coverUrl: FALLBACK_COVER,
    spotifyAlbumUri: "spotify:album:1vWnB0hYmluskQuzxwo25a",
  },
];
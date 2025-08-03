
import React from 'react';
import { Album } from '../types';

interface CDSelectorProps {
  albums: Album[];
  selectedAlbumId: number | null | undefined;
  onSelectAlbum: (album: Album) => void;
}

const CDSelector: React.FC<CDSelectorProps> = ({ albums, selectedAlbumId, onSelectAlbum }) => {
  return (
    <div className="bg-[#fcfaf5]/80 border border-[#c9bba8] rounded-2xl p-6 shadow-xl h-full flex flex-col">
      <h2 className="font-orbitron text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
        ALBUM LIBRARY
      </h2>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => onSelectAlbum(album)}
            className={`group flex items-center gap-3 p-3 rounded-xl w-full text-left transition-all duration-300 ease-out
              ${selectedAlbumId === album.id 
                ? 'bg-gradient-to-r from-pink-400/20 to-purple-400/20 ring-2 ring-pink-400 shadow-lg transform scale-[1.02]' 
                : 'bg-white/50 hover:bg-white/80 hover:shadow-md hover:transform hover:scale-[1.01]'
              }`}
          >
            <div className="relative">
              <img
                src={album.coverUrl}
                alt={album.title}
                className={`w-12 h-12 rounded-lg object-cover shadow-sm transition-all duration-300
                  ${selectedAlbumId === album.id ? 'ring-2 ring-pink-400' : 'group-hover:shadow-md'}`}
              />
              {selectedAlbumId === album.id && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm leading-tight truncate transition-colors duration-300
                ${selectedAlbumId === album.id ? 'text-pink-700' : 'text-slate-800 group-hover:text-slate-900'}`}>
                {album.title}
              </p>
              <p className="text-xs text-slate-600 truncate mt-0.5">{album.artist}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CDSelector;

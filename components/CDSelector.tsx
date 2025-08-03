
import React from 'react';
import { Album } from '../types';

interface CDSelectorProps {
  albums: Album[];
  selectedAlbumId: number | null | undefined;
  onSelectAlbum: (album: Album) => void;
}

const CDSelector: React.FC<CDSelectorProps> = ({ albums, selectedAlbumId, onSelectAlbum }) => {
  return (
    <div className="bg-[#fcfaf5]/60 border border-[#c9bba8] rounded-2xl p-6 backdrop-blur-sm">
      <h2 className="font-orbitron text-xl font-bold text-slate-700 mb-4 border-b border-slate-300 pb-2">ALBUM LIBRARY</h2>
      <div className="h-48 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-4">
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => onSelectAlbum(album)}
              className={`flex items-center gap-4 p-2 rounded-lg w-full text-left transition-all duration-200 ease-in-out
                ${selectedAlbumId === album.id ? 'bg-pink-400/20 ring-2 ring-pink-500' : 'bg-[#fcfaf5]/70 hover:bg-[#fcfaf5]'}`}
            >
              <img
                src={album.coverUrl}
                alt={album.title}
                className="w-14 h-14 rounded-md object-cover shadow-md flex-shrink-0"
              />
              <div>
                <p className={`font-bold ${selectedAlbumId === album.id ? 'text-pink-600' : 'text-slate-900'}`}>{album.title}</p>
                <p className="text-sm text-slate-600">{album.artist}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CDSelector;

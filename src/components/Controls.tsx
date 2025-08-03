
import React from 'react';
import { PlayIcon, PauseIcon, EjectIcon } from './Icons';

interface ControlsProps {
  onToggleTray: () => void;
  onTogglePlay: () => void;
  isTrayOpen: boolean;
  isPlaying: boolean;
  hasCD: boolean;
}

const ControlButton: React.FC<{ 
  onClick: () => void; 
  disabled?: boolean; 
  children: React.ReactNode; 
  'aria-label': string;
  primary?: boolean;
}> = ({ onClick, disabled, children, 'aria-label': ariaLabel, primary = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={`relative w-14 h-14 rounded-full flex items-center justify-center
      transition-all duration-300 ease-out
      focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-transparent
      disabled:opacity-40 disabled:cursor-not-allowed
      ${primary 
        ? `bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg
           hover:enabled:from-pink-600 hover:enabled:to-pink-700 hover:enabled:shadow-xl hover:enabled:scale-105
           active:scale-95` 
        : `bg-white/80 text-slate-700 border border-[#c9bba8] shadow-md
           hover:enabled:bg-white hover:enabled:shadow-lg hover:enabled:scale-105
           active:scale-95`
      }`}
  >
    <div className="relative z-10">
      {children}
    </div>
    {primary && !disabled && (
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
    )}
  </button>
);

const Controls: React.FC<ControlsProps> = ({ onToggleTray, onTogglePlay, isTrayOpen, isPlaying, hasCD }) => {
  return (
    <div className="bg-[#fcfaf5]/80 border border-[#c9bba8] rounded-2xl p-6 shadow-xl">
      <div className="flex justify-center items-center gap-6">
        <ControlButton 
          onClick={onTogglePlay} 
          disabled={!hasCD || isTrayOpen} 
          aria-label={isPlaying ? "Pause" : "Play"}
          primary={true}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </ControlButton>
        
        <ControlButton 
          onClick={onToggleTray} 
          aria-label={isTrayOpen ? "Close Tray" : "Open Tray"}
        >
          <EjectIcon />
        </ControlButton>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-600">
          {!hasCD ? 'Select an album to play' : 
           isTrayOpen ? 'Tray is open' :
           isPlaying ? 'Now playing' : 'Ready to play'}
        </p>
      </div>
    </div>
  );
};

export default Controls;


import React from 'react';
import { PlayIcon, PauseIcon, EjectIcon } from './Icons';

interface ControlsProps {
  onToggleTray: () => void;
  onTogglePlay: () => void;
  isTrayOpen: boolean;
  isPlaying: boolean;
  hasCD: boolean;
}

const ControlButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; 'aria-label': string }> = ({ onClick, disabled, children, 'aria-label': ariaLabel }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className="w-16 h-16 rounded-full bg-[#fcfaf5] text-slate-800 flex items-center justify-center
                   border border-[#c9bba8] shadow-md
                   transition-all duration-200 ease-in-out
                   hover:enabled:bg-pink-400/30 hover:enabled:text-pink-600
                   focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-[#e3d5c2]
                   disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {children}
    </button>
);


const Controls: React.FC<ControlsProps> = ({ onToggleTray, onTogglePlay, isTrayOpen, isPlaying, hasCD }) => {
  return (
    <div className="w-full flex justify-center items-center gap-6 mt-6 p-4 bg-[#fcfaf5]/40 rounded-lg">
      <ControlButton onClick={onTogglePlay} disabled={!hasCD || isTrayOpen} aria-label={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </ControlButton>
      <ControlButton onClick={onToggleTray} aria-label={isTrayOpen ? "Close Tray" : "Open Tray"}>
        <EjectIcon />
      </ControlButton>
    </div>
  );
};

export default Controls;

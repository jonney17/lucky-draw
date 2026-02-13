import { useEffect } from 'react';
import { audioService } from './audioService';

export const useAudio = () => {
  useEffect(() => {
    // Initialize background music
    audioService.initBackgroundMusic('/audio/background-music.mp3', 0.3);
    
    // Register sound effects
    audioService.registerSoundEffect('draw', '/audio/draw-effect.mp3', 0.8);
    audioService.registerSoundEffect('win', '/audio/win-effect.mp3', 1);
    audioService.registerSoundEffect('click', '/audio/click-effect.mp3', 0.6);

    // Play background music
    audioService.playBackgroundMusic();

    // Cleanup on unmount
    return () => {
      audioService.stopBackgroundMusic();
    };
  }, []);

  return {
    playSoundEffect: (name: string) => audioService.playSoundEffect(name),
    toggleMute: () => audioService.toggleMute(),
    setMuted: (muted: boolean) => audioService.setMuted(muted),
    isMuted: () => audioService.isMutedState(),
  };
};

// Audio Service for managing background music and sound effects

class AudioService {
  private bgMusicAudio: HTMLAudioElement | null = null;
  private soundEffects: Map<string, HTMLAudioElement> = new Map();
  private isMuted = false;

  // Initialize background music
  initBackgroundMusic(src: string, volume: number = 0.3) {
    if (!this.bgMusicAudio) {
      this.bgMusicAudio = new Audio(src);
      this.bgMusicAudio.loop = true;
      this.bgMusicAudio.volume = volume;
    }
  }

  // Play background music
  playBackgroundMusic() {
    if (this.bgMusicAudio && !this.isMuted) {
      this.bgMusicAudio.play().catch((err) => {
        console.log('Could not play background music:', err);
      });
    }
  }

  // Stop background music
  stopBackgroundMusic() {
    if (this.bgMusicAudio) {
      this.bgMusicAudio.pause();
      this.bgMusicAudio.currentTime = 0;
    }
  }

  // Set background music volume
  setBackgroundMusicVolume(volume: number) {
    if (this.bgMusicAudio) {
      this.bgMusicAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  // Register a sound effect
  registerSoundEffect(name: string, src: string, volume: number = 1) {
    const audio = new Audio(src);
    audio.volume = volume;
    this.soundEffects.set(name, audio);
  }

  // Play a sound effect
  playSoundEffect(name: string) {
    if (this.isMuted) return;
    
    const audio = this.soundEffects.get(name);
    if (audio) {
      // Clone and play to allow overlapping sounds
      const clonedAudio = audio.cloneNode() as HTMLAudioElement;
      clonedAudio.play().catch((err) => {
        console.log(`Could not play sound effect '${name}':`, err);
      });
    }
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgMusicAudio) {
      this.bgMusicAudio.muted = this.isMuted;
    }
  }

  // Set mute state
  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgMusicAudio) {
      this.bgMusicAudio.muted = muted;
    }
  }

  // Check if muted
  isMutedState(): boolean {
    return this.isMuted;
  }

  // Cleanup
  cleanup() {
    this.stopBackgroundMusic();
    this.soundEffects.clear();
  }
}

export const audioService = new AudioService();

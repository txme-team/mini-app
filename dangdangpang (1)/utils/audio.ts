
// A simple audio synth to avoid external asset dependencies
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;

  constructor() {
    // Intentionally empty.
  }

  // Call this on the FIRST user interaction (e.g. Game Start button)
  // This is critical for iOS Safari to unlock audio.
  init() {
    if (!this.ctx) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      } catch (e) {
        console.error("Web Audio API not supported", e);
      }
    }

    if (this.ctx) {
      // 1. Resume context if suspended
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(e => console.error("Audio resume failed", e));
      }

      // 2. iOS Unlock Trick: Play a short silent buffer
      // This forces the audio hardware to wake up immediately within the click event.
      try {
        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.start(0);
      } catch (e) {
        console.error("iOS Audio Unlock failed", e);
      }
    }
  }

  private ensureContext() {
    // Just a fallback, but init() should be called explicitly first.
    if (!this.ctx) {
        this.init();
    } else if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
    }
  }

  // --- Haptic Feedback Helper ---
  private vibrate(pattern: number | number[]) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
            navigator.vibrate(pattern);
        } catch (e) {
            // Ignore
        }
    }
  }

  toggleMute() {
    this.ensureContext(); // Ensure context exists when toggling
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.playBGM();
    }
    return this.isMuted;
  }

  playSelect() {
    this.vibrate(10); 
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playMatchSuccess() {
    this.vibrate([10, 30, 10]);
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;
    
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      const startTime = this.ctx.currentTime + (i * 0.05);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
      
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  playStoreSuccess() {
    this.vibrate([50, 50, 100]);
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    // "Coin" / Cash register sound
    const notes = [880, 1760]; 
    notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (i * 0.1));
        
        const startTime = this.ctx.currentTime + (i * 0.1);
        gain.gain.setValueAtTime(0.05, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
        
        osc.start(startTime);
        osc.stop(startTime + 0.1);
    });
  }

  playError() {
    this.vibrate([50, 50, 50]);
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playLevelComplete() {
    this.vibrate([20, 30, 20, 30, 50]);
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;
    
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; 
    notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const start = this.ctx.currentTime + (i * 0.1);
        gain.gain.setValueAtTime(0.1, start);
        gain.gain.linearRampToValueAtTime(0, start + 0.5);
        osc.start(start);
        osc.stop(start + 0.5);
    });
  }

  playBGM() {
    if (this.isMuted || this.isBgmPlaying) return;
    this.ensureContext();
    if (!this.ctx) return;
    
    this.isBgmPlaying = true;
    // Simple placeholder for BGM
  }

  stopBGM() {
    this.isBgmPlaying = false;
  }
}

export const soundManager = new SoundManager();

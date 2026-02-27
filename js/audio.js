/**
 * audio.js - Audio System
 * نظام الصوتيات والموسيقى
 */

const AudioSystem = {
  enabled: localStorage.getItem('audioEnabled') !== 'false',
  volume: parseFloat(localStorage.getItem('audioVolume')) || 0.5,
  audioContext: null,
  oscillators: {},

  /**
   * تهيئة نظام الصوت
   */
  init() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  },

  /**
   * تشغيل صوت النقر
   */
  playClick() {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      
      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn('Error playing click sound:', e);
    }
  },

  /**
   * تشغيل صوت النجاح
   */
  playSuccess() {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const now = this.audioContext.currentTime;
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      
      frequencies.forEach((freq, index) => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(this.volume * 0.3, now + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.2);

        osc.start(now + index * 0.1);
        osc.stop(now + index * 0.1 + 0.2);
      });
    } catch (e) {
      console.warn('Error playing success sound:', e);
    }
  },

  /**
   * تشغيل صوت الخطأ
   */
  playError() {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
      
      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn('Error playing error sound:', e);
    }
  },

  /**
   * تشغيل صوت الفوز
   */
  playWin() {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const now = this.audioContext.currentTime;
      const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      frequencies.forEach((freq, index) => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(this.volume * 0.4, now + index * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.15 + 0.3);

        osc.start(now + index * 0.15);
        osc.stop(now + index * 0.15 + 0.3);
      });
    } catch (e) {
      console.warn('Error playing win sound:', e);
    }
  },

  /**
   * تشغيل صوت الخسارة
   */
  playLose() {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
      
      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn('Error playing lose sound:', e);
    }
  },

  /**
   * تشغيل صوت التلميح
   */
  playHint() {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const now = this.audioContext.currentTime;
      const frequencies = [440, 550]; // A4, C#5
      
      frequencies.forEach((freq, index) => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(this.volume * 0.2, now + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.15);

        osc.start(now + index * 0.1);
        osc.stop(now + index * 0.1 + 0.15);
      });
    } catch (e) {
      console.warn('Error playing hint sound:', e);
    }
  },

  /**
   * تشغيل صوت الإنجاز
   */
  playAchievement() {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const now = this.audioContext.currentTime;
      const frequencies = [392, 494, 587, 784]; // G4, B4, D5, G5
      
      frequencies.forEach((freq, index) => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(this.volume * 0.3, now + index * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.12 + 0.25);

        osc.start(now + index * 0.12);
        osc.stop(now + index * 0.12 + 0.25);
      });
    } catch (e) {
      console.warn('Error playing achievement sound:', e);
    }
  },

  /**
   * تفعيل/تعطيل الصوت
   */
  toggleAudio(enabled) {
    this.enabled = enabled;
    localStorage.setItem('audioEnabled', enabled);
  },

  /**
   * ضبط مستوى الصوت
   * @param {number} volume - مستوى الصوت (0-1)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('audioVolume', this.volume);
  },

  /**
   * الحصول على حالة الصوت
   */
  isEnabled() {
    return this.enabled;
  },

  /**
   * الحصول على مستوى الصوت
   */
  getVolume() {
    return this.volume;
  }
};

// تهيئة نظام الصوت عند تحميل الملف
document.addEventListener('DOMContentLoaded', () => {
  AudioSystem.init();
});

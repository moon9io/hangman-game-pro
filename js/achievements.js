/**
 * achievements.js - Achievements & Points System
 * نظام الإنجازات والنقاط
 */

const AchievementsSystem = {
  achievements: {
    firstWin: {
      id: 'firstWin',
      name: 'firstWin',
      description: 'firstWinDesc',
      icon: '🏆',
      unlocked: false,
      condition: (stats) => stats.totalWins >= 1
    },
    tenWins: {
      id: 'tenWins',
      name: 'tenWins',
      description: 'tenWinsDesc',
      icon: '🎯',
      unlocked: false,
      condition: (stats) => stats.totalWins >= 10
    },
    perfectGame: {
      id: 'perfectGame',
      name: 'perfectGame',
      description: 'perfectGameDesc',
      icon: '⭐',
      unlocked: false,
      condition: (stats) => stats.perfectGames >= 1
    },
    streak5: {
      id: 'streak5',
      name: 'streak5',
      description: 'streak5Desc',
      icon: '🔥',
      unlocked: false,
      condition: (stats) => stats.bestStreak >= 5
    },
    streak10: {
      id: 'streak10',
      name: 'streak10',
      description: 'streak10Desc',
      icon: '💥',
      unlocked: false,
      condition: (stats) => stats.bestStreak >= 10
    },
    speedRunner: {
      id: 'speedRunner',
      name: 'speedRunner',
      description: 'speedRunnerDesc',
      icon: '⚡',
      unlocked: false,
      condition: (stats) => stats.speedRuns >= 1
    }
  },

  stats: {
    totalGames: 0,
    totalWins: 0,
    totalLosses: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalPoints: 0,
    perfectGames: 0,
    speedRuns: 0,
    hintsUsed: 0,
    hintsBalance: 5,
    lastGameTime: 0
  },

  /**
   * تهيئة النظام
   */
  init() {
    this.loadStats();
    this.loadAchievements();
  },

  /**
   * حفظ الإحصائيات
   */
  saveStats() {
    localStorage.setItem('gameStats', JSON.stringify(this.stats));
  },

  /**
   * تحميل الإحصائيات
   */
  loadStats() {
    const saved = localStorage.getItem('gameStats');
    if (saved) {
      this.stats = { ...this.stats, ...JSON.parse(saved) };
    }
  },

  /**
   * حفظ الإنجازات
   */
  saveAchievements() {
    const achievements = {};
    Object.keys(this.achievements).forEach(key => {
      achievements[key] = this.achievements[key].unlocked;
    });
    localStorage.setItem('achievements', JSON.stringify(achievements));
  },

  /**
   * تحميل الإنجازات
   */
  loadAchievements() {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      const achievements = JSON.parse(saved);
      Object.keys(achievements).forEach(key => {
        if (this.achievements[key]) {
          this.achievements[key].unlocked = achievements[key];
        }
      });
    }
  },

  /**
   * تسجيل فوز
   * @param {number} guessesRemaining - عدد المحاولات المتبقية
   * @param {number} gameTime - وقت اللعبة بالثواني
   */
  recordWin(guessesRemaining, gameTime = 0) {
    this.stats.totalGames++;
    this.stats.totalWins++;
    this.stats.currentStreak++;
    
    if (this.stats.currentStreak > this.stats.bestStreak) {
      this.stats.bestStreak = this.stats.currentStreak;
    }

    // حساب النقاط
    let points = 100; // نقاط أساسية
    points += guessesRemaining * 10; // نقاط إضافية لكل محاولة متبقية
    
    if (guessesRemaining === 6) {
      this.stats.perfectGames++;
      points += 50; // نقاط إضافية للعبة مثالية
    }

    if (gameTime > 0 && gameTime < 30) {
      this.stats.speedRuns++;
      points += 75; // نقاط إضافية للسرعة
    }

    this.stats.totalPoints += points;
    this.stats.lastGameTime = gameTime;

    this.checkAchievements();
    this.saveStats();
    this.saveAchievements();

    return points;
  },

  /**
   * تسجيل خسارة
   */
  recordLoss() {
    this.stats.totalGames++;
    this.stats.totalLosses++;
    this.stats.currentStreak = 0;
    this.stats.lastGameTime = 0;

    this.checkAchievements();
    this.saveStats();
  },

  /**
   * استخدام تلميح
   */
  useHint() {
    if (this.stats.hintsBalance > 0) {
      this.stats.hintsBalance--;
      this.stats.hintsUsed++;
      this.saveStats();
      return true;
    }
    return false;
  },

  /**
   * شراء تلميحات
   * @param {number} amount - عدد التلميحات
   */
  buyHints(amount = 5) {
    this.stats.hintsBalance += amount;
    this.saveStats();
  },

  /**
   * الحصول على عدد التلميحات المتبقية
   */
  getHintsBalance() {
    return this.stats.hintsBalance;
  },

  /**
   * فحص الإنجازات الجديدة
   */
  checkAchievements() {
    const newAchievements = [];

    Object.keys(this.achievements).forEach(key => {
      const achievement = this.achievements[key];
      if (!achievement.unlocked && achievement.condition(this.stats)) {
        achievement.unlocked = true;
        newAchievements.push(achievement);
        AudioSystem.playAchievement();
      }
    });

    return newAchievements;
  },

  /**
   * الحصول على جميع الإنجازات
   */
  getAllAchievements() {
    return Object.values(this.achievements);
  },

  /**
   * الحصول على الإنجازات المفتوحة
   */
  getUnlockedAchievements() {
    return Object.values(this.achievements).filter(a => a.unlocked);
  },

  /**
   * الحصول على الإحصائيات
   */
  getStats() {
    return {
      ...this.stats,
      winRate: this.stats.totalGames > 0 
        ? Math.round((this.stats.totalWins / this.stats.totalGames) * 100) 
        : 0,
      unlockedAchievements: this.getUnlockedAchievements().length,
      totalAchievements: Object.keys(this.achievements).length
    };
  },

  /**
   * إعادة تعيين الإحصائيات (للاختبار)
   */
  resetStats() {
    this.stats = {
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalPoints: 0,
      perfectGames: 0,
      speedRuns: 0,
      hintsUsed: 0,
      hintsBalance: 5,
      lastGameTime: 0
    };
    
    Object.keys(this.achievements).forEach(key => {
      this.achievements[key].unlocked = false;
    });

    localStorage.removeItem('gameStats');
    localStorage.removeItem('achievements');
  }
};

// تهيئة النظام عند تحميل الملف
document.addEventListener('DOMContentLoaded', () => {
  AchievementsSystem.init();
});

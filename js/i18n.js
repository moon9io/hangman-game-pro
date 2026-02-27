/**
 * i18n.js - Internationalization System
 * نظام الترجمة والتعريب
 */

const i18n = {
  currentLanguage: localStorage.getItem('language') || 'ar',

  translations: {
    ar: {
      // Header & Navigation
      title: 'لعبة المشنوق',
      subtitle: 'اختبر مهاراتك في تخمين الكلمات',
      
      // Game Labels
      guesses: 'المحاولات المتبقية',
      score: 'النقاط',
      wins: 'الانتصارات',
      losses: 'الخسائر',
      streak: 'السلسلة الحالية',
      
      // Buttons
      newGame: 'لعبة جديدة',
      giveUp: 'استسلام',
      hint: 'تلميح',
      buyHints: 'شراء تلميحات',
      playAgain: 'العب مرة أخرى',
      backToMenu: 'العودة للقائمة الرئيسية',
      
      // Game States
      guessedLetters: 'الحروف المخمنة',
      correctLetters: 'الحروف الصحيحة',
      wrongLetters: 'الحروف الخاطئة',
      
      // Results
      youWon: 'لقد فزت! 🎉',
      youLost: 'لقد خسرت! 😢',
      gameOver: 'انتهت اللعبة',
      theWordWas: 'الكلمة كانت',
      
      // Hints
      hintsRemaining: 'التلميحات المتبقية',
      noHintsLeft: 'لا توجد تلميحات متبقية',
      buyMoreHints: 'اشتر المزيد من التلميحات',
      hintUsed: 'تم استخدام تلميح',
      
      // Achievements
      achievements: 'الإنجازات',
      firstWin: 'الفوز الأول',
      firstWinDesc: 'فز باللعبة الأولى',
      tenWins: 'عشر انتصارات',
      tenWinsDesc: 'فز بـ 10 لعبات',
      perfectGame: 'لعبة مثالية',
      perfectGameDesc: 'فز بدون أخطاء',
      streak5: 'سلسلة 5',
      streak5Desc: 'اربح 5 ألعاب متتالية',
      streak10: 'سلسلة 10',
      streak10Desc: 'اربح 10 ألعاب متتالية',
      speedRunner: 'العداء السريع',
      speedRunnerDesc: 'فز باللعبة في أقل من 30 ثانية',
      
      // Theme
      lightTheme: 'فاتح',
      darkTheme: 'داكن',
      theme: 'المظهر',
      
      // Language
      language: 'اللغة',
      arabic: 'العربية',
      english: 'English',
      
      // Messages
      selectCategory: 'اختر فئة الكلمات',
      technology: 'التكنولوجيا',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      tryAgain: 'حاول مرة أخرى',
      
      // Stats
      totalGames: 'إجمالي الألعاب',
      winRate: 'نسبة الفوز',
      bestStreak: 'أفضل سلسلة',
      totalPoints: 'إجمالي النقاط',
      
      // Keyboard
      enterLetter: 'أدخل حرفاً',
      invalidInput: 'إدخال غير صالح',
    },
    en: {
      // Header & Navigation
      title: 'Hangman Game',
      subtitle: 'Test your word guessing skills',
      
      // Game Labels
      guesses: 'Remaining Guesses',
      score: 'Score',
      wins: 'Wins',
      losses: 'Losses',
      streak: 'Current Streak',
      
      // Buttons
      newGame: 'New Game',
      giveUp: 'Give Up',
      hint: 'Hint',
      buyHints: 'Buy Hints',
      playAgain: 'Play Again',
      backToMenu: 'Back to Menu',
      
      // Game States
      guessedLetters: 'Guessed Letters',
      correctLetters: 'Correct Letters',
      wrongLetters: 'Wrong Letters',
      
      // Results
      youWon: 'You Won! 🎉',
      youLost: 'You Lost! 😢',
      gameOver: 'Game Over',
      theWordWas: 'The word was',
      
      // Hints
      hintsRemaining: 'Hints Remaining',
      noHintsLeft: 'No hints left',
      buyMoreHints: 'Buy more hints',
      hintUsed: 'Hint used',
      
      // Achievements
      achievements: 'Achievements',
      firstWin: 'First Win',
      firstWinDesc: 'Win your first game',
      tenWins: 'Ten Wins',
      tenWinsDesc: 'Win 10 games',
      perfectGame: 'Perfect Game',
      perfectGameDesc: 'Win without mistakes',
      streak5: 'Streak 5',
      streak5Desc: 'Win 5 games in a row',
      streak10: 'Streak 10',
      streak10Desc: 'Win 10 games in a row',
      speedRunner: 'Speed Runner',
      speedRunnerDesc: 'Win a game in less than 30 seconds',
      
      // Theme
      lightTheme: 'Light',
      darkTheme: 'Dark',
      theme: 'Theme',
      
      // Language
      language: 'Language',
      arabic: 'العربية',
      english: 'English',
      
      // Messages
      selectCategory: 'Select word category',
      technology: 'Technology',
      loading: 'Loading...',
      error: 'Error occurred',
      tryAgain: 'Try Again',
      
      // Stats
      totalGames: 'Total Games',
      winRate: 'Win Rate',
      bestStreak: 'Best Streak',
      totalPoints: 'Total Points',
      
      // Keyboard
      enterLetter: 'Enter a letter',
      invalidInput: 'Invalid input',
    }
  },

  /**
   * الحصول على النص المترجم
   * @param {string} key - مفتاح الترجمة
   * @returns {string} النص المترجم
   */
  t(key) {
    const lang = this.currentLanguage;
    return this.translations[lang]?.[key] || key;
  },

  /**
   * تعيين اللغة الحالية
   * @param {string} lang - رمز اللغة ('ar' أو 'en')
   */
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
      document.body.lang = lang;
      this.updatePageLanguage();
    }
  },

  /**
   * الحصول على اللغة الحالية
   * @returns {string} رمز اللغة
   */
  getLanguage() {
    return this.currentLanguage;
  },

  /**
   * تحديث لغة الصفحة
   */
  updatePageLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = this.t(key);
    });

    // تحديث اتجاه الصفحة
    if (this.currentLanguage === 'ar') {
      document.body.style.direction = 'rtl';
      document.body.style.textAlign = 'right';
    } else {
      document.body.style.direction = 'ltr';
      document.body.style.textAlign = 'left';
    }
  },

  /**
   * تهيئة نظام الترجمة
   */
  init() {
    this.setLanguage(this.currentLanguage);
  }
};

// تهيئة النظام عند تحميل الملف
document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
});

/**
 * game.js - Game Logic
 * منطق اللعبة الأساسي
 */

const GameEngine = {
  word: '',
  guessedLetters: [],
  wrongGuesses: 0,
  maxWrongGuesses: 6,
  gameActive: false,
  gameStartTime: 0,
  language: 'ar',
  category: 'technology',

  /**
   * تهيئة اللعبة
   * @param {string} language - اللغة ('ar' أو 'en')
   */
  async init(language = 'ar') {
    this.language = language;
    await this.loadWords();
    this.startNewGame();
  },

  /**
   * تحميل الكلمات من ملفات JSON
   */
  async loadWords() {
    try {
      const lang = this.language === 'ar' ? 'ar' : 'en';
      const response = await fetch(`data/words-${lang}.json`);
      this.words = await response.json();
    } catch (error) {
      console.error('Error loading words:', error);
      this.words = ['hangman', 'game', 'javascript', 'programming'];
    }
  },

  /**
   * بدء لعبة جديدة
   */
  startNewGame() {
    this.word = this.getRandomWord().toLowerCase();
    this.guessedLetters = [];
    this.wrongGuesses = 0;
    this.gameActive = true;
    this.gameStartTime = Date.now();
  },

  /**
   * الحصول على كلمة عشوائية
   */
  getRandomWord() {
    return this.words[Math.floor(Math.random() * this.words.length)];
  },

  /**
   * التحقق من صحة الحرف
   * @param {string} letter - الحرف المخمن
   */
  guessLetter(letter) {
    if (!this.gameActive) return { valid: false, message: 'Game is over' };

    letter = letter.toLowerCase();

    // التحقق من صحة الإدخال
    if (!/^[a-zأ-ي]$/.test(letter)) {
      return { valid: false, message: 'Invalid input' };
    }

    // التحقق من أن الحرف لم يتم تخمينه من قبل
    if (this.guessedLetters.includes(letter)) {
      return { valid: false, message: 'Already guessed' };
    }

    this.guessedLetters.push(letter);

    // التحقق من صحة التخمين
    const isCorrect = this.word.includes(letter);
    
    if (!isCorrect) {
      this.wrongGuesses++;
      AudioSystem.playError();
    } else {
      AudioSystem.playClick();
    }

    // التحقق من حالة اللعبة
    const gameState = this.checkGameState();

    return {
      valid: true,
      correct: isCorrect,
      gameState: gameState,
      word: this.getDisplayWord()
    };
  },

  /**
   * الحصول على الكلمة المعروضة
   */
  getDisplayWord() {
    return this.word
      .split('')
      .map(letter => this.guessedLetters.includes(letter) ? letter : '_')
      .join(' ');
  },

  /**
   * التحقق من حالة اللعبة
   */
  checkGameState() {
    // فحص الفوز
    const won = this.word.split('').every(letter => 
      this.guessedLetters.includes(letter)
    );

    if (won) {
      this.gameActive = false;
      AudioSystem.playWin();
      const gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
      const points = AchievementsSystem.recordWin(
        this.maxWrongGuesses - this.wrongGuesses,
        gameTime
      );
      return { status: 'won', points };
    }

    // فحص الخسارة
    if (this.wrongGuesses >= this.maxWrongGuesses) {
      this.gameActive = false;
      AudioSystem.playLose();
      AchievementsSystem.recordLoss();
      return { status: 'lost', word: this.word };
    }

    return { status: 'playing' };
  },

  /**
   * الاستسلام
   */
  giveUp() {
    if (!this.gameActive) return;
    
    this.gameActive = false;
    AudioSystem.playLose();
    AchievementsSystem.recordLoss();
    
    return {
      status: 'lost',
      word: this.word
    };
  },

  /**
   * استخدام تلميح
   */
  useHint() {
    if (!this.gameActive) return { valid: false, message: 'Game is over' };

    if (!AchievementsSystem.useHint()) {
      return { valid: false, message: 'No hints available' };
    }

    AudioSystem.playHint();

    // البحث عن حرف لم يتم تخمينه
    const unguessedLetters = this.word
      .split('')
      .filter(letter => !this.guessedLetters.includes(letter));

    if (unguessedLetters.length === 0) {
      return { valid: false, message: 'No more hints needed' };
    }

    const hintLetter = unguessedLetters[
      Math.floor(Math.random() * unguessedLetters.length)
    ];

    this.guessedLetters.push(hintLetter);

    return {
      valid: true,
      hint: hintLetter,
      word: this.getDisplayWord(),
      gameState: this.checkGameState()
    };
  },

  /**
   * الحصول على معلومات اللعبة الحالية
   */
  getGameInfo() {
    return {
      word: this.getDisplayWord(),
      wrongGuesses: this.wrongGuesses,
      guessesRemaining: this.maxWrongGuesses - this.wrongGuesses,
      guessedLetters: this.guessedLetters,
      correctLetters: this.guessedLetters.filter(l => this.word.includes(l)),
      wrongLetters: this.guessedLetters.filter(l => !this.word.includes(l)),
      gameActive: this.gameActive,
      hintsRemaining: AchievementsSystem.getHintsBalance()
    };
  },

  /**
   * الحصول على مراحل الرسم
   */
  getHangmanStage() {
    const stages = [
      '  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n========='
    ];

    return stages[Math.min(this.wrongGuesses, stages.length - 1)];
  }
};

// تهيئة محرك اللعبة عند تحميل الملف
document.addEventListener('DOMContentLoaded', async () => {
  await GameEngine.init(i18n.getLanguage());
});

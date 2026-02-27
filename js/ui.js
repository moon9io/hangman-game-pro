/**
 * ui.js - User Interface
 * واجهة المستخدم
 */

const UI = {
  gameContainer: null,
  currentTheme: localStorage.getItem('theme') || 'light',
  gameTimer: null,
  gameStartTime: 0,

  /**
   * تهيئة واجهة المستخدم
   */
  init() {
    this.gameContainer = document.getElementById('game-container');
    this.setupEventListeners();
    this.setTheme(this.currentTheme);
    this.updateDisplay();
    this.startGameTimer();
  },

  /**
   * إعداد مستمعي الأحداث
   */
  setupEventListeners() {
    // زر لعبة جديدة
    document.getElementById('new-game-btn')?.addEventListener('click', () => {
      this.newGame();
    });

    // زر الاستسلام
    document.getElementById('give-up-btn')?.addEventListener('click', () => {
      this.giveUp();
    });

    // زر التلميح
    document.getElementById('hint-btn')?.addEventListener('click', () => {
      this.useHint();
    });

    // زر شراء التلميحات
    document.getElementById('buy-hints-btn')?.addEventListener('click', () => {
      this.buyHints();
    });

    // تبديل المظهر
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      this.toggleTheme();
    });

    // تبديل اللغة
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        this.changeLanguage(lang);
      });
    });

    // لوحة المفاتيح
    document.addEventListener('keydown', (e) => {
      if (GameEngine.gameActive && /^[a-zأ-ي]$/.test(e.key)) {
        this.guessLetter(e.key);
      }
    });

    // شبكة الحروف
    this.setupAlphabetGrid();
  },

  /**
   * إعداد شبكة الحروف
   */
  setupAlphabetGrid() {
    const alphabet = GameEngine.language === 'ar' 
      ? 'أبجدهوزحطيكلمنسعفصقرشتثخذضظغ'
      : 'abcdefghijklmnopqrstuvwxyz';

    const grid = document.getElementById('alphabet-grid');
    if (!grid) return;

    grid.innerHTML = '';

    alphabet.split('').forEach(letter => {
      const btn = document.createElement('button');
      btn.className = 'letter-btn';
      btn.textContent = letter;
      btn.setAttribute('data-letter', letter);
      btn.addEventListener('click', () => {
        this.guessLetter(letter);
      });
      grid.appendChild(btn);
    });
  },

  /**
   * تخمين حرف
   */
  guessLetter(letter) {
    const result = GameEngine.guessLetter(letter);

    if (!result.valid) {
      this.showMessage(i18n.t('invalidInput'));
      return;
    }

    // تحديث الزر
    const btn = document.querySelector(`[data-letter="${letter}"]`);
    if (btn) {
      btn.disabled = true;
      if (result.correct) {
        btn.classList.add('correct');
      } else {
        btn.classList.add('wrong');
      }
    }

    this.updateDisplay();

    if (result.gameState.status !== 'playing') {
      this.endGame(result.gameState);
    }
  },

  /**
   * استخدام تلميح
   */
  useHint() {
    const result = GameEngine.useHint();

    if (!result.valid) {
      this.showMessage(i18n.t('noHintsLeft'));
      return;
    }

    // تحديث الزر
    const btn = document.querySelector(`[data-letter="${result.hint}"]`);
    if (btn) {
      btn.disabled = true;
      btn.classList.add('correct');
    }

    this.showMessage(`${i18n.t('hintUsed')}: ${result.hint}`);
    this.updateDisplay();

    if (result.gameState.status !== 'playing') {
      this.endGame(result.gameState);
    }
  },

  /**
   * شراء تلميحات
   */
  buyHints() {
    AchievementsSystem.buyHints(5);
    this.showMessage(`تم شراء 5 تلميحات جديدة!`);
    this.updateDisplay();
  },

  /**
   * الاستسلام
   */
  giveUp() {
    if (!confirm(i18n.t('gameOver') + '؟')) {
      return;
    }

    const result = GameEngine.giveUp();
    this.endGame(result);
  },

  /**
   * لعبة جديدة
   */
  newGame() {
    GameEngine.startNewGame();
    this.setupAlphabetGrid();
    this.updateDisplay();
    this.gameStartTime = Date.now();
    this.hideResultModal();
  },

  /**
   * تحديث العرض
   */
  updateDisplay() {
    const info = GameEngine.getGameInfo();

    // تحديث الكلمة
    const wordDisplay = document.getElementById('word-display');
    if (wordDisplay) {
      wordDisplay.textContent = info.word;
    }

    // تحديث رسم المشنوق
    const hangmanDrawing = document.getElementById('hangman-drawing');
    if (hangmanDrawing) {
      hangmanDrawing.textContent = GameEngine.getHangmanStage();
    }

    // تحديث الإحصائيات
    document.getElementById('guesses-remaining')?.textContent = info.guessesRemaining;
    document.getElementById('wrong-guesses')?.textContent = info.wrongGuesses;
    document.getElementById('hints-remaining')?.textContent = info.hintsRemaining;

    // تحديث الحروف المخمنة
    this.updateGuessedLetters(info);

    // تحديث الإحصائيات الجانبية
    this.updateSidebar();
  },

  /**
   * تحديث الحروف المخمنة
   */
  updateGuessedLetters(info) {
    const correctContainer = document.getElementById('correct-letters');
    const wrongContainer = document.getElementById('wrong-letters');

    if (correctContainer) {
      correctContainer.innerHTML = info.correctLetters
        .map(letter => `<span class="letter-badge correct">${letter}</span>`)
        .join('');
    }

    if (wrongContainer) {
      wrongContainer.innerHTML = info.wrongLetters
        .map(letter => `<span class="letter-badge wrong">${letter}</span>`)
        .join('');
    }
  },

  /**
   * تحديث الشريط الجانبي
   */
  updateSidebar() {
    const stats = AchievementsSystem.getStats();

    document.getElementById('total-games')?.textContent = stats.totalGames;
    document.getElementById('total-wins')?.textContent = stats.totalWins;
    document.getElementById('total-losses')?.textContent = stats.totalLosses;
    document.getElementById('win-rate')?.textContent = stats.winRate + '%';
    document.getElementById('best-streak')?.textContent = stats.bestStreak;
    document.getElementById('current-streak')?.textContent = stats.currentStreak;
    document.getElementById('total-points')?.textContent = stats.totalPoints;
    document.getElementById('unlocked-achievements')?.textContent = 
      `${stats.unlockedAchievements}/${stats.totalAchievements}`;
  },

  /**
   * إنهاء اللعبة
   */
  endGame(gameState) {
    if (gameState.status === 'won') {
      this.showResultModal(true, gameState.points);
    } else {
      this.showResultModal(false, gameState.word);
    }
  },

  /**
   * عرض نتيجة اللعبة
   */
  showResultModal(won, data) {
    const modal = document.getElementById('result-modal');
    if (!modal) return;

    const resultEmoji = modal.querySelector('.result-emoji');
    const resultTitle = modal.querySelector('.result-title');
    const resultMessage = modal.querySelector('.result-message');

    if (won) {
      resultEmoji.textContent = '🎉';
      resultTitle.textContent = i18n.t('youWon');
      resultMessage.textContent = `${i18n.t('score')}: ${data} نقطة`;
    } else {
      resultEmoji.textContent = '😢';
      resultTitle.textContent = i18n.t('youLost');
      resultMessage.textContent = `${i18n.t('theWordWas')}: ${data}`;
    }

    modal.classList.add('active');
  },

  /**
   * إخفاء نتيجة اللعبة
   */
  hideResultModal() {
    const modal = document.getElementById('result-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  },

  /**
   * عرض رسالة
   */
  showMessage(message) {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;

    messageEl.textContent = message;
    messageEl.style.display = 'block';

    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 3000);
  },

  /**
   * تبديل المظهر
   */
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(this.currentTheme);
  },

  /**
   * ضبط المظهر
   */
  setTheme(theme) {
    this.currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.textContent = theme === 'light' 
        ? `🌙 ${i18n.t('darkTheme')}`
        : `☀️ ${i18n.t('lightTheme')}`;
    }
  },

  /**
   * تغيير اللغة
   */
  changeLanguage(lang) {
    i18n.setLanguage(lang);
    GameEngine.language = lang;
    
    // تحديث أزرار اللغة
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      }
    });

    // إعادة تحميل اللعبة
    this.setupAlphabetGrid();
    this.updateDisplay();
    i18n.updatePageLanguage();
  },

  /**
   * بدء مؤقت اللعبة
   */
  startGameTimer() {
    this.gameStartTime = Date.now();
    
    this.gameTimer = setInterval(() => {
      if (GameEngine.gameActive) {
        const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const timerEl = document.getElementById('game-timer');
        if (timerEl) {
          timerEl.textContent = `${elapsed}s`;
        }
      }
    }, 1000);
  },

  /**
   * عرض الإنجازات
   */
  displayAchievements() {
    const container = document.getElementById('achievements-container');
    if (!container) return;

    const achievements = AchievementsSystem.getAllAchievements();
    
    container.innerHTML = achievements
      .map(achievement => `
        <div class="achievement-badge ${achievement.unlocked ? '' : 'locked'}" 
             title="${i18n.t(achievement.description)}">
          <div class="achievement-icon">${achievement.icon}</div>
          <div class="achievement-name">${i18n.t(achievement.name)}</div>
        </div>
      `)
      .join('');
  }
};

// تهيئة واجهة المستخدم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  UI.displayAchievements();
});

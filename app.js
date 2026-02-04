/**
 * Self Praise Mini - 自分褒めシステム
 * MVP Version 1.0
 */

// ===================================
// データ管理
// ===================================
const STORAGE_KEY = 'selfPraiseMini';

const defaultData = {
  tapCountTotal: 0,
  tapByDate: {},
  cards: [],
  dailyLogs: [],
  lastOpenedDate: null,
  lastGachaDate: null
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...defaultData, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('データ読み込みエラー:', e);
  }
  return { ...defaultData };
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('データ保存エラー:', e);
  }
}

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ===================================
// 褒め言葉データ
// ===================================
const praiseWords = [
  'えらい！',
  '最高！',
  '勝ち！',
  '天才！',
  'すごい！',
  '生きてて偉い',
  '進んだ！',
  '耐えた！',
  '完璧！',
  'やるじゃん！',
  '神！',
  'センスある！',
  '素敵！',
  '優勝！',
  'ナイス！'
];

// ===================================
// カードデータ
// ===================================
const cardTemplates = {
  N: [
    { title: '生存確認', body: '今日も生きてる。それでOK。' },
    { title: '静観の達人', body: '静かにやり過ごした。偉業である。' },
    { title: '呼吸継続', body: '息してる。それだけで100点。' },
    { title: '一日完走', body: '今日という日を走り切った。' },
    { title: '存在証明', body: 'ここにいる。それが全て。' }
  ],
  R: [
    { title: '一歩前進者', body: '昨日より一歩、確実に進んだ。' },
    { title: '不安抱擁の勇者', body: '不安を抱えながらも前に進んだ。' },
    { title: '困難突破者', body: '壁にぶつかっても止まらなかった。' },
    { title: '自己対話の賢者', body: '自分と向き合う勇気を持った。' },
    { title: '継続の徒', body: '続けることを選んだ強さ。' }
  ],
  SR: [
    { title: '耐え抜いた戦士', body: 'あらゆる困難を乗り越えてきた証。' },
    { title: '継続の覇者', body: '積み重ねが生んだ唯一無二の存在。' },
    { title: '自己肯定の王', body: '自分を認める力を手に入れた。' }
  ]
};

function getRandomRarity() {
  const rand = Math.random() * 100;
  if (rand < 5) return 'SR';
  if (rand < 30) return 'R';
  return 'N';
}

function generateCard() {
  const rarity = getRandomRarity();
  const templates = cardTemplates[rarity];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return {
    date: getTodayString(),
    rarity,
    title: template.title,
    body: template.body
  };
}

// ===================================
// 日報返信テンプレート
// ===================================
const replyTemplates = {
  openers: [
    'なるほど、そんな一日だったんだね。',
    'うんうん、聞いてるよ。',
    'そっか、大変だったね。',
    'ふむふむ、よく話してくれたね。',
    'それは色々あったんだね。'
  ],
  affirmations: [
    'でもね、それでも今日ここまで来た。十分に偉い。',
    '不安があるのは、前に進んでる証拠だよ。',
    '完璧じゃなくていい。今日の自分、合格。',
    '誰がなんと言おうと、あなたは頑張ってる。',
    'その気持ちを抱えながら過ごせた。それだけですごいこと。',
    '立ち止まっても、後退してない。それでいい。',
    '今日という日を生き抜いた。それは紛れもない事実。'
  ],
  closers: [
    '本日の業務（生存）、完了。',
    '今日も一日、お疲れさま。',
    'よくやった。明日もなんとかなる。',
    'ゆっくり休んでね。',
    '今日の自分に花丸をあげよう。'
  ]
};

function generateReply(input) {
  const opener = replyTemplates.openers[Math.floor(Math.random() * replyTemplates.openers.length)];
  const affirmation = replyTemplates.affirmations[Math.floor(Math.random() * replyTemplates.affirmations.length)];
  const closer = replyTemplates.closers[Math.floor(Math.random() * replyTemplates.closers.length)];
  return `${opener}\n\n${affirmation}\n\n${closer}`;
}

// ===================================
// UI更新関数
// ===================================
let appData = loadData();

function updateTapStats() {
  const today = getTodayString();
  const todayTap = appData.tapByDate[today] || 0;
  
  document.getElementById('today-tap').textContent = todayTap;
  document.getElementById('total-tap').textContent = appData.tapCountTotal;
  document.getElementById('footer-total').textContent = appData.tapCountTotal;
  
  // 100タップで背景進化
  const hint = document.getElementById('tap-hint');
  if (appData.tapCountTotal >= 100) {
    document.body.classList.add('evolved');
    hint.classList.add('hidden');
  } else {
    document.body.classList.remove('evolved');
    hint.textContent = `あと${100 - appData.tapCountTotal}タップで背景が進化！`;
  }
}

function updateCardGallery() {
  const gallery = document.getElementById('card-gallery');
  const emptyMsg = document.getElementById('gallery-empty');
  
  gallery.innerHTML = '';
  
  if (appData.cards.length === 0) {
    emptyMsg.classList.remove('hidden');
  } else {
    emptyMsg.classList.add('hidden');
    // 最新順に表示
    const sortedCards = [...appData.cards].reverse();
    sortedCards.forEach((card, index) => {
      const realIndex = appData.cards.length - 1 - index;
      const cardEl = document.createElement('div');
      cardEl.className = 'gallery-card';
      cardEl.innerHTML = `
        <div class="card-rarity ${card.rarity.toLowerCase()}">${card.rarity}</div>
        <div class="card-preview">${card.title}</div>
      `;
      cardEl.addEventListener('click', () => showCardDetail(realIndex));
      gallery.appendChild(cardEl);
    });
  }
  
  document.getElementById('footer-cards').textContent = appData.cards.length;
}

function updateGachaButton() {
  const today = getTodayString();
  const btn = document.getElementById('gacha-button');
  const status = document.getElementById('gacha-status');
  
  if (appData.lastGachaDate === today) {
    btn.disabled = true;
    status.textContent = '✅ 今日のカードは獲得済みです';
  } else {
    btn.disabled = false;
    status.textContent = '今日のカードを手に入れよう！';
  }
}

function updateDailyHistory() {
  const list = document.getElementById('history-list');
  const emptyMsg = document.getElementById('history-empty');
  
  list.innerHTML = '';
  
  if (appData.dailyLogs.length === 0) {
    emptyMsg.classList.remove('hidden');
  } else {
    emptyMsg.classList.add('hidden');
    // 最新順
    const sortedLogs = [...appData.dailyLogs].reverse();
    sortedLogs.forEach((log, index) => {
      const realIndex = appData.dailyLogs.length - 1 - index;
      const item = document.createElement('div');
      item.className = 'history-item';
      item.innerHTML = `
        <div class="history-item-date">${log.date}</div>
        <div class="history-item-preview">${log.input}</div>
      `;
      item.addEventListener('click', () => showHistoryDetail(realIndex));
      list.appendChild(item);
    });
  }
}

// ===================================
// イベントハンドラ
// ===================================

// タブ切り替え
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.mode-section');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab + '-mode';
      
      tabs.forEach(t => t.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(targetId).classList.add('active');
    });
  });
}

// タップボタン
function initTapButton() {
  const btn = document.getElementById('tap-button');
  const praiseDisplay = document.getElementById('praise-display');
  const confettiContainer = document.getElementById('confetti-container');
  
  btn.addEventListener('click', () => {
    const today = getTodayString();
    
    // カウント更新
    appData.tapByDate[today] = (appData.tapByDate[today] || 0) + 1;
    appData.tapCountTotal++;
    saveData(appData);
    updateTapStats();
    
    // 褒め言葉表示
    const praise = praiseWords[Math.floor(Math.random() * praiseWords.length)];
    const praiseEl = document.createElement('span');
    praiseEl.className = 'praise-text';
    praiseEl.textContent = praise;
    praiseEl.style.left = `${Math.random() * 60 + 20}%`;
    praiseDisplay.appendChild(praiseEl);
    setTimeout(() => praiseEl.remove(), 1000);
    
    // 紙吹雪演出
    for (let i = 0; i < 8; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = '40%';
      confetti.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
      confetti.style.animationDelay = `${Math.random() * 0.2}s`;
      confettiContainer.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1200);
    }
  });
}

// ガチャボタン
function initGachaButton() {
  const btn = document.getElementById('gacha-button');
  const modal = document.getElementById('gacha-modal');
  const closeBtn = document.getElementById('gacha-modal-close');
  
  btn.addEventListener('click', () => {
    const today = getTodayString();
    if (appData.lastGachaDate === today) return;
    
    // カード生成
    const card = generateCard();
    appData.cards.push(card);
    appData.lastGachaDate = today;
    saveData(appData);
    
    // モーダル表示
    document.getElementById('new-rarity').textContent = card.rarity;
    document.getElementById('new-rarity').className = `card-rarity ${card.rarity.toLowerCase()}`;
    document.getElementById('new-title').textContent = card.title;
    document.getElementById('new-body').textContent = card.body;
    modal.classList.add('show');
    
    updateGachaButton();
    updateCardGallery();
  });
  
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });
  
  modal.querySelector('.modal-overlay').addEventListener('click', () => {
    modal.classList.remove('show');
  });
}

// カード詳細モーダル
function showCardDetail(index) {
  const card = appData.cards[index];
  if (!card) return;
  
  const modal = document.getElementById('card-modal');
  document.getElementById('modal-rarity').textContent = card.rarity;
  document.getElementById('modal-rarity').className = `card-rarity ${card.rarity.toLowerCase()}`;
  document.getElementById('modal-title').textContent = card.title;
  document.getElementById('modal-body').textContent = card.body;
  document.getElementById('modal-date').textContent = card.date;
  modal.classList.add('show');
}

function initCardModal() {
  const modal = document.getElementById('card-modal');
  const closeBtn = document.getElementById('card-modal-close');
  
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });
  
  modal.querySelector('.modal-overlay').addEventListener('click', () => {
    modal.classList.remove('show');
  });
}

// 日報送信
function initDailySubmit() {
  const input = document.getElementById('daily-input');
  const submitBtn = document.getElementById('submit-daily');
  const replyArea = document.getElementById('reply-area');
  const replyContent = document.getElementById('reply-content');
  
  submitBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    
    // 返信生成
    const reply = generateReply(text);
    
    // 保存
    const log = {
      date: getTodayString(),
      input: text,
      reply: reply
    };
    appData.dailyLogs.push(log);
    saveData(appData);
    
    // 表示
    replyContent.innerHTML = reply.replace(/\n/g, '<br>');
    replyArea.classList.add('show');
    
    // 入力クリア
    input.value = '';
    
    // 履歴更新
    updateDailyHistory();
    
    // スクロール
    setTimeout(() => {
      replyArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  });
}

// 履歴詳細モーダル
function showHistoryDetail(index) {
  const log = appData.dailyLogs[index];
  if (!log) return;
  
  const modal = document.getElementById('history-modal');
  document.getElementById('history-date').textContent = log.date;
  document.getElementById('history-input-detail').textContent = log.input;
  document.getElementById('history-reply-detail').innerHTML = log.reply.replace(/\n/g, '<br>');
  modal.classList.add('show');
}

function initHistoryModal() {
  const modal = document.getElementById('history-modal');
  const closeBtn = document.getElementById('history-modal-close');
  
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });
  
  modal.querySelector('.modal-overlay').addEventListener('click', () => {
    modal.classList.remove('show');
  });
}

// データ初期化
function initResetButton() {
  const btn = document.getElementById('reset-btn');
  
  btn.addEventListener('click', () => {
    if (confirm('本当にすべてのデータを初期化しますか？\nこの操作は取り消せません。')) {
      localStorage.removeItem(STORAGE_KEY);
      appData = { ...defaultData };
      
      // UI更新
      updateTapStats();
      updateCardGallery();
      updateGachaButton();
      updateDailyHistory();
      document.getElementById('reply-area').classList.remove('show');
      
      alert('データを初期化しました。');
    }
  });
}

// ===================================
// 初期化
// ===================================
function init() {
  // 最終利用日更新
  appData.lastOpenedDate = getTodayString();
  saveData(appData);
  
  // UI初期化
  updateTapStats();
  updateCardGallery();
  updateGachaButton();
  updateDailyHistory();
  
  // イベント設定
  initTabs();
  initTapButton();
  initGachaButton();
  initCardModal();
  initDailySubmit();
  initHistoryModal();
  initResetButton();
}

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', init);

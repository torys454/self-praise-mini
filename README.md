# Self Praise Mini ✨

「落ち込んだ時」や「1日の終わり」に自分を褒めて気持ちを整えるWebアプリです。

## 🎯 概要

3つのモードで自己肯定感をブーストします：

1. **タップモード** - 連打して褒め言葉と演出で気分UP
2. **カードモード** - 1日1枚、自分を肯定するカードを収集
3. **日報モード** - 愚痴や不安を入力→全肯定で返信

## 🚀 使い方

### ローカルで動かす方法

#### 方法1: ファイルを直接開く
1. `index.html` をブラウザにドラッグ＆ドロップ
2. またはダブルクリックで開く

#### 方法2: ローカルサーバーを使う（推奨）
```bash
# Pythonがインストールされている場合
cd self-praise-mini
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く

# Node.jsの場合
npx serve .
# 表示されたURLをブラウザで開く
```

### GitHub Pagesで公開する方法

1. GitHubにログインし、新しいリポジトリを作成
   - リポジトリ名: `self-praise-mini`（任意）
   - Public を選択

2. ファイルをアップロード
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/あなたのユーザー名/self-praise-mini.git
   git push -u origin main
   ```
   
   または、GitHub上で「Add file」→「Upload files」からドラッグ＆ドロップ

3. GitHub Pages を有効化
   - リポジトリの「Settings」タブを開く
   - 左メニューの「Pages」をクリック
   - Source で「Deploy from a branch」を選択
   - Branch で「main」「/ (root)」を選択して Save

4. 数分待つと公開完了
   - URL: `https://あなたのユーザー名.github.io/self-praise-mini/`

## 📱 機能詳細

### タップモード
- 中央の大きなボタンをタップすると褒め言葉が表示される
- タップするたびに紙吹雪が舞う
- 累計100タップで背景がゴージャスに進化！

### カードモード
- 1日1回「宝箱を開ける」ボタンでカードを獲得
- レア度: N（70%）/ R（25%）/ SR（5%）
- 獲得したカードは図鑑に保存され、いつでも見返せる

### 日報モード
- テキスト入力欄に今日あったことや愚痴を書く
- 送信すると、全肯定の返信と「承認！」スタンプが表示
- 過去の日報は履歴から確認できる

## 💾 データ保存について

- すべてのデータは **localStorage（端末内）** に保存されます
- サーバーにデータは送信されません
- ブラウザを閉じてもデータは残ります
- 別の端末やブラウザではデータは引き継がれません

### データ初期化方法

画面下部フッターの「データ初期化」ボタンをタップ→確認ダイアログで「OK」

⚠️ 初期化すると以下がすべて消えます：
- タップ数（今日・累計）
- 獲得カード
- 日報履歴

## 🛠️ 技術仕様

- HTML/CSS/JavaScript のみ（外部ライブラリなし）
- 外部APIなし（オフラインでも動作）
- スマホ最適化（レスポンシブデザイン）

## 📝 ファイル構成

```
self-praise-mini/
├── index.html  # メインHTML
├── style.css   # スタイルシート
├── app.js      # アプリロジック
└── README.md   # このファイル
```

## 📜 ライセンス

MIT License - 自由に使ってください！

---

✨ 今日もお疲れさま。自分を褒めよう。✨

# Purus Education

Purusプログラミング言語を学ぶためのインタラクティブWebアプリケーションです。

基礎的な構文から応用問題まで、ブラウザ上でPurusコードを書き、即座に実行結果を確認できます。

## 主な機能

- 基礎からFizzBuzzまで17のインタラクティブレッスン
- Purus構文ハイライト付きMonacoエディタ
- サーバーサイドコード実行
- ダーク/ライトテーマ切り替え
- 日本語/英語バイリンガル対応
- 実行結果に基づくレッスンの自動採点
- Xへのレッスン修了共有

## 技術スタック

| 種類 | 技術 |
|------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| UI | Tailwind CSS v4 |
| コードエディタ | Monaco Editor |
| 実行環境 | purus (npm) |

## 始め方

### 前提条件

- Node.js 18以上

### インストール

```bash
git clone <repository-url>
cd purus-lang-edu
npm install
```

### 起動

```bash
npm run dev
```

ブラウザでhttp://localhost:3000を開くとアプリケーションが表示されます。

## ディレクトリ構成

```
purus-lang-edu/
├── public/                     /* 静的アセット */
├── src/
│   ├── app/
│   │   ├── [locale]/           /* ロケール対応ルート */
│   │   │   ├── lessons/        /* レッスン一覧・詳細ページ */
│   │   │   │   └── [id]/
│   │   │   │       └── not-found.tsx /* レッスン404ページ */
│   │   │   ├── layout.tsx      /* ロケールレイアウト */
│   │   │   ├── not-found.tsx   /* ロケール404ページ */
│   │   │   └── page.tsx        /* トップページ */
│   │   ├── api/
│   │   │   └── run/            /* コード実行API */
│   │   ├── globals.css
│   │   └── layout.tsx          /* ルートレイアウト */
│   ├── components/
│   │   ├── Editor.tsx          /* Monacoエディタ */
│   │   ├── Header.tsx          /* ヘッダーコンポーネント */
│   │   ├── LanguageSwitcher.tsx /* 言語切替 */
│   │   ├── OutputPane.tsx      /* 実行結果表示 */
│   │   ├── Sidebar.tsx         /* サイドバー */
│   │   └── ThemeToggle.tsx     /* テーマ切替 */
│   ├── hooks/
│   │   └── useTheme.ts         /* テーマ管理フック */
│   ├── lib/
│   │   ├── i18n.ts             /* 国際化設定 */
│   │   ├── lessons.ts          /* レッスンデータ */
│   │   ├── purus-lang.ts       /* Purus言語定義 */
│   │   └── purus.ts            /* Purus実行ラッパー */
│   └── proxy.ts                 /* プロキシ設定 */
├── package.json
├── tsconfig.json
└── next.config.ts
```

## ライセンス

Apache License 2.0

詳細は[LICENSE](./LICENSE)ファイルを参照してください。

# Purus Education

Purusプログラミング言語を学ぶためのインタラクティブWebアプリケーションです。

基礎的な構文から応用問題まで、ブラウザ上でPurusコードを書き、即座に実行結果を確認できます。

## 主な機能

- 基礎からFizzBuzzまで17のインタラクティブレッスン
- Purus構文ハイライト付きMonacoエディタ
- サーバーサイドコード実行
- ダーク/ライトテーマ切り替え
- 日本語/英語バイリンガル対応
- GitHub OAuth認証
- PostgreSQLによるユーザー進捗管理

## 技術スタック

| 種類 | 技術 |
|------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| UI | Tailwind CSS v4 |
| コードエディタ | Monaco Editor |
| 認証 | NextAuth.js (GitHub OAuth) |
| ORM | Prisma |
| データベース | PostgreSQL |
| 実行環境 | purus (npm) |

## 始め方

### 前提条件

- Node.js 18以上
- PostgreSQL
- GitHub OAuth App (認証機能を使用する場合)

### インストール

```bash
git clone <repository-url>
cd purus-lang-edu
npm install
```

### 環境設定

`.env.local`ファイルを作成し、以下の変数を設定してください。

```
DATABASE_URL=postgresql://user:password@localhost:5432/purus_edu
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
```

### データベース初期セットアップ

```bash
npx prisma migrate dev
npx prisma generate
```

### 起動

```bash
npm run dev
```

ブラウザでhttp://localhost:3000を開くとアプリケーションが表示されます。

## ディレクトリ構成

```
purus-lang-edu/
├── prisma/
│   └── schema.prisma          /* DBスキーマ定義 */
├── public/                     /* 静的アセット */
├── src/
│   ├── app/
│   │   ├── [locale]/           /* ロケール対応ルート */
│   │   │   ├── dashboard/      /* ダッシュボードページ */
│   │   │   ├── lessons/        /* レッスン一覧・詳細ページ */
│   │   │   │   └── [id]/
│   │   │   │       └── not-found.tsx /* レッスン404ページ */
│   │   │   ├── layout.tsx      /* ロケールレイアウト */
│   │   │   ├── not-found.tsx   /* ロケール404ページ */
│   │   │   └── page.tsx        /* トップページ */
│   │   ├── api/
│   │   │   ├── auth/           /* NextAuth認証API */
│   │   │   ├── progress/       /* 進捗管理API */
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
│   │   ├── auth.ts             /* NextAuth設定 */
│   │   ├── i18n.ts             /* 国際化設定 */
│   │   ├── lessons.ts          /* レッスンデータ */
│   │   ├── prisma.ts           /* Prismaクライアント */
│   │   ├── purus-lang.ts       /* Purus言語定義 */
│   │   └── purus.ts            /* Purus実行ラッパー */
│   ├── proxy.ts                 /* プロキシ設定 */
│   └── types/
│       └── next-auth.d.ts      /* NextAuth型定義 */
├── package.json
├── tsconfig.json
└── next.config.ts
```

## ライセンス

Apache License 2.0

詳細は[LICENSE](./LICENSE)ファイルを参照してください。

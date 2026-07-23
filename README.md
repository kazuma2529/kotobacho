# ことば帳

日常会話で「言えそうで言えない」英単語をジャンル別に学べるアプリです。  
42 ジャンル・1,950 語を収録しています（静的 TypeScript データ）。

## 機能

- ジャンル別の単語学習
- 「微妙」「苦手」への分類と復習
- Firebase Authentication（メール / Google / ゲスト）
- Firestore によるユーザー進捗の同期

## セットアップ

前提: Node.js 18+

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

追加の `.env` は不要です。Firebase 設定は [`firebase-config.json`](firebase-config.json) にあります。

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド（`dist/`） |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run lint` | TypeScript 型チェック |

## 単語・ジャンルの追加

コンテンツは `src/data/` 配下の静的 TypeScript です。

1. ジャンルを増やす場合は [`src/data/genresData.ts`](src/data/genresData.ts) に定義を追加
2. 単語は `makeWordList` 形式で追加（例: [`src/data/wordsPart5.ts`](src/data/wordsPart5.ts)）

```ts
const GENRE_43_DATA: [string, string][] = [
  ['日本語', 'English'],
];

export const WORDS_PART_N: WordItem[] = [
  ...makeWordList(43, GENRE_43_DATA),
];
```

3. 新しい Part ファイルを作った場合は [`src/data/wordsData.ts`](src/data/wordsData.ts) に import を追加

`id` は `${genreId}-${number}` 形式です。既存 ID を変えるとユーザー進捗がずれます。

## デプロイ

本番 URL: https://kotobacho.vercel.app

GitHub (`main`) への push で Vercel が自動デプロイします。

Google ログインを使う場合は、Firebase Console → Authentication → Settings → Authorized domains に次を追加してください。

- `kotobacho.vercel.app`
- `kotobacho-kyamada760-gmailcoms-projects.vercel.app`

## 技術スタック

- Vite + React + TypeScript
- Tailwind CSS
- Firebase (Auth / Firestore)

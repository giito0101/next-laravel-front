# LocalSkillShare Next Front

LocalSkillShare のフロントエンドです。

Next.js から Laravel API (`lss-laravel-api`) を呼び出し、スキル一覧から詳細、予約フォームへ進む流れを確認できるプロトタイプです。

## 公開デモ

現在公開している画面です。

| page | url | description |
| --- | --- | --- |
| スキル一覧 | [https://next-laravel-front.vercel.app/skills](https://next-laravel-front.vercel.app/skills) | API から取得したスキル一覧を確認できます。 |
| スキル詳細 | [https://next-laravel-front.vercel.app/skills/01kptp2s5q8b4t8k8jw25zasee](https://next-laravel-front.vercel.app/skills/01kptp2s5q8b4t8k8jw25zasee) | スキルの説明、カテゴリ、エリア、価格を確認できます。 |
| 予約フォーム | [https://next-laravel-front.vercel.app/skills/01kptp2s5q8b4t8k8jw25zasee/reserve](https://next-laravel-front.vercel.app/skills/01kptp2s5q8b4t8k8jw25zasee/reserve) | 希望日時を入力する予約フォームを確認できます。 |

## 見られる画面

| path | description |
| --- | --- |
| `/skills` | API から取得したスキル一覧を表示 |
| `/skills/[id]` | スキル詳細を表示 |
| `/skills/[id]/reserve` | 予約作成フォームを表示 |

現在は画面デザインを作り込む前の段階で、API 接続とページ遷移の土台を優先しています。

## できること

- Laravel API からスキル一覧を取得して表示
- 一覧からスキル詳細へ遷移
- 詳細から予約フォームへ遷移
- 共通 API クライアント `lib/api.ts` で API 通信を管理
- 主要画面の表示と送信処理をテスト

## 技術スタック

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Vitest
- Testing Library

## Laravel API との接続

`.env` または `.env.local` に API の URL を設定します。

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

Docker で Laravel API を `10000` 番で動かす場合:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:10000/api
```

## 動作確認

先に Laravel API を起動します。

```bash
cd ../lss-laravel-api
php artisan serve
```

次にフロントエンドを起動します。

```bash
cd ../next-laravel-front
npm install
npm run dev
```

ブラウザで確認します。

```text
http://localhost:3000/skills
```

## テスト

```bash
npm test
```

確認済み:

```text
Test Files  3 passed (3)
Tests       3 passed (3)
```

テストでは、スキル一覧表示・スキル詳細表示・予約フォーム送信後の表示を確認しています。

## 現在の開発範囲

このリポジトリは、LocalSkillShare の画面プロトタイプです。現時点では以下が今後の改善対象です。

- トップページはまだ Next.js 初期画面
- 一覧・詳細画面は簡素な表示
- 検索 UI / カテゴリ絞り込み UI は未実装
- 予約作成 payload は Laravel API 側の `date` / `X-User-Id` に合わせる必要あり

## 次に作る画面

ポートフォリオとして見せるため、次の 3 画面を優先して作り込む想定です。

1. `/skills`
   スキルカード一覧、検索、カテゴリ絞り込みを追加する。

2. `/skills/[id]`
   スキル説明、価格、エリア、予約導線を見やすくする。

3. `/skills/[id]/reserve`
   Laravel API と接続して、実際に予約作成できる状態にする。

# LocalSkillShare Next Front

LocalSkillShare の Next.js フロントエンドです。

Laravel API (`lss-laravel-api`) と接続して、スキル一覧・スキル詳細・予約作成画面の土台を実装しています。現時点では、画面と API 接続の検証を進めるための最小構成です。

## 技術スタック

- Next.js 16.1.6
- React 19
- TypeScript
- Tailwind CSS
- Vitest
- Testing Library

## 現在できること

- `/skills` で Laravel API からスキル一覧を取得して表示
- `/skills/[id]` でスキル詳細を取得して表示
- `/skills/[id]/reserve` で予約作成フォームを表示
- 共通 API クライアント `lib/api.ts` から `NEXT_PUBLIC_API_BASE_URL` を使って Laravel API へアクセス
- スキル一覧、スキル詳細、予約フォームの表示・送信処理をテスト

## 現在の注意点

- トップページ `/` はまだ create-next-app の初期画面です。
- 予約フォームは画面と送信処理の土台がありますが、Laravel API 側の予約作成仕様とはまだ完全に揃っていません。
- Laravel API 側は予約作成時に `date` と `X-User-Id` を期待していますが、フロント側は現在 `startAt` を送っています。
- `/ping` は接続確認用のページですが、現在の `NEXT_PUBLIC_API_BASE_URL` に `/api` を含める設定だと URL が二重になるため調整が必要です。

## セットアップ

```bash
npm install
```

`.env` または `.env.local` に Laravel API の URL を設定します。

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

`NEXT_PUBLIC_API_BASE_URL` はブラウザ側にも公開される Next.js の環境変数です。API のベース URL として `lib/api.ts` から参照しています。

## 起動方法

先に Laravel API を起動します。

```bash
cd ../lss-laravel-api
php artisan serve
```

標準では `http://127.0.0.1:8000` で起動します。

次に Next.js を起動します。

```bash
cd ../next-laravel-front
npm run dev
```

標準では `http://localhost:3000` で起動します。

## 主要ページ

| path | description |
| --- | --- |
| `/` | 初期テンプレート画面 |
| `/skills` | スキル一覧 |
| `/skills/[id]` | スキル詳細 |
| `/skills/[id]/reserve` | 予約作成フォーム |
| `/ping` | API 接続確認用のページ |

## API 接続

API の共通処理は `lib/api.ts` にあります。

```ts
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
```

現在の想定:

```text
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

この設定の場合、次のような URL にアクセスします。

```text
GET http://127.0.0.1:8000/api/skills
GET http://127.0.0.1:8000/api/skills/{id}
POST http://127.0.0.1:8000/api/skills/{id}/reservations
```

`fetch failed` が出る場合は、Laravel API が起動しているか確認してください。

```bash
curl http://127.0.0.1:8000/api/skills
```

## テスト

```bash
npm test
```

確認済みの実行結果:

```text
Test Files  3 passed (3)
Tests       3 passed (3)
```

現在の主なテスト対象:

- スキル一覧ページが API レスポンスのスキルを表示すること
- スキル詳細ページが詳細情報と予約導線を表示すること
- 予約作成ページがフォーム送信後に成功メッセージを表示すること

## 今後やること

- トップページを LocalSkillShare 用に差し替える
- 予約作成フォームの送信 payload を Laravel API の `date` に合わせる
- 予約作成時に `X-User-Id` を送る方法を決める
- `/ping` の URL 組み立てを現在の env 設定に合わせる
- 一覧検索やカテゴリ絞り込み UI を追加する

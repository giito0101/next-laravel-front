# LocalSkillShare Laravel + Next Frontend

LocalSkillShare を Laravel API + Next.js 構成で作り直している版のフロントエンドです。

このリポジトリはフロントエンドのみを管理しています。バックエンドは別リポジトリの Laravel API (`lss-laravel-api`) を利用します。

Next.js から Laravel API を呼び出し、スキル一覧から詳細、予約作成、所有者向け予約一覧まで確認できるプロトタイプです。

## 公開デモ

現在公開している画面です。

| page | url | description |
| --- | --- | --- |
| スキル一覧 | [https://next-laravel-front.vercel.app/skills](https://next-laravel-front.vercel.app/skills) | API から取得したスキル一覧を確認できます。 |
| スキル詳細 | [https://next-laravel-front.vercel.app/skills/01kpw9y9dcf2bfdxfm52e3kh45](https://next-laravel-front.vercel.app/skills/01kpw9y9dcf2bfdxfm52e3kh45) | スキルの説明、カテゴリ、エリア、価格を確認できます。 |
| 予約フォーム | [https://next-laravel-front.vercel.app/skills/01kpw9y9dcf2bfdxfm52e3kh45/reserve](https://next-laravel-front.vercel.app/skills/01kpw9y9dcf2bfdxfm52e3kh45/reserve) | 希望日時を入力する予約フォームを確認できます。 |

## 見られる画面

| path | description |
| --- | --- |
| `/skills` | API から取得したスキル一覧を表示 |
| `/skills/[id]` | スキル詳細を表示 |
| `/skills/[id]/reserve` | 予約作成フォームを表示 |
| `/reservations/my` | 所有者として、自分のスキルに入った予約一覧を表示 |

`/skills/[id]/reservations` は互換用に予約作成ページへつないでいます。所有者向けの予約一覧は `/reservations/my` です。

## できること

- Laravel API からスキル一覧を取得して表示
- キーワード、カテゴリ、エリアでスキル一覧を絞り込み
- 一覧からスキル詳細へ遷移
- 詳細から予約フォームへ遷移
- 予約フォームから Laravel API に予約を作成
- 所有者向けに、自分のスキルに入った予約一覧を表示
- 現在ユーザーが作成したスキルは一覧・詳細・予約作成対象から除外
- レビュー一覧表示とレビュー投稿フォーム
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

認証はまだ未導入のため、デモ用のユーザー ID を環境変数で切り替えます。

```env
NEXT_PUBLIC_DEMO_USER_ID=demo-customer-1
NEXT_PUBLIC_DEMO_PROVIDER_ID=provider-pc-1
```

- `NEXT_PUBLIC_DEMO_USER_ID` は、スキル一覧・詳細・予約作成で使う利用者 ID です。
- `NEXT_PUBLIC_DEMO_PROVIDER_ID` は、`/reservations/my` で使うスキル所有者 ID です。
- 未設定の場合は `demo-customer-1` / `provider-pc-1` を使います。

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
http://localhost:3000/reservations/my
```

## テスト

```bash
npm test
```

確認済み:

```text
Test Files  4 passed (4)
Tests       11 passed (11)
```

テストでは、スキル一覧表示・自分のスキル除外・スキル詳細表示・予約フォーム送信・所有者向け予約一覧を確認しています。

## 現在の開発範囲

このリポジトリは、LocalSkillShare Laravel + Next 版のフロントエンドプロトタイプです。元の LocalSkillShare 本体ではなく、Laravel API と接続する Next.js 側の画面実装を扱います。

現時点では以下が今後の改善対象です。

- トップページはまだ Next.js 初期画面
- 本格的なログイン・セッション管理は未導入
- 予約ステータスの承認・キャンセル操作は未実装
- `/reservations/my` は所有者向けの閲覧のみ対応
- 一覧・詳細・予約画面はプロトタイプ UI

## 次に改善すること

ポートフォリオとして見せるため、次の改善を進める想定です。

1. `/skills`
   スキルカード一覧、検索、カテゴリ絞り込みの見せ方をさらに整える。

2. `/skills/[id]`
   スキル説明、価格、エリア、予約導線を見やすくする。

3. `/skills/[id]/reserve`
   バリデーションエラーをより分かりやすく表示する。

4. `/reservations/my`
   スキル所有者として受けた予約を確認し、将来的に承認・キャンセルできるようにする。

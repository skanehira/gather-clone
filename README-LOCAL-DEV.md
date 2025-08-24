# ローカル開発環境セットアップ

このプロジェクトはSupabaseをローカルで動作させることで、本番環境に依存せずに開発できます。

## 前提条件

- Node.js (v18以上)
- Docker (Supabaseローカル環境用)
- npm

## セットアップ手順

### 1. 依存関係のインストール

```bash
# プロジェクトルートで
npm install

# フロントエンド
cd frontend && npm install && cd ..

# バックエンド  
cd backend && npm install && cd ..
```

### 2. 環境変数の設定

```bash
# 各ディレクトリで.env.localを作成
cp .env.local.example .env.local
cp frontend/.env.local.example frontend/.env.local
cp backend/.env.local.example backend/.env.local
```

**注意**: Agora（ビデオチャット）を使用する場合は、[Agora.io](https://agora.io)でアカウントを作成し、App IDとCertificateを取得して環境変数に設定してください。

### 3. ローカルSupabaseの起動

```bash
# Supabaseローカル環境を起動（初回は時間がかかります）
npm run supabase:start
```

初回起動時は以下が自動でセットアップされます：
- PostgreSQL データベース
- 認証システム
- リアルタイム機能
- ストレージ
- Supabase Studio (管理画面)

### 4. 開発サーバーの起動

```bash
# フロントエンドとバックエンドを同時に起動
npm run dev:local
```

または個別に起動：

```bash
# フロントエンド（別ターミナル）
cd frontend && npm run dev

# バックエンド（別ターミナル）
cd backend && npm run dev
```

## アクセス先

- **フロントエンド**: http://localhost:3000
- **バックエンド**: http://localhost:3001  
- **Supabase Studio**: http://localhost:54323 (データベース管理画面)
- **メール確認**: http://localhost:54324 (開発用メールサーバー)

## データベース管理

```bash
# データベースリセット（全データ削除）
npm run supabase:reset

# Supabase停止
npm run supabase:stop

# Supabase状態確認
npm run supabase:status
```

## 初回ユーザー作成

1. http://localhost:3000 にアクセス
2. サインアップページでアカウント作成
3. ローカル環境では自動でアカウントが有効化されます

## トラブルシューティング

### Dockerエラー
```bash
# Dockerが起動していることを確認
docker ps

# Supabaseコンテナの状態確認
npm run supabase:status
```

### ポート競合
デフォルトポート（3000, 3001, 54321-54327）が使用中の場合は、`supabase/config.toml`で変更できます。

### データベースエラー
```bash
# データベースをリセット
npm run supabase:reset
```

## 本番環境との切り替え

本番環境を使用する場合は、`.env.local`ファイルで本番のSupabaseの値に変更してください。
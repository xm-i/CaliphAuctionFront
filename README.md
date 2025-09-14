# Caliph Auction Frontend

Vue 3 + TypeScript + Vite によるカリフオークションフロントエンド。

## 開発手順

依存関係インストール:

```bash
npm ci
```

開発サーバ起動 (ポート 8080 固定):

```bash
npm run dev
```

型チェック + 本番ビルド:

```bash
npm run build
```

本番ビルドをローカル確認:

```bash
npm run preview
```

## 環境変数 / 設定

`VITE_` プレフィックス付き変数は Vite によってクライアントへ埋め込まれます。`base` は固定で `/` です。

### API 接続先の切り替え

`VITE_API_BASE_URL` を環境ごとに `.env.*` で定義します。

同梱ファイル例:

```
.env.development  -> VITE_API_BASE_URL=https://localhost:5000
.env.production   -> VITE_API_BASE_URL=https://api.caliphauction.com
```

Vite は `npm run dev` (development モード) なら `.env.development`、`npm run build` は `--mode production` がデフォルトで `.env.production` を読み込みます。独自モードを使いたい場合:

## デプロイ (VPS / SCP / rsync)

GitHub Actions を用いてビルド成果物 (`dist/`) を VPS へ `rsync` (SSH) で転送します。

### ワークフロー

ファイル: `.github/workflows/deploy.yml`

トリガー:

- `master` ブランチへの push
- 手動実行 (workflow_dispatch)

主なステップ:

1. リポジトリ checkout
2. Node.js 20 セットアップ & npm キャッシュ
3. `npm ci`
4. `npm run build`
5. `rsync` により `dist/` をサーバ指定パスへ同期

### 必要な GitHub Secrets

ハードコードされた接続情報:

```
ユーザ: ubuntu
ホスト: caliphauction.com
パス:   /var/www/caliph-auction/front
ポート: 22
```

必要なシークレットは 1 つのみ:

| 名前             | 説明                                                     |
| ---------------- | -------------------------------------------------------- |
| `DEPLOY_SSH_KEY` | `ubuntu` ユーザで接続可能な秘密鍵 (パスフレーズ無し推奨) |

公開鍵 (`.pub`) をサーバ側 `~/.ssh/authorized_keys` に配置してください。

### サーバ側の準備例 (Ubuntu/Nginx)

```bash
sudo mkdir -p /var/www/html/app
sudo chown deploy:deploy /var/www/html/app

# Nginx サーバブロック例 (/etc/nginx/sites-available/auction.conf)
server {
   listen 80;
   server_name example.com;
   root /var/www/html/app;  # dist の中身がここに同期される
   index index.html;

   location / {
      try_files $uri $uri/ /index.html; # SPA fallback
   }

   access_log /var/log/nginx/auction.access.log;
   error_log  /var/log/nginx/auction.error.log;
}
```

有効化:

```bash
sudo ln -s /etc/nginx/sites-available/auction.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 手動デプロイ (ローカルから)

サーバに直接アップロードしたい場合:

```bash
npm run build
rsync -avz --delete dist/ deploy@example.com:/var/www/html/app/
```

### トラブルシュート

| 症状                           | 原因                    | 対応                                     |
| ------------------------------ | ----------------------- | ---------------------------------------- |
| 403 / 404                      | Nginx root/権限設定ミス | 所有者・パス再確認 (`ls -al`)            |
| CSS が反映されない             | ブラウザキャッシュ      | ハードリロード / キャッシュ削除          |
| 直接 URL アクセスで 404        | SPA fallback 未設定     | Nginx の `try_files` 行を追加            |
| rsync 失敗 (Permission denied) | デプロイユーザ権限不足  | `DEPLOY_PATH` の所有権変更               |
| ホスト検証失敗                 | known_hosts 未登録      | workflow 内 ssh-keyscan で解決済みか確認 |

## ディレクトリ概要

- `src/` : アプリ本体
- `src/components/` : Vue コンポーネント
- `src/stores/` : Pinia ストア
- `src/router/` : ルーティング
- `public/` : そのままコピーされる静的ファイル

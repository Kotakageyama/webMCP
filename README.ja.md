# TaskSurface

TaskSurface は、WebMCP ネイティブな人とエージェントの協働 UI を示すデモです。ページが公開する capability を唯一の情報源とし、エージェントが作業をタスクに絞り込み、店舗担当者が意味の分かる変更内容を確認して明示的に確定します。

MVP では、商品返品、配送先変更、出荷キャンセルの 3 フローを扱います。チャットサイドバーではなく、集中した UI、エージェントの存在表示、WebMCP capability 名、業務上の意味を示すプレビューを提供します。

WebMCP 対応の Chrome origin では、`app/webmcp.ts` が Imperative API（`document.modelContext.registerTool`）を使い、現在のページ・タスクで有用なツールだけを登録します。WebMCP 非対応ブラウザでも店舗担当者向け UI は完全に動作し、capability パネルで同じタスクグラフを確認できます。

## WebMCP の確認

サイトツールは ChatGPT のコネクターやチャット画面の `+` メニュー項目ではありません。現在開いているページに属し、WebMCP 対応ブラウザのエージェントが発見します。

### ChatGPT デスクトップアプリ

1. ChatGPT デスクトップアプリ内蔵ブラウザで Cloud Run の URL を開きます。
2. **Browser settings → Permissions → Enable site tools** が有効であることを確認します。
3. ブラウザのアドレスバーにある矢印を確認します。現在のページ状態で使えるツールが表示されます。
4. ChatGPT に赤い T シャツの返品、配送先変更、または出荷キャンセルを依頼します。ダッシュボードではタスク開始ツールのみが公開され、タスクに入ると関連する読み取り・準備ツールだけに切り替わります。

ページ内の **Live WebMCP tools** パネルは、登録と同じツール名定義から表示されています。対応ブラウザで登録できたか、WebMCP 非対応か、登録時エラーかを確認できます。

### Google Chrome

Chrome での確認はページ API を検証しますが、サイトを ChatGPT カスタムアプリに変えるものではありません。Chrome 149 以降で `chrome://flags/#enable-webmcp-testing` を有効にして再起動し、デプロイ済み URL を開きます。Chrome DevTools の WebMCP 機能、またはページの **Live WebMCP tools** の状態で、ダッシュボードが 3 つのタスク開始ツールを公開していることを確認します。各タスクに入り、公開リストがタスク固有のツールへ切り替わることを確認します。

## ローカル実行

```bash
cp .env.example .env.local
npm install
npm run dev
```

`DATABASE_URL` がなければ、デモはメモリ上のシード済み注文を使います。Neon の接続文字列がある場合は、Neon SQL Editor または `psql "$DATABASE_URL" -f db/schema.sql` で `db/schema.sql` を適用してください。アプリは `orders` を読み、承認済みアクションを `task_actions` に書き込みます。

## Cloud Run + Neon

1. Neon Postgres データベースを作成し、`db/schema.sql` を実行します。
2. プール接続 URL（`sslmode=require` を含む）を Secret Manager に登録します。`gcloud secrets create tasksurface-database-url --replication-policy=automatic` を実行し、値を追加します。
3. 選択したリージョンに `tasksurface` Artifact Registry リポジトリを作成します。
4. `make PROJECT_ID=... REGION=asia-northeast1 release` でデプロイします。

Cloud Run が受け取るのは Secret Manager への参照だけで、`DATABASE_URL` はイメージに含まれません。アプリは Next.js の standalone 出力を使い、Cloud Run の `PORT`（既定値 8080）にバインドします。

## セキュリティ体験ページ

`/security-lab` は、日本語で説明する安全な教育用シミュレーションです。表示上のロール、ページが実際に公開する読み取り専用 WebMCP ツール、非信頼コンテンツが判断を逸脱させる失敗例、最小権限・人の承認・サーバー側強制による防御を確認できます。秘密情報、顧客情報、書き込み操作、攻撃手順は公開しません。

## ライセンス

本プロジェクトは [MIT License](LICENSE) で提供されます。

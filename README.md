# PWAMAP-CLI

`PWAMAP-CLI` は、CSVデータソースからインタラクティブな PWA の地図アプリケーションを簡単に構築するためのコマンドラインツールです。

このツールを使うことで、店舗リストや施設一覧などの位置情報を含んだCSVファイルから、インタラクティブな地図サイトを生成できます。

## 前提条件

- [Node.js](httpss://nodejs.org/) (v16以上を推奨)
- [npm](https://www.npmjs.com/)

## インストール

### グローバルインストール

```bash
npm install -g pwamap-cli
```

#### 使い方

```bash
pwamap-cli start ./data.csv
```

```bash
pwamap-cli build ./data.csv
```

### ローカルインストール

```bash
npm install --save-dev pwamap-cli
```

#### 使い方

```bash
npx pwamap-cli start ./data.csv
```

```bash
npx pwamap-cli build ./data.csv
```

## 開発者向け

リポジトリをクローンし、依存関係をインストールします。

```bash
git clone https://github.com/your-username/pwamap-cli.git
cd pwamap-cli
npm install
```

### CLIツールの使い方

`pwamap-cli` は、CSVファイルを引数として実行します。

#### 開発サーバーの起動

CSVファイルを指定して、開発用のローカルサーバーを起動します。ファイルの変更を監視し、自動でリロードされます。

```bash
npm run cli:start ./data.csv
```

実行後、ターミナルに表示されるURL（通常は `http://localhost:3000`）にブラウザでアクセスしてください。

#### 静的サイトのビルド

CSVファイルを元に、本番デプロイ用の静的サイトを `build` ディレクトリに生成します。

```bash
npm run cli:build ./data.csv
```

生成された `build` ディレクトリの中身を、任意のWebサーバーにアップロードして公開できます。

## ライセンス

このプロジェクトは [MIT License](LICENSE.txt) の下で公開されています。

#!/usr/bin/env node

const fs = require('fs');
const YAML = require('yaml');
const path = require('path');
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const command = args[0];
const csvFilePath = args[1];

function processYamlConfig() {
  const srcConfigFilePath = path.join(process.cwd(), '/config.yml');
  const distConfigFilePath = path.join(process.cwd(), '/src/config.json');

  if (fs.existsSync(srcConfigFilePath)) {
    const yamlText = fs.readFileSync(srcConfigFilePath).toString();
    const config = YAML.parse(yamlText);

    if (config) {
      const envText =
        Object.keys(config)
          .filter((key) => typeof config[key] === 'string' || typeof config[key] === 'number')
          .map((key) => `REACT_APP_${key.toUpperCase()}="${config[key]}"`)
          .join('\n') + '\n';

      fs.writeFileSync(distConfigFilePath, JSON.stringify(config, null, 2));
      fs.writeFileSync(path.join(process.cwd(), '.env'), envText);
      console.log('設定ファイル (config.yml) を処理しました。');
    }
  }
}

function processCsv(onComplete) {
  if (!csvFilePath) {
    console.error(`エラー: CSVファイルのパスを指定してください。`);
    console.error(`使用法: pwamap-cli ${command} <path/to/your.csv>`);
    process.exit(1);
  }

  const absoluteCsvPath = path.resolve(process.cwd(), csvFilePath);

  if (!fs.existsSync(absoluteCsvPath)) {
    console.error(`エラー: ファイルが見つかりません - ${absoluteCsvPath}`);
    process.exit(1);
  }

  const csvFile = fs.readFileSync(absoluteCsvPath, 'utf8');
  const distCsvPath = path.join(__dirname, '../public/data.csv');

  fs.writeFileSync(distCsvPath, csvFile);

  console.log(`CSVファイルを読み込みました: ${absoluteCsvPath}`);
  onComplete();
}

// コマンドに応じて処理を分岐
if (command === 'start') {
  processCsv(() => {
    console.log('React開発サーバーを起動します...');
    const server = spawn('npm', ['start'], {
      cwd: path.join(__dirname, '..'), // スクリプトの実行場所をpwamap-cliのルートに指定
      stdio: 'inherit',
      shell: true,
    });
    server.on('close', (code) => {
      if (code !== 0) {
        console.error(`開発サーバーが異常終了しました。終了コード: ${code}`);
      }
    });
  });
} else if (command === 'build') {
  processCsv(() => {
    console.log('アプリケーションをビルドします...');
    const builder = spawn('npm', ['run', 'build'], {
      cwd: path.join(__dirname, '..'), // スクリプトの実行場所をpwamap-cliのルートに指定
      stdio: 'inherit',
      shell: true,
    });
    builder.on('close', (code) => {
      if (code === 0) {
        console.log('ビルドが正常に完了しました。');
      } else {
        console.error(`ビルドプロセスが異常終了しました。終了コード: ${code}`);
      }
    });
  });
} else {
  processYamlConfig();
  process.exit(0);
}

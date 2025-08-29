#!/usr/bin/env node

const fs = require('fs');
const YAML = require('yaml');
const path = require('path');
const Papa = require('papaparse');

// 引数を処理
const args = process.argv.slice(2);
const command = args[0];
const csvFilePath = args[1];

// YAML設定の処理を関数化
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
      console.log('✅ 設定ファイル (config.yml) を処理しました。');
    }
  }
}

// 'start' コマンドが指定された場合の処理
if (command === 'start') {
  if (!csvFilePath) {
    console.error('エラー: CSVファイルのパスを指定してください。');
    console.error('使用法: pwamap-cli start <path/to/your.csv>');
    process.exit(1);
  }

  const absoluteCsvPath = path.resolve(process.cwd(), csvFilePath);

  if (!fs.existsSync(absoluteCsvPath)) {
    console.error(`エラー: ファイルが見つかりません - ${absoluteCsvPath}`);
    process.exit(1);
  }

  const csvFile = fs.readFileSync(absoluteCsvPath, 'utf8');
  const distJsonPath = path.join(process.cwd(), '/public/data.json');

  Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      fs.writeFileSync(distJsonPath, JSON.stringify(results.data, null, 2));
      console.log(`✅ CSVをJSONに変換し、${distJsonPath} に保存しました。`);
      processYamlConfig(); // YAMLの処理も実行
      process.exit(0);
    },
    error: (error) => {
      console.error('CSVのパース中にエラーが発生しました:', error.message);
      process.exit(1);
    },
  });
} else {
  // 'start' 以外、または引数がない場合はYAMLの処理のみ実行
  processYamlConfig();
  process.exit(0);
}
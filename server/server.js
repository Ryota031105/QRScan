const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ミドルウェアの設定
app.use(express.json()); // JSON形式のリクエストボディを解析できるようにする
app.use(cors());         // Reactからのクロスドメイン通信を許可する

// MySQLとの接続プールを作成（効率的な接続管理）
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 接続テスト
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQLへの接続に失敗しました:', err.message);
    return;
  }
  console.log('✅ MySQLに正常に接続しました！');
  connection.release();
});

// ==========================================
// APIエンドポイント: QRコードデータの登録・更新
// ==========================================
app.post('/api/scans', (req, res) => {
  const { location, item_name } = req.body;

  if (!location || !item_name) {
    return res.status(400).json({ error: '所在地または品名が送信されていません。' });
  }

  // まず同じ location と item_name が存在するか確認する
  const checkQuery = 'SELECT id FROM inventory WHERE location = ? AND item_name = ?';
  
  db.query(checkQuery, [location, item_name], (err, results) => {
    if (err) return res.status(500).json({ error: 'データベースエラー' });

    if (results.length > 0) {
      // 存在する場合：updated_at と is_checked を更新
      const updateQuery = 'UPDATE inventory SET updated_at = CURRENT_TIMESTAMP, is_checked = TRUE WHERE id = ?';
      db.query(updateQuery, [results[0].id], (err) => {
        if (err) return res.status(500).json({ error: '更新エラー' });
        res.status(200).json({ status: 'updated' });
      });
    } else {
      // 存在しない場合：新規登録
      const insertQuery = 'INSERT INTO inventory (location, item_name, is_checked) VALUES (?, ?, TRUE)';
      db.query(insertQuery, [location, item_name], (err) => {
        if (err) return res.status(500).json({ error: '登録エラー' });
        res.status(201).json({ status: 'created' });
      });
    }
  });
});

// ==========================================
// APIエンドポイント: 全データ取得
// ==========================================
app.get('/api/scans', (req, res) => {
  db.query('SELECT * FROM inventory', (err, results) => {
    if (err) return res.status(500).json({ error: '取得エラー' });
    res.status(200).json(results);
  });
});

// ==========================================
// APIエンドポイント: チェック状態の一括更新
// ==========================================
app.put('/api/scans/checked', (req, res) => {
  const { ids, is_checked } = req.body;

  if (!ids || ids.length === 0) return res.status(400).json({ error: 'IDがありません' });

  const query = 'UPDATE inventory SET is_checked = ? WHERE id IN (?)';
  db.query(query, [is_checked, ids], (err) => {
    if (err) return res.status(500).json({ error: '更新エラー' });
    res.status(200).json({ success: true });
  });
});

// サーバーの起動
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
});
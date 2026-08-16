const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ミドルウェアの設定
app.use(express.json()); // JSON形式のリクエストボディを解析できるようにする
app.use(cors()); // Reactからのクロスドメイン通信を許可する

// MySQLとの接続プールを作成（効率的な接続管理）
const db = mysql.createPool({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "password",
  database: process.env.MYSQLDATABASE || "qr_db",
  port: Number(process.env.MYSQLPORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: { rejectUnauthorized: false },
});

// データベースの初期化（コールバック形式に修正）
function initDb() {
  return new Promise((resolve) => {
    db.getConnection((err, connection) => {
      if (err) {
        console.error("Failed to initialize database (getConnection):", err);
        return resolve();
      }

      // scans テーブルが存在しない場合は作成する
      connection.query(
        `
        CREATE TABLE IF NOT EXISTS inventory (
          id INT AUTO_INCREMENT PRIMARY KEY,
          location TEXT NOT NULL,
          item_name TEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_checked BOOLEAN NOT NULL DEFAULT TRUE
        )
      `,
        (err) => {
          connection.release();
          if (err) {
            console.error("Failed to initialize database (query):", err);
          } else {
            console.log(
              "Database initialized & table verified/created successfully.",
            );
          }
          resolve();
        },
      );
    });
  });
}

// 接続テスト
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQLへの接続に失敗しました:", err.message);
    return;
  }
  console.log("✅ MySQLに正常に接続しました！");
  connection.release();
});

// ==========================================
// APIエンドポイント: QRコードデータの登録・更新
// ==========================================
app.post("/api/scans", (req, res) => {
  const { location, item_name } = req.body;

  if (!location || !item_name) {
    return res
      .status(400)
      .json({ error: "所在地または品名が送信されていません。" });
  }

  // まず同じ location と item_name が存在するか確認する
  const checkQuery =
    "SELECT id FROM inventory WHERE location = ? AND item_name = ?";

  db.query(checkQuery, [location, item_name], (err, results) => {
    if (err) return res.status(500).json({ error: "データベースエラー" });

    if (results.length > 0) {
      // 存在する場合：updated_at と is_checked を更新
      const updateQuery =
        "UPDATE inventory SET updated_at = CURRENT_TIMESTAMP, is_checked = TRUE WHERE id = ?";
      db.query(updateQuery, [results[0].id], (err) => {
        if (err) return res.status(500).json({ error: "更新エラー" });
        res.status(200).json({ status: "updated" });
      });
    } else {
      // 存在しない場合：新規登録
      const insertQuery =
        "INSERT INTO inventory (location, item_name, is_checked) VALUES (?, ?, TRUE)";
      db.query(insertQuery, [location, item_name], (err) => {
        if (err) return res.status(500).json({ error: "登録エラー" });
        res.status(201).json({ status: "created" });
      });
    }
  });
});

// ==========================================
// APIエンドポイント: 全データ取得
// ==========================================
app.get("/api/scans", (req, res) => {
  db.query("SELECT * FROM inventory", (err, results) => {
    if (err) return res.status(500).json({ error: "取得エラー" });
    res.status(200).json(results);
  });
});

// ==========================================
// APIエンドポイント: チェック状態の一括更新
// ==========================================
app.put("/api/scans/checked", (req, res) => {
  db.query("UPDATE inventory SET is_checked = false", (err) => {
    if (err) return res.status(500).json({ error: "更新エラー" });
    res.status(200).json({ success: true });
  });
});

// サーバーの起動
initDb().then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`);
  });
});

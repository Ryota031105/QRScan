import { useEffect, useState } from "react";
// テーブルのカラムに合わせて型を変更
type Item = {
  id: number;
  location: string;
  item_name: string;
  updated_at: string;
  is_checked: boolean | number;
};

export default function Page() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const fetchItems = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/scans`);
      if (!response.ok) throw new Error("データ取得に失敗しました");

      const data = await response.json();
      setItems(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const toggleCheck = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  // PUT: 一括更新（is_checked というキー名で送信）
  const updateCheckedStatus = async (isChecked: boolean) => {
    if (selectedIds.size === 0) return;
    try {
      const response = await fetch(`${apiUrl}/api/scans/checked`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: Array.from(selectedIds),
          is_checked: isChecked,
        }),
      });

      if (!response.ok) throw new Error("更新に失敗しました");

      fetchItems();
      setSelectedIds(new Set());
    } catch (e) {
      console.error(e);
    }
  };

  const downloadCsv = () => {
    if (items.length === 0) return;
    const header = "id,location,item_name,updated_at,is_checked\n";
    const rows = items
      .map((i) => {
        // DBによって is_checked が 1/0 で返るか true/false で返るか異なるため安全に判定
        const checkedStr =
          i.is_checked === 1 || i.is_checked === true ? "true" : "false";
        return `${i.id},${i.location},${i.item_name},${i.updated_at},${checkedStr}`;
      })
      .join("\n");

    // ===== 修正箇所：ここから =====
    // UTF-8のBOM（Byte Order Mark）を作成
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    // Blobの配列の先頭にBOMを追加する
    const blob = new Blob([bom, header + rows], {
      type: "text/csv;charset=utf-8;",
    });
    // ===== 修正箇所：ここまで =====

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>DB詳細</h2>

      <div style={{ marginBottom: "15px" }}>
        <button onClick={downloadCsv} style={{ marginRight: "10px" }}>
          CSVダウンロード
        </button>
        <button
          onClick={() => updateCheckedStatus(true)}
          style={{ marginRight: "10px" }}
        >
          選択済みをチェック(true)にする
        </button>
        <button onClick={() => updateCheckedStatus(false)}>
          選択済みを未チェック(false)にする
        </button>
      </div>

      <table
        border={1}
        cellPadding={8}
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th>選択</th>
            <th>id</th>
            <th>所在地</th>
            <th>物品名</th>
            <th>最終認証日</th>
            <th>チェック済み</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(item.id)}
                  onChange={() => toggleCheck(item.id)}
                />
              </td>
              <td>{item.id}</td>
              <td>{item.location}</td>
              <td>{item.item_name}</td>
              <td>{new Date(item.updated_at).toLocaleString("ja-JP")}</td>
              <td>{item.is_checked ? "true" : "false"}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                データがありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

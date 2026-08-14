import { useRef, useState } from "react";
import { useZxing } from "react-zxing";

export default function Page() {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const lastScannedRef = useRef<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const { ref } = useZxing({
    onDecodeResult(result) {
      if (!isScanning) return;
      if (lastScannedRef.current === result.rawValue) {
        console.log("同じよ！");
        return;
      }
      handleScan(result.rawValue);
    },
  });

  const handleScan = async (text: string) => {
    try {
      setIsScanning(false);

      // QRの文字列をパースし、キー揺れ（item_data / item_name）を吸収
      const parsedData = JSON.parse(text);
      const location = parsedData.location;
      const itemName = parsedData.item_data || parsedData.item_name;

      // バックエンドが受け取りやすいように、locationとitem_nameを明示的に送信
      const response = await fetch(`${apiUrl}/api/scans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: location,
          item_name: itemName,
        }),
      });

      if (!response.ok) throw new Error("保存失敗");

      const result = await response.json();

      // 新規か更新かでメッセージを出し分ける
      if (result.status === "updated") {
        setDialogContent(
          `下記の物品情報を更新しました。\n\n所在地：${location}\n物品名：${itemName}`,
        );
      } else {
        setDialogContent(
          `下記の物品は未登録です。\n新規登録します。\n\n所在地：${location}\n品名：${itemName}`,
        );
      }
      setShowDialog(true);
    } catch (e) {
      console.error(e);
      alert("QRデータの解析、またはサーバーとの通信に失敗しました。");
      setIsScanning(true);
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
    setIsScanning(true); // スキャン再開
  };

  return (
    <div>
      <h2>QRスキャンページ</h2>

      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <video ref={ref} style={{ width: "100%", borderRadius: "8px" }} />
      </div>

      {showDialog && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            border: "1px solid #ccc",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 100,
          }}
        >
          <pre
            style={{
              margin: "0 0 20px 0",
              fontFamily: "inherit",
              whiteSpace: "pre-wrap",
            }}
          >
            {dialogContent}
          </pre>
          <button
            onClick={closeDialog}
            style={{ padding: "8px 16px", cursor: "pointer" }}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}

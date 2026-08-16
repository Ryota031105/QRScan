import { useRef, useState } from "react";
import { InfoIcon, Scan } from "lucide-react";
import { useZxing } from "react-zxing";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Page() {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
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
      lastScannedRef.current = result.rawValue;
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

      setDialogContent(`所在地：${location}\n物品名：${itemName}`);

      // 新規か更新かでメッセージを出し分ける
      if (result.status === "updated") {
        setDialogTitle(`下記の物品をスキャンしました`);
      } else {
        setDialogTitle(`下記の新規物品をスキャンしました`);
      }
      setShowDialog(true);
      setTimeout(closeDialog, 3000);
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
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      <div>
        <video
          ref={ref}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div
        className={`absolute top-0 left-0 right-0 z-50 p-4 transition-all duration-500 ease-out transform ${
          showDialog
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <Alert>
          <InfoIcon />
          <AlertTitle>{dialogTitle}</AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {dialogContent}
          </AlertDescription>
        </Alert>
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
        <Scan color="#ffffff" strokeWidth={0.5} size={5400} />
      </div>
    </div>
  );
}

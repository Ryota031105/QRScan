import { useRef, useState } from "react";
import { useZxing } from "react-zxing";
import { insert } from "@/lib/api";

export function useScan() {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const lastScannedRef = useRef<string | null>(null);

  const closeDialog = () => {
    setShowDialog(false);
    setIsScanning(true);
  };

  const handleScan = async (text: string) => {
    try {
      setIsScanning(false);

      const parsedData = JSON.parse(text);
      const location = parsedData.location;
      const itemName = parsedData.item_data || parsedData.item_name;

      const result = await insert({
        location,
        item_name: itemName,
      });

      setDialogContent(`所在地：${location}\n物品名：${itemName}`);
      setDialogTitle(
        result.status === "updated"
          ? "下記の物品をスキャンしました"
          : "下記の新規物品をスキャンしました"
      );
      setShowDialog(true);
      setTimeout(closeDialog, 3000);
    } catch (e) {
      console.error(e);
      alert("QRデータの解析、またはサーバーとの通信に失敗しました。");
      setIsScanning(true);
    }
  };

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

  return {
    ref,
    showDialog,
    dialogContent,
    dialogTitle,
  };
}
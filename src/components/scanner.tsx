import { insert } from "@/lib/api";
import React, { use, useState } from "react";

export default function Scanner(promise: Promise<any>) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  try {
    const result = use(promise);

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

  const closeDialog = () => {
    setShowDialog(false);
    setIsScanning(true); // スキャン再開
  };
  return (
    <>
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
    </>
  );
}

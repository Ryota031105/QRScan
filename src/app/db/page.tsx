import { Suspense, useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/column";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { RiResetLeftLine } from "react-icons/ri";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LuDownload } from "react-icons/lu";
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

  // PUT: 一括更新（is_checked というキー名で送信）
  const updateCheckedStatus = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/scans/checked`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!response.ok) throw new Error("更新に失敗しました");

      fetchItems();
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
        const formatted = format(
          new Date(i.updated_at),
          "yyyy/MM/dd HH:mm:ss",
          {
            locale: ja,
          },
        );

        return `${i.id},${i.location},${i.item_name},${formatted},${checkedStr}`;
      })
      .join("\n");

    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, header + rows], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-center py-4">
        <Button variant="outline" onClick={downloadCsv} className="mx-2">
          <LuDownload />
          CSVダウンロード
        </Button>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="destructive" className="mx-2">
                <RiResetLeftLine />
                チェック状態のリセット
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                チェック状態をリセットしますか？
              </AlertDialogTitle>
              <AlertDialogDescription>
                この操作は元に戻せません。
                <br />
                全てのチェック状態が未チェックに更新されます。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>戻る</AlertDialogCancel>
              <AlertDialogAction onClick={() => updateCheckedStatus()}>
                リセット
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Suspense fallback={"Loading"}>
        <DataTable columns={columns} data={items} />
      </Suspense>
    </div>
  );
}

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { LuDownload } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import type { Item } from "./column";

export function DownloadButton(items: Item[]) {
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
    <>
      <Button variant="outline" onClick={downloadCsv}>
        <LuDownload />
        CSVダウンロード
      </Button>
    </>
  );
}

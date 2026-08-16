import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
export type Item = {
  id: number;
  location: string;
  item_name: string;
  updated_at: string;
  is_checked: boolean | number;
};

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "location",
    header: "所在地",
  },
  {
    accessorKey: "item_name",
    header: "物品名",
  },
  {
    accessorKey: "updated_at",
    header: "更新日",
    cell: ({ row }) => {
      const rawDate = row.getValue("updated_at") as string;
      if (!rawDate) return "-";

      try {
        // date-fns を使って "YYYY/MM/DD HH:mm" 形式に変換
        const formatted = format(new Date(rawDate), "yyyy/MM/dd HH:mm:ss", {
          locale: ja,
        });
        return <span>{formatted}</span>;
      } catch (e) {
        return <span>{rawDate}</span>; // 万が一パースエラーになったらそのまま表示
      }
    },
  },
  {
    accessorKey: "is_checked",
    header: "チェック状態",
    cell: ({ row }) => {
      const isChecked = row.getValue("is_checked");
      return (
        <span
          className={isChecked ? "text-green-600 font-medium" : "text-gray-400"}
        >
          {isChecked ? "チェック済み" : "未チェック"}
        </span>
      );
    },
  },
];

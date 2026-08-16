import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3" // 左側の余白を調整
        >
          所在地
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "item_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          物品名
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          更新日
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rawDate = row.getValue("updated_at") as string;
      if (!rawDate) return "-";

      try {
        const formatted = format(new Date(rawDate), "yyyy/MM/dd HH:mm:ss", {
          locale: ja,
        });
        return <span>{formatted}</span>;
      } catch (e) {
        return <span>{rawDate}</span>;
      }
    },
  },
  {
    accessorKey: "is_checked",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          チェック状態
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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

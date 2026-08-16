import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { Item } from "@/types/item";
import { fetchItems, resetCheckedStatus } from "@/lib/api";

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);

  const getItems = useCallback(async () => {
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    getItems();
  }, [fetchItems]);

  const updateCheckedStatus = async () => {
    try {
      await resetCheckedStatus();
      getItems();
    } catch (e) {
      console.error(e);
    }
  };

  const downloadCsv = () => {
    if (items.length === 0) return;
    const header = "id,location,item_name,updated_at,is_checked\n";
    const rows = items
      .map((i) => {
        const checkedStr =
          i.is_checked === 1 || i.is_checked === true ? "true" : "false";
        const formatted = format(
          new Date(i.updated_at),
          "yyyy/MM/dd HH:mm:ss",
          { locale: ja }
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

  return {
    items,
    updateCheckedStatus,
    downloadCsv,
  };
}
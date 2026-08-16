import type { Item } from "@/types/item";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface ScanPayload {
  location: string;
  item_name: string;
}

interface ScanResponse {
  status: "updated" | "created" | string;
  [key: string]: any;
}

export async function insert(payload: ScanPayload): Promise<ScanResponse> {
  const response = await fetch(`${apiUrl}/api/scans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("保存失敗");
  }

  return response.json();
}

export async function fetchItems(): Promise<Item[]> {
  const response = await fetch(`${apiUrl}/api/scans`);
  if (!response.ok) throw new Error("データ取得に失敗しました");
  return response.json();
}

export async function resetCheckedStatus(): Promise<void> {
  const response = await fetch(`${apiUrl}/api/scans/checked`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!response.ok) throw new Error("更新に失敗しました");
}

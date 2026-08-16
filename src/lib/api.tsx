const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const insert = async (location: string, itemName: string) => {
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
  return result;
};

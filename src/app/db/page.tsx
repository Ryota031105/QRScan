import { DataTable } from "@/components/data-table";
import { columns } from "@/components/column";
import { useItems } from "@/hooks/useItem";
import { ItemActions } from "@/components/item-actions";

export default function Page() {
  const { items, updateCheckedStatus, downloadCsv } = useItems();

  return (
    <div>
      <ItemActions
        onDownloadCsv={downloadCsv}
        onResetChecked={updateCheckedStatus}
      />
      <DataTable columns={columns} data={items} />
    </div>
  );
}

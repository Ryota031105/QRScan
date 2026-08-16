import { DataTable } from "@/components/dbtable/data-table";
import { columns } from "@/components/dbtable/column";
import { useItems } from "@/hooks/useItem";
import { ItemActions } from "@/components/dbtable/item-actions";

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

import { DataTable } from "@/components/dbtable/data-table";
import { columns } from "@/components/dbtable/column";
import { useItems } from "@/hooks/useItem";

export default function Page() {
  const { items, updateCheckedStatus, downloadCsv } = useItems();

  return (
    <div>
      <DataTable
        columns={columns}
        data={items}
        onDownloadCsv={downloadCsv}
        onResetChecked={updateCheckedStatus}
      />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { RiResetLeftLine } from "react-icons/ri";
import { LuDownload } from "react-icons/lu";
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

interface ItemActionsProps {
  onDownloadCsv: () => void;
  onResetChecked: () => void;
}

export function ItemActions({
  onDownloadCsv,
  onResetChecked,
}: ItemActionsProps) {
  return (
    <div className="flex items-center justify-center py-4">
      <Button variant="outline" onClick={onDownloadCsv} className="mx-2">
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
        <AlertDialogContent className="max-w-lg">
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
            <AlertDialogAction onClick={onResetChecked}>
              リセット
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

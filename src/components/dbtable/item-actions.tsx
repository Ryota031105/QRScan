import { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AiOutlineBars } from "react-icons/ai";

interface ItemActionsProps {
  onDownloadCsv: () => void;
  onResetChecked: () => void;
}

export function ItemActions({
  onDownloadCsv,
  onResetChecked,
}: ItemActionsProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  return (
    <div className="flex items-center justify-center py-4">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline">
              <AiOutlineBars />
            </Button>
          }
        />
        <DropdownMenuContent className="w-auto" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuItem onClick={onDownloadCsv}>
              <LuDownload />
              CSVダウンロード
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                setIsAlertOpen(true);
              }}
            >
              <RiResetLeftLine />
              チェック状態のリセット
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
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
            <AlertDialogAction
              onClick={() => {
                onResetChecked();
                setIsAlertOpen(false);
              }}
            >
              リセット
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

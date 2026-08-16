import { Scanner } from "@/components/Scanner/scanner";
import { ScanAlert } from "@/components/Scanner/scan-alert";
import { ScanGuide } from "@/components/Scanner/scan-guide";
import { useScan } from "@/hooks/useScan";

export default function Page() {
  const { ref, showDialog, dialogContent, dialogTitle } = useScan();

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      <Scanner videoRef={ref} />
      <ScanAlert
        show={showDialog}
        title={dialogTitle}
        content={dialogContent}
      />
      <ScanGuide />
    </div>
  );
}

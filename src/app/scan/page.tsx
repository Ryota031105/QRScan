import { Scanner } from "@/components/scanner/scanner";
import { ScanAlert } from "@/components/scanner/scan-alert";
import { ScanGuide } from "@/components/scanner/scan-guide";
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

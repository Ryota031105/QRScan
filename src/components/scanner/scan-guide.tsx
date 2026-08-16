import { Scan } from "lucide-react";

export function ScanGuide() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6 z-10 -mt-6 pointer-events-none">
      <Scan color="#ffffff" strokeWidth={0.5} size={500} />
    </div>
  );
}

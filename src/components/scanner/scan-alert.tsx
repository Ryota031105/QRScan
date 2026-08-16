import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ScanAlertProps {
  show: boolean;
  title: string;
  content: string;
}

export function ScanAlert({ show, title, content }: ScanAlertProps) {
  return (
    <div
      className={`absolute top-0 left-0 right-0 z-50 p-4 transition-all duration-500 ease-out transform ${
        show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <Alert>
        <InfoIcon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="whitespace-pre-line">
          {content}
        </AlertDescription>
      </Alert>
    </div>
  );
}

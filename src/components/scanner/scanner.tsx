import type { RefObject } from "react";

interface ScannerProps {
  videoRef: RefObject<HTMLVideoElement | null>;
}

export function Scanner({ videoRef }: ScannerProps) {
  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

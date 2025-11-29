import { useEffect, useState } from "react";
import axios from "axios";
import type { QrResponse } from "../../Types/QrTypes";

interface QrCodeDisplayProps {
  qrApiUrl: string;
  onQrLoaded?: (qrCode: string) => void;
  onError?: (error: Error) => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  className?: string;
}

export const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({
  qrApiUrl,
  onQrLoaded,
  onError,
  loadingComponent = <div>Loading QR Code...</div>,
  errorComponent = <div>Failed to load QR Code</div>,
  className = ""
}) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchQr = async () => {
      try {
        const res = await axios.get<QrResponse>(qrApiUrl);
        setQrCode(res.data.qrCode);
        onQrLoaded?.(res.data.qrCode);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load QR code');
        setError(error);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQr();
  }, [qrApiUrl, onQrLoaded, onError]);

  if (isLoading) return <>{loadingComponent}</>;
  if (error) return <>{errorComponent}</>;
  if (!qrCode) return null;

  return (
    <div className={className}>
      <img 
        src={qrCode} 
        alt="QR Code" 
        className="w-full h-auto max-w-xs mx-auto"
      />
    </div>
  );
};

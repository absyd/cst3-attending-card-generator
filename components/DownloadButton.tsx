'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isImageLoaded: boolean;
}

export function DownloadButton({ canvasRef, isImageLoaded }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!canvasRef.current || !isImageLoaded) return;

    setIsDownloading(true);
    try {
      const canvas = canvasRef.current;

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Failed to generate image');
          setIsDownloading(false);
          return;
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cst-titans-attending-card-${Date.now()}.png`;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image');
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={!isImageLoaded || isDownloading}
      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 h-auto"
      size="lg"
    >
      <Download className="w-4 h-4 mr-2" />
      {isDownloading ? 'Generating...' : 'Download Card'}
    </Button>
  );
}

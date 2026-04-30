'use client';

import { useState, useRef } from 'react';
import { CardEditor } from '@/components/CardEditor';
import { ImageUploader } from '@/components/ImageUploader';
import { AdjustmentControls } from '@/components/AdjustmentControls';
import { DownloadButton } from '@/components/DownloadButton';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData);
    // Reset controls when new image is uploaded
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
    setRotation(0);
  };

  const handleResetControls = () => {
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
    setRotation(0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#0a1628] text-white py-6 sm:py-8 px-3 sm:px-4">
      {/* Decorative Elements - Hidden on mobile for performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-500/20 mb-4 sm:mb-6">
            <img src="/images/final-logo.png" className='h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-amber-400/50' alt="CST Tech Titans Logo" />
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 px-2">
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              CST TECH TITANS
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-amber-200/80 font-medium mb-1">Trophy Card Generator</p>
          <p className="text-sm sm:text-base text-blue-200/70 max-w-xl mx-auto mb-2 px-4">Upload your photo and create your exclusive tournament attending card</p>
          <p className="text-xs sm:text-sm text-blue-300/50">Crafted with passion by <a href="https://absyd.xyz" className="text-amber-400/80 hover:text-amber-300 transition-colors">Abu Sayed</a></p>
        </div>

        {/* Main Content - Stack on mobile, side-by-side on desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Preview Section - Full width on mobile */}
          <div className="flex flex-col order-1 lg:order-1">
            <div className="mb-3 sm:mb-4 flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
              <h2 className="text-base sm:text-lg font-semibold text-amber-100/90">Preview</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            </div>
            <div className="bg-[#0d1d35] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-500/20 shadow-2xl shadow-blue-950/50">
              <CardEditor
                uploadedImage={uploadedImage}
                scale={scale}
                offsetX={offsetX}
                offsetY={offsetY}
                rotation={rotation}
                forwardedRef={canvasRef}
              />
            </div>
          </div>

          {/* Controls Section - Full width on mobile */}
          <div className="flex flex-col gap-4 sm:gap-6 order-2 lg:order-2">
            {/* Upload Section */}
            <div className="bg-[#0d1d35] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-amber-500/20 shadow-lg">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                <h2 className="text-base sm:text-lg font-semibold text-amber-100/90">Upload Photo</h2>
              </div>
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>

            {/* Adjustment Controls */}
            <div className="bg-[#0d1d35] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-amber-500/20 shadow-lg flex-1">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                <h2 className="text-base sm:text-lg font-semibold text-amber-100/90">Adjust Image</h2>
              </div>
              <AdjustmentControls
                scale={scale}
                offsetX={offsetX}
                offsetY={offsetY}
                rotation={rotation}
                onScaleChange={setScale}
                onOffsetXChange={setOffsetX}
                onOffsetYChange={setOffsetY}
                onRotationChange={setRotation}
                isImageLoaded={!!uploadedImage}
              />
            </div>

            {/* Action Buttons - Horizontal on mobile if space permits */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={handleResetControls}
                disabled={!uploadedImage}
                className="flex-1 px-4 py-3 sm:py-3 rounded-lg font-semibold text-sm sm:text-base text-amber-100/80 border border-amber-500/30 bg-[#0d1d35] hover:bg-[#122542] hover:border-amber-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                Reset Controls
              </button>
              <div className="flex-1">
                <DownloadButton canvasRef={canvasRef} isImageLoaded={!!uploadedImage} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="h-px w-24 sm:w-32 mx-auto bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-4 sm:mb-6" />
          <p className="text-xs sm:text-sm text-blue-200/40 px-4">Create your exclusive CST Tech Titans tournament attending card</p>
        </div>
      </div>
    </main>
  );
}

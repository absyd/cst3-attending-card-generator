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
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            Tournament Card Customizer
          </h1>
          <p className="text-slate-300">Upload your photo and create your CST Tech Titans tournament attending card</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Canvas Preview */}
          <div className="flex flex-col justify-start">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">Preview</h2>
            </div>
            <CardEditor
              uploadedImage={uploadedImage}
              scale={scale}
              offsetX={offsetX}
              offsetY={offsetY}
              rotation={rotation}
              forwardedRef={canvasRef}
            />
          </div>

          {/* Right Column - Controls */}
          <div className="flex flex-col gap-6">
            {/* Upload Section */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">Upload Photo</h2>
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>

            {/* Adjustment Controls */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 flex-1">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">Adjust Image</h2>
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

            {/* Reset and Download Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleResetControls}
                disabled={!uploadedImage}
                className="w-full px-4 py-2 rounded font-semibold text-slate-200 border border-slate-600 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset Controls
              </button>
              <DownloadButton canvasRef={canvasRef} isImageLoaded={!!uploadedImage} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-400 text-sm">
          <p>Create your custom CST Tech Titans tournament attending card</p>
        </div>
      </div>
    </main>
  );
}

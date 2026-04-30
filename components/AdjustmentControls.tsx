'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface AdjustmentControlsProps {
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  onScaleChange: (value: number) => void;
  onOffsetXChange: (value: number) => void;
  onOffsetYChange: (value: number) => void;
  onRotationChange: (value: number) => void;
  isImageLoaded: boolean;
}

export function AdjustmentControls({
  scale,
  offsetX,
  offsetY,
  rotation,
  onScaleChange,
  onOffsetXChange,
  onOffsetYChange,
  onRotationChange,
  isImageLoaded,
}: AdjustmentControlsProps) {
  if (!isImageLoaded) {
    return (
      <div className="text-amber-200/50 text-center py-6 sm:py-8 px-4">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-500/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-amber-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm sm:text-base">Upload an image to enable adjustments</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Scale Control */}
      <div className="bg-[#0a1628]/50 rounded-lg p-3 sm:p-4 border border-amber-500/10">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <Label htmlFor="scale" className="text-sm sm:text-base text-amber-100/90 font-medium">
            Zoom
          </Label>
          <span className="text-sm sm:text-base text-amber-400 font-semibold tabular-nums">
            {scale.toFixed(2)}x
          </span>
        </div>
        <Slider
          id="scale"
          min={0.5}
          max={2.5}
          step={0.05}
          value={[scale]}
          onValueChange={(value) => onScaleChange(value[0])}
          className="w-full touch-none"
        />
        <p className="text-xs sm:text-sm text-blue-200/50 mt-2">Pinch to zoom on mobile</p>
      </div>

      {/* Position Controls - Grid on mobile for compactness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Horizontal Position */}
        <div className="bg-[#0a1628]/50 rounded-lg p-3 sm:p-4 border border-amber-500/10">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <Label htmlFor="offsetX" className="text-sm sm:text-base text-amber-100/90 font-medium">
              Horizontal
            </Label>
            <span className="text-sm sm:text-base text-amber-400 font-semibold tabular-nums">
              {offsetX}px
            </span>
          </div>
          <Slider
            id="offsetX"
            min={-200}
            max={200}
            step={5}
            value={[offsetX]}
            onValueChange={(value) => onOffsetXChange(value[0])}
            className="w-full touch-none"
          />
        </div>

        {/* Vertical Position */}
        <div className="bg-[#0a1628]/50 rounded-lg p-3 sm:p-4 border border-amber-500/10">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <Label htmlFor="offsetY" className="text-sm sm:text-base text-amber-100/90 font-medium">
              Vertical
            </Label>
            <span className="text-sm sm:text-base text-amber-400 font-semibold tabular-nums">
              {offsetY}px
            </span>
          </div>
          <Slider
            id="offsetY"
            min={-200}
            max={200}
            step={5}
            value={[offsetY]}
            onValueChange={(value) => onOffsetYChange(value[0])}
            className="w-full touch-none"
          />
        </div>
      </div>

      {/* Rotation Control */}
      <div className="bg-[#0a1628]/50 rounded-lg p-3 sm:p-4 border border-amber-500/10">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <Label htmlFor="rotation" className="text-sm sm:text-base text-amber-100/90 font-medium">
            Rotation
          </Label>
          <span className="text-sm sm:text-base text-amber-400 font-semibold tabular-nums">
            {rotation}°
          </span>
        </div>
        <Slider
          id="rotation"
          min={0}
          max={360}
          step={1}
          value={[rotation]}
          onValueChange={(value) => onRotationChange(value[0])}
          className="w-full touch-none"
        />
        <div className="flex justify-between mt-2">
          <button
            onClick={() => onRotationChange(0)}
            className="text-xs text-blue-300/60 hover:text-amber-400 transition-colors"
          >
            Reset to 0°
          </button>
          <button
            onClick={() => onRotationChange(rotation === 90 ? 0 : 90)}
            className="text-xs text-blue-300/60 hover:text-amber-400 transition-colors"
          >
            {rotation === 90 ? 'Clear' : 'Rotate 90°'}
          </button>
        </div>
      </div>
    </div>
  );
}

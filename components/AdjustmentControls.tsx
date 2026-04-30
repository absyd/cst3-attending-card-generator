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
      <div className="text-slate-400 text-center py-8">
        Upload an image to adjust controls
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scale Control */}
      <div>
        <Label htmlFor="scale" className="text-slate-200">
          Zoom: {scale.toFixed(2)}x
        </Label>
        <Slider
          id="scale"
          min={0.5}
          max={2.5}
          step={0.05}
          value={[scale]}
          onValueChange={(value) => onScaleChange(value[0])}
          className="mt-2"
        />
        <div className="text-xs text-slate-400 mt-1">Zoom in or out to fit your photo</div>
      </div>

      {/* Horizontal Position Control */}
      <div>
        <Label htmlFor="offsetX" className="text-slate-200">
          Horizontal Position: {offsetX}px
        </Label>
        <Slider
          id="offsetX"
          min={-200}
          max={200}
          step={5}
          value={[offsetX]}
          onValueChange={(value) => onOffsetXChange(value[0])}
          className="mt-2"
        />
        <div className="text-xs text-slate-400 mt-1">Move left or right</div>
      </div>

      {/* Vertical Position Control */}
      <div>
        <Label htmlFor="offsetY" className="text-slate-200">
          Vertical Position: {offsetY}px
        </Label>
        <Slider
          id="offsetY"
          min={-200}
          max={200}
          step={5}
          value={[offsetY]}
          onValueChange={(value) => onOffsetYChange(value[0])}
          className="mt-2"
        />
        <div className="text-xs text-slate-400 mt-1">Move up or down</div>
      </div>

      {/* Rotation Control */}
      <div>
        <Label htmlFor="rotation" className="text-slate-200">
          Rotation: {rotation}°
        </Label>
        <Slider
          id="rotation"
          min={0}
          max={360}
          step={1}
          value={[rotation]}
          onValueChange={(value) => onRotationChange(value[0])}
          className="mt-2"
        />
        <div className="text-xs text-slate-400 mt-1">Rotate your image</div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface CardEditorProps {
  uploadedImage: string | null;
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  forwardedRef?: React.RefObject<HTMLCanvasElement | null>;
  onOffsetXChange?: (value: number) => void;
  onOffsetYChange?: (value: number) => void;
  onScaleChange?: (value: number) => void; // ✅ NEW
}

export function CardEditor({
  uploadedImage,
  scale,
  offsetX,
  offsetY,
  rotation,
  forwardedRef,
  onOffsetXChange,
  onOffsetYChange,
  onScaleChange,
}: CardEditorProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = forwardedRef || internalCanvasRef;

  const templateImageRef = useRef<HTMLImageElement | null>(null);
  const uploadedImageRef = useRef<HTMLImageElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  const pinchStartRef = useRef<null | {
    distance: number;
    scale: number;
  }>(null);

  // -----------------------------
  // LOAD TEMPLATE
  // -----------------------------
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      templateImageRef.current = img;
      drawCanvas();
    };
    img.src = '/images/tournament-card.png';
  }, []);

  // -----------------------------
  // LOAD USER IMAGE
  // -----------------------------
  useEffect(() => {
    if (!uploadedImage) {
      uploadedImageRef.current = null;
      drawCanvas();
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      uploadedImageRef.current = img;
      drawCanvas();
    };
    img.src = uploadedImage;
  }, [uploadedImage]);

  // -----------------------------
  // REDRAW
  // -----------------------------
  useEffect(() => {
    drawCanvas();
  }, [scale, offsetX, offsetY, rotation]);

  // -----------------------------
  // COORDINATES
  // -----------------------------
  const getCanvasCoordinates = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  }, [canvasRef]);

  // -----------------------------
  // DRAG
  // -----------------------------
  const startDrag = (clientX: number, clientY: number) => {
    if (!uploadedImageRef.current) return;

    setIsDragging(true);

    dragStartRef.current = {
      x: clientX,
      y: clientY,
      offsetX,
      offsetY,
    };
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (!isDragging || !onOffsetXChange || !onOffsetYChange) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleFactor = canvas.width / rect.width;

    const dx = (clientX - dragStartRef.current.x) * scaleFactor;
    const dy = (clientY - dragStartRef.current.y) * scaleFactor;

    onOffsetXChange(Math.round(dragStartRef.current.offsetX + dx));
    onOffsetYChange(Math.round(dragStartRef.current.offsetY + dy));
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  // -----------------------------
  // PINCH HELPERS
  // -----------------------------
  const getDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // -----------------------------
  // GLOBAL END FIX
  // -----------------------------
  useEffect(() => {
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);

    return () => {
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchend', endDrag);
    };
  }, []);

  // -----------------------------
  // DRAW
  // -----------------------------
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !templateImageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const template = templateImageRef.current;
    const dpr = window.devicePixelRatio || 1;

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    canvas.width = template.naturalWidth * dpr;
    canvas.height = template.naturalHeight * dpr;

    ctx.scale(dpr, dpr);

    ctx.drawImage(template, 0, 0, template.naturalWidth, template.naturalHeight);

    if (!uploadedImageRef.current) return;

    const userImg = uploadedImageRef.current;

    const circleX = 370;
    const circleY = 630;
    const circleRadius = template.naturalWidth * 0.24;

    ctx.save();

    ctx.beginPath();
    ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
    ctx.clip();

    const w = userImg.naturalWidth * scale;
    const h = userImg.naturalHeight * scale;

    const x = circleX - w / 2 + offsetX;
    const y = circleY - h / 2 + offsetY;

    if (rotation !== 0) {
      ctx.translate(circleX, circleY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-circleX, -circleY);
    }

    ctx.drawImage(userImg, x, y, w, h);

    ctx.restore();
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="relative flex justify-center items-center bg-[#060d1a] rounded-lg p-4 select-none">
      <canvas
        ref={canvasRef}
        className={`max-w-full h-auto rounded-lg shadow-2xl ${
          uploadedImage ? 'cursor-grab active:cursor-grabbing' : ''
        } ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{
          maxHeight: '500px',
          touchAction: 'pan-x pan-y', // ✅ FIXED
        }}
        draggable={false}

        // MOUSE
        onMouseDown={(e) => {
          e.preventDefault();
          startDrag(e.clientX, e.clientY);
        }}
        onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}

        // TOUCH START
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            const t = e.touches[0];
            startDrag(t.clientX, t.clientY);
          }

          if (e.touches.length === 2) {
            pinchStartRef.current = {
              distance: getDistance(e.touches),
              scale: scale,
            };
          }
        }}

        // TOUCH MOVE
        onTouchMove={(e) => {
          if (e.touches.length === 1 && isDragging) {
            const t = e.touches[0];
            moveDrag(t.clientX, t.clientY);
          }

          if (e.touches.length === 2 && pinchStartRef.current) {
            e.preventDefault();

            const newDistance = getDistance(e.touches);
            const scaleChange = newDistance / pinchStartRef.current.distance;

            let newScale = pinchStartRef.current.scale * scaleChange;

            // optional clamp
            newScale = Math.max(0.2, Math.min(newScale, 5));

            onScaleChange?.(newScale);
          }
        }}

        // TOUCH END
        onTouchEnd={() => {
          endDrag();
          pinchStartRef.current = null;
        }}
      />

      {uploadedImage && !isDragging && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1.5 rounded-full pointer-events-none">
          Drag or pinch to adjust
        </div>
      )}
    </div>
  );
}
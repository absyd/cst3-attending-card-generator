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
}: CardEditorProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = forwardedRef || internalCanvasRef;

  const templateImageRef = useRef<HTMLImageElement | null>(null);
  const uploadedImageRef = useRef<HTMLImageElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

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
  // COORDINATE CONVERSION
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
  // OPTIONAL HIT AREA CHECK
  // -----------------------------
  const isPointInPhotoArea = useCallback((x: number, y: number) => {
    if (!templateImageRef.current) return false;

    const circleX = 370;
    const circleY = 630;
    const circleRadius = templateImageRef.current.naturalWidth * 0.24;

    const dx = x - circleX;
    const dy = y - circleY;

    return dx * dx + dy * dy <= circleRadius * circleRadius;
  }, []);

  // -----------------------------
  // DRAG START
  // -----------------------------
  const startDrag = useCallback((clientX: number, clientY: number) => {
    if (!uploadedImageRef.current) return;

    const coords = getCanvasCoordinates(clientX, clientY);

    // 🔴 Toggle this if you want free drag everywhere
    // if (!isPointInPhotoArea(coords.x, coords.y)) return;

    setIsDragging(true);

    dragStartRef.current = {
      x: clientX,
      y: clientY,
      offsetX,
      offsetY,
    };
  }, [getCanvasCoordinates, isPointInPhotoArea, offsetX, offsetY]);

  // -----------------------------
  // DRAG MOVE
  // -----------------------------
  const moveDrag = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !onOffsetXChange || !onOffsetYChange) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleFactor = canvas.width / rect.width;

    const dx = (clientX - dragStartRef.current.x) * scaleFactor;
    const dy = (clientY - dragStartRef.current.y) * scaleFactor;

    onOffsetXChange(Math.round(dragStartRef.current.offsetX + dx));
    onOffsetYChange(Math.round(dragStartRef.current.offsetY + dy));
  }, [isDragging, onOffsetXChange, onOffsetYChange, canvasRef]);

  // -----------------------------
  // END DRAG
  // -----------------------------
  const endDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  // -----------------------------
  // GLOBAL MOUSE UP FIX
  // -----------------------------
  useEffect(() => {
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);

    return () => {
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchend', endDrag);
    };
  }, [endDrag]);

  // -----------------------------
  // DRAW CANVAS
  // -----------------------------
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !templateImageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const template = templateImageRef.current;
    const dpr = window.devicePixelRatio || 1;

    // FIX: reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    canvas.width = template.naturalWidth * dpr;
    canvas.height = template.naturalHeight * dpr;

    ctx.scale(dpr, dpr);

    // Draw template
    ctx.drawImage(template, 0, 0, template.naturalWidth, template.naturalHeight);

    if (!uploadedImageRef.current) return;

    const userImg = uploadedImageRef.current;

    const circleX = 370;
    const circleY = 630;
    const circleRadius = template.naturalWidth * 0.24;

    ctx.save();

    // Clip circle
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
        style={{ maxHeight: '500px', touchAction: 'none' }}
        draggable={false}

        // MOUSE
        onMouseDown={(e) => {
          e.preventDefault();
          startDrag(e.clientX, e.clientY);
        }}
        onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}

        // TOUCH
        onTouchStart={(e) => {
          e.preventDefault();
          const t = e.touches[0];
          startDrag(t.clientX, t.clientY);
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          const t = e.touches[0];
          moveDrag(t.clientX, t.clientY);
        }}
        onTouchEnd={endDrag}
      />

      {uploadedImage && !isDragging && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1.5 rounded-full pointer-events-none">
          Drag photo to position
        </div>
      )}
    </div>
  );
}
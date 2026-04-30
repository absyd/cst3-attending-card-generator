'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface CardEditorProps {
  uploadedImage: string | null;
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  forwardedRef?: React.RefObject<HTMLCanvasElement>;
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  // Load template image on mount
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      templateImageRef.current = img;
      drawCanvas();
    };
    img.src = '/images/tournament-card.png';
  }, []);

  // Load uploaded image
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

  // Redraw canvas when controls change
  useEffect(() => {
    drawCanvas();
  }, [scale, offsetX, offsetY, rotation]);

  // Convert screen coordinates to canvas coordinates
  const getCanvasCoordinates = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, [canvasRef]);

  // Check if point is within the circular photo area
  const isPointInPhotoArea = useCallback((x: number, y: number) => {
    if (!templateImageRef.current) return false;

    const templateImg = templateImageRef.current;
    const circleX = 370;
    const circleY = 630;
    const circleRadius = templateImg.naturalWidth * 0.24;

    const distance = Math.sqrt(Math.pow(x - circleX, 2) + Math.pow(y - circleY, 2));
    return distance <= circleRadius;
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (!uploadedImageRef.current || !onOffsetXChange || !onOffsetYChange) return;

    const coords = getCanvasCoordinates(clientX, clientY);

    // Only start drag if clicking within the photo area
    if (!isPointInPhotoArea(coords.x, coords.y)) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      offsetX: offsetX,
      offsetY: offsetY,
    };
  }, [getCanvasCoordinates, isPointInPhotoArea, offsetX, offsetY, onOffsetXChange, onOffsetYChange]);

  // Handle drag move
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !onOffsetXChange || !onOffsetYChange) return;

    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    // Convert screen delta to canvas offset delta
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      // canvas.width is the natural width (with DPR), rect.width is display width
      const scaleFactor = (canvas.width / (window.devicePixelRatio || 1)) / rect.width;

      onOffsetXChange(Math.round(dragStartRef.current.offsetX + deltaX * scaleFactor));
      onOffsetYChange(Math.round(dragStartRef.current.offsetY + deltaY * scaleFactor));
    }
  }, [isDragging, onOffsetXChange, onOffsetYChange, canvasRef]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  }, [handleDragStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  }, [handleDragMove]);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const handleMouseLeave = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
    }
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  }, [handleDragMove, isDragging]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !templateImageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on template image
    const templateImg = templateImageRef.current;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = templateImg.naturalWidth * dpr;
    canvas.height = templateImg.naturalHeight * dpr;
    ctx.scale(dpr, dpr);

    // Draw template background
    ctx.drawImage(templateImg, 0, 0, templateImg.naturalWidth, templateImg.naturalHeight);

    // Draw user's image in the circular area if uploaded
    if (uploadedImageRef.current) {
      const userImg = uploadedImageRef.current;
      const canvasWidth = templateImg.naturalWidth;
      const canvasHeight = templateImg.naturalHeight;

      // Calculate circle parameters
      // do not change the paremeters below 
      const circleX = 370;
      // do not change the paremeters below 
      const circleY = 630;
      // do not change the paremeters below 
      const circleRadius = canvasWidth * 0.24;

      // Save context state
      ctx.save();

      // Create circular clipping region
      ctx.beginPath();
      ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
      ctx.clip();

      // Calculate image dimensions and position
      const scaledWidth = userImg.naturalWidth * scale;
      const scaledHeight = userImg.naturalHeight * scale;

      // Calculate position (centered by default, with offset)
      const posX = circleX - scaledWidth / 2 + offsetX;
      const posY = circleY - scaledHeight / 2 + offsetY;

      // Apply rotation if needed
      if (rotation !== 0) {
        ctx.translate(circleX, circleY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-circleX, -circleY);
      }

      // Draw the image
      ctx.drawImage(userImg, posX, posY, scaledWidth, scaledHeight);

      // Restore context state
      ctx.restore();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex justify-center items-center bg-[#060d1a] rounded-lg p-2 sm:p-4 select-none touch-none ${
        uploadedImage ? 'cursor-grab active:cursor-grabbing' : ''
      } ${isDragging ? 'cursor-grabbing' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto shadow-2xl rounded-lg"
        style={{ maxHeight: '500px', touchAction: 'none' }}
        draggable={false}
      />
      {uploadedImage && (
        <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs sm:text-sm px-3 py-1.5 rounded-full pointer-events-none transition-opacity duration-200 ${isDragging ? 'opacity-0' : 'opacity-100'}`}>
          Drag photo to position
        </div>
      )}
    </div>
  );
}

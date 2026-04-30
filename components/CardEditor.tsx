'use client';

import { useEffect, useRef, useState } from 'react';

interface CardEditorProps {
  uploadedImage: string | null;
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  forwardedRef?: React.RefObject<HTMLCanvasElement>;
}

export function CardEditor({
  uploadedImage,
  scale,
  offsetX,
  offsetY,
  rotation,
  forwardedRef,
}: CardEditorProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = forwardedRef || internalCanvasRef;
  const templateImageRef = useRef<HTMLImageElement | null>(null);
  const uploadedImageRef = useRef<HTMLImageElement | null>(null);

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
    <div className="flex justify-center items-center bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg p-4">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto shadow-2xl rounded"
        style={{ maxHeight: '600px' }}
      />
    </div>
  );
}

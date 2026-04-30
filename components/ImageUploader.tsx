'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void;
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Read file and convert to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setPreview(imageData);
      onImageUpload(imageData);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <div className="border-2 border-dashed border-blue-400 rounded-lg p-6 text-center cursor-pointer hover:bg-slate-800 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="text-slate-300">
          <div className="text-lg font-semibold mb-2">Click to upload your photo</div>
          <div className="text-sm text-slate-400">PNG, JPG, WebP accepted</div>
        </div>
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-sm text-slate-400 mb-2">Preview:</p>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-32 object-cover rounded border border-slate-600"
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Image
          </Button>
        </div>
      )}
    </div>
  );
}

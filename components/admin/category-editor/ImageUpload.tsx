'use client';

import { useState } from 'react';
import { CLOUDINARY_CONFIG } from '@/lib/cloudinary.config';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  placeholder?: string;
  folder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  placeholder = 'Enter image URL or upload',
  folder = 'categories',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('folder', `${CLOUDINARY_CONFIG.folder}/${folder}`);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      onChange(data.secure_url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="image-upload-field">
      <label className="field-label">
        {label}
        <span className="tooltip" title="Upload an image or enter URL">?</span>
      </label>

      <div className="input-row">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="url-input"
        />
        <label className={`btn-upload ${uploading ? 'uploading' : ''}`}>
          {uploading ? 'Uploading...' : 'Upload'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            hidden
          />
        </label>
        {value && (
          <button type="button" className="btn-clear" onClick={handleClear}>
            Clear
          </button>
        )}
      </div>

      {error && <div className="error-msg">{error}</div>}

      {value && (
        <div className="image-preview">
          <img src={value} alt="Preview" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }} />
        </div>
      )}

      <style jsx>{`
        .image-upload-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .tooltip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          background: #e5e7eb;
          border-radius: 50%;
          font-size: 10px;
          color: #6b7280;
          cursor: help;
          margin-left: 4px;
        }

        .input-row {
          display: flex;
          gap: 8px;
        }

        .url-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .url-input:focus {
          outline: none;
          border-color: #FE4A64;
          box-shadow: 0 0 0 3px rgba(254, 74, 100, 0.1);
        }

        .btn-upload {
          padding: 10px 16px;
          background: #FE4A64;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s;
        }

        .btn-upload:hover:not(.uploading) {
          background: #e5435b;
        }

        .btn-upload.uploading {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .btn-clear {
          padding: 10px 12px;
          background: #f3f4f6;
          color: #6b7280;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-clear:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .error-msg {
          font-size: 12px;
          color: #dc2626;
        }

        .image-preview {
          margin-top: 8px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .image-preview img {
          max-width: 100%;
          max-height: 200px;
          object-fit: contain;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

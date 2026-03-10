'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageDropzoneProps {
  files: File[]
  onChange: (next: File[]) => void
}

export function ImageDropzone({ files, onChange }: ImageDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange([...files, ...acceptedFiles])
    },
    [files, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 10,
  })

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`rounded-2xl border border-dashed p-6 text-center transition ${
          isDragActive
            ? 'border-[var(--brand)] bg-[var(--brand)]/10'
            : 'border-[var(--border)] bg-[var(--bg-soft)]/40'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto mb-2 h-6 w-6 text-[var(--text-muted)]" />
        <p className="text-sm font-medium text-[var(--text)]">
          Drag assets here or click to upload
        </p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          JPG, PNG, WebP up to 10 files
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2"
            >
              <p className="truncate text-sm text-[var(--text)]">{file.name}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(files.filter((_, i) => i !== index))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

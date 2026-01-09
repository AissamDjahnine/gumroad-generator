"use client";

import * as React from "react";
import { useDropzone, FileRejection } from "react-dropzone";

const MAX_BYTES = 20 * 1024 * 1024; // 20MB

function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let value = bytes;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export type PdfDropzoneProps = {
  file: File | null;
  onFileSelected: (file: File | null) => void;
};

export default function PdfDropzone({ file, onFileSelected }: PdfDropzoneProps) {
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = React.useCallback(
  (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);

      if (fileRejections?.length) {
        const first = fileRejections[0];
        const msg =
          first?.errors?.[0]?.message ||
          "File rejected. Please upload a valid PDF under 20MB.";
        setError(msg);
        onFileSelected(null);
        return;
      }

      const f = acceptedFiles?.[0] ?? null;
      if (!f) {
        onFileSelected(null);
        return;
      }

      // Extra safety checks
      if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
        setError("Only PDF files are allowed.");
        onFileSelected(null);
        return;
      }

      if (f.size > MAX_BYTES) {
        setError("File is too large. Max 20MB.");
        onFileSelected(null);
        return;
      }

      onFileSelected(f);
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true, // we'll trigger open() ourselves to keep UX consistent
    accept: { "application/pdf": [".pdf"] },
    maxSize: MAX_BYTES,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={[
          "rounded-2xl border-2 border-dashed p-10 text-center transition",
          isDragActive ? "border-zinc-900 bg-zinc-50" : "border-zinc-300",
        ].join(" ")}
      >
        <input {...getInputProps()} />

        <p className="text-sm text-zinc-600">
          Drag and drop your PDF here, or{" "}
          <button
            type="button"
            onClick={open}
            className="text-zinc-900 underline underline-offset-4"
          >
            browse
          </button>
        </p>
        <p className="mt-2 text-xs text-zinc-500">PDF only • Max 20MB</p>

        <button
          type="button"
          onClick={open}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Select PDF
        </button>

        {file ? (
          <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-zinc-900">{file.name}</div>
                <div className="mt-1 text-xs text-zinc-500">{formatBytes(file.size)}</div>
              </div>
              <button
                type="button"
                onClick={() => onFileSelected(null)}
                className="text-xs text-zinc-600 hover:text-zinc-900 underline underline-offset-4"
              >
                Remove
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
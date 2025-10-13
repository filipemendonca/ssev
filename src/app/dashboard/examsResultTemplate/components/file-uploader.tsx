"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
}

export function FileUploader({ value, onChange }: Readonly<FileUploaderProps>) {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0];
      if (!uploadedFile) return;

      if (uploadedFile.size > 6 * 1024 * 1024) {
        alert("O arquivo deve ter no máximo 6 MB");
        return;
      }

      onChange?.(uploadedFile);
      simulateUpload();
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  const simulateUpload = () => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
      }
    }, 20);
  };

  const removeFile = () => {
    onChange?.(null);
    setProgress(0);
  };

  return (
    <div className="flex flex-col gap-4 w-full p-4 border rounded-xl shadow-sm bg-white">
      {value ? (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-800">{value.name}</span>
              <span className="text-sm text-gray-500">
                ({(value.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              className="text-gray-500 hover:text-red-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <Progress
            value={progress}
            className="h-2 bg-gray-200 [&>div]:bg-cyan-600"
          />

          <p className="text-xs text-gray-500 text-right">
            {progress < 100 ? `${progress}%` : "Upload concluído!"}
          </p>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-cyan-600"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-3 w-8 h-8 text-gray-500" />
          <p className="text-gray-700 font-medium">
            Arraste o arquivo desejado aqui
          </p>
          <p className="text-sm text-gray-500 mt-1">
            ou{" "}
            <span className="text-cyan-600 underline">Selecione o arquivo</span>
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 text-left mt-2">
        • Envie apenas um arquivo: <strong>.docx</strong>
      </p>
      <p className="text-xs text-gray-500 text-left mt-2">
        • Tamanho máximo: <strong>6 MB</strong>
      </p>
    </div>
  );
}

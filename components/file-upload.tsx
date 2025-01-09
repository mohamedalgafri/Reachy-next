// components/file-upload.tsx
"use client";

import { X, FileUp } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface FileUploadProps {
  endpoint: string;
  value?: string;
  onChange: (url?: string) => void;
  accept?: string;
}

export function FileUpload({
  endpoint,
  value,
  onChange,
  accept = ".pdf,.doc,.docx"
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      
      // إضافة نوع الملف
      const isDocument = file.name.toLowerCase().match(/\.(pdf|doc|docx)$/);
      formData.append("type", isDocument ? "file" : "image");
      formData.append("path", "documents"); // أو أي مجلد آخر تريده

      const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "فشل رفع الملف");
      }

      const data = await response.json();
      onChange(data.secure_url);
    } catch (error: any) {
      console.error("خطأ في رفع الملف:", error);
      // يمكنك إضافة toast هنا لإظهار رسالة الخطأ للمستخدم
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onChange(undefined); // تغيير "" إلى undefined ليتوافق مع التايبات
  };

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline truncate max-w-[200px]"
          >
            {value.split("/").pop()}
          </a>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label className="w-full cursor-pointer">
            <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg hover:bg-muted/30 transition">
              <FileUp className="h-6 w-6 mb-2 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                {isUploading ? (
                  "جاري رفع الملف..."
                ) : (
                  <>
                    <span>اضغط لرفع الملف</span>
                    <br />
                    <span className="text-xs">
                      PDF, DOC, DOCX (حد أقصى 10MB)
                    </span>
                  </>
                )}
              </div>
            </div>
            <input
              type="file"
              accept={accept}
              onChange={handleUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}
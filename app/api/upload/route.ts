// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_FORMATS = {
  image: ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"],
  document: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"],
  raw: ["txt", "json", "csv"]
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const path = formData.get("path") as string;
    
    if (!file) {
      return NextResponse.json(
        { error: "لم يتم تحديد ملف" },
        { status: 400 }
      );
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    let resourceType = "auto";

    if (ALLOWED_FORMATS.document.includes(extension!)) {
      resourceType = "raw";
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadOptions = {
      folder: path || "site-content",
      resource_type: resourceType,
      allowed_formats: [
        ...ALLOWED_FORMATS.image,
        ...ALLOWED_FORMATS.document,
        ...ALLOWED_FORMATS.raw
      ],
    };

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { 
        error: "فشل في رفع الملف", 
        details: error.message || error 
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb'
  },
};
"use client"
import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <h1 className="text-6xl font-bold">404</h1>
      <Image
        src="/_static/illustrations/rocket-crashed.svg"
        alt="404"
        width={400}
        height={400}
        className="pointer-events-none mb-5 mt-6"
        // dark:invert"
      />
      <p className="text-balance px-4 text-center text-xl font-medium">
        الصفحة غير موجودة . الرجوع الى {" "}
        <Link
          href="/"
          className="underline underline-offset-4 text-gray-900 hover:text-blue-500"
        >
          الصفحة الرئسية
        </Link>
      </p>
    </div>
  );
}
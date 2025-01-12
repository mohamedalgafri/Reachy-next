// app/[locale]/auth/login/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function LoginPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const session = await auth();

  // التحقق من تسجيل الدخول وتحويل مباشر للوحة التحكم
  if (session?.user) {
    redirect(`/${locale}/admin`);
  }

  // عرض نموذج تسجيل الدخول فقط للمستخدمين غير المسجلين
  const LoginForm = (await import('@/components/auth/login-form')).default;
  return <LoginForm />;
}
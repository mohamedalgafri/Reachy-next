// components/auth/admin-guard.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

export async function AdminGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/auth/login");
    }

    if (session.user.role !== UserRole.ADMIN) {
        redirect("/auth/login?error=unauthorized");
    }

    return <>{children}</>;
}
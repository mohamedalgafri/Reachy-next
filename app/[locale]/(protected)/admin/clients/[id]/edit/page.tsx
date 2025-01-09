// app/admin/services/[serviceId]/edit/page.tsx
import { ClientForm } from "@/components/forms/ClientForm";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface ServiceEditPageProps {
  params: {
    id: string;
  }
}

export default async function ClientEditPage({ params }: ServiceEditPageProps) {
  const client = await db.client.findUnique({
    where: {
      id: Number(params.id)
    }
  });

  if (!client) {
    notFound();
  }

  return (
    <div className="p-6">
      <ClientForm 
        initialData={client} 
        mode="edit" 
      />
    </div>
  );
}
// app/admin/services/[serviceId]/edit/page.tsx
import { ServiceForm } from "@/components/forms/ServiceForm";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface ServiceEditPageProps {
  params: {
    serviceId: string;
  }
}

export default async function ServiceEditPage({ params }: ServiceEditPageProps) {
  const service = await db.service.findUnique({
    where: {
      id: Number(params.serviceId)
    }
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="p-6">
      <ServiceForm 
        initialData={service} 
        mode="edit" 
      />
    </div>
  );
}
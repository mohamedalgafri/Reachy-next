// app/(protected)/admin/features/[featureId]/edit/page.tsx
import { FeatureForm } from "@/components/forms/FeatureForm";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface FeatureEditPageProps {
  params: {
    featureId: string;
  };
}

export default async function FeatureEditPage({ params }: FeatureEditPageProps) {
  const feature = await db.feature.findUnique({
    where: {
      id: Number(params.featureId)
    }
  });

  if (!feature) {
    notFound();
  }

  return (
    <div className="p-6">
      <FeatureForm 
        initialData={feature} 
        mode="edit" 
      />
    </div>
  );
}
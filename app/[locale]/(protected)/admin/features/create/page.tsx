// app/(protected)/admin/features/create/page.tsx
import { FeatureForm } from "@/components/forms/FeatureForm";

export default function CreateFeaturePage() {
  return (
    <div className="p-6">
      <FeatureForm mode="create" />
    </div>
  );
}

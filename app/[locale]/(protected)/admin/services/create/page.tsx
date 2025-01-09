// app/admin/services/create/page.tsx
import { ServiceForm } from "@/components/forms/ServiceForm";

export default function CreateServicePage() {
  return (
    <div className="p-6">
      <ServiceForm mode="create" />
    </div>
  );
}
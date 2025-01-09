// app/admin/services/create/page.tsx
import { ClientForm } from "@/components/forms/ClientForm";
import { ServiceForm } from "@/components/forms/ServiceForm";

export default function CreateClientPage() {
  return (
    <div className="p-6">
      <ClientForm mode="create" />
    </div>
  );
}
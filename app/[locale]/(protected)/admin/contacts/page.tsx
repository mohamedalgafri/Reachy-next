// app/(protected)/admin/contacts/page.tsx
import { columns } from "./columns";
import { getContacts } from "@/actions/contact";
import { format } from 'date-fns';
import { ContactTable } from "./contact-table";

export default async function ContactsPage() {
  const contacts = await getContacts();

  const formattedContacts = contacts.map(contact => ({
    ...contact,
    createdAt: new Date(contact.createdAt).toISOString(),
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">رسائل التواصل</h1>
          <p className="text-sm text-muted-foreground">
            إدارة رسائل التواصل الواردة من العملاء
          </p>
        </div>
      </div>
      <ContactTable initialContacts={formattedContacts} />
    </div>
  );
}
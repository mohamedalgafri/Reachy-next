// app/(protected)/admin/contacts/page.tsx
import { columns } from "./columns";
import { getContacts } from "@/actions/contact";
import { format } from 'date-fns';
import { ContactTable } from "./contact-table";
import { getLocale } from 'next-intl/server';

export default async function ContactsPage() {
  const contacts = await getContacts();
  const locale = await getLocale();

  const formattedContacts = contacts.map(contact => ({
    ...contact,
    createdAt: new Date(contact.createdAt).toISOString(),
  }));

  const pageTitle = {
    ar: "رسائل التواصل",
    en: "Contact Messages"
  };

  const pageDescription = {
    ar: "إدارة رسائل التواصل الواردة من العملاء",
    en: "Manage incoming contact messages from customers"
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <h1 className="text-2xl font-bold">
            {locale === 'ar' ? pageTitle.ar : pageTitle.en}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'ar' ? pageDescription.ar : pageDescription.en}
          </p>
        </div>
      </div>
      <ContactTable initialContacts={formattedContacts} />
    </div>
  );
}
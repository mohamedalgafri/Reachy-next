// app/(protected)/admin/contacts/contact-table.tsx
'use client';

import { useState } from 'react';
import { Contact, columns } from "./columns";
import { DataTable } from "./data-table";
import { ContactDialog } from '@/components/ContactDialog';

interface ContactTableProps {
  initialContacts: Contact[];
}

export function ContactTable({ initialContacts }: ContactTableProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const contacts = initialContacts.map(contact => ({
    ...contact,
    onView: handleViewContact
  }));

  return (
    <>
      <DataTable columns={columns} data={contacts} />
      
      {selectedContact && (
        <ContactDialog
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}
    </>
  );
}
'use client';

import { useState } from 'react';
import { Contact, columns } from "./columns";
import { DataTable } from "./data-table";
import { ContactDialog } from '@/components/ContactDialog';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteContact } from "@/actions/contact";
import { useLocale } from 'next-intl';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface ContactTableProps {
  initialContacts: Contact[];
}

export function ContactTable({ initialContacts }: ContactTableProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setShowDeleteAlert(true);
  };

  const handleDelete = async () => {
    if (!contactToDelete) return;
    try {
      setLoading(true);
      const result = await deleteContact(contactToDelete.id);
      if (result.success) {
        toast.success(locale === 'ar' ? "تم حذف الرسالة بنجاح" : "Message deleted successfully");
        router.refresh();
        setShowDeleteAlert(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(locale === 'ar' ? "حدث خطأ أثناء حذف الرسالة" : "Error deleting message");
    } finally {
      setLoading(false);
      setContactToDelete(null);
    }
  };

  const contacts = initialContacts.map(contact => ({
    ...contact,
    onView: handleViewContact,
    onDelete: handleDeleteClick
  }));

  return (
    <>
      <AlertDialog 
        open={showDeleteAlert} 
        onOpenChange={(open) => {
          if (!loading) {
            setShowDeleteAlert(open);
            if (!open) setContactToDelete(null);
          }
        }}
      >
        <AlertDialogContent onInteractOutside={e => {
          if (loading) {
            e.preventDefault();
          }
        }}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {locale === 'ar' ? "تأكيد حذف الرسالة" : "Confirm Message Deletion"}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <p>
                {locale === 'ar' 
                  ? "هل أنت متأكد من حذف الرسالة التالية:" 
                  : "Are you sure you want to delete this message:"}
              </p>
              <div className="font-medium text-black dark:text-white">
                {contactToDelete?.subject}
              </div>
              <div className="font-medium text-muted-foreground">
                {contactToDelete?.name}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={loading}>
              {locale === 'ar' ? "إلغاء" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              {loading 
                ? (locale === 'ar' ? "جاري الحذف..." : "Deleting...") 
                : (locale === 'ar' ? "تأكيد الحذف" : "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
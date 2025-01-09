// components/ContactDialog.tsx
import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { Contact } from "@/app/[locale]/(protected)/admin/contacts/columns"
import { markContactAsRead } from "@/actions/contact"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from './ui/button';
import { Copy, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ContactDialogProps {
  contact: Contact;
  onClose: () => void;
}

export function ContactDialog({ contact, onClose }: ContactDialogProps) {
  useEffect(() => {
    if (!contact.isRead) {
      markContactAsRead(contact.id);
    }
  }, [contact.id, contact.isRead]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`تم نسخ ${label} بنجاح`);
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${contact.email}`;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>تفاصيل الرسالة</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 p-4">
            <div className="grid gap-4 border-b pb-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-semibold">الاسم:</span>
                <div className="col-span-2 flex items-center gap-2">
                  {contact.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8"
                    onClick={() => handleCopy(contact.name, "الاسم")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-semibold">البريد الإلكتروني:</span>
                <div className="col-span-2 flex items-center gap-2">
                  <span dir="ltr" className="text-left flex-1">
                    {contact.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8"
                    onClick={() => handleCopy(contact.email, "البريد الإلكتروني")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8"
                    onClick={handleEmailClick}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-semibold">رقم الهاتف:</span>
                <div className="col-span-2 flex items-center gap-2">
                  <span dir="ltr" className="text-left flex-1">
                    {contact.phone}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8"
                    onClick={() => handleCopy(contact.phone, "رقم الهاتف")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-semibold">تاريخ الإرسال:</span>
                <span className="col-span-2">
                  {format(new Date(contact.createdAt), 'dd/MM/yyyy - hh:mm a', { locale: ar })}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">الموضوع:</h3>
                <p>{contact.subject}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">الرسالة:</h3>
                <div className="bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
                  {contact.message}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
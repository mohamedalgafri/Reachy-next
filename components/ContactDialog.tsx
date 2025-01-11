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
import { useLocale } from 'next-intl';

interface ContactDialogProps {
  contact: Contact;
  onClose: () => void;
}

export function ContactDialog({ contact, onClose }: ContactDialogProps) {
  const locale = useLocale();

  const translations = {
    ar: {
      messageDetails: "تفاصيل الرسالة",
      name: "الاسم",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      sendDate: "تاريخ الإرسال",
      subject: "الموضوع",
      message: "الرسالة",
      copied: "تم نسخ",
      successfully: "بنجاح"
    },
    en: {
      messageDetails: "Message Details",
      name: "Name",
      email: "Email",
      phone: "Phone",
      sendDate: "Send Date",
      subject: "Subject",
      message: "Message",
      copied: "Copied",
      successfully: "successfully"
    }
  };

  const t = translations[locale as keyof typeof translations];

  useEffect(() => {
    if (!contact.isRead) {
      markContactAsRead(contact.id);
    }
  }, [contact.id, contact.isRead]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    if (locale === 'ar') {
      toast.success(`تم نسخ ${label} بنجاح`);
    } else {
      toast.success(`${label} copied successfully`);
    }
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${contact.email}`;
  };

  const isRTL = locale === 'ar';
  const textDirection = isRTL ? 'rtl' : 'ltr';

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{t.messageDetails}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6" dir={textDirection}>
          <div className="space-y-6 py-4">
            <div className="grid gap-4 border-b pb-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-semibold">{t.name}:</span>
                <div className="col-span-2 ltr:ml-auto rtl:mr-auto flex items-center gap-2">
                  {contact.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8"
                    onClick={() => handleCopy(contact.name, t.name)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-semibold">{t.email}:</span>
                <div className="col-span-2 text-end flex items-center gap-2">
                  <span dir="ltr" className="text-left flex-1">
                    {contact.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8"
                    onClick={() => handleCopy(contact.email, t.email)}
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
                <span className="font-semibold">{t.phone}:</span>
                <div className="col-span-2 text-end flex items-center gap-2">
                  <span dir="ltr" className="text-left flex-1">
                    {contact.phone}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8"
                    onClick={() => handleCopy(contact.phone, t.phone)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-semibold">{t.sendDate}:</span>
                <span className="col-span-2 text-end">
                  {format(new Date(contact.createdAt), 'dd/MM/yyyy - hh:mm a', { 
                    locale: isRTL ? ar : undefined 
                  })}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t.subject}:</h3>
                <p>{contact.subject}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t.message}:</h3>
                <div className="bg-muted/50 p-4 rounded-lg whitespace-pre-wrap max-h-[300px] overflow-y-auto">
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
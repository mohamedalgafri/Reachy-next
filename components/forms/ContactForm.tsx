// components/ContactForm.tsx
'use client';

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createContact } from '@/actions/contact';
import { useLocale } from 'next-intl';
import MapInfoC from '../content/MapInfoC';
import * as z from 'zod';

const getValidationSchema = (locale: string) => {
  const messages = {
    ar: {
      nameMin: "الاسم يجب أن يكون أكثر من حرفين",
      emailInvalid: "البريد الإلكتروني غير صحيح",
      phoneInvalid: "رقم الهاتف غير صحيح",
      subjectMin: "الموضوع يجب أن يكون أكثر من 2 أحرف",
      messageMin: "الرسالة يجب أن تكون أكثر من 10 أحرف"
    },
    en: {
      nameMin: "Name must be at least 2 characters",
      emailInvalid: "Invalid email address",
      phoneInvalid: "Invalid phone number",
      subjectMin: "Subject must be at least 2 characters",
      messageMin: "Message must be at least 10 characters"
    }
  };

  const currentMessages = locale === 'ar' ? messages.ar : messages.en;

  return z.object({
    name: z.string().min(2, { message: currentMessages.nameMin }),
    email: z.string().email({ message: currentMessages.emailInvalid }),
    phone: z.string().min(10, { message: currentMessages.phoneInvalid }),
    subject: z.string().min(2, { message: currentMessages.subjectMin }),
    message: z.string().min(10, { message: currentMessages.messageMin }),
  });
};

const ContactForm = ({ settings }) => {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  
  const ContactSchema = getValidationSchema(locale);
  type ContactType = z.infer<typeof ContactSchema>;

  const form = useForm<ContactType>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    }
  });

  const onSubmit = async (data: ContactType) => {
    setIsLoading(true);
    try {
      const result = await createContact(data);
      if (result.success) {
        toast.success(locale === 'ar' ? 'تم إرسال الرسالة بنجاح' : 'Message sent successfully');
        form.reset();
      } else {
        toast.error(locale === 'ar' ? 'فشل في إرسال الرسالة' : 'Failed to send message');
      }
    } catch (error) {
      toast.error(locale === 'ar' ? 'حدث خطأ أثناء إرسال الرسالة' : 'Error sending message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="sectionCU sectionBGColor" id="contact">
      <div className="container relative">
        <div className="pt-10">
          <div className="ballsCT">
            <div className="ballsColor">
              <div className="ballC"></div>
              <div className="ballC"></div>
              <div className="ballC"></div>
            </div>
            <div>
              <span className="uppercase font-bold text-white">
                {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </span>
            </div>
          </div>

          <div className="formMap mt-10">
            <div className="formC">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='mb-3'>
                  <input
                    className={`inputF ${form.formState.errors.name && "border border-red-600"}`}
                    type="text"
                    placeholder={locale === 'ar' ? 'الاسم' : 'Name'}
                    {...form.register("name")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col md:flex-row gap-1 md:gap-3 mb-1">
                  <div className="w-full mb-2">
                    <input
                      className={`inputF ${form.formState.errors.email && "border border-red-600"}`}
                      type="email"
                      placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                      {...form.register("email")}
                      disabled={isLoading}
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full mb-2">
                    <input
                      className={`inputF ${form.formState.errors.phone && "border border-red-600"}`}
                      type="tel"
                      placeholder={locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                      {...form.register("phone")}
                      disabled={isLoading}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='mb-3'>
                  <input
                    className={`inputF ${form.formState.errors.subject && "border border-red-600"}`}
                    type="text"
                    placeholder={locale === 'ar' ? 'عنوان الرسالة' : 'Message Subject'}
                    {...form.register("subject")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.subject && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.subject.message}
                    </p>
                  )}
                </div>

                <div className='mb-3'>
                  <textarea
                    className={`inputF ${form.formState.errors.message && "border border-red-600"}`}
                    placeholder={locale === 'ar' ? 'نص الرسالة' : 'Message Text'}
                    rows={10}
                    {...form.register("message")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.message && (
                    <p className="text-red-600 font-bold text-sm mt-1">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>

                <div className="btnsS flex gap-4 items-center mx-auto mt-5 text-white">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="action btnArrow flex items-center justify-center gap-1 w-max min-w-[200px] py-1 px-8"
                  >
                    <span className="textbtn">
                      {isLoading 
                        ? (locale === "ar" ? "جاري الارسال" : "Sending...") 
                        : (locale === "ar" ? "إرسال" : "Send")}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            <MapInfoC settings={settings} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
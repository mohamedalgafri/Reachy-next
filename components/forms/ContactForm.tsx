// components/ContactForm.tsx
'use client';

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createContact } from '@/actions/contact';
import { ContactSchema, ContactType } from '@/types/form-types';
import { useLocale } from 'next-intl';
import MapInfoC from '../content/MapInfoC';

const ContactForm = ({settings}) => {
  const locale = useLocale()
  const [isLoading, setIsLoading] = useState(false);
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
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الرسالة");
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
                    className={`inputF ${ form.formState.errors.name && "border border-red-600"} `}
                    type="text"
                    placeholder={`${locale === 'ar' ? 'الاسم' : 'Name'}`}
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
                      className={`inputF ${ form.formState.errors.email && "border border-red-600"} `}
                      type="email"
                      placeholder={`${locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}`}
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
                      className={`inputF ${ form.formState.errors.phone && "border border-red-600"} `}
                      type="tel"
                      placeholder={`${locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}`}
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
                    className={`inputF ${ form.formState.errors.subject && "border border-red-600"} `}
                    type="text"
                    placeholder={`${locale === 'ar' ? 'عنوان الرسالة' : 'Message Subject'}`}
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
                    className={`inputF ${ form.formState.errors.message && "border border-red-600"} `}
                    placeholder={`${locale === 'ar' ? 'نص الرسالة' : 'Message Text'}`}
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
                      {isLoading ? locale === "ar" ? "Sending..." : "جاري الارسال" : locale === "ar" ? "إرسال" : "Send"}
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
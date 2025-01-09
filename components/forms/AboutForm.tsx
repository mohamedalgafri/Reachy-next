// components/forms/AboutForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TextEditor } from "@/components/forms/TextEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import { updateAboutSection } from "@/actions/about";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const formSchema = z.object({
  title_ar: z.string().min(1, "العنوان باللغة العربية مطلوب"),
  title_en: z.string().min(1, "العنوان باللغة الإنجليزية مطلوب"),
  content_ar: z.string().min(1, "المحتوى باللغة العربية مطلوب"),
  content_en: z.string().min(1, "المحتوى باللغة الإنجليزية مطلوب"),
  vision_title_ar: z.string().min(1, "عنوان الرؤية باللغة العربية مطلوب"),
  vision_title_en: z.string().min(1, "عنوان الرؤية باللغة الإنجليزية مطلوب"),
  vision_content_ar: z.string().min(1, "محتوى الرؤية باللغة العربية مطلوب"),
  vision_content_en: z.string().min(1, "محتوى الرؤية باللغة الإنجليزية مطلوب"),
  mission_title_ar: z.string().min(1, "عنوان الرسالة باللغة العربية مطلوب"),
  mission_title_en: z.string().min(1, "عنوان الرسالة باللغة الإنجليزية مطلوب"),
  mission_content_ar: z.string().min(1, "محتوى الرسالة باللغة العربية مطلوب"),
  mission_content_en: z.string().min(1, "محتوى الرسالة باللغة الإنجليزية مطلوب"),
});

interface AboutFormProps {
  initialData: z.infer<typeof formSchema>;
  sectionId: number;
}

export default function AboutForm({ initialData, sectionId }: AboutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const result = await updateAboutSection(sectionId, values);
      
      if (result.success) {
        toast.success('تم تحديث القسم بنجاح');
        router.push('/admin/sections');
        router.refresh();
      } else {
        throw new Error(result.error || 'حدث خطأ أثناء التحديث');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "حدث خطأ أثناء تحديث القسم");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">{locale === "ar" ? "تعديل قسم من نحن" : "Edit About Us Section"}</h2>
        <CardDescription>{locale === "ar" ? "قم بتحديث محتوى صفحة من نحن" : "Update the content of the About Us page"}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="ar" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="ar">عربي</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>

              <TabsContent value="ar">
                {/* Main Content - Arabic */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العنوان الرئيسي</FormLabel>
                        <TextEditor {...field} dir="rtl" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المحتوى</FormLabel>
                        <TextEditor {...field} dir="rtl" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vision_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عنوان الرؤية</FormLabel>
                        <TextEditor {...field} dir="rtl" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vision_content_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>محتوى الرؤية</FormLabel>
                        <TextEditor {...field} dir="rtl" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mission_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عنوان الرسالة</FormLabel>
                        <TextEditor {...field} dir="rtl" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mission_content_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>محتوى الرسالة</FormLabel>
                        <TextEditor {...field} dir="rtl" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="en">
                {/* Main Content - English */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Title</FormLabel>
                        <TextEditor {...field} dir="ltr" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <TextEditor {...field} dir="ltr" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vision_title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vision Title</FormLabel>
                        <TextEditor {...field} dir="ltr" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vision_content_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vision Content</FormLabel>
                        <TextEditor {...field} dir="ltr" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mission_title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mission Title</FormLabel>
                        <TextEditor {...field} dir="ltr" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mission_content_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mission Content</FormLabel>
                        <TextEditor {...field} dir="ltr" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isLoading}
              >
                إعادة تعيين
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
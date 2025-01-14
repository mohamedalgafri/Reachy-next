"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TextEditor } from "@/components/forms/TextEditor";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateServicesSection } from "@/actions/servicesSection";
import { useLocale } from "next-intl";

const formSchema = z.object({
  title: z.object({
    ar: z.string().min(1, "العنوان العربي مطلوب"),
    en: z.string().min(1, "English title is required"),
  })
});

type FormData = z.infer<typeof formSchema>;

interface ServicesSectionFormProps {
  initialData: {
    title: {
      ar: string;
      en: string;
    };
  };
  sectionId: number;
}

export default function ServicesSectionForm({
  initialData,
  sectionId
}: ServicesSectionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ar");
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: {
        ar: initialData?.title?.ar || "",
        en: initialData?.title?.en || ""
      }
    }
  });

  useEffect(() => {
    // تحديث قيم النموذج عندما تتغير البيانات الأولية
    if (initialData?.title) {
      form.reset({
        title: {
          ar: initialData.title.ar || "",
          en: initialData.title.en || ""
        }
      });
    }
  }, [initialData, form]);

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);
      const result = await updateServicesSection(sectionId, {
        title: {
          ar: values.title.ar,
          en: values.title.en
        }
      });

      if (result.success) {
        toast.success(locale === "ar" ? "تم تحديث القسم بنجاح" : "Section updated successfully");
        router.push("/admin/sections");
        router.refresh();
      } else {
        throw new Error(result.error || "حدث خطأ أثناء التحديث");
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
        <h2 className="text-2xl font-bold">{locale === "ar" ? "تعديل قسم الخدمات" : "Edit Services Section"}</h2>
        <CardDescription>
          {locale === "ar" 
            ? "قم بتحديث عنوان قسم الخدمات باللغتين العربية والإنجليزية" 
            : "Update the services section title in Arabic and English"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="ar">العربية</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>

              <TabsContent value="ar" className="space-y-6">
                <FormField
                  control={form.control}
                  name="title.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>العنوان بالعربية</FormLabel>
                      <TextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="أدخل العنوان بالعربية..."
                        dir="rtl"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="en" className="space-y-6">
                <FormField
                  control={form.control}
                  name="title.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title in English</FormLabel>
                      <TextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter title in English..."
                        dir="ltr"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isLoading}
              >
                {activeTab === "ar" ? "إعادة تعيين" : "Reset"}
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading 
                  ? (activeTab === "ar" ? "جاري الحفظ..." : "Saving...") 
                  : (activeTab === "ar" ? "حفظ التغييرات" : "Save Changes")
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TextEditor } from "@/components/forms/TextEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateStorySection } from "@/actions/storySection";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
    title_ar: z.string().min(1, "العنوان الرئيسي باللغة العربية مطلوب"),
    title_en: z.string().min(1, "العنوان الرئيسي باللغة الإنجليزية مطلوب"),
    subTitle_ar: z.string().min(1, "العنوان الفرعي باللغة العربية مطلوب"),
    subTitle_en: z.string().min(1, "العنوان الفرعي باللغة الإنجليزية مطلوب"),
    profileUrl: z.string().min(1, "يرجى رفع الملف")
});

type FormData = z.infer<typeof formSchema>;

interface StoryFormProps {
    initialData: {
        title_ar: string;
        title_en: string;
        subTitle_ar: string;
        subTitle_en: string;
        profileUrl?: string;
    };
    sectionId: number;
}

export default function StoryForm({
    initialData,
    sectionId
}: StoryFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title_ar: initialData?.title_ar || "",
            title_en: initialData?.title_en || "",
            subTitle_ar: initialData?.subTitle_ar || "",
            subTitle_en: initialData?.subTitle_en || "",
            profileUrl: initialData?.profileUrl || ""
        }
    });

    const onSubmit = async (values: FormData) => {
        try {
            setIsLoading(true);
            const result = await updateStorySection(sectionId, values);

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
                <h2 className="text-2xl font-bold">تعديل قسم Our Story</h2>
                <p className="text-muted-foreground">قم بتحديث محتوى قسم من نحن</p>
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
                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="title_ar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>العنوان الرئيسي (عربي)</FormLabel>
                                                <TextEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="أدخل العنوان الرئيسي..."
                                                    dir="rtl"
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="subTitle_ar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>العنوان الفرعي (عربي)</FormLabel>
                                                <TextEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="أدخل العنوان الفرعي..."
                                                    dir="rtl"
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="en">
                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="title_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title (English)</FormLabel>
                                                <TextEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Enter the title..."
                                                    dir="ltr"
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="subTitle_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subtitle (English)</FormLabel>
                                                <TextEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Enter the subtitle..."
                                                    dir="ltr"
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>

                        <FormField
                            control={form.control}
                            name="profileUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الملف التعريفي</FormLabel>
                                    <FileUpload
                                        endpoint="upload"
                                        value={field.value}
                                        onChange={field.onChange}
                                        accept=".pdf,.doc,.docx"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
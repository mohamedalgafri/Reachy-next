"use client";

import { useState, useTransition } from "react";
import { updateUserName, type FormData } from "@/actions/update-user-name";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLocale } from 'next-intl';

import { userNameSchema } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

interface UserNameFormProps {
  user: Pick<User, "id" | "name">;
}

export function UserNameForm({ user }: UserNameFormProps) {
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const updateUserNameWithId = updateUserName.bind(null, user.id);
  const locale = useLocale();

  const translations = {
    ar: {
      accountName: "اسم الحساب",
      description: "تعديل اسم الحساب",
      name: "الاسم",
      save: "حفظ",
      saveChanges: "حفظ التعديل",
      maxChars: "الحد الأقصى 32 حرف",
      error: "حدث خطأ",
      errorDesc: "لم يتم تحديث الاسم. يرجى المحاولة مرة أخرى",
      success: "تم تحديث اسم المستخدم بنجاح"
    },
    en: {
      accountName: "Account Name",
      description: "Edit your account name",
      name: "Name",
      save: "Save",
      saveChanges: "Save Changes",
      maxChars: "Max 32 characters",
      error: "Something went wrong",
      errorDesc: "Your name was not updated. Please try again",
      success: "Your name has been updated"
    }
  };

  const t = translations[locale as keyof typeof translations];

  const checkUpdate = (value: string) => {
    setUpdated(user.name !== value);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const { status } = await updateUserNameWithId(data);

      if (status !== "success") {
        toast.error(t.error, {
          description: t.errorDesc,
        });
      } else {
        await update();
        setUpdated(false);
        toast.success(t.success);
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title={t.accountName}
        description={t.description}
      >
        <div className="flex w-full items-center gap-2">
          <Label className="sr-only" htmlFor="name">
            {t.name}
          </Label>
          <Input
            id="name"
            className="flex-1"
            size={32}
            {...register("name")}
            onChange={(e) => checkUpdate(e.target.value)}
          />
          <Button
            type="submit"
            variant={updated ? "default" : "disable"}
            disabled={isPending || !updated}
            className="w-[67px] shrink-0 px-0 sm:w-[130px]"
          >
            {isPending ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              <p>
                {t.save}
                <span className="hidden sm:inline-flex">
                  &nbsp;{locale === 'ar' ? 'التعديل' : 'Changes'}
                </span>
              </p>
            )}
          </Button>
        </div>
        <div className="flex flex-col justify-between p-1">
          {errors?.name && (
            <p className="pb-0.5 text-[13px] text-red-600">
              {errors.name.message}
            </p>
          )}
          <p className="text-[13px] text-muted-foreground">{t.maxChars}</p>
        </div>
      </SectionColumns>
    </form>
  );
}
// components/forms/user-forms.tsx
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useLocale } from 'next-intl';

import { userNameSchema, emailSchema, passwordSchema } from "@/lib/validations/user";
import { updateUserName, updateUserEmail, updateUserPassword } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";
import { createValidationSchemas } from "@/lib/validations/user";
import { z } from "zod";

const translations = {
  ar: {
    name: {
      title: "اسم الحساب",
      description: "تعديل اسم الحساب",
      label: "الاسم",
      maxChars: "الحد الأقصى 32 حرف",
      success: "تم تحديث الاسم بنجاح",
      error: "حدث خطأ في تحديث الاسم"
    },
    email: {
      title: "البريد الإلكتروني",
      description: "تعديل البريد الإلكتروني",
      label: "البريد الإلكتروني",
      success: "تم تحديث البريد الإلكتروني بنجاح",
      error: "حدث خطأ في تحديث البريد الإلكتروني"
    },
    password: {
      title: "كلمة المرور",
      description: "تغيير كلمة المرور",
      label: "كلمة المرور الجديدة",
      minChars: "8 أحرف على الأقل",
      success: "تم تحديث كلمة المرور بنجاح",
      error: "حدث خطأ في تحديث كلمة المرور"
    },
    common: {
      save: "حفظ",
      changes: "التعديل"
    }
  },
  en: {
    name: {
      title: "Account Name",
      description: "Edit your account name",
      label: "Name",
      maxChars: "Max 32 characters",
      success: "Name updated successfully",
      error: "Error updating name"
    },
    email: {
      title: "Email Address",
      description: "Edit your email address",
      label: "Email",
      success: "Email updated successfully",
      error: "Error updating email"
    },
    password: {
      title: "Password",
      description: "Change your password",
      label: "New Password",
      minChars: "Minimum 8 characters",
      success: "Password updated successfully",
      error: "Error updating password"
    },
    common: {
      save: "Save",
      changes: "Changes"
    }
  }
};

interface UserFormsProps {
  user: Pick<User, "id" | "name" | "email">;
}

export function UserForms({ user }: UserFormsProps) {
  const { update } = useSession();
  const locale = useLocale();
  const t = translations[locale as keyof typeof translations];
  const schemas = createValidationSchemas(locale as 'ar' | 'en');
  
  return (
    <div className="space-y-6">
      <UserNameForm user={user} translations={t} schema={schemas.userNameSchema} />
      <UserEmailForm user={user} translations={t} schema={schemas.emailSchema} />
      <UserPasswordForm user={user} translations={t} schema={schemas.passwordSchema} />
    </div>
  );
}


function UserNameForm({ 
  user, 
  translations, 
  schema 
}: { 
  user: Pick<User, "id" | "name">;
  translations: any;
  schema: z.ZodSchema;
}) {
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user.name || "" },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await updateUserName(user.id, data);
      if (result.status === "success") {
        await update();
        setUpdated(false);
        toast.success(translations.name.success);
      } else {
        toast.error(translations.name.error);
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title={translations.name.title}
        description={translations.name.description}
      >
        <div className="flex w-full items-center gap-2">
          <Input
            id="name"
            className="flex-1"
            {...register("name")}
            onChange={(e) => setUpdated(e.target.value !== user.name)}
          />
          <Button
            type="submit"
            disabled={isPending || !updated}
          >
            {isPending ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              <>
                {translations.common.save}
                <span className="hidden sm:inline-flex">
                  &nbsp;{translations.common.changes}
                </span>
              </>
            )}
          </Button>
        </div>
        {errors?.name && (
          <p className="text-sm text-red-500 mt-2">{errors.name.message}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {translations.name.maxChars}
        </p>
      </SectionColumns>
    </form>
  );
}

function UserEmailForm({ 
  user, 
  translations,
  schema 
}: { 
  user: Pick<User, "id" | "email">;
  translations: any;
  schema: z.ZodSchema;
}) {
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: user.email || "" },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await updateUserEmail(user.id, data);
      if (result.status === "success") {
        await update();
        setUpdated(false);
        toast.success(translations.email.success);
      } else {
        toast.error(result.message || translations.email.error);
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title={translations.email.title}
        description={translations.email.description}
      >
        <div className="flex w-full items-center gap-2">
          <Input
            id="email"
            type="email"
            className="flex-1"
            {...register("email")}
            onChange={(e) => setUpdated(e.target.value !== user.email)}
          />
          <Button
            type="submit"
            disabled={isPending || !updated}
          >
            {isPending ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              <>
                {translations.common.save}
                <span className="hidden sm:inline-flex">
                  &nbsp;{translations.common.changes}
                </span>
              </>
            )}
          </Button>
        </div>
        {errors?.email && (
          <p className="text-sm text-red-500 mt-2">{errors.email.message}</p>
        )}
      </SectionColumns>
    </form>
  );
}

function UserPasswordForm({ 
  user, 
  translations,
  schema 
}: { 
  user: Pick<User, "id">;
  translations: any;
  schema: z.ZodSchema;
}) {
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await updateUserPassword(user.id, data);
      if (result.status === "success") {
        reset();
        toast.success(translations.password.success);
      } else {
        toast.error(translations.password.error);
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title={translations.password.title}
        description={translations.password.description}
      >
        <div className="flex w-full items-center gap-2">
          <Input
            id="password"
            type="password"
            className="flex-1"
            {...register("password")}
          />
          <Button
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              <>
                {translations.common.save}
                <span className="hidden sm:inline-flex">
                  &nbsp;{translations.common.changes}
                </span>
              </>
            )}
          </Button>
        </div>
        {errors?.password && (
          <p className="text-sm text-red-500 mt-2">{errors.password.message as string}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {translations.password.minChars}
        </p>
      </SectionColumns>
    </form>
  );
}
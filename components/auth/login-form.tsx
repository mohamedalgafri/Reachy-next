"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "next-auth/react";
import CardWrapper from "./card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { login } from "@/actions/login";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useLocale } from 'next-intl';

const LoginForm = () => {
  const locale = useLocale();
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const translations = {
    ar: {
      title: "تسجيل الدخول",
      email: "البريد الإلكتروني",
      emailPlaceholder: "admin@example.com",
      password: "كلمة المرور",
      passwordPlaceholder: "••••••••",
      loginButton: "تسجيل الدخول",
      loggingIn: "جاري تسجيل الدخول...",
      loginError: "حدث خطأ في تسجيل الدخول!",
      // Add form validation messages in Arabic
      emailRequired: "البريد الإلكتروني مطلوب",
      emailInvalid: "البريد الإلكتروني غير صالح",
      passwordRequired: "كلمة المرور مطلوبة",
      passwordLength: "كلمة المرور مطلوبة"
    },
    en: {
      title: "Login",
      email: "Email",
      emailPlaceholder: "admin@example.com",
      password: "Password",
      passwordPlaceholder: "••••••••",
      loginButton: "Login",
      loggingIn: "Logging in...",
      loginError: "Login error!",
      // Add form validation messages in English
      emailRequired: "Email is required",
      emailInvalid: "Invalid email address",
      passwordRequired: "Password is required",
      passwordLength: "Password is required"
    }
  };

  const t = translations[locale as keyof typeof translations];

  // Update LoginSchema with localized messages
  const LocalizedLoginSchema = z.object({
    email: z.string().min(1, { message: t.emailRequired }).email({ message: t.emailInvalid }),
    password: z.string().min(6, { message: t.passwordLength }),
  });

  const form = useForm<z.infer<typeof LocalizedLoginSchema>>({
    resolver: zodResolver(LocalizedLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = (values: z.infer<typeof LocalizedLoginSchema>) => {
    setError("");

    startTransition(async () => {
      try {
        const result = await login(values);
        
        if (result?.error) {
          setError(result.error);
          return;
        }

        if (result?.success) {
          await signIn("credentials", {
            email: result.email,
            password: result.password,
            redirect: true,
            callbackUrl: DEFAULT_LOGIN_REDIRECT
            // callbackUrl: `/${locale}/admin`
          });
        }
      } catch (error) {
        setError(t.loginError);
      }
    });
  };

  return (
    <CardWrapper
      headerLabel={t.title}
      backButtonLabel=""
      backButtonHref=""
      showSocial={false}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.email}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder={t.emailPlaceholder}
                      type="email"
                      dir="ltr"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.password}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder={t.passwordPlaceholder}
                      type="password"
                      dir="ltr"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && <FormError message={error} />}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? t.loggingIn : t.loginButton}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
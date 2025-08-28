"use client";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/use-login";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>;

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "O campo email é obrigatório" })
    .email({ message: "Informe um email válido" }),
  password: z
    .string()
    .min(1, {
      message: "O campo senha é obrigatório",
    })
    .min(6, {
      message: "A senha deve ter pelo menos 6 caracteres",
    }),
});

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { mutateAsync: loginAsync, isPending } = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await loginAsync(data);
    if (res.access_token) {
      window.location.href = "/dashboard";
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-3", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="nome@examplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
              <Link
                href="/forgot-password"
                className="text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75"
              >
                Esqueceu sua senha?
              </Link>
            </FormItem>
          )}
        />
        <Button
          className="mt-2 cursor-pointer"
          disabled={isPending}
          type="submit"
        >
          Entrar
        </Button>
      </form>
    </Form>
  );
}

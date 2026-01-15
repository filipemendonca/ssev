"use client";
import { PasswordInput } from "@/components/password-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { useResetPassword } from "@/hooks/use-forgot-password";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import { Fragment, HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ResetPasswordFormProps = HTMLAttributes<HTMLFormElement> & {
  token: string | null;
};

const formSchema = z
  .object({
    password: z.string().min(1, {
      message: "Campo obrigatório.",
    }),
    repeatPassword: z.string().min(1, {
      message: "Campo obrigatório.",
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.password || data.password.length < 6) {
      ctx.addIssue({
        path: ["password"],
        message: "A nova senha deve ter no mínimo 6 caracteres.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (!data.repeatPassword || data.repeatPassword.length < 6) {
      ctx.addIssue({
        path: ["repeatPassword"],
        message: "A repetição da nova senha deve ter no mínimo 6 caracteres.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.password !== data.repeatPassword) {
      ctx.addIssue({
        path: ["repeatPassword"],
        message: "As senhas não coincidem.",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export function ResetPasswordForm({
  className,
  token,
  ...props
}: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const { mutateAsync: resetPasswordAsync } = useResetPassword(setIsLoading);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const obj = { token, password: data.password };
    const res = await resetPasswordAsync(obj);
    if (res.message) {
      setShowMessage(true);
      setMessage(res.message);
    }
    form.reset();
    setIsLoading(false);
  }

  const renderMessageIfExistEmail = (text: string) => (
    <Alert variant="success" className="mb-5">
      <CheckCircle2Icon />
      <AlertTitle>Sucesso!</AlertTitle>
      <AlertDescription>{text}</AlertDescription>
    </Alert>
  );

  return (
    <Fragment>
      {showMessage && renderMessageIfExistEmail(message)}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("grid gap-3", className)}
          {...props}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Nova senha</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repeatPassword"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Repita a nova senha</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="mt-2 cursor-pointer"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? <Spinner className="size-7" /> : "Salvar"}
          </Button>
          <Link
            href="/sign-in"
            className="text-muted-foreground text-right text-sm font-medium hover:opacity-75"
          >
            {" <- "} Retornar para o login
          </Link>
        </form>
      </Form>
    </Fragment>
  );
}

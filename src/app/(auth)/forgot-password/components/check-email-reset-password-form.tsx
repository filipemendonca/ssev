"use client";
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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForgotPassword } from "@/hooks/use-forgot-password";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import { Fragment, HTMLAttributes, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CheckEmailResetPasswordFormProps = HTMLAttributes<HTMLFormElement>;

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "O campo email é obrigatório" })
    .email({ message: "Informe um email válido" }),
});

export function CheckEmailResetPasswordForm({
  className,
  ...props
}: CheckEmailResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { mutateAsync: forgotPasswordAsync, isError } = useForgotPassword();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (isError) {
      setIsLoading(false);
    }
  }, [isError]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const res = await forgotPasswordAsync(data);
    if (res.message) {
      setShowMessage(true);
      setMessage(res.message);
    }
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
          <Button
            className="mt-2 cursor-pointer"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? <Spinner className="size-7" /> : "Enviar"}
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

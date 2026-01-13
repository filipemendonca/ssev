"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { GenericResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheckIcon, RefreshCcw } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Users } from "../../users/data-table/columns";
import { Profile } from "../types";
import { PasswordInput } from "@/components/password-input";
import { Badge } from "@/components/ui/badge";

const formSchema = z
  .object({
    name: z.string().min(1, {
      message: "O campo Nome é obrigatório.",
    }),
    email: z.string().email({
      message: "Insira um e-mail válido.",
    }),
    enableChangePassword: z.boolean(),
    newPassword: z.string().optional(),
    repeatNewPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.enableChangePassword) {
      if (!data.newPassword || data.newPassword.length < 6) {
        ctx.addIssue({
          path: ["newPassword"],
          message: "A nova senha deve ter no mínimo 6 caracteres.",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.repeatNewPassword || data.repeatNewPassword.length < 6) {
        ctx.addIssue({
          path: ["repeatNewPassword"],
          message: "A repetição da nova senha deve ter no mínimo 6 caracteres.",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.newPassword !== data.repeatNewPassword) {
        ctx.addIssue({
          path: ["repeatNewPassword"],
          message: "As senhas não coincidem.",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

interface ProfileFormProps {
  initialData: Profile | undefined;
}

export default function ProfileForm({
  initialData,
}: Readonly<ProfileFormProps>) {
  const defaultValues = useMemo(
    () => ({
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      role: initialData?.role ?? "",
      enableChangePassword: initialData?.enableChangePassword ?? false,
      newPassword: initialData?.newPassword ?? "",
      repeatNewPassword: initialData?.repeatNewPassword ?? "",
    }),
    [initialData]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  const enableChangePasswordControl = form.watch("enableChangePassword");

  const { mutateAsync: editProfileAsync } = useApiMutation<
    GenericResponse<Users>
  >({
    endpoint: `/profile/${initialData?.id}`,
    method: "PATCH",
    queryKeys: ["editProfile"],
    invalidateQueries: true,
    invalidateQueryKeys: ["getProfile"],
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (enableChangePasswordControl) {
      values.enableChangePassword = enableChangePasswordControl;
    } else {
      values.newPassword = undefined;
      values.repeatNewPassword = undefined;
    }
    await editProfileAsync(values as never);
    form.reset();
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        {initialData?.name && initialData?.role && (
          <>
            <CardTitle className="text-left text-2xl font-bold">
              Olá, {initialData.name}{" "}
              <Badge variant="outline">
                <BadgeCheckIcon />
                {initialData.role}
              </Badge>
            </CardTitle>
            <CardDescription className="text-left">
              Atualize suas informações de perfil abaixo.
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o nome" {...field} autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Endereço de email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enableChangePassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modificar senha</FormLabel>
                    <FormControl>
                      <Switch
                        className="cursor-pointer"
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {enableChangePasswordControl && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="repeatNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repita a nova senha</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <Button type="submit" className="cursor-pointer">
              <RefreshCcw />
              Atualizar informações
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

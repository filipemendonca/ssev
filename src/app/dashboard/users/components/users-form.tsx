"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { GenericResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowLeft } from "@tabler/icons-react";
import { SaveAll } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Users } from "../data-table/columns";

enum ROLE {
  ADMINISTRADOR = "ADMINISTRADOR",
  VETERINARIO = "VETERINARIO",
  PATOLOGISTA = "PATOLOGISTA",
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "O campo Nome é obrigatório.",
  }),
  email: z.string().email({
    message: "Insira um e-mail válido.",
  }),
  username: z.string().min(1, {
    message: "O campo Username é obrigatório.",
  }),
  isActive: z.boolean(),
  role: z.enum(Object.values(ROLE) as [string, ...string[]], {
    message: "Selecione uma categoria válida.",
  }),
});

interface UsersFormProps {
  initialData: Users | undefined;
  pageTitle: string;
  isEdit: boolean;
}

export default function UsersForm({
  initialData,
  pageTitle,
  isEdit,
}: Readonly<UsersFormProps>) {
  const route = useRouter();

  const defaultValues = {
    name: initialData?.name ?? "",
    username: initialData?.username ?? "",
    email: initialData?.email ?? "",
    isActive: initialData?.isActive ?? true,
    role: initialData?.role ?? "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  const { mutateAsync: createUserAsync } = useApiMutation<
    GenericResponse<Users>
  >({
    endpoint: "/users",
    method: "POST",
    queryKeys: ["createUser"],
    invalidateQueries: true,
    invalidateQueryKeys: ["users"],
  });

  const { mutateAsync: editUserAsync } = useApiMutation<GenericResponse<Users>>(
    {
      endpoint: `/users/${initialData?.id}`,
      method: "PUT",
      queryKeys: ["editUser"],
      invalidateQueries: true,
      invalidateQueryKeys: ["users"],
    }
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEdit) {
      await editUserAsync(values as never);
    } else {
      await createUserAsync(values as never);
    }
    form.reset();

    route.push("/dashboard/users");
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o nome" {...field} />
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nome de usuário"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ativo</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ROLE).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Link
              href="/dashboard/users"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "text-xs md:text-sm cursor-pointer mr-2"
              )}
            >
              <IconArrowLeft /> Voltar
            </Link>
            <Button type="submit" className="cursor-pointer">
              <SaveAll />
              Salvar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

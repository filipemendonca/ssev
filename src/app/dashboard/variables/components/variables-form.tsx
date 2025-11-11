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
import { Variables } from "../data-table/columns";

const formSchema = z.object({
  key: z.string().min(1, {
    message: "O campo Variável é obrigatório.",
  }),
});

interface VariablesFormProps {
  initialData: Variables | null;
  pageTitle: string;
  isEdit: boolean;
}

export default function VariablesForm({
  initialData,
  pageTitle,
  isEdit,
}: Readonly<VariablesFormProps>) {
  const route = useRouter();

  const defaultValues = {
    key: initialData?.key ?? "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  const { mutateAsync: createVariablesAsync } = useApiMutation<
    GenericResponse<Variables>
  >({
    endpoint: "/variables",
    method: "POST",
    queryKeys: ["createVariables"],
    invalidateQueries: true,
    invalidateQueryKeys: ["variables"],
    multipartFormData: true,
  });

  const { mutateAsync: editVariablesAsync } = useApiMutation<
    GenericResponse<Variables>
  >({
    endpoint: `/variables/${initialData?.id}`,
    method: "PUT",
    queryKeys: ["editVariables"],
    invalidateQueries: true,
    invalidateQueryKeys: ["variables"],
    multipartFormData: true,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEdit) {
        await editVariablesAsync(values as never);
      } else {
        await createVariablesAsync(values as never);
      }
    } catch (error) {
      console.log(error);
    }

    form.reset();

    route.push("/dashboard/variables");
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
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variável</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insira a chave de variável"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Link
              href="/dashboard/variables"
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

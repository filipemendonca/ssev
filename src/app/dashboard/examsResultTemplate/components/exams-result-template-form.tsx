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
import { ExamsResultTemplate } from "../data-table/columns";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "O campo Nome é obrigatório.",
  }),
  content: z.object({}),
});

interface ExamsResultTemplateFormProps {
  initialData: ExamsResultTemplate | undefined;
  pageTitle: string;
  isEdit: boolean;
}

export default function ExamsResultTemplateForm({
  initialData,
  pageTitle,
  isEdit,
}: Readonly<ExamsResultTemplateFormProps>) {
  const route = useRouter();

  const defaultValues = {
    name: initialData?.name ?? "",
    content: initialData?.content ?? "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  const { mutateAsync: createExamsResultTemplateAsync } = useApiMutation<
    GenericResponse<ExamsResultTemplate>
  >({
    endpoint: "/examsResultTemplate",
    method: "POST",
    queryKeys: ["createExamsResultTemplate"],
    invalidateQueries: true,
    invalidateQueryKeys: ["examsResultTemplate"],
  });

  const { mutateAsync: editExamsResultTemplateAsync } = useApiMutation<
    GenericResponse<ExamsResultTemplate>
  >({
    endpoint: `/examsResultTemplate/${initialData?.id}`,
    method: "PUT",
    queryKeys: ["editExamsResultTemplate"],
    invalidateQueries: true,
    invalidateQueryKeys: ["examsResultTemplate"],
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEdit) {
      await editExamsResultTemplateAsync(values as never);
    } else {
      await createExamsResultTemplateAsync(values as never);
    }
    form.reset();

    route.push("/dashboard/examsResultTemplate");
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
            </div>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="content"
                render={({}) => (
                  <FormItem>
                    <FormLabel>Conteúdo do template</FormLabel>
                    <FormControl></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Link
              href="/dashboard/examsResultTemplate"
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

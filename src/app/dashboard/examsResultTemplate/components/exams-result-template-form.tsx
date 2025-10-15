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
import { FileUploader } from "./file-uploader";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "O campo Nome é obrigatório.",
  }),
  fileName: z.custom<string | null>(),
  attachment: z.custom<File | null>(
    (value) => value instanceof File || value === null,
    {
      message: "Deve-se importar um arquivo do tipo .docx",
    }
  ),
});

interface ExamsResultTemplateFormProps {
  initialData: ExamsResultTemplate | null;
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
    fileName: initialData?.fileName ?? "",
    attachment: null,
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
    multipartFormData: true,
  });

  const { mutateAsync: editExamsResultTemplateAsync } = useApiMutation<
    GenericResponse<ExamsResultTemplate>
  >({
    endpoint: `/examsResultTemplate/${initialData?.id}`,
    method: "PUT",
    queryKeys: ["editExamsResultTemplate"],
    invalidateQueries: true,
    invalidateQueryKeys: ["examsResultTemplate"],
    multipartFormData: true,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("name", values.name);
    if (values.attachment) {
      formData.append("file", values.attachment);
    }

    try {
      if (isEdit) {
        await editExamsResultTemplateAsync(formData as never);
      } else {
        await createExamsResultTemplateAsync(formData as never);
      }
    } catch (error) {
      console.log(error);
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
                name="attachment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo do template</FormLabel>
                    <FormControl>
                      <FileUploader
                        {...field}
                        fileName={initialData?.fileName || null}
                      />
                    </FormControl>
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

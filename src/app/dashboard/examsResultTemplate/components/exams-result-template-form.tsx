"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { GenericResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as z from "zod";
import { ExamsResultTemplate } from "../data-table/columns";
import { SerializedEditorState } from "lexical";
import { RichTextArea } from "@/components/rich-text-area";
import { Button, buttonVariants } from "@/components/ui/button";
import { SaveAll } from "lucide-react";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "O campo Nome é obrigatório.",
  }),
  content: z.any(),
});

interface ExamsResultTemplateFormProps {
  initialData: ExamsResultTemplate | undefined;
  pageTitle: string;
  isEdit: boolean;
}

// export const initialValue = {
//   root: {
//     children: [
//       {
//         children: [
//           {
//             detail: 0,
//             format: 0,
//             mode: "normal",
//             style: "",
//             text: "",
//             type: "text",
//             version: 1,
//           },
//         ],
//         direction: "ltr",
//         format: "",
//         indent: 0,
//         type: "paragraph",
//         version: 1,
//       },
//     ],
//     direction: "ltr",
//     format: "",
//     indent: 0,
//     type: "root",
//     version: 1,
//   },
// } as unknown as SerializedEditorState;

export default function ExamsResultTemplateForm({
  initialData,
  pageTitle,
  isEdit,
}: Readonly<ExamsResultTemplateFormProps>) {
  const route = useRouter();
  const [editorState, setEditorState] = useState<
    SerializedEditorState | undefined
  >(initialData?.content);

  const defaultValues = {
    name: initialData?.name ?? "",
    content:
      initialData?.content ?? (editorState as unknown as SerializedEditorState),
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
    try {
      if (isEdit) {
        await editExamsResultTemplateAsync(values as never);
      } else {
        await createExamsResultTemplateAsync(values as never);
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
              {/* <div className="flex flex-col">
              <Label className="mb-1 text-sm">Nome</Label>
              <Input placeholder="Insira o nome" />
            </div> */}
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
              {/* <div className="flex flex-col">
              <Label className="mb-1 text-sm">Conteúdo do template</Label>
              <RichTextArea
                editorState={editorState}
                setEditorState={setEditorState}
              />
            </div> */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo do template</FormLabel>
                    <FormControl>
                      <RichTextArea
                        editorState={field.value}
                        setEditorState={setEditorState}
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

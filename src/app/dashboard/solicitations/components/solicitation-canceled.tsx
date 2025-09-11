"use client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowLeft } from "@tabler/icons-react";
import { format } from "date-fns";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { Solicitations } from "../data-table/columns";

const formSchema = z.object({
  canceledCause: z.string(),
});

type canceledForm = z.infer<typeof formSchema>;

interface SolicitationCanceledProps {
  initialData: Solicitations | undefined;
  pageTitle: string;
}

export default function SolicitationCanceled({
  initialData,
  pageTitle,
}: Readonly<SolicitationCanceledProps>) {
  const form = useForm<canceledForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { canceledCause: initialData?.canceledCause || "" },
  });

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="flex justify-between text-2xl font-bold ">
          <div className="flex justify-between">{pageTitle}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="-mr-4 w-full overflow-y-auto py-1 pr-4 mb-10">
          <p className="mb-10">
            <Label className="mb-2">Data e hora do cancelamento:</Label>{" "}
            <span>
              {initialData?.canceledAt ? (
                format(initialData?.canceledAt, "dd/MM/yyyy HH:mm:ss")
              ) : (
                <></>
              )}
            </span>
          </p>
          <Form {...form}>
            <FormField
              name="canceledCause"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Causa do Cancelamento</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </div>

        <Link
          href="/dashboard/solicitations"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "text-xs md:text-sm cursor-pointer mr-2"
          )}
        >
          <IconArrowLeft /> Voltar
        </Link>
      </CardContent>
    </Card>
  );
}

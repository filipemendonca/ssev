"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { GenericResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Sample } from "../data-table/columns";

const formSchema = z.object({
  name: z.string(),
});

type SampleForm = z.infer<typeof formSchema>;

interface SampleActionDialogProps {
  setDataFiltered: Dispatch<
    SetStateAction<GenericResponse<Sample[]> | undefined>
  >;
}

export function SampleFilter({
  setDataFiltered,
}: Readonly<SampleActionDialogProps>) {
  const form = useForm<SampleForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  const { mutateAsync, data } = useApiMutation<GenericResponse<Sample[]>>({
    endpoint: "/sample/findMany",
    method: "POST",
    showSuccessToast: false,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync(values as never);
    setDataFiltered(data);
  };

  console.log(data);

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          id="user-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-0.5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <>
                <FormLabel>Nome</FormLabel>
                <FormItem className="grid grid-cols-6">
                  <FormControl>
                    <Input
                      placeholder="Nome da amostra"
                      className="col-span-2"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              </>
            )}
          />
          <Button type="submit" form="user-form" className="cursor-pointer">
            <Search />
            Pesquisar
          </Button>
        </form>
      </Form>
    </div>
  );
}

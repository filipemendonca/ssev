"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { GenericResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveAll } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Sample } from "../data-table/columns";

const formSchema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
});

type SampleForm = z.infer<typeof formSchema>;

interface SampleActionDialogProps {
  model: Sample;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SampleEditDialog({
  model,
  open,
  onOpenChange,
}: Readonly<SampleActionDialogProps>) {
  const title = "Editar Amostra";

  const form = useForm<SampleForm>({
    resolver: zodResolver(formSchema),
    defaultValues: model,
  });

  const { mutateAsync } = useApiMutation<GenericResponse<Sample>>({
    endpoint: `/sample/${model.id}`,
    method: "PUT",
    queryKeys: ["sampleEdit"],
    invalidateQueries: true,
    invalidateQueryKeys: ["sample"],
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync(values as never);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="-mr-4 h-20 w-full overflow-y-auto py-1 pr-4">
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
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">
                      Nome
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome da amostra"
                        className="col-span-4"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit" form="user-form" className="cursor-pointer">
            <SaveAll />
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

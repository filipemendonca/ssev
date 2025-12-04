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
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveAll } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InfectiousAgents } from "../data-table/columns";
import { GenericResponse } from "@/types";
import { useApiMutation } from "@/hooks/use-api-mutation";

const formSchema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
});

type InfectiousAgentsForm = z.infer<typeof formSchema>;

interface InfectiousAgentsCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InfectiousAgentsCreateDialog({
  open,
  onOpenChange,
}: Readonly<InfectiousAgentsCreateDialogProps>) {
  const title = "Criar Agente Infeccioso";

  const form = useForm<InfectiousAgentsForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  const { mutateAsync } = useApiMutation<GenericResponse<InfectiousAgents>>({
    endpoint: "/infectious-agents",
    method: "POST",
    queryKeys: ["infectious-agents-create"],
    invalidateQueries: true,
    invalidateQueryKeys: ["infectious-agents"],
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync(values as never);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="-mr-4 h-20 w-full overflow-y-auto py-1 pr-4">
          <Form {...form}>
            <form id="user-form" className="space-y-4 p-0.5">
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
                        placeholder="Nome do agente infeccioso"
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
          <Button
            type="button"
            form="user-form"
            className="cursor-pointer"
            onClick={form.handleSubmit(onSubmit)}
          >
            <SaveAll />
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

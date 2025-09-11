"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { GenericResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Solicitations } from "../data-table/columns";

interface CancelSolicitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mutateAsync: UseMutateAsyncFunction<
    GenericResponse<Solicitations>,
    Error,
    never,
    unknown
  >;
}

const formSchema = z.object({
  canceledCause: z
    .string()
    .min(1, "O campo causa do cancelamento é obrigatório"),
});

type CancelSolicitationModalForm = z.infer<typeof formSchema>;

export const CancelSolicitationModal: React.FC<
  CancelSolicitationModalProps
> = ({ isOpen, onClose, mutateAsync }) => {
  const [isMounted, setIsMounted] = useState(false);

  const form = useForm<CancelSolicitationModalForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { canceledCause: "" },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync(values as never);
    form.reset();
    onClose();
  };

  return (
    <Modal
      title="Cancelamento de Solicitação"
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl"
    >
      <div className="-mr-4 w-full overflow-y-auto py-1 pr-4">
        <Form {...form}>
          <form
            id="user-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-0.5"
          >
            <FormField
              control={form.control}
              name="canceledCause"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Causa do Cancelamento</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Defina aqui a causa do cancelamento..."
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full items-center justify-end space-x-2 pt-6">
              <Button
                type="submit"
                variant="destructive"
                className="cursor-pointer"
              >
                Cancelar Solicitacão
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

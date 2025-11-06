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
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { GenericResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Solicitations } from "../data-table/columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/*

Campos necessários:

Material: Provavelmente caixa de texto
Tipo de coleta: Dropdown
Qualidade das amostras: Dropdown (satisfatória, insatisfatória)
Avaliação clínica: Provavelmete caixa de texto
Conclusão: Provavelmente caixa de texto

 */

enum CollectType {
  TESTE1 = "Teste 1",
  TESTE2 = "Teste 2",
}

enum QualitySampleType {
  SATISFATORIA = "Satisfatória",
  INSATISFATORIA = "Insatisfatória",
}

interface FinishSolicitationModalProps {
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
  supplie: z.string().min(1, "O campo Material é obrigatório."),
  collectType: z.enum(Object.values(CollectType) as [string, ...string[]], {
    message: "Selecione o tipo de coleta.",
  }),
  qualitySampleType: z.enum(
    Object.values(QualitySampleType) as [string, ...string[]],
    {
      message: "Selecione a qualidade da amostra.",
    }
  ),
  clinicEvaluation: z.string().min(1, "Informe a avaliação clínica."),
  conclusion: z.string().min(1, "É necessário preencher a conclusão."),
});

type FinishSolicitationModalForm = z.infer<typeof formSchema>;

export const FinishSolicitationModal: React.FC<
  FinishSolicitationModalProps
> = ({ isOpen, onClose, mutateAsync }) => {
  const [isMounted, setIsMounted] = useState(false);

  const form = useForm<FinishSolicitationModalForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { supplie: "", conclusion: "", clinicEvaluation: "" },
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
      title="Finalização de Solicitação"
      isOpen={isOpen}
      onClose={onClose}
      className="md:max-w-lg max-w-2xl"
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
              name="supplie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Informe o material utilizado"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="collectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de coleta</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-2/3">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CollectType).map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qualitySampleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualidade das amostras</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-2/3">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(QualitySampleType).map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clinicEvaluation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avaliação clínica</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Defina aqui a avaliação clínica..."
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="conclusion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conclusão</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Disserte sobre a conclusão da solicitação..."
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full items-center justify-end space-x-2 pt-6">
              <Button type="submit" className="cursor-pointer">
                Continuar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { GenericResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Solicitations } from "../data-table/columns";

enum CollectType {
  NI = "Não informado",
  TESTE1 = "Teste 1",
  TESTE2 = "Teste 2",
}

enum QualitySampleType {
  SATISFATORIA = "Satisfatória",
  INSATISFATORIA = "Insatisfatória",
}

enum SolicitationResult {
  POSITIVO = "Positivo",
  NEGATIVO = "Negativo",
  INDETERMINADO = "Indeterminado",
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
  callback?: () => void;
}

const formSchema = z.object({
  solicitationColectTypeConclusion: z
    .string()
    .min(1, "Selecione o tipo de coleta."),
  solicitationSampleQuality: z
    .string()
    .min(1, "Selecione a qualidade da amostra."),
  solicitationClinicAvaliation: z
    .string()
    .min(1, "Informe a avaliação clínica."),
  solicitationResult: z.string().min(1, "Informe o resultado."),
  status: z.string().optional(),
});

type FinishSolicitationModalForm = z.infer<typeof formSchema>;

export const FinishSolicitationModal: React.FC<
  FinishSolicitationModalProps
> = ({ isOpen, onClose, mutateAsync, callback }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FinishSolicitationModalForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      solicitationClinicAvaliation: "",
      solicitationColectTypeConclusion: "",
      solicitationSampleQuality: "",
      solicitationResult: "",
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    await mutateAsync(values as never);
    form.reset();
    onClose();
    callback?.();
    setIsLoading(false);
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
              name="solicitationResult"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resultado</FormLabel>
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
                      {Object.entries(SolicitationResult).map((item) => (
                        <SelectItem key={item[0]} value={item[0].toString()}>
                          {item[1]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="solicitationSampleConclusion"
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
            /> */}
            <FormField
              control={form.control}
              name="solicitationColectTypeConclusion"
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
                      {Object.entries(CollectType).map((item) => (
                        <SelectItem key={item[0]} value={item[0].toString()}>
                          {item[1]}
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
              name="solicitationSampleQuality"
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
                      {Object.entries(QualitySampleType).map((item) => (
                        <SelectItem key={item[0]} value={item[0].toString()}>
                          {item[1]}
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
              name="solicitationClinicAvaliation"
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
            {/* <FormField
              control={form.control}
              name="solicitationConclusionText"
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
            /> */}
            <div className="flex w-full items-center justify-end space-x-2 pt-6">
              <Button
                type="submit"
                className="cursor-pointer w-1/4"
                disabled={isLoading}
              >
                {isLoading ? <Spinner className="size-5" /> : "Continuar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

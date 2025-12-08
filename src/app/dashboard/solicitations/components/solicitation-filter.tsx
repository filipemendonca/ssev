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
import { zodResolver } from "@hookform/resolvers/zod";
import { EraserIcon, Search } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { recordStatus, SolicitationStatus } from "../types/types";
import { SolicitationFilterDto } from "../dto/solicitation.filter.dto";
import { DateRange, DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangeProps {
  range: DateRange;
  rangeCompare?: DateRange;
}

const formSchema = z.object({
  tutor: z.string(),
  patient: z.string(),
  status: z.nativeEnum(SolicitationStatus).optional(),
  rangeDate: z
    .object({
      range: z.object({
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    })
    .optional(),
});

type SolicitationFilterForm = z.infer<typeof formSchema>;

interface SolicitationActionDialogProps {
  setSearch: Dispatch<SetStateAction<SolicitationFilterDto>>;
}

export function SolicitationFilter({
  setSearch,
}: Readonly<SolicitationActionDialogProps>) {
  const [range, setRange] = useState<DateRangeProps>();
  const form = useForm<SolicitationFilterForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tutor: "",
      patient: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (range?.range.from && range?.range.to) {
      values.rangeDate = {
        range: { from: range.range.from, to: range.range.to },
      };
    }
    setSearch(values as never);
  };

  const clearFilters = () => {
    globalThis.location.reload();
  };

  return (
    <div className="mx-auto w-full">
      <Form {...form}>
        <form
          id="user-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <FormField
              control={form.control}
              name="tutor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tutor</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rangeDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data da solicitação</FormLabel>
                  <FormControl>
                    <DateRangePicker
                      {...field}
                      onUpdate={(values) => setRange(values)}
                      locale="pt-BR"
                      showCompare={false}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
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
                      {Object.keys(recordStatus).map((item) => (
                        <SelectItem key={item} value={item}>
                          {recordStatus[item]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            form="user-form"
            className="cursor-pointer mr-2"
          >
            <Search />
            Pesquisar
          </Button>
          <Button
            type="button"
            className="cursor-pointer"
            variant={"link"}
            onClick={clearFilters}
          >
            <EraserIcon />
            Limpar Filtros
          </Button>
        </form>
      </Form>
    </div>
  );
}

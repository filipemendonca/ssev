"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { GenericResponse } from "@/types";
import { fetcher } from "@/utils/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowLeft } from "@tabler/icons-react";
import { SaveAll } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Exams } from "../../exams/data-table/columns";
import { InfectiousAgents } from "../../infectious-agents/data-table/columns";
import { Sample } from "../../sample/data-table/columns";
import { Solicitations } from "../data-table/columns";
import {
  BLOOD_COLLECTION_TUBE_COLOR,
  ExamResultType,
  ExamsWithCheck,
  InfectiousAgentsWithCheck,
  SampleWithCheck,
} from "../types/types";

enum GENDER {
  MACHO = "Macho",
  FEMEA = "Fêmea",
}

const formSchema = z.object({
  tutor: z.string().min(1, {
    message: "O campo Tutor é obrigatório.",
  }),
  patient: z.string().min(1, {
    message: "O campo Paciente é obrigatório.",
  }),
  age: z.string().min(1, {
    message: "O campo Idade é obrigatório.",
  }),
  doctor: z.string().min(1, {
    message: "O nome do Doutor é obrigatório.",
  }),
  specie: z.string().min(1, {
    message: "Informe a Espécie do animal.",
  }),
  hospitalVet: z.string().min(1, {
    message: "Informe o nome da clínica ou hospital.",
  }),
  samples: z.array(
    z.string().min(1, {
      message: "O campo Amostra é obrigatório.",
    })
  ),
  exams: z.array(
    z.string().min(1, {
      message: "O campo Exame é obrigatório.",
    })
  ),
  infectiousAgents: z.array(
    z.string().min(1, {
      message: "Selecione pelo menos um agente infeccioso.",
    })
  ),
  gender: z.enum(Object.values(GENDER) as [string, ...string[]], {
    message: "Selecione um gênero.",
  }),
  examResultType: z.enum(
    Object.values(ExamResultType) as [string, ...string[]],
    {
      message: "Selecione o tipo do exame.",
    }
  ),
  bloodCollectionTubeColor: z.enum(
    Object.values(BLOOD_COLLECTION_TUBE_COLOR) as [string, ...string[]],
    {
      message: "Selecione uma cor do tubo de coleta de sangue.",
    }
  ),
});

interface SolicitationsFormProps {
  initialData: Solicitations | undefined;
  pageTitle: string;
  isEdit: boolean;
}

export default function SolicitationsForm({
  initialData,
  pageTitle,
  isEdit,
}: Readonly<SolicitationsFormProps>) {
  const route = useRouter();
  const [sampleCheckboxes, setSampleCheckboxes] = useState<SampleWithCheck[]>(
    initialData?.samples as []
  );
  const [examsCheckboxes, setExamsCheckboxes] = useState<ExamsWithCheck[]>(
    initialData?.exams as []
  );
  const [infectiousAgentsCheckboxes, setInfectiousAgentsCheckboxes] = useState<
    InfectiousAgentsWithCheck[]
  >(initialData?.infectiousAgents as []);

  const defaultValues = {
    tutor: initialData?.tutor || "",
    patient: initialData?.patient || "",
    age: initialData?.age || "",
    doctor: initialData?.doctor || "",
    specie: initialData?.specie || "",
    hospitalVet: initialData?.hospitalVet || "",
    samples: initialData?.samples || [],
    exams: initialData?.exams || [],
    infectiousAgents: initialData?.infectiousAgents || [],
    gender: initialData?.gender || "",
    bloodCollectionTubeColor: initialData?.bloodCollectionTubeColor
      ? BLOOD_COLLECTION_TUBE_COLOR[
          initialData.bloodCollectionTubeColor as unknown as keyof typeof BLOOD_COLLECTION_TUBE_COLOR
        ]
      : "",
    examResultType: initialData?.examResultType
      ? ExamResultType[
          initialData.examResultType as unknown as keyof typeof ExamResultType
        ]
      : "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  const fetchDropdownItemsData = useCallback(async () => {
    const [infectiouAgentsData, examsData, sampleData] = await Promise.all([
      fetcher<GenericResponse<InfectiousAgents[]>>(
        "/infectious-agents?limit=1000&currentPage=1"
      ),
      fetcher<GenericResponse<Exams[]>>("/exams?limit=1000&currentPage=1"),
      fetcher<GenericResponse<Sample[]>>("/sample?limit=1000&currentPage=1"),
    ]);

    setSampleCheckboxes(
      sampleData?.data?.map((item) =>
        initialData?.samples.includes(item.id)
          ? { ...item, checked: true }
          : { ...item, checked: false }
      )
    );
    setExamsCheckboxes(
      examsData?.data?.map((item) =>
        initialData?.exams.includes(item.id)
          ? { ...item, checked: true }
          : { ...item, checked: false }
      )
    );
    setInfectiousAgentsCheckboxes(
      infectiouAgentsData?.data?.map((item) =>
        initialData?.infectiousAgents.includes(item.id)
          ? { ...item, checked: true }
          : { ...item, checked: false }
      )
    );
  }, [initialData?.exams, initialData?.infectiousAgents, initialData?.samples]);

  useEffect(() => {
    fetchDropdownItemsData();
  }, [fetchDropdownItemsData]);

  const toggleCheck = (id: string, value: boolean) => {
    setSampleCheckboxes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: value } : s))
    );

    setExamsCheckboxes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: value } : s))
    );

    setInfectiousAgentsCheckboxes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: value } : s))
    );
  };

  const { mutateAsync: createSolicitationAsync } = useApiMutation<
    GenericResponse<Solicitations>
  >({
    endpoint: "/solicitation",
    method: "POST",
    queryKeys: ["createSolicitation"],
    invalidateQueries: true,
    invalidateQueryKeys: ["solicitation"],
  });

  const { mutateAsync: editSolicitationAsync } = useApiMutation<
    GenericResponse<Solicitations>
  >({
    endpoint: `/solicitation/${initialData?.id}`,
    method: "PUT",
    queryKeys: ["editSolicitation"],
    invalidateQueries: true,
    invalidateQueryKeys: ["solicitation"],
  });

  async function mapProperties(values: z.infer<typeof formSchema>) {
    return {
      ...values,
      samples: sampleCheckboxes.filter((s) => s.checked).map((s) => s.id),
      exams: examsCheckboxes.filter((e) => e.checked).map((e) => e.id),
      infectiousAgents: infectiousAgentsCheckboxes
        .filter((i) => i.checked)
        .map((i) => i.id),
      examResultType: Object.entries(ExamResultType).find(
        ([, val]) => val === values.examResultType
      )?.[0],
      bloodCollectionTubeColor: Object.entries(
        BLOOD_COLLECTION_TUBE_COLOR
      ).find(([, val]) => val === values.bloodCollectionTubeColor)?.[0],
    };
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    //Populate samples, exams and infectious agents from checkboxes
    const obj = await mapProperties(values);
    if (isEdit) {
      await editSolicitationAsync(obj as never);
    } else {
      await createSolicitationAsync(obj as never);
    }
    form.reset();

    route.push("/dashboard/solicitations");
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="tutor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tutor</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o nome do tutor" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input
                        placeholder="Insira o nome do paciente"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Espécie / Raça</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insira a espécie ou raça do animal."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Insira a idade do animal."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gênero</FormLabel>
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
                        {Object.values(GENDER).map((item) => (
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
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="doctor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doutor</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o nome do doutor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hospitalVet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clínica / Hospital</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Insira o nome da clínica ou hospital."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-5 mt-5">
              <FormField
                control={form.control}
                name="examResultType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de exame</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-2/3">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ExamResultType).map((item) => (
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
                name="bloodCollectionTubeColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tubo de coleta de sangue</FormLabel>
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
                        {Object.values(BLOOD_COLLECTION_TUBE_COLOR).map(
                          (item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Card className="mx-auto w-full">
              <CardHeader>
                <CardTitle className="text-left text-md">Amostra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {sampleCheckboxes?.map((sample) => (
                    <div
                      key={sample.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={sample.id}
                        checked={sample.checked}
                        onCheckedChange={(value) =>
                          toggleCheck(sample.id, value === true)
                        }
                        className="cursor-pointer"
                      />
                      <Label htmlFor={sample.id}>{sample.name}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mx-auto w-full">
              <CardHeader>
                <CardTitle className="text-left text-md">Exames</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {examsCheckboxes?.map((exams) => (
                    <div key={exams.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={exams.id}
                        checked={exams.checked}
                        onCheckedChange={(value) =>
                          toggleCheck(exams.id, value === true)
                        }
                        className="cursor-pointer"
                      />
                      <Label htmlFor={exams.id}>{exams.name}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mx-auto w-full">
              <CardHeader>
                <CardTitle className="text-left text-md">
                  Agentes Infecciosos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {infectiousAgentsCheckboxes?.map((infectiousAgents) => (
                    <div
                      key={infectiousAgents.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={infectiousAgents.id}
                        checked={infectiousAgents.checked}
                        onCheckedChange={(value) =>
                          toggleCheck(infectiousAgents.id, value === true)
                        }
                        className="cursor-pointer"
                      />
                      <Label htmlFor={infectiousAgents.id}>
                        {infectiousAgents.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Link
              href="/dashboard/solicitations"
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

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
import { useUserStore } from "@/context/stores/user.store";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { GenericResponse } from "@/types";
import { fetcher } from "@/utils/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowLeft } from "@tabler/icons-react";
import { CheckIcon, SaveAll } from "lucide-react";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useConfigureButtonToSolicitations } from "../../../../hooks/use-configure-buttons-to-solicitation";
import { Exams } from "../../exams/data-table/columns";
import { InfectiousAgents } from "../../infectious-agents/data-table/columns";
import { Sample } from "../../sample/data-table/columns";
import { Solicitations } from "../data-table/columns";
import {
  ExamResultType,
  ExamsWithCheck,
  InfectiousAgentsWithCheck,
  recordStatus,
  SampleWithCheck,
  SolicitationFormValues,
  SolicitationStatus,
  styles,
} from "../types/types";
import { changeToNextStatus, updateTextDialogByStatus } from "../utils/utils";
import { FinishSolicitationModal } from "./finish-solicitation-modal";

enum GENDER {
  MACHO = "Macho",
  FEMEA = "Fêmea",
}

const BLOOD_COLLECTION_TUBE_COLOR_ARRAY = [
  { id: "TAMPA_ROXA", name: "Tampa Roxa", checked: false, key: nanoid() },
  {
    id: "TAMPA_VERMELHA",
    name: "Tampa Vermelha",
    checked: false,
    key: nanoid(),
  },
  { id: "TAMPA_CINZA", name: "Tampa Cinza", checked: false, key: nanoid() },
  { id: "TAMPA_AZUL", name: "Tampa Azul", checked: false, key: nanoid() },
];

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
      message: "Escolha ao menos uma amostra.",
    })
  ),
  exams: z.array(
    z.string().min(1, {
      message: "Escolha ao menos um exame.",
    })
  ),
  infectiousAgents: z.array(
    z.string().min(1, {
      message: "Escolha ao menos um agente infeccioso.",
    })
  ),
  gender: z.enum(Object.values(GENDER) as [string, ...string[]], {
    message: "Selecione o gênero.",
  }),
  examResultType: z.enum(
    Object.values(ExamResultType) as [string, ...string[]],
    {
      message: "Selecione o tipo do exame.",
    }
  ),
  bloodCollectionTubeColor: z.array(
    z.string().min(1, {
      message: "Escolha ao menos uma cor do tubo de coleta de sangue.",
    })
  ),
});

interface SolicitationsFormProps {
  initialData: Solicitations | undefined;
  pageTitle: string;
  isEdit: boolean;
  isView?: boolean;
}

export default function SolicitationsForm({
  initialData,
  pageTitle,
  isEdit,
  isView,
}: Readonly<SolicitationsFormProps>) {
  const route = useRouter();
  const { user } = useUserStore();
  const { enableChangeStatus } = useConfigureButtonToSolicitations(
    initialData ? initialData.status : SolicitationStatus.CRIADO,
    user ? user.role : null
  );
  const [sampleCheckboxes, setSampleCheckboxes] = useState<SampleWithCheck[]>(
    initialData?.samples as []
  );
  const [examsCheckboxes, setExamsCheckboxes] = useState<ExamsWithCheck[]>(
    initialData?.exams as []
  );
  const [infectiousAgentsCheckboxes, setInfectiousAgentsCheckboxes] = useState<
    InfectiousAgentsWithCheck[]
  >(initialData?.infectiousAgents as []);
  const [
    bloodCollectionTubeColorCheckboxes,
    setBloodCollectionTubeColorCheckboxes,
  ] = useState(BLOOD_COLLECTION_TUBE_COLOR_ARRAY);
  const [openFinishSolicitationModal, setOpenFinishSolicitationModal] =
    useState(false);

  const defaultValues = {
    userId: initialData?.userId || "",
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
    bloodCollectionTubeColor: initialData?.bloodCollectionTubeColor || [],
    examResultType: initialData?.examResultType
      ? ExamResultType[
          initialData.examResultType as unknown as keyof typeof ExamResultType
        ]
      : "",
  };

  const { buttonGridText } = updateTextDialogByStatus(initialData?.status);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  const populateCheckboxes = useCallback(
    (
      sampleData: GenericResponse<Sample[]>,
      examsData: GenericResponse<Exams[]>,
      infectiouAgentsData: GenericResponse<InfectiousAgents[]>
    ) => {
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
    },
    [initialData?.exams, initialData?.infectiousAgents, initialData?.samples]
  );

  const populateBloodCollectionTubeColorCheckboxes = useCallback(() => {
    setBloodCollectionTubeColorCheckboxes((prev) =>
      prev.map((bctc) =>
        initialData?.bloodCollectionTubeColor.includes(bctc.id)
          ? { ...bctc, checked: true }
          : { ...bctc, checked: false }
      )
    );
  }, [initialData?.bloodCollectionTubeColor]);

  const fetchDropdownItemsData = useCallback(async () => {
    const [infectiouAgentsData, examsData, sampleData] = await Promise.all([
      fetcher<GenericResponse<InfectiousAgents[]>>(
        "/infectious-agents?limit=1000&currentPage=1"
      ),
      fetcher<GenericResponse<Exams[]>>("/exams?limit=1000&currentPage=1"),
      fetcher<GenericResponse<Sample[]>>("/sample?limit=1000&currentPage=1"),
    ]);

    populateCheckboxes(sampleData, examsData, infectiouAgentsData);
  }, [populateCheckboxes]);

  useEffect(() => {
    fetchDropdownItemsData();
    populateBloodCollectionTubeColorCheckboxes();
  }, [fetchDropdownItemsData, populateBloodCollectionTubeColorCheckboxes]);

  const samplesWithKey = sampleCheckboxes?.map((item) => ({
    ...item,
    key: nanoid(),
  }));
  const examsWithKey = examsCheckboxes?.map((item) => ({
    ...item,
    key: nanoid(),
  }));
  const infectiousAgentsWithKey = infectiousAgentsCheckboxes?.map((item) => ({
    ...item,
    key: nanoid(),
  }));

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

    setBloodCollectionTubeColorCheckboxes((prev) =>
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
    method: "PATCH",
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
      bloodCollectionTubeColor: bloodCollectionTubeColorCheckboxes
        .filter((s) => s.checked)
        .map((s) => s.id),
    } as SolicitationFormValues;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    //Populate samples, exams and infectious agents from checkboxes
    const obj = await mapProperties(values);

    if (isEdit) {
      await editSolicitationAsync(obj as never);
    } else {
      obj.userId = user?.id;
      await createSolicitationAsync(obj as never);
    }
    form.reset();

    route.push("/dashboard/solicitations");
  }

  const handleChangeStatus = async () => {
    if (initialData?.status) {
      if (initialData.status === SolicitationStatus.EM_ANALISE) {
        setOpenFinishSolicitationModal(true);
        return;
      } else {
        initialData.status = changeToNextStatus(initialData.status);
        await editSolicitationAsync(initialData as never);
        route.push("/dashboard/solicitations");
      }
    }
  };

  const renderChangeStatusButton = () =>
    initialData && enableChangeStatus && buttonGridText !== undefined ? (
      <Button
        type="button"
        className="cursor-pointer"
        onClick={handleChangeStatus}
        variant={
          initialData?.status === SolicitationStatus.EM_ANALISE
            ? "success"
            : "default"
        }
      >
        <CheckIcon className="mr-2 h-4 w-4" /> {buttonGridText}
      </Button>
    ) : (
      <></>
    );

  const renderButtonChangeStatus = () =>
    isView ? renderChangeStatusButton() : <></>;

  const renderStatusBadge = () =>
    isView && initialData ? (
      <span
        className={`inline-flex items-center rounded-2xl px-2.5 py-0.5 text-xs font-medium ml-2 ${
          styles[initialData.status as keyof typeof styles] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {recordStatus[initialData.status]}
      </span>
    ) : (
      <></>
    );

  return (
    <>
      <FinishSolicitationModal
        isOpen={openFinishSolicitationModal}
        onClose={() => setOpenFinishSolicitationModal(false)}
        mutateAsync={editSolicitationAsync}
        callback={() => globalThis.location.reload()}
      />

      <Card className="mx-auto w-full">
        <CardHeader>
          <CardTitle className="flex justify-between text-2xl font-bold ">
            <div className="flex justify-between">
              {pageTitle}
              {renderStatusBadge()}
            </div>
            <div className="flex justify-between">
              {renderButtonChangeStatus()}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="tutor"
                  disabled={isView}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tutor</FormLabel>
                      <FormControl>
                        <Input
                          autoFocus
                          placeholder="Insira o nome do tutor"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="patient"
                  disabled={isView}
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
                  disabled={isView}
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
                  disabled={isView}
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
                        disabled={isView}
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
                  disabled={isView}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doutor</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Insira o nome do doutor"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hospitalVet"
                  disabled={isView}
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
                  disabled={isView}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de exame</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        disabled={isView}
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

                {/* <FormField
                control={form.control}
                name="bloodCollectionTubeColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tubo de coleta de sangue</FormLabel>
                    <Select
                      disabled={isView}
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
              /> */}
              </div>

              <Card className="mx-auto w-full">
                <CardHeader>
                  <CardTitle className="text-left text-md">
                    Tubo de coleta de sangue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {bloodCollectionTubeColorCheckboxes?.map((bctc) => (
                      <div
                        key={bctc.key}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={bctc.id}
                          disabled={isView}
                          checked={bctc.checked}
                          onCheckedChange={(value) =>
                            toggleCheck(bctc.id, value === true)
                          }
                          className="cursor-pointer"
                        />
                        <Label htmlFor={bctc.id}>{bctc.name}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mx-auto w-full">
                <CardHeader>
                  <CardTitle className="text-left text-md">Amostra</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {samplesWithKey?.map((sample) => (
                      <div
                        key={sample.key}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={sample.id}
                          disabled={isView}
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
                    {examsWithKey?.map((exams) => (
                      <div
                        key={exams.key}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={exams.id}
                          checked={exams.checked}
                          disabled={isView}
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
                    {infectiousAgentsWithKey?.map((infectiousAgents) => (
                      <div
                        key={infectiousAgents.key}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={infectiousAgents.id}
                          checked={infectiousAgents.checked}
                          disabled={isView}
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
              {isView ?? (
                <Button type="submit" className="cursor-pointer">
                  <SaveAll />
                  Salvar
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

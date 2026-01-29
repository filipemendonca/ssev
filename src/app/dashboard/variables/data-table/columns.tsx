"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CellAction } from "./cell-actions";
import { mapColumns } from "@/utils/columnsTranslations";

const translations: Record<string, string> = {
  gender: "Gênero",
  tutor: "Tutor",
  patient: "Paciente",
  doctor: "Veterinário",
  hospitalVet: "Hospital Veterinário",
  age: "Idade",
  createdAt: "Data de criação da solicitação",
  updatedAt: "Data de atualização da solicitação",
  finishedAt: "Data de finalização da solicitação",
  canceledAt: "Data de cancelamento da solicitação",
  status: "Status",
  specie: "Espécie",
  samples: "Amostras",
  exams: "Exames",
  examResultType: "Tipo de Resultado do Exame",
  infectiousAgents: "Agentes Infecciosos",
  bloodCollectionTubeColor: "Cor do Tubo de Coleta de Sangue",
  solicitationClinicAvaliation: "Avaliação Clínica da Solicitação",
  solicitationColectTypeConclusion: "Tipo de Coleta da Solicitação (Conslusão)",
  solicitationConclusionText: "Texto de Conclusão da Solicitação",
  solicitationResult: "Resultado da Solicitação",
  solicitationSampleConclusion: "Material usado na coleta",
  solicitationSampleQuality: "Qualidade da Amostra da Solicitação",
};

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Variables = {
  id: string;
  variableName: string;
  fieldRelated: string;
  tableRelated: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Variables>[] = [
  {
    accessorKey: "variableName",
    header: "Variavel",
  },
  {
    accessorKey: "fieldRelated",
    header: "Campo relacionado",
    cell: ({ getValue }) => {
      return mapColumns(translations, getValue() as string);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Atualizado em",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <CellAction model={row.original} />,
  },
];

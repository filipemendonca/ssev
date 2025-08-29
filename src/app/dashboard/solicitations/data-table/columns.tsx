"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CellAction } from "./cell-actions";
import {
  BLOOD_COLLECTION_TUBE_COLOR,
  ExamResultType,
  SolicitationStatus,
} from "../types/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Solicitations = {
  id: string;
  userId: string;
  tutor: string;
  patient: string;
  gender: string;
  age: string;
  doctor: string;
  specie: string;
  hospitalVet: string;
  samples: string[];
  exams: string[];
  infectiousAgents: string[];
  bloodCollectionTubeColor: BLOOD_COLLECTION_TUBE_COLOR;
  status: SolicitationStatus;
  canceledAt: string;
  canceledReason: string;
  finishedAt: string;
  blockedAt: string;
  blockedReason: string;
  examResultType: ExamResultType;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Solicitations>[] = [
  {
    accessorKey: "tutor",
    header: "Tutor",
  },
  {
    accessorKey: "patient",
    header: "Paciente",
  },
  {
    accessorKey: "doctor",
    header: "Doutor",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;

      const styles = {
        CRIADO: "bg-blue-100 text-blue-800",
        EM_ANALISE: "bg-yellow-100 text-yellow-800",
        EM_TRANSPORTE: "bg-yellow-100 text-yellow-800",
        FILTRAGEM: "bg-yellow-100 text-yellow-800",
        BLOQUEADO: "bg-orange-100 text-orange-800",
        FINALIZADO: "bg-green-100 text-green-800",
        CANCELADO: "bg-red-100 text-red-800",
      };

      const recordStatus: Record<string, string> = {
        CRIADO: "Criado",
        EM_ANALISE: "Em análise",
        EM_TRANSPORTE: "Em transporte",
        FILTRAGEM: "Filtragem",
        BLOQUEADO: "Bloqueado",
        FINALIZADO: "Finalizado",
        CANCELADO: "Cancelado",
      };

      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"
          }`}
        >
          {recordStatus[status]}
        </span>
      );
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

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CellAction } from "./cell-actions";
import {
  BLOOD_COLLECTION_TUBE_COLOR,
  ExamResultType,
  recordStatus,
  SolicitationStatus,
  styles,
} from "../types/types";
import { Dispatch, SetStateAction } from "react";

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
  canceledCause: string;
  finishedAt: string;
  blockedAt: string;
  blockedCause: string;
  examResultType: ExamResultType;
  createdAt: string;
  updatedAt: string;
};

export const columns = (
  shouldShowActions: boolean,
  setSolicitationId?: Dispatch<SetStateAction<string>>,
  setOpenBlockedSolicitationModal?: Dispatch<SetStateAction<boolean>>
): ColumnDef<Solicitations>[] => {
  const baseColumns: ColumnDef<Solicitations>[] = [
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

        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              styles[status as keyof typeof styles] ||
              "bg-gray-100 text-gray-800"
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
  ];

  if (shouldShowActions) {
    baseColumns.push({
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <CellAction
          model={row.original}
          setOpenBlockedSolicitationModal={setOpenBlockedSolicitationModal}
          setSolicitationId={setSolicitationId}
        />
      ),
    });
  }

  return baseColumns;
};

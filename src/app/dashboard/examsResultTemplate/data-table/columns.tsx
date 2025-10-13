"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CellAction } from "./cell-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ExamsResultTemplate = {
  id: string;
  name: string;
  fileName: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<ExamsResultTemplate>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "fileName",
    header: "Arquivo",
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

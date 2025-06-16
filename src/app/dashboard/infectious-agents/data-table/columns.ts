"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type InfectiousAgents = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<InfectiousAgents>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
  },
  {
    accessorKey: "updatedAt",
    header: "Atualizado em",
  },
];

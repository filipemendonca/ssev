"use client";

import { DataTable } from "@/components/ui/table/data-table";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface InfectiousAgentsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function InfectiousAgentsDataTable<TData, TValue>({
  columns,
  data,
}: Readonly<InfectiousAgentsTableProps<TData, TValue>>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });
  return <DataTable table={table} />;
}

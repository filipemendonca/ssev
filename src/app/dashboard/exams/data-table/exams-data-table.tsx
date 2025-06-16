"use client";

import { DataTable } from "@/components/ui/table/data-table";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface ExamsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ExamsDataTable<TData, TValue>({
  columns,
  data,
}: Readonly<ExamsTableProps<TData, TValue>>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });
  return <DataTable table={table} />;
}

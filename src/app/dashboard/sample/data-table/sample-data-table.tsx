"use client";

import { DataTable } from "@/components/ui/table/data-table";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface SampleTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function SampleDataTable<TData, TValue>({
  columns,
  data,
}: Readonly<SampleTableProps<TData, TValue>>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });
  return <DataTable table={table} />;
}

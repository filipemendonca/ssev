"use client";

import { DataTable } from "@/components/ui/table/data-table";
import { GenericResponse, PaginationOptions } from "@/types";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";

interface GenericDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  item: GenericResponse<TData[]>;
  setPaginationOptions: Dispatch<SetStateAction<PaginationOptions>>;
}

export function GenericDataDataTable<TData, TValue>({
  columns,
  item,
  setPaginationOptions,
}: Readonly<GenericDataTableProps<TData, TValue>>) {
  const { data, meta } = item ?? {};

  const table = useReactTable({
    columns,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: meta?.totalPages ?? 0,
    state: {
      pagination: {
        pageIndex: meta?.currentPage ? meta.currentPage - 1 : 0,
        pageSize: meta?.limit ?? 10,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater !== "function") return;

      const newPageInfo = updater(table.getState().pagination);

      setPaginationOptions({
        currentPage: newPageInfo.pageIndex + 1,
        limit: newPageInfo.pageSize,
      });
    },
  });
  return <DataTable table={table} meta={meta} />;
}

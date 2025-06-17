"use client";
import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { ExamsDataTable } from "./data-table/exams-data-table";
import { columns, Exams } from "./data-table/columns";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { ExamsActionDialog } from "./components/exams-action-dialog";
import { GenericResponse } from "@/types";
import { useApiQuery } from "@/hooks/use-api-query";

export default function Page() {
  const [openDialog, setOpenDialog] = useState(false);
  const { data } = useApiQuery<GenericResponse<Exams[]>>(["exams"], "/exams");

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Exames" description="Gerencie os Exames." />
          <Link
            href="#"
            className={cn(buttonVariants(), "text-xs md:text-sm")}
            onClick={() => setOpenDialog(true)}
          >
            <IconPlus className="mr-2 h-4 w-4" /> Novo
          </Link>
        </div>
        <Separator />
        <Suspense
          // key={key}
          fallback={
            <DataTableSkeleton columnCount={2} rowCount={8} filterCount={2} />
          }
        >
          <ExamsDataTable columns={columns} data={data?.data ?? []} />
        </Suspense>
      </div>
      <ExamsActionDialog open={openDialog} onOpenChange={setOpenDialog} />
    </PageContainer>
  );
}

"use client";
import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { useApiQuery } from "@/hooks/use-api-query";
import { cn } from "@/lib/utils";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { SampleActionDialog } from "./components/sample-action-dialog";
import { columns, Sample } from "./data-table/columns";
import { SampleDataTable } from "./data-table/sample-data-table";
import { GenericResponse } from "@/types";

export default function Page() {
  const [openDialog, setOpenDialog] = useState(false);

  const { data } = useApiQuery<GenericResponse<Sample[]>>(
    ["sample"],
    "/sample"
  );

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Amostras"
            description="Gerencie as amostras a serem coletadas."
          />
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
          fallback={
            <DataTableSkeleton columnCount={3} rowCount={8} filterCount={2} />
          }
        >
          <SampleDataTable columns={columns} data={data?.data ?? []} />
        </Suspense>
      </div>
      <SampleActionDialog open={openDialog} onOpenChange={setOpenDialog} />
    </PageContainer>
  );
}

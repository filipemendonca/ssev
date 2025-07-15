"use client";
import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { GenericDataDataTable } from "@/components/ui/table/generic-data-table";
import { useApiQuery } from "@/hooks/use-api-query";
import { cn } from "@/lib/utils";
import { GenericResponse, PaginationOptions } from "@/types";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { SampleCreateDialog } from "./components/sample-create-dialog";
import { columns, Sample } from "./data-table/columns";

export default function Page() {
  const [openDialog, setOpenDialog] = useState(false);
  // const [dataFiltered, setDataFiltered] = useState<GenericResponse<Sample[]>>();

  const [paginationOptions, setPaginationOptions] = useState<PaginationOptions>(
    {
      currentPage: 1,
      limit: 10,
    }
  );

  const { data } = useApiQuery<GenericResponse<Sample[]>>(
    ["sample", paginationOptions],
    `/sample?limit=${paginationOptions.limit}&currentPage=${paginationOptions.currentPage}`
  );

  // useEffect(() => {
  //   setDataFiltered(data);
  // }, [data]);

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
            <IconPlus /> Novo
          </Link>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={3} rowCount={8} filterCount={2} />
          }
        >
          <GenericDataDataTable
            columns={columns}
            item={data as GenericResponse<Sample[]>}
            setPaginationOptions={setPaginationOptions}
          />
        </Suspense>
      </div>
      <SampleCreateDialog open={openDialog} onOpenChange={setOpenDialog} />
    </PageContainer>
  );
}

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
import { Suspense, useEffect, useState } from "react";
import { columns, InfectiousAgents } from "./data-table/columns";
import { InfectiousAgentsCreateDialog } from "./components/infectious-agents-create-dialog";
import { InfectiousAgentsFilter } from "./components/infectious-agents-filter";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { InfectiousAgentsFilterDto } from "./dto/infectious-agents.dto";

const baseUrl = "/infectious-agents";

export default function Page() {
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState<InfectiousAgentsFilterDto | null>(null);
  const [paginationOptions, setPaginationOptions] = useState<PaginationOptions>(
    {
      currentPage: 1,
      limit: 10,
    }
  );

  const paginationUrl = `?limit=${paginationOptions.limit}&currentPage=${paginationOptions.currentPage}`;

  const { data: getAll } = useApiQuery<GenericResponse<InfectiousAgents[]>>(
    ["infectious-agents", paginationOptions],
    `${baseUrl}${paginationUrl}`
  );

  const { mutateAsync: searchAsync, data: getSearched } = useApiMutation<
    GenericResponse<InfectiousAgents[]>
  >({
    endpoint: `${baseUrl}/search${paginationUrl}`,
    method: "POST",
    queryKeys: ["infectiousAgentsSearch"],
  });

  useEffect(() => {
    if (search !== null) searchAsync(search as never);
  }, [searchAsync, search]);

  const data = search?.name
    ? (getSearched as GenericResponse<InfectiousAgents[]>)
    : (getAll as GenericResponse<InfectiousAgents[]>);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Agentes Infecciosos"
            description="Gerencie os Agentes Infecciosos."
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
        <InfectiousAgentsFilter setSearch={setSearch} />
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={2} rowCount={8} filterCount={2} />
          }
        >
          <GenericDataDataTable
            columns={columns}
            item={data}
            setPaginationOptions={setPaginationOptions}
          />
        </Suspense>
      </div>
      <InfectiousAgentsCreateDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
    </PageContainer>
  );
}

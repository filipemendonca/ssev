"use client";
import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { InfectiousAgentsDataTable } from "./data-table/infectious-agents-data-table";
import { columns, InfectiousAgents } from "./data-table/columns";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { InfectiousAgentsActionDialog } from "./components/infectious-agents-action-dialog";
import { GenericResponse } from "@/types";
import { useApiQuery } from "@/hooks/use-api-query";

export default function Page() {
  const [openDialog, setOpenDialog] = useState(false);

  const { data } = useApiQuery<GenericResponse<InfectiousAgents[]>>(
    ["infectious-agents"],
    "/infectious-agents"
  );

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
        <Suspense
          // key={key}
          fallback={
            <DataTableSkeleton columnCount={2} rowCount={8} filterCount={2} />
          }
        >
          <InfectiousAgentsDataTable
            columns={columns}
            data={data?.data ?? []}
          />
        </Suspense>
      </div>
      <InfectiousAgentsActionDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
    </PageContainer>
  );
}

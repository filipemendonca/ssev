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
import { BlockSolicitationModal } from "./components/block-solicitation-modal";
import { columns, Solicitations } from "./data-table/columns";
import { SolicitationStatus } from "./types/types";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { CancelSolicitationModal } from "./components/cancel-solicitation-modal";

export default function Page() {
  const [solicitationId, setSolicitationId] = useState("");
  const [paginationOptions, setPaginationOptions] = useState<PaginationOptions>(
    {
      currentPage: 1,
      limit: 10,
    }
  );

  const [openBlockedSolicitationModal, setOpenBlockedSolicitationModal] =
    useState(false);
  const [openCanceledSolicitationModal, setOpenCanceledSolicitationModal] =
    useState(false);

  const { data } = useApiQuery<GenericResponse<Solicitations[]>>(
    ["solicitation", paginationOptions],
    `/solicitation?limit=${paginationOptions.limit}&currentPage=${paginationOptions.currentPage}`
  );

  const { mutateAsync: blockUnblockSolicitationAsync } = useApiMutation<
    GenericResponse<Solicitations>
  >({
    endpoint: `/solicitation/blockUnblockSolicitation/${solicitationId}`,
    method: "PATCH",
    queryKeys: ["blockUnblockSolicitation"],
    invalidateQueries: true,
    invalidateQueryKeys: ["solicitation"],
  });

  const { mutateAsync: cancelSolicitationAsync } = useApiMutation<
    GenericResponse<Solicitations>
  >({
    endpoint: `/solicitation/cancelSolicitation/${solicitationId}`,
    method: "PATCH",
    queryKeys: ["cancelSolicitation"],
    invalidateQueries: true,
    invalidateQueryKeys: ["solicitation"],
  });

  const hasNonFinalized = data?.data?.some(
    (row) => row.status !== SolicitationStatus.FINALIZADO
  );

  const columnsDefinitions = columns(
    hasNonFinalized!,
    setSolicitationId,
    setOpenBlockedSolicitationModal,
    setOpenCanceledSolicitationModal
  );

  return (
    <>
      <BlockSolicitationModal
        isOpen={openBlockedSolicitationModal}
        onClose={() => setOpenBlockedSolicitationModal(false)}
        mutateAsync={blockUnblockSolicitationAsync}
      />
      <CancelSolicitationModal
        isOpen={openCanceledSolicitationModal}
        onClose={() => setOpenCanceledSolicitationModal(false)}
        mutateAsync={cancelSolicitationAsync}
      />
      <PageContainer scrollable={false}>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-start justify-between">
            <Heading
              title="Solicitações"
              description="Gerencie as solicitações."
            />
            <Link
              href="/dashboard/solicitations/create"
              className={cn(buttonVariants(), "text-xs md:text-sm")}
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
            <GenericDataDataTable
              columns={columnsDefinitions}
              item={data as GenericResponse<Solicitations[]>}
              setPaginationOptions={setPaginationOptions}
              isClicable={true}
            />
          </Suspense>
        </div>
      </PageContainer>
    </>
  );
}

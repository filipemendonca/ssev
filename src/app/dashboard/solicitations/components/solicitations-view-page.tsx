"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenericResponse } from "@/types";
import { fetcher } from "@/utils/fetcher";
import { TabsContent } from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import { Solicitations } from "../data-table/columns";
import { SolicitationStatus } from "../types/types";
import SolicitationsForm from "./solicitations-form";
import SolicitationBlocked from "./solicitation-blocked";
import SolicitationCanceled from "./solicitation-canceled";

type TUsersViewPageProps = {
  solicitationsId: string;
  viewMode?: boolean;
};

export default function SolicitationsViewPage({
  solicitationsId,
  viewMode,
}: Readonly<TUsersViewPageProps>) {
  const isEdit = solicitationsId !== "create" && !viewMode;

  const { data } = useQuery<GenericResponse<Solicitations>>({
    queryKey: ["getSolicitationsById", solicitationsId],
    queryFn: () =>
      fetcher<GenericResponse<Solicitations>>(
        `/solicitation/${solicitationsId}`
      ),
    enabled: isEdit || viewMode,
  });

  const solicitations = isEdit || viewMode ? data?.data : undefined;

  let pageTitle = "Solicitação - Novo";

  if (solicitationsId !== "create") {
    if (viewMode) {
      pageTitle = `Solicitação - Visualizar`;
    } else {
      pageTitle = `Solicitação - Editar`;
    }
  }

  const hasSolicitationBlocked =
    data?.data?.status === SolicitationStatus.BLOQUEADO;

  const hasSolicitationCanceled =
    data?.data?.status === SolicitationStatus.CANCELADO;

  return (
    <Tabs defaultValue="solicitationForm">
      <TabsList>
        <TabsTrigger className="cursor-pointer" value="solicitationForm">
          Cadastro
        </TabsTrigger>
        {hasSolicitationBlocked && (
          <TabsTrigger className="cursor-pointer" value="blockedSolicitation">
            Bloqueio de solicitação
          </TabsTrigger>
        )}

        {hasSolicitationCanceled && (
          <TabsTrigger className="cursor-pointer" value="canceledSolicitation">
            Cancelamento de solicitação
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="solicitationForm">
        <SolicitationsForm
          isEdit={isEdit}
          initialData={solicitations}
          pageTitle={pageTitle}
          isView={viewMode}
        />
      </TabsContent>
      <TabsContent value="blockedSolicitation">
        <SolicitationBlocked
          pageTitle="Solicitação bloqueada"
          initialData={solicitations}
        />
      </TabsContent>
      <TabsContent value="canceledSolicitation">
        <SolicitationCanceled
          pageTitle="Solicitação cancelada"
          initialData={solicitations}
        />
      </TabsContent>
    </Tabs>
  );
}

"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenericResponse } from "@/types";
import { fetcher } from "@/utils/fetcher";
import { TabsContent } from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Solicitations } from "../data-table/columns";
import { SolicitationStatus } from "../types/types";
import SolicitationBlocked from "./solicitation-blocked";
import SolicitationCanceled from "./solicitation-canceled";
import SolicitationsForm from "./solicitations-form";

type TUsersViewPageProps = {
  solicitationsId: string;
  viewMode?: boolean;
};

export default function SolicitationsViewPage({
  solicitationsId,
  viewMode,
}: Readonly<TUsersViewPageProps>) {
  const router = useRouter();
  const isEdit = solicitationsId !== "create" && !viewMode;

  const { data } = useQuery<GenericResponse<Solicitations>>({
    queryKey: ["getSolicitationsById", solicitationsId],
    queryFn: () =>
      fetcher<GenericResponse<Solicitations>>(
        `/solicitation/${solicitationsId}?isViewMode=${viewMode ?? false}`
      ),
    enabled: isEdit || viewMode,
  });

  useEffect(() => {
    if (data?.statusCode === 404 && solicitationsId !== "create") {
      router.push("/not-found");
    }
    if (data?.statusCode === 403) router.push("/forbidden");
  }, [data, router, solicitationsId]);

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

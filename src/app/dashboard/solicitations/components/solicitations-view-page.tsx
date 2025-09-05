"use client";
import { GenericResponse } from "@/types";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import { Solicitations } from "../data-table/columns";
import SolicitationsForm from "./solicitations-form";

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

  return (
    <SolicitationsForm
      isEdit={isEdit}
      initialData={solicitations}
      pageTitle={pageTitle}
      isView={viewMode}
    />
  );
}

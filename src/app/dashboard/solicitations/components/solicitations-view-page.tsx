"use client";
import { GenericResponse } from "@/types";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import { Solicitations } from "../data-table/columns";
import SolicitationsForm from "./solicitations-form";

type TUsersViewPageProps = {
  solicitationsId: string;
};

export default function SolicitationsViewPage({
  solicitationsId,
}: Readonly<TUsersViewPageProps>) {
  const isEdit = solicitationsId !== "create";

  const { data } = useQuery<GenericResponse<Solicitations>>({
    queryKey: ["getSolicitationsById", solicitationsId],
    queryFn: () =>
      fetcher<GenericResponse<Solicitations>>(
        `/solicitation/${solicitationsId}`
      ),
    enabled: isEdit,
  });

  const solicitations = isEdit ? data?.data : undefined;

  let pageTitle = "Solicitação - Novo";

  if (solicitationsId !== "create") {
    pageTitle = `Solicitação - Editar`;
  }

  return (
    <SolicitationsForm
      isEdit={isEdit}
      initialData={solicitations}
      pageTitle={pageTitle}
    />
  );
}

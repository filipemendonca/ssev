"use client";
import { GenericResponse } from "@/types";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import { Variables } from "../data-table/columns";
import VariablesForm from "./variables-form";

type VariablesPageProps = {
  variableId: string;
};

export default function VariablesPage({
  variableId,
}: Readonly<VariablesPageProps>) {
  const isEdit = variableId !== "create";

  const { data } = useQuery<GenericResponse<Variables>>({
    queryKey: ["getVariablesId", variableId],
    queryFn: () =>
      fetcher<GenericResponse<Variables>>(`/variables/${variableId}`),
    enabled: isEdit,
  });

  const variables = isEdit ? data?.data : undefined;

  let pageTitle = "Cadastro de Variáveis - Novo";

  if (variableId !== "create") {
    pageTitle = `Cadastro de Variáveis - Editar`;
  }

  return (
    <VariablesForm
      isEdit={isEdit}
      initialData={variables ?? null}
      pageTitle={pageTitle}
    />
  );
}

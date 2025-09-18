"use client";
import { GenericResponse } from "@/types";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import { ExamsResultTemplate } from "../data-table/columns";
import UsersForm from "./exams-result-template-form";

type ExamsResultTemplateViewPageProps = {
  examsResultTemplateId: string;
};

export default function ExamsResultTemplateViewPage({
  examsResultTemplateId,
}: Readonly<ExamsResultTemplateViewPageProps>) {
  const isEdit = examsResultTemplateId !== "create";

  const { data } = useQuery<GenericResponse<ExamsResultTemplate>>({
    queryKey: ["getExamsResultTemplateById", examsResultTemplateId],
    queryFn: () =>
      fetcher<GenericResponse<ExamsResultTemplate>>(
        `/examsResultTemplate/${examsResultTemplateId}`
      ),
    enabled: isEdit,
  });

  const users = isEdit ? data?.data : undefined;

  let pageTitle = "Template de Exames - Novo";

  if (examsResultTemplateId !== "create") {
    pageTitle = `Template de Exames - Editar`;
  }

  return (
    <UsersForm isEdit={isEdit} initialData={users} pageTitle={pageTitle} />
  );
}

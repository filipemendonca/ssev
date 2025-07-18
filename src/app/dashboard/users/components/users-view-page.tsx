"use client";
import { GenericResponse } from "@/types";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import { Users } from "../data-table/columns";
import UsersForm from "./users-form";

type TUsersViewPageProps = {
  usersId: string;
};

export default function UsersViewPage({
  usersId,
}: Readonly<TUsersViewPageProps>) {
  const isEdit = usersId !== "create";

  const { data } = useQuery<GenericResponse<Users>>({
    queryKey: ["getUserById", usersId],
    queryFn: () => fetcher<GenericResponse<Users>>(`/users/${usersId}`),
    enabled: isEdit,
  });

  const users = isEdit ? data?.data : undefined;

  let pageTitle = "Usuário - Novo";

  if (usersId !== "create") {
    pageTitle = `Usuário - Editar`;
  }

  return (
    <UsersForm isEdit={isEdit} initialData={users} pageTitle={pageTitle} />
  );
}

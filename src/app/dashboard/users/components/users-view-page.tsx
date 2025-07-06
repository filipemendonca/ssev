import UsersForm from "./users-form";

type TUsersViewPageProps = {
  usersId: string;
};

export default async function UsersViewPage({
  usersId,
}: Readonly<TUsersViewPageProps>) {
  const users = null;
  let pageTitle = "Usuário - Novo";

  if (usersId !== "novo") {
    pageTitle = `Usuário - Editar`;
  }

  return <UsersForm initialData={users} pageTitle={pageTitle} />;
}

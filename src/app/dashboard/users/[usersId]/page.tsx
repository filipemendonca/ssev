import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import { Suspense } from "react";
import UsersViewPage from "../components/users-view-page";

export const metadata = {
  title: "Dashboard : Usuário",
};

type PageProps = { params: Promise<{ usersId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <UsersViewPage usersId={params.usersId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}

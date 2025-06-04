import PageContainer from "@/components/layout/page-container";

export const metadata = {
  title: "Dashboard: Users",
};

export default async function Page() {
  return (
    <PageContainer scrollable={true}>
      <div className="flex h-full w-full items-center justify-center">
        <h1 className="text-2xl font-bold">Users Page</h1>
        <p className="mt-2 text-gray-600">This is the users page content.</p>
      </div>
    </PageContainer>
  );
}

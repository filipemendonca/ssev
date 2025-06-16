"use client";
import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { SampleDataTable } from "./data-table/sample-data-table";
import { columns, Sample } from "./data-table/columns";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { SampleActionDialog } from "./components/sample-action-dialog";

// export const metadata = {
//   title: "Amostras",
// };

export default function Page() {
  const [openDialog, setOpenDialog] = useState(false);
  const data: Sample[] = [
    {
      id: "728ed52f",
      name: "Teste",
      createdAt: "2023-10-01T12:00:00Z",
      updatedAt: "2023-10-01T12:00:00Z",
    },
    {
      id: "b1a2c3d4",
      name: "Amostra 1",
      createdAt: "2023-10-02T12:00:00Z",
      updatedAt: "2023-10-02T12:00:00Z",
    },
    {
      id: "e5f6g7h8",
      name: "Amostra 2",
      createdAt: "2023-10-03T12:00:00Z",
      updatedAt: "2023-10-03T12:00:00Z",
    },
    {
      id: "i9j0k1l2",
      name: "Amostra 3",
      createdAt: "2023-10-04T12:00:00Z",
      updatedAt: "2023-10-04T12:00:00Z",
    },
    {
      id: "m3n4o5p6",
      name: "Amostra 4",
      createdAt: "2023-10-05T12:00:00Z",
      updatedAt: "2023-10-05T12:00:00Z",
    },
    {
      id: "q7r8s9t0",
      name: "Amostra 5",
      createdAt: "2023-10-06T12:00:00Z",
      updatedAt: "2023-10-06T12:00:00Z",
    },
    {
      id: "u1v2w3x4",
      name: "Amostra 6",
      createdAt: "2023-10-07T12:00:00Z",
      updatedAt: "2023-10-07T12:00:00Z",
    },
    {
      id: "y5z6a7b8",
      name: "Amostra 7",
      createdAt: "2023-10-08T12:00:00Z",
      updatedAt: "2023-10-08T12:00:00Z",
    },
    {
      id: "c9d0e1f2",
      name: "Amostra 8",
      createdAt: "2023-10-09T12:00:00Z",
      updatedAt: "2023-10-09T12:00:00Z",
    },
    {
      id: "g3h4i5j6",
      name: "Amostra 9",
      createdAt: "2023-10-10T12:00:00Z",
      updatedAt: "2023-10-10T12:00:00Z",
    },
    {
      id: "k7l8m9n0",
      name: "Amostra 10",
      createdAt: "2023-10-11T12:00:00Z",
      updatedAt: "2023-10-11T12:00:00Z",
    },
    {
      id: "o1p2q3r4",
      name: "Amostra 11",
      createdAt: "2023-10-12T12:00:00Z",
      updatedAt: "2023-10-12T12:00:00Z",
    },
    {
      id: "s5t6u7v8",
      name: "Amostra 12",
      createdAt: "2023-10-13T12:00:00Z",
      updatedAt: "2023-10-13T12:00:00Z",
    },
  ];

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Amostras"
            description="Gerencie as amostras a serem coletadas."
          />
          <Link
            href="#"
            className={cn(buttonVariants(), "text-xs md:text-sm")}
            onClick={() => setOpenDialog(true)}
          >
            <IconPlus className="mr-2 h-4 w-4" /> Novo
          </Link>
        </div>
        <Separator />
        <Suspense
          // key={key}
          fallback={
            <DataTableSkeleton columnCount={2} rowCount={8} filterCount={2} />
          }
        >
          <SampleDataTable columns={columns} data={data} />
        </Suspense>
      </div>
      <SampleActionDialog open={openDialog} onOpenChange={setOpenDialog} />
    </PageContainer>
  );
}

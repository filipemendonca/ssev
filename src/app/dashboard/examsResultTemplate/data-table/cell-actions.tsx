"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExamsResultTemplate } from "./columns";
import { useApiMutationDelete } from "@/hooks/use-api-mutation-delete";
import { GenericResponse } from "@/types";

interface CellActionProps {
  model: ExamsResultTemplate;
}

export const CellAction: React.FC<CellActionProps> = ({ model }) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { deleteItemAsync } = useApiMutationDelete<
    GenericResponse<ExamsResultTemplate>
  >({
    endpoint: `/examsResultTemplate/${model.id}`,
    hasBody: false,
    queryKeys: ["deleteExamsResultTemplate"],
    invalidateQueries: true,
    invalidateQueryKeys: ["examsResultTemplate"],
  });

  const onConfirm = async () => {
    await deleteItemAsync(model.id as never);
    setOpen(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title="Tem certeza?"
        description="Esta ação não pode ser desfeita. Você tem certeza que deseja remover este template?"
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/examsResultTemplate/${model.id}`)
            }
            className="cursor-pointer"
          >
            <IconEdit className="mr-2 h-4 w-4" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="cursor-pointer"
          >
            <IconTrash className="mr-2 h-4 w-4" /> Remover
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

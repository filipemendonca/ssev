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
import { useApiMutationDelete } from "@/hooks/use-api-mutation-delete";
import { GenericResponse } from "@/types";
import { useState } from "react";
import { Sample } from "./columns";
import { SampleEditDialog } from "../components/sample-edit-dialog";

interface CellActionProps {
  model: Sample;
}

export const CellAction: React.FC<CellActionProps> = ({ model }) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSample, setCurrentSample] = useState<Sample>(model);

  const { deleteItemAsync } = useApiMutationDelete<GenericResponse<Sample>>({
    endpoint: `/sample/${model.id}`,
    hasBody: false,
    queryKeys: ["sampleDelete"],
    invalidateQueries: true,
    invalidateQueryKeys: ["sample"],
  });

  const onConfirm = async () => {
    await deleteItemAsync(model.id as never);
    setOpen(false);
  };

  const onEdit = async () => {
    setOpenDialog(true);
    setCurrentSample(model);
  };

  return (
    <>
      <SampleEditDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        model={currentSample}
      />
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title="Tem certeza?"
        description="Esta ação não pode ser desfeita. Você tem certeza que deseja remover esta amostra?"
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit()} className="cursor-pointer">
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

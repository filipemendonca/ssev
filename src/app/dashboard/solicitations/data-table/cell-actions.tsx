"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/context/stores/user.store";
import { ROLE } from "@/enum/role.enum";
import { useApiMutationDelete } from "@/hooks/use-api-mutation-delete";
import { GenericResponse } from "@/types";
import { ReloadIcon } from "@radix-ui/react-icons";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SolicitationStatus } from "../types/types";
import { Solicitations } from "./columns";
import { GenericModal } from "@/components/modal/generic-modal";

interface CellActionProps {
  model: Solicitations;
}

export const CellAction: React.FC<CellActionProps> = ({ model }) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAlertDialogChangeStatus, setOpenAlertDialogChangeStatus] =
    useState(false);
  const router = useRouter();
  const { user } = useUserStore();

  const enableButtons =
    user?.role === ROLE.ADMINISTRADOR ||
    (user?.role === ROLE.VETERINARIO &&
      model.status === SolicitationStatus.CRIADO);

  const { deleteItemAsync } = useApiMutationDelete<
    GenericResponse<Solicitations>
  >({
    endpoint: `/solicitation/${model.id}`,
    hasBody: false,
    queryKeys: ["deleteSolicitation"],
    invalidateQueries: true,
    invalidateQueryKeys: ["solicitation"],
  });

  const onConfirm = async () => {
    await deleteItemAsync(model.id as never);
    setOpen(false);
  };

  const onClickButton1GenericModal = () => {
    router.push(`solicitations/${model.id}/view`);
  };

  let solicitationStatusChangeText = "";
  let alertDialogChangeStatusTitle = "";
  let alertDialogChangeStatusDescription = "";
  let buttonText1 = "";
  let buttonText2 = "";
  switch (model.status) {
    case SolicitationStatus.CRIADO:
      solicitationStatusChangeText = "Despachar para filtragem";
      alertDialogChangeStatusTitle = "Despachar essa solicitação?";
      alertDialogChangeStatusDescription =
        "Deseja despachar essa solicitação para filtragem?";
      buttonText1 = "Despachar sem conferir";
      buttonText2 = "Conferir solicitação";
      break;
    case SolicitationStatus.FILTRAGEM:
      solicitationStatusChangeText = "Despachar para transporte";
      break;
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title="Tem certeza?"
        description="Esta ação não pode ser desfeita. Você tem certeza que deseja excluir esta solicitação?"
      />
      <GenericModal
        isOpen={openAlertDialogChangeStatus}
        onClose={() => setOpenAlertDialogChangeStatus(false)}
        onClickButton1={() => {}}
        onClickButton2={onClickButton1GenericModal}
        loading={loading}
        title={alertDialogChangeStatusTitle}
        description={alertDialogChangeStatusDescription}
        buttonText1={buttonText1}
        buttonText2={buttonText2}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {enableButtons ? (
            <>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/solicitations/${model.id}`)
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

              <Separator className="mt-2 mb-2" />
            </>
          ) : (
            <></>
          )}

          <DropdownMenuItem
            onClick={() => setOpenAlertDialogChangeStatus(true)}
            className="cursor-pointer"
          >
            <ReloadIcon className="mr-2 h-4 w-4" />{" "}
            {solicitationStatusChangeText}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

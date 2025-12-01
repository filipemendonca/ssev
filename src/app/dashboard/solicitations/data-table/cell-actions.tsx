"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { GenericModal } from "@/components/modal/generic-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/context/stores/user.store";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useApiMutationDelete } from "@/hooks/use-api-mutation-delete";
import { GenericResponse } from "@/types";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import {
  CheckIcon,
  CircleX,
  DownloadIcon,
  EyeIcon,
  LockIcon,
  UnlockIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useConfigureButtonToSolicitations } from "../../../../hooks/use-configure-buttons-to-solicitation";
import { FinishSolicitationModal } from "../components/finish-solicitation-modal";
import { SolicitationStatus } from "../types/types";
import {
  changeToNextStatus,
  downloadDocx,
  updateTextDialogByStatus,
} from "../utils/utils";
import { Solicitations } from "./columns";

interface CellActionProps {
  model: Solicitations;
  setSolicitationId?: Dispatch<SetStateAction<string>>;
  setOpenBlockedSolicitationModal?: Dispatch<SetStateAction<boolean>>;
  setOpenCanceledSolicitationModal?: Dispatch<SetStateAction<boolean>>;
}

export const CellAction: React.FC<CellActionProps> = ({
  model,
  setSolicitationId,
  setOpenBlockedSolicitationModal,
  setOpenCanceledSolicitationModal,
}) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAlertDialogChangeStatus, setOpenAlertDialogChangeStatus] =
    useState(false);
  const [openFinishSolicitationModal, setOpenFinishSolicitationModal] =
    useState(false);
  const router = useRouter();
  const { user } = useUserStore();
  const {
    enableChangeStatus,
    enableCrudButtons,
    enableFinishButton,
    enableBlockSolicitationButton,
    enableCancelSolicitationButton,
  } = useConfigureButtonToSolicitations(model.status, user ? user.role : null);

  const { deleteItemAsync } = useApiMutationDelete<
    GenericResponse<Solicitations>
  >({
    endpoint: `/solicitation/${model.id}`,
    hasBody: false,
    queryKeys: ["deleteSolicitation"],
    invalidateQueries: true,
    invalidateQueryKeys: ["solicitation"],
  });

  const { mutateAsync: editSolicitationAsync } = useApiMutation<
    GenericResponse<Solicitations>
  >({
    endpoint: `/solicitation/${model?.id}`,
    method: "PATCH",
    queryKeys: ["editSolicitation"],
    invalidateQueries: true,
    invalidateQueryKeys: ["solicitation"],
  });

  const { mutateAsync: blockUnblockSolicitationAsync } = useApiMutation<
    GenericResponse<Solicitations>
  >({
    endpoint: `/solicitation/blockUnblockSolicitation/${model?.id}`,
    method: "PATCH",
    queryKeys: ["blockUnblockSolicitation"],
    invalidateQueries: true,
    invalidateQueryKeys: ["solicitation"],
  });

  const onConfirm = async () => {
    await deleteItemAsync(model.id as never);
    setOpen(false);
  };

  const onClickButton1GenericModal = async () => {
    model.status = changeToNextStatus(model.status);
    await editSolicitationAsync(model as never);
    setOpenAlertDialogChangeStatus(false);
    globalThis.location.reload();
  };

  const onClickButton2GenericModal = () => {
    router.push(`solicitations/${model.id}/view`);
  };

  const {
    title,
    description,
    buttonGridText,
    button1,
    button2,
    iconColor,
    textColor,
  } = updateTextDialogByStatus(model.status);

  const renderCrudButtons = () =>
    enableCrudButtons ? (
      <>
        <Separator className="mt-2 mb-2" />

        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/solicitations/${model.id}`)}
          className="cursor-pointer"
        >
          <IconEdit className="mr-2 h-4 w-4" /> Editar
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setOpen(true)}
          className="cursor-pointer"
        >
          <IconTrash color="red" className="mr-2 h-4 w-4" />{" "}
          <span className="text-red-600">Remover</span>
        </DropdownMenuItem>
      </>
    ) : (
      <></>
    );

  const handleConfiguredBlockSolicitationModal = () => {
    if (setOpenBlockedSolicitationModal && setSolicitationId) {
      setOpenBlockedSolicitationModal(true);
      setSolicitationId(model.id);
    }
  };

  const handleConfigureCancelSolicitationModal = () => {
    if (setOpenCanceledSolicitationModal && setSolicitationId) {
      setOpenCanceledSolicitationModal(true);
      setSolicitationId(model.id);
    }
  };

  const isBlockedSolicitationStatus = () =>
    model.status !== SolicitationStatus.BLOQUEADO ? (
      <DropdownMenuItem
        onClick={() => handleConfiguredBlockSolicitationModal()}
        className="cursor-pointer"
      >
        <LockIcon className="mr-2 h-4 w-4" /> Bloquear solicitação
      </DropdownMenuItem>
    ) : (
      <DropdownMenuItem
        onClick={() => blockUnblockSolicitationAsync({} as never)}
        className="cursor-pointer"
      >
        <UnlockIcon className="mr-2 h-4 w-4" /> Desbloquear solicitação
      </DropdownMenuItem>
    );

  const renderBlockButton = () =>
    enableBlockSolicitationButton ? isBlockedSolicitationStatus() : <></>;

  const renderCancelSolicitation = () =>
    enableCancelSolicitationButton ? (
      <DropdownMenuItem
        onClick={() => handleConfigureCancelSolicitationModal()}
        className="cursor-pointer"
      >
        <CircleX className="mr-2 h-4 w-4" /> Cancelar solicitação
      </DropdownMenuItem>
    ) : (
      <></>
    );

  const renderChangeStatusButton = () =>
    enableChangeStatus && buttonGridText !== undefined ? (
      <DropdownMenuItem
        onClick={() => setOpenAlertDialogChangeStatus(true)}
        className="cursor-pointer"
      >
        <CheckIcon color={iconColor || "gray"} className="mr-2 h-4 w-4" />{" "}
        <span className={textColor}>{buttonGridText}</span>
      </DropdownMenuItem>
    ) : (
      <></>
    );

  const renderFinishButton = () =>
    enableFinishButton ? (
      <DropdownMenuItem
        onClick={() => setOpenFinishSolicitationModal(true)}
        className="cursor-pointer"
      >
        <CheckIcon className="mr-2 h-4 w-4" /> Finalizar solicitação
      </DropdownMenuItem>
    ) : (
      <></>
    );

  const renderDownloadButton = () => {
    return model.status === SolicitationStatus.FINALIZADO ? (
      <>
        <Separator className="mt-2 mb-2" />
        <DropdownMenuItem
          onClick={() => downloadDocx(model)}
          className="cursor-pointer"
        >
          <DownloadIcon className="mr-2 h-4 w-4" /> Baixar laudo
        </DropdownMenuItem>
      </>
    ) : (
      <></>
    );
  };

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
        onClickButton1={onClickButton1GenericModal}
        onClickButton2={onClickButton2GenericModal}
        loading={loading}
        title={title}
        description={description ?? ""}
        buttonText1={button1}
        buttonText2={button2}
      />
      <FinishSolicitationModal
        isOpen={openFinishSolicitationModal}
        onClose={() => setOpenFinishSolicitationModal(false)}
        mutateAsync={editSolicitationAsync}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => router.push(`solicitations/${model.id}/view`)}
            className="cursor-pointer"
          >
            <EyeIcon className="mr-2 h-4 w-4" /> Visualizar
          </DropdownMenuItem>

          {renderBlockButton()}
          {renderCancelSolicitation()}
          {renderCrudButtons()}
          {!enableFinishButton && renderChangeStatusButton()}
          {renderFinishButton()}
          {renderDownloadButton()}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

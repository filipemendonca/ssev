import { SolicitationStatus } from "@/app/dashboard/solicitations/types/types";
import { ROLE } from "@/enum/role.enum";

interface ConfigureButtonsToSolicitation {
  enableChangeStatus: boolean;
  enableCrudButtons: boolean;
  enableFinishButton: boolean;
  enableBlockSolicitationButton: boolean;
  enableCancelSolicitationButton: boolean;
}

const configurePerRole = ({
  enableChangeStatus,
  enableCrudButtons,
  enableFinishButton,
  enableBlockSolicitationButton,
  enableCancelSolicitationButton,
}: ConfigureButtonsToSolicitation) => {
  return {
    enableChangeStatus,
    enableCrudButtons,
    enableFinishButton,
    enableBlockSolicitationButton,
    enableCancelSolicitationButton,
  };
};

function configurePerStatus(
  solicitationStatus: SolicitationStatus | null,
  userRole: ROLE | null
): ConfigureButtonsToSolicitation {
  switch (solicitationStatus) {
    case SolicitationStatus.CRIADO:
    case SolicitationStatus.FILTRAGEM:
      return configurePerRole({
        enableChangeStatus: true,
        enableCrudButtons: true,
        enableFinishButton: false,
        enableBlockSolicitationButton: true,
        enableCancelSolicitationButton: true,
      });
    case SolicitationStatus.BLOQUEADO:
    case SolicitationStatus.EM_TRANSPORTE:
      if (userRole === ROLE.ADMINISTRADOR || userRole === ROLE.PATOLOGISTA) {
        return configurePerRole({
          enableChangeStatus: true,
          enableCrudButtons: true,
          enableFinishButton: false,
          enableBlockSolicitationButton: true,
          enableCancelSolicitationButton: true,
        });
      }
      if (userRole === ROLE.VETERINARIO) {
        return configurePerRole({
          enableChangeStatus: false,
          enableCrudButtons: true,
          enableFinishButton: false,
          enableBlockSolicitationButton: true,
          enableCancelSolicitationButton: false,
        });
      }
      break;
    case SolicitationStatus.EM_ANALISE:
      if (userRole === ROLE.ADMINISTRADOR || userRole === ROLE.PATOLOGISTA) {
        return configurePerRole({
          enableChangeStatus: true,
          enableCrudButtons: true,
          enableFinishButton: true,
          enableBlockSolicitationButton: true,
          enableCancelSolicitationButton: true,
        });
      }
      if (userRole === ROLE.VETERINARIO) {
        return configurePerRole({
          enableChangeStatus: false,
          enableCrudButtons: false,
          enableFinishButton: false,
          enableBlockSolicitationButton: false,
          enableCancelSolicitationButton: false,
        });
      }
      break;
    case SolicitationStatus.CANCELADO:
    case SolicitationStatus.FINALIZADO:
      return configurePerRole({
        enableChangeStatus: false,
        enableCrudButtons: false,
        enableFinishButton: false,
        enableBlockSolicitationButton: false,
        enableCancelSolicitationButton: false,
      });
  }
  return configurePerRole({
    enableChangeStatus: true,
    enableCrudButtons: true,
    enableFinishButton: true,
    enableBlockSolicitationButton: true,
    enableCancelSolicitationButton: true,
  });
}

export const useConfigureButtonToSolicitations = (
  solicitationStatus: SolicitationStatus | null,
  userRole: ROLE | null
) => {
  return configurePerStatus(solicitationStatus, userRole);
};

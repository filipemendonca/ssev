import { SolicitationStatus } from "../types/types";

export const changeToNextStatus = (status: SolicitationStatus) => {
  switch (status) {
    case SolicitationStatus.CRIADO:
      return SolicitationStatus.FILTRAGEM;
    case SolicitationStatus.FILTRAGEM:
      return SolicitationStatus.EM_TRANSPORTE;
    case SolicitationStatus.EM_TRANSPORTE:
      return SolicitationStatus.EM_ANALISE;
    case SolicitationStatus.EM_ANALISE:
      return SolicitationStatus.FINALIZADO;
    default:
      return status;
  }
};

export const updateTextDialogByStatus = (
  status: SolicitationStatus | undefined
) => {
  let solicitationStatusChangeText = "";
  const alertDialogChangeStatusTitle = "Despachar essa solicitação?";
  let alertDialogChangeStatusDescription = "";
  const buttonText1 = "Despachar sem conferir";
  const buttonText2 = "Conferir solicitação";

  switch (status) {
    case SolicitationStatus.CRIADO:
      solicitationStatusChangeText = "Despachar para filtragem";
      alertDialogChangeStatusDescription =
        "Deseja despachar essa solicitação para filtragem?";
      break;
    case SolicitationStatus.FILTRAGEM:
      solicitationStatusChangeText = "Despachar para transporte";
      alertDialogChangeStatusDescription =
        "Deseja despachar essa solicitação para transporte?";
      break;
    case SolicitationStatus.EM_TRANSPORTE:
      solicitationStatusChangeText = "Despachar para analisar";
      alertDialogChangeStatusDescription =
        "Deseja despachar essa solicitação para analisar?";
      break;
    case SolicitationStatus.EM_ANALISE:
      solicitationStatusChangeText = "Finalizar";
      alertDialogChangeStatusDescription = "Deseja finalizar esta solicitação?";
      break;
    default:
      solicitationStatusChangeText = "...";
      alertDialogChangeStatusDescription = "...";
      break;
  }

  return {
    buttonGridText: solicitationStatusChangeText,
    title: alertDialogChangeStatusTitle,
    description: alertDialogChangeStatusDescription,
    button1: buttonText1,
    button2: buttonText2,
  };
};

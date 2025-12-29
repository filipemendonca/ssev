import { fetcher } from "@/utils/fetcher";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Solicitations } from "../data-table/columns";
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
  let solicitationStatusChangeText: string | undefined = "";
  const alertDialogChangeStatusTitle = "Despachar essa solicitação?";
  let alertDialogChangeStatusDescription: string | undefined = "";
  const buttonText1 = "Despachar sem conferir";
  const buttonText2 = "Conferir solicitação";
  let colorText = "";
  let colorIcon = "";

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
      colorText = "text-green-600";
      colorIcon = "green";
      break;
    default:
      solicitationStatusChangeText = undefined;
      alertDialogChangeStatusDescription = undefined;
      break;
  }

  return {
    buttonGridText: solicitationStatusChangeText,
    title: alertDialogChangeStatusTitle,
    description: alertDialogChangeStatusDescription,
    button1: buttonText1,
    button2: buttonText2,
    iconColor: colorIcon,
    textColor: colorText,
  };
};

export async function downloadDocx(model: Solicitations) {
  try {
    const dateTodayFormatted = format(Date.now(), "ddMMyyyy", { locale: ptBR });
    const documentTitle = `solicitacao_${model.patient}_${dateTodayFormatted}.docx`;

    // 1️⃣ Chama sua função fetcher com isFileDownload = true
    const data = await fetcher<Blob>(
      `/solicitation/document/download/${model.id}`,
      { method: "GET" },
      false, // multipartFormData
      true // isFileDownload
    );

    // 2️⃣ Cria URL temporária
    const url = globalThis.URL.createObjectURL(data);

    // 3️⃣ Cria link temporário para download
    const a = document.createElement("a");
    a.href = url;

    // 4️⃣ Tenta pegar nome do arquivo via header (não disponível no fetcher)
    // ❗ Como fetcher não retorna headers, usamos nome padrão
    a.download = documentTitle;

    document.body.appendChild(a);

    // 5️⃣ Força o download
    a.click();

    // 6️⃣ Limpa
    a.remove();
    globalThis.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao baixar documento:", error);
  }
}

import { Exams } from "../../exams/data-table/columns";
import { InfectiousAgents } from "../../infectious-agents/data-table/columns";
import { Sample } from "../../sample/data-table/columns";

export type SampleWithCheck = Sample & { checked: boolean };
export type ExamsWithCheck = Exams & { checked: boolean };
export type InfectiousAgentsWithCheck = InfectiousAgents & {
  checked: boolean;
};

export enum BLOOD_COLLECTION_TUBE_COLOR {
  TAMPA_ROXA = "Tampa Roxa",
  TAMPA_VERMELHA = "Tampa Vermelha",
  TAMPA_CINZA = "Tampa Cinza",
  TAMPA_AZUL = "Tampa Azul",
}

// export enum SolicitationStatus {
//   CRIADO, // azul
//   FILTRAGEM, // amerelo
//   EM_TRANSPORTE, // amarelo
//   EM_ANALISE, // amarelo
//   BLOQUEADO, // laranja
//   FINALIZADO, // verde
//   CANCELADO, // vermelho
// }

export enum SolicitationStatus {
  CRIADO = "CRIADO",
  FILTRAGEM = "FILTRAGEM",
  EM_TRANSPORTE = "EM_TRANSPORTE",
  EM_ANALISE = "EM_ANALISE",
  BLOQUEADO = "BLOQUEADO",
  FINALIZADO = "FINALIZADO",
  CANCELADO = "CANCELADO",
}

export enum ExamResultType {
  PCR_QUALITATIVO = "PCR Qualitativo",
  PCR_QUANTITATIVO = "PCR Quantitativo",
}

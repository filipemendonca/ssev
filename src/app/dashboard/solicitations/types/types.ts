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

export const styles = {
  CRIADO: "bg-blue-100 text-blue-800",
  EM_ANALISE: "bg-yellow-100 text-yellow-800",
  EM_TRANSPORTE: "bg-yellow-100 text-yellow-800",
  FILTRAGEM: "bg-yellow-100 text-yellow-800",
  BLOQUEADO: "bg-orange-100 text-orange-800",
  FINALIZADO: "bg-green-100 text-green-800",
  CANCELADO: "bg-red-100 text-red-800",
};

export const recordStatus: Record<string, string> = {
  CRIADO: "Criado",
  EM_ANALISE: "Em análise",
  EM_TRANSPORTE: "Em transporte",
  FILTRAGEM: "Filtragem",
  BLOQUEADO: "Bloqueado",
  FINALIZADO: "Finalizado",
  CANCELADO: "Cancelado",
};

export interface SolicitationFormValues {
  userId: string | undefined;
  samples: string[];
  exams: string[];
  infectiousAgents: string[];
  examResultType: string | undefined;
  bloodCollectionTubeColor: string[];
  tutor: string;
  patient: string;
  age: string;
  doctor: string;
  specie: string;
  hospitalVet: string;
  gender: string;
}

import { SolicitationStatus } from "../types/types";

export interface SolicitationFilterDto {
  tutor: string;
  patient: string;
  status: SolicitationStatus;
  startDate: string;
  endDate: string;
}

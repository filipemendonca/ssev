interface ChangedBy {
  name: string;
}

export interface SolicitationHistoryDTO {
  id: string;
  solicitationId: string;
  previousStatus: string;
  newStatus: string;
  changedAt: string;
  changedById: string;
  changedBy?: ChangedBy;
}

import { SolicitationStatus } from "../solicitations/types/types";

export type SolicitationStatusMetricsItem = {
  status: SolicitationStatus;
  count: number;
};

export type SolicitationStatusMetrics = {
  range: {
    from: string | null;
    to: string | null;
  };
  total: number;
  items: SolicitationStatusMetricsItem[];
};

export type ExamsInfectiousMetricItem = {
  name: string;
  openCount: number;
  closedCount: number;
  openPercent: number;
  closedPercent: number;
  total: number;
};

export type ExamsInfectiousMetrics = {
  range: {
    from: string | null;
    to: string | null;
  };
  exams: ExamsInfectiousMetricItem[];
  infectiousAgents: ExamsInfectiousMetricItem[];
};

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
  examId: string;
  name: string;
  currentCount: number;
  previousCount: number;
  growthPercent: number;
  trend: "crescimento" | "decrescimento" | "estavel";
};

export type ExamsInfectiousMetrics = {
  range: {
    current: {
      from: string;
      to: string;
    };
    previous: {
      from: string;
      to: string;
    };
  };
  totals: {
    currentCount: number;
    previousCount: number;
    growthPercent: number;
  };
  exams: ExamsInfectiousMetricItem[];
};

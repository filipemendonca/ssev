"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "@/components/ui/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { recordStatus } from "../solicitations/types/types";
import { SolicitationStatusMetrics } from "../types/metrics";
import { MetricsDateFilter } from "./metrics-date-filter";

const STATUS_CHART_COLOR: Record<string, string> = {
  CRIADO: "#2563eb",
  FILTRAGEM: "#ca8a04",
  EM_TRANSPORTE: "#d97706",
  EM_ANALISE: "#a16207",
  BLOQUEADO: "#ea580c",
  FINALIZADO: "#16a34a",
  CANCELADO: "#dc2626",
};

type StatusMetricsCardProps = {
  isLoading: boolean;
  metrics: SolicitationStatusMetrics | null | undefined;
  metricsDateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
};

export const StatusMetricsCard = memo(function StatusMetricsCard({
  isLoading,
  metrics,
  metricsDateRange,
  onDateRangeChange,
}: StatusMetricsCardProps) {
  const statusChartData = useMemo(() => {
    const items = metrics?.items ?? [];
    return items.map((item) => ({
      status: item.status,
      label: recordStatus[item.status] ?? item.status,
      count: item.count,
      fill: STATUS_CHART_COLOR[item.status] ?? "#64748b",
    }));
  }, [metrics]);

  let content: React.ReactNode;
  if (isLoading) {
    content = (
      <div className="space-y-3">
        <Skeleton className="h-6 w-60" />
        <Skeleton className="h-[260px] w-full" />
      </div>
    );
  } else if (statusChartData.length === 0) {
    content = (
      <div className="text-sm text-muted-foreground">
        Nenhum dado de status encontrado.
      </div>
    );
  } else {
    content = (
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={statusChartData}
            margin={{ top: 8, right: 8, left: -16, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value: number) => [value, "Quantidade"]} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {statusChartData.map((item) => (
                <Cell key={item.status} fill={item.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-semibold">
            Solicitações por status
          </CardTitle>
          <MetricsDateFilter
            metricsDateRange={metricsDateRange}
            onDateRangeChange={onDateRangeChange}
          />
        </div>
        {isLoading ? (
          <Skeleton className="h-4 w-40" />
        ) : (
          <p className="text-sm text-muted-foreground">
            Total no período: {metrics?.total ?? 0}
          </p>
        )}
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
});

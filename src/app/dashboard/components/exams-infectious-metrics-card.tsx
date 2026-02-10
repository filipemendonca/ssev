"use client";

import { memo, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "@/components/ui/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ExamsInfectiousMetrics } from "../types/metrics";
import { MetricsDateFilter } from "./metrics-date-filter";

type ExamsInfectiousMetricsCardProps = {
  isLoading: boolean;
  metrics: ExamsInfectiousMetrics | null | undefined;
  metricsDateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
};

const PIE_COLORS = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#0891b2",
  "#ca8a04",
  "#e11d48",
  "#4f46e5",
];

function getGrowthTextClass(value: number) {
  if (value > 0) return "text-green-600";
  if (value < 0) return "text-red-600";
  return "text-slate-600";
}

export const ExamsInfectiousMetricsCard = memo(
  function ExamsInfectiousMetricsCard({
    isLoading,
    metrics,
    metricsDateRange,
    onDateRangeChange,
  }: ExamsInfectiousMetricsCardProps) {
    const currentPieData = useMemo(() => {
      return (metrics?.exams ?? []).map((item) => ({
        name: item.name,
        value: item.currentCount,
      }));
    }, [metrics]);

    const previousPieData = useMemo(() => {
      return (metrics?.exams ?? []).map((item) => ({
        name: item.name,
        value: item.previousCount,
      }));
    }, [metrics]);

    const hasChartData = useMemo(() => {
      const currentTotal = currentPieData.reduce(
        (acc, item) => acc + item.value,
        0,
      );
      const previousTotal = previousPieData.reduce(
        (acc, item) => acc + item.value,
        0,
      );
      return currentTotal > 0 || previousTotal > 0;
    }, [currentPieData, previousPieData]);

    const currentRangeLabel = useMemo(() => {
      if (!metrics?.range.current) return "-";

      return `${format(new Date(metrics.range.current.from), "dd/MM/yyyy", {
        locale: ptBR,
      })} - ${format(new Date(metrics.range.current.to), "dd/MM/yyyy", {
        locale: ptBR,
      })}`;
    }, [metrics]);

    const previousRangeLabel = useMemo(() => {
      if (!metrics?.range.previous) return "-";

      return `${format(new Date(metrics.range.previous.from), "dd/MM/yyyy", {
        locale: ptBR,
      })} - ${format(new Date(metrics.range.previous.to), "dd/MM/yyyy", {
        locale: ptBR,
      })}`;
    }, [metrics]);

    const totalGrowthClass = getGrowthTextClass(
      metrics?.totals.growthPercent ?? 0,
    );

    let content: React.ReactNode;
    if (isLoading) {
      content = (
        <div className="space-y-4">
          <Skeleton className="h-6 w-72" />
          <Skeleton className="h-[260px] w-full" />
          <Skeleton className="h-[260px] w-full" />
        </div>
      );
    } else if (hasChartData === false) {
      content = (
        <div className="text-sm text-muted-foreground">
          Nenhum dado de exames encontrado para os períodos comparados.
        </div>
      );
    } else {
      content = (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground">Total período atual</p>
              <p className="text-xl font-semibold">
                {metrics?.totals.currentCount ?? 0}
              </p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground">Total período anterior</p>
              <p className="text-xl font-semibold">
                {metrics?.totals.previousCount ?? 0}
              </p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground">Crescimento total</p>
              <p className={`text-xl font-semibold ${totalGrowthClass}`}>
                {metrics?.totals.growthPercent ?? 0}%
              </p>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <p className="text-sm font-medium mb-2">
              Exames - Período atual ({currentRangeLabel})
            </p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentPieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={110}
                  paddingAngle={2}
                >
                  {currentPieData.map((item, index) => (
                    <Cell
                      key={`${item.name}-current-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, "Quantidade"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[320px] w-full">
            <p className="text-sm font-medium mb-2">
              Exames - Período anterior ({previousRangeLabel})
            </p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={previousPieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={110}
                  paddingAngle={2}
                >
                  {previousPieData.map((item, index) => (
                    <Cell
                      key={`${item.name}-previous-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, "Quantidade"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-md border">
            <div className="grid grid-cols-4 gap-2 border-b bg-muted/30 px-3 py-2 text-xs font-medium">
              <span>Exame</span>
              <span>Atual</span>
              <span>Anterior</span>
              <span>Crescimento</span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {(metrics?.exams ?? []).map((item) => (
                <div
                  key={item.examId}
                  className="grid grid-cols-4 gap-2 px-3 py-2 text-sm border-b last:border-b-0"
                >
                  <span className="truncate">{item.name}</span>
                  <span>{item.currentCount}</span>
                  <span>{item.previousCount}</span>
                  <span className={getGrowthTextClass(item.growthPercent)}>
                    {item.growthPercent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg font-semibold">
              Exames (comparativo mensal)
            </CardTitle>
            <MetricsDateFilter
              metricsDateRange={metricsDateRange}
              onDateRangeChange={onDateRangeChange}
            />
          </div>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  },
);

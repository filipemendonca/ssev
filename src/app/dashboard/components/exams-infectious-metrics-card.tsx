"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ExamsInfectiousMetrics } from "../types/metrics";

type ExamsInfectiousMetricsCardProps = {
  isLoading: boolean;
  metrics: ExamsInfectiousMetrics | null | undefined;
};

export const ExamsInfectiousMetricsCard = memo(
  function ExamsInfectiousMetricsCard({
    isLoading,
    metrics,
  }: ExamsInfectiousMetricsCardProps) {
    const examsChartData = useMemo(() => {
      const items = metrics?.exams ?? [];
      return items.map((item) => ({
        name: item.name,
        emAndamento: item.openCount,
        finalizado: item.closedCount,
      }));
    }, [metrics]);

    const infectiousAgentsChartData = useMemo(() => {
      const items = metrics?.infectiousAgents ?? [];
      return items.map((item) => ({
        name: item.name,
        emAndamento: item.openCount,
        finalizado: item.closedCount,
      }));
    }, [metrics]);

    let content: React.ReactNode;
    if (isLoading) {
      content = (
        <div className="space-y-4">
          <Skeleton className="h-6 w-72" />
          <Skeleton className="h-[260px] w-full" />
          <Skeleton className="h-6 w-72" />
          <Skeleton className="h-[260px] w-full" />
        </div>
      );
    } else if (
      examsChartData.length === 0 &&
      infectiousAgentsChartData.length === 0
    ) {
      content = (
        <div className="text-sm text-muted-foreground">
          Nenhum dado de exames e agentes infecciosos encontrado.
        </div>
      );
    } else {
      content = (
        <div className="space-y-8">
          <div className="h-[320px] w-full">
            <p className="text-sm font-medium mb-2">Exames</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={examsChartData}
                margin={{ top: 8, right: 8, left: -16, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value: number) => [value, "Quantidade"]} />
                <Bar dataKey="emAndamento" stackId="a" fill="#f59e0b" />
                <Bar dataKey="finalizado" stackId="a" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[320px] w-full">
            <p className="text-sm font-medium mb-2">Agentes infecciosos</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={infectiousAgentsChartData}
                margin={{ top: 8, right: 8, left: -16, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value: number) => [value, "Quantidade"]} />
                <Bar dataKey="emAndamento" stackId="a" fill="#f59e0b" />
                <Bar dataKey="finalizado" stackId="a" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Exames e agentes infecciosos
          </CardTitle>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  },
);

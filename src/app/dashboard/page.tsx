"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { DateRange } from "@/components/ui/date-range-picker";
import { useUserStore } from "@/context/stores/user.store";
import { ROLE } from "@/enum/role.enum";
import { fetcher } from "@/utils/fetcher";
import { GenericResponse } from "@/types";
import { Solicitations } from "./solicitations/data-table/columns";
import { SolicitationStatus } from "./solicitations/types/types";
import { LatestInProgressCards } from "./components/latest-in-progress-cards";
import { MetricsDateFilter } from "./components/metrics-date-filter";
import { StatusMetricsCard } from "./components/status-metrics-card";
import { ExamsInfectiousMetricsCard } from "./components/exams-infectious-metrics-card";
import {
  ExamsInfectiousMetrics,
  SolicitationStatusMetrics,
} from "./types/metrics";

export default function Page() {
  const { user } = useUserStore();
  const canViewStatusMetrics = user?.role === ROLE.ADMINISTRADOR;
  const canViewExamsInfectiousMetrics =
    user?.role === ROLE.ADMINISTRADOR || user?.role === ROLE.PATOLOGISTA;

  const [metricsDateRange, setMetricsDateRange] = useState<DateRange>(() => {
    const to = new Date();
    to.setHours(23, 59, 59, 999);

    const from = new Date();
    from.setDate(from.getDate() - 29);
    from.setHours(0, 0, 0, 0);

    return { from, to };
  });

  const metricsQueryParams = useMemo(() => {
    const params = new URLSearchParams();

    if (metricsDateRange.from) {
      const from = new Date(metricsDateRange.from);
      from.setHours(0, 0, 0, 0);
      params.set("from", from.toISOString());
    }

    if (metricsDateRange.to) {
      const to = new Date(metricsDateRange.to);
      to.setHours(23, 59, 59, 999);
      params.set("to", to.toISOString());
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  }, [metricsDateRange]);

  const handleMetricsDateRangeChange = useCallback((range: DateRange) => {
    setMetricsDateRange(range);
  }, []);

  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["dashboard-data", user?.role, metricsQueryParams],
    staleTime: 30_000,
    queryFn: async () => {
      const solicitationsPromise = fetcher<GenericResponse<Solicitations[]>>(
        "/solicitation?limit=4&currentPage=1",
      );
      const statusMetricsPromise = canViewStatusMetrics
        ? fetcher<GenericResponse<SolicitationStatusMetrics>>(
            `/solicitation/metrics/status${metricsQueryParams}`,
          )
        : Promise.resolve(null);
      const examsInfectiousMetricsPromise = canViewExamsInfectiousMetrics
        ? fetcher<GenericResponse<ExamsInfectiousMetrics>>(
            `/solicitation/metrics/exams-infectious${metricsQueryParams}`,
          )
        : Promise.resolve(null);

      const [
        solicitationsResponse,
        statusMetricsResponse,
        examsInfectiousMetricsResponse,
      ] = await Promise.all([
        solicitationsPromise,
        statusMetricsPromise,
        examsInfectiousMetricsPromise,
      ]);

      return {
        solicitationsResponse,
        statusMetricsResponse,
        examsInfectiousMetricsResponse,
      };
    },
  });

  const solicitationsResponse = dashboardData?.solicitationsResponse;
  const statusMetricsResponse = dashboardData?.statusMetricsResponse;
  const examsInfectiousMetricsResponse =
    dashboardData?.examsInfectiousMetricsResponse;

  const latestInProgress = useMemo(() => {
    const items = solicitationsResponse?.data ?? [];
    return items
      .filter((item) => item.status !== SolicitationStatus.FINALIZADO)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 4);
  }, [solicitationsResponse]);

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between space-y-2 mb-10">
          <h2 className="text-2xl font-bold tracking-tight">
            Olá {user?.name}, bem-vindo de volta!
          </h2>
        </div>

        <div className="flex items-center justify-between space-y-2 mt-10 mb-5">
          <h1 className="text-lg font-semibold">
            Últimas solicitações em andamento
          </h1>
        </div>
        <LatestInProgressCards
          isLoading={isDashboardLoading && !solicitationsResponse}
          items={latestInProgress}
        />

        {canViewExamsInfectiousMetrics ? (
          <div className="mb-6">
            <MetricsDateFilter
              metricsDateRange={metricsDateRange}
              onDateRangeChange={handleMetricsDateRangeChange}
            />
          </div>
        ) : null}

        {canViewStatusMetrics ? (
          <div className="mb-10">
            <StatusMetricsCard
              isLoading={isDashboardLoading}
              metrics={statusMetricsResponse?.data}
            />
          </div>
        ) : null}

        {canViewExamsInfectiousMetrics ? (
          <div className="mb-10">
            <ExamsInfectiousMetricsCard
              isLoading={isDashboardLoading}
              metrics={examsInfectiousMetricsResponse?.data}
            />
          </div>
        ) : null}
      </div>
    </PageContainer>
  );
}

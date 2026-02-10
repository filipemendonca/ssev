"use client";

import PageContainer from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "@/components/ui/date-range-picker";
import { useUserStore } from "@/context/stores/user.store";
import { ROLE } from "@/enum/role.enum";
import { GenericResponse } from "@/types";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { LatestInProgressCards } from "./components/latest-in-progress-cards";
import { StatusMetricsCard } from "./components/status-metrics-card";
import { Solicitations } from "./solicitations/data-table/columns";
import { SolicitationStatus } from "./solicitations/types/types";
import { SolicitationStatusMetrics } from "./types/metrics";

export default function Page() {
  const { user } = useUserStore();
  const canViewStatusMetrics =
    user?.role === ROLE.ADMINISTRADOR || user?.role === ROLE.PATOLOGISTA;
  // const canViewExamsInfectiousMetrics =
  //   user?.role === ROLE.ADMINISTRADOR || user?.role === ROLE.PATOLOGISTA;

  const createDefaultRange = () => {
    const to = new Date();
    to.setHours(23, 59, 59, 999);

    const from = new Date();
    from.setDate(from.getDate() - 29);
    from.setHours(0, 0, 0, 0);

    return { from, to };
  };

  const [statusMetricsDateRange, setStatusMetricsDateRange] =
    useState<DateRange>(createDefaultRange);
  // const [examsMetricsDateRange, setExamsMetricsDateRange] =
  //   useState<DateRange>(createDefaultRange);

  const statusMetricsQueryParams = useMemo(() => {
    const params = new URLSearchParams();

    if (statusMetricsDateRange.from) {
      const from = new Date(statusMetricsDateRange.from);
      from.setHours(0, 0, 0, 0);
      params.set("from", from.toISOString());
    }

    if (statusMetricsDateRange.to) {
      const to = new Date(statusMetricsDateRange.to);
      to.setHours(23, 59, 59, 999);
      params.set("to", to.toISOString());
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  }, [statusMetricsDateRange]);

  // const examsMetricsQueryParams = useMemo(() => {
  //   const params = new URLSearchParams();

  //   if (examsMetricsDateRange.from) {
  //     const from = new Date(examsMetricsDateRange.from);
  //     from.setHours(0, 0, 0, 0);
  //     params.set("from", from.toISOString());
  //   }

  //   if (examsMetricsDateRange.to) {
  //     const to = new Date(examsMetricsDateRange.to);
  //     to.setHours(23, 59, 59, 999);
  //     params.set("to", to.toISOString());
  //   }

  //   const queryString = params.toString();
  //   return queryString ? `?${queryString}` : "";
  // }, [examsMetricsDateRange]);

  const handleStatusMetricsDateRangeChange = useCallback((range: DateRange) => {
    setStatusMetricsDateRange(range);
  }, []);

  // const handleExamsMetricsDateRangeChange = useCallback((range: DateRange) => {
  //   setExamsMetricsDateRange(range);
  // }, []);

  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: [
      "dashboard-data",
      user?.role,
      statusMetricsQueryParams,
      // examsMetricsQueryParams,
    ],
    staleTime: 30_000,
    queryFn: async () => {
      const solicitationsPromise = fetcher<GenericResponse<Solicitations[]>>(
        "/solicitation?limit=4&currentPage=1",
      );
      const statusMetricsPromise = canViewStatusMetrics
        ? fetcher<GenericResponse<SolicitationStatusMetrics>>(
            `/solicitation/metrics/status${statusMetricsQueryParams}`,
          )
        : Promise.resolve(null);
      // const examsInfectiousMetricsPromise = canViewExamsInfectiousMetrics
      //   ? fetcher<GenericResponse<ExamsInfectiousMetrics>>(
      //       `/solicitation/metrics/exams-infectious${examsMetricsQueryParams}`,
      //     )
      //   : Promise.resolve(null);

      const [
        solicitationsResponse,
        statusMetricsResponse,
        // examsInfectiousMetricsResponse,
      ] = await Promise.all([
        solicitationsPromise,
        statusMetricsPromise,
        // examsInfectiousMetricsPromise,
      ]);

      return {
        solicitationsResponse,
        statusMetricsResponse,
        // examsInfectiousMetricsResponse,
      };
    },
  });

  const solicitationsResponse = dashboardData?.solicitationsResponse;
  const statusMetricsResponse = dashboardData?.statusMetricsResponse;
  // const examsInfectiousMetricsResponse =
  //   dashboardData?.examsInfectiousMetricsResponse;

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

        <div className="mt-10 mb-10">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Últimas solicitações em andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LatestInProgressCards
                isLoading={isDashboardLoading && !solicitationsResponse}
                items={latestInProgress}
              />
            </CardContent>
          </Card>
        </div>

        {canViewStatusMetrics ? (
          <div className="mb-10">
            <StatusMetricsCard
              isLoading={isDashboardLoading}
              metrics={statusMetricsResponse?.data}
              metricsDateRange={statusMetricsDateRange}
              onDateRangeChange={handleStatusMetricsDateRangeChange}
            />
          </div>
        ) : null}

        {/* {canViewExamsInfectiousMetrics ? (
          <div className="mb-10">
            <ExamsInfectiousMetricsCard
              isLoading={isDashboardLoading}
              metrics={examsInfectiousMetricsResponse?.data}
              metricsDateRange={examsMetricsDateRange}
              onDateRangeChange={handleExamsMetricsDateRangeChange}
            />
          </div>
        ) : null} */}
      </div>
    </PageContainer>
  );
}

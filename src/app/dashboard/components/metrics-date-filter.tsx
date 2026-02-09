"use client";

import { memo } from "react";
import { DateRange, DateRangePicker } from "@/components/ui/date-range-picker";

type MetricsDateFilterProps = {
  metricsDateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
};

export const MetricsDateFilter = memo(function MetricsDateFilter({
  metricsDateRange,
  onDateRangeChange,
}: MetricsDateFilterProps) {
  return (
    <DateRangePicker
      onUpdate={(values) => {
        onDateRangeChange({
          from: values.range.from,
          to: values.range.to ?? values.range.from,
        });
      }}
      initialDateFrom={metricsDateRange.from}
      initialDateTo={metricsDateRange.to}
      locale="pt-BR"
      showCompare={false}
    />
  );
});

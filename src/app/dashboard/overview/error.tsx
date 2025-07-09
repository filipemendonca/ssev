"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconAlertCircle } from "@tabler/icons-react";

export default function OverviewError({ error }: Readonly<{ error: Error }>) {
  return (
    <Alert variant="destructive">
      <IconAlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Falha ao carregar as estatísticas: {error.message}
      </AlertDescription>
    </Alert>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Solicitations } from "../solicitations/data-table/columns";
import { recordStatus, styles } from "../solicitations/types/types";
import { memo } from "react";
import { Separator } from "@/components/ui/separator";

type LatestInProgressCardsProps = {
  isLoading: boolean;
  items: Solicitations[];
};

export const LatestInProgressCards = memo(function LatestInProgressCards({
  isLoading,
  items,
}: LatestInProgressCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"].map((key) => (
          <Card key={key} className="h-full">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Nenhuma solicitação em andamento encontrada.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
      {items.map((solicitation) => (
        <Link
          key={solicitation.id}
          href={`/dashboard/solicitations/${solicitation.id}/view`}
          className="block"
        >
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center justify-between text-base font-semibold">
                <span className="line-clamp-1">{solicitation.patient}</span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    styles[solicitation.status as keyof typeof styles] ||
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {recordStatus[solicitation.status]}
                </span>
              </CardTitle>
              <Separator />
              <div className="text-sm text-muted-foreground line-clamp-1">
                <strong>Tutor:</strong> {solicitation.tutor}
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <div className="line-clamp-1">
                <strong>Médico:</strong> {solicitation.doctor}
              </div>
              <div className="line-clamp-1">
                <strong>Espécie:</strong> {solicitation.specie}
              </div>
              <div className="text-xs">
                <strong>Criado em:</strong>{" "}
                {format(
                  new Date(solicitation.createdAt),
                  "dd/MM/yyyy 'às' HH:mm",
                  {
                    locale: ptBR,
                  },
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
});

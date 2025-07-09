import PageContainer from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconTrendingUp } from "@tabler/icons-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React from "react";

export default function Page({
  sales,
  pie_stats,
  bar_stats,
  area_stats,
}: Readonly<{
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}>) {
  const formattedDate = format(new Date(), "MMMM", { locale: ptBR });

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between space-y-2 mb-10">
          <h2 className="text-2xl font-bold tracking-tight">
            Olá, bem-vindo de volta!
          </h2>
        </div>

        {/* <Separator /> */}

        <div className="flex items-center justify-between space-y-2 mt-10 mb-5">
          <h1>
            Solicitações em alta este mês de <strong>{formattedDate}</strong>
          </h1>
        </div>
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4 mb-10">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Solicitações em alta</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                12
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconTrendingUp />
                  +12.5%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Pesquisa de hematozoários <IconTrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Aumento de 12.5% nas solicitações
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Solicitações em alta</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                10
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconTrendingUp />
                  +1.5%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Histopatologia <IconTrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Aumento de 1.5% nas solicitações
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Solicitações em alta</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                10
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconTrendingUp />
                  +2.5%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Sorologia simples <IconTrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Aumento de 2.5% nas solicitações
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Solicitações em alta</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                8
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconTrendingUp />
                  +20%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Biologia molecular <IconTrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Aumento de 20% nas solicitações
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">{bar_stats}</div>
          <div className="col-span-4 md:col-span-3">
            {/* sales arallel routes */}
            {sales}
          </div>
          <div className="col-span-4">{area_stats}</div>
          <div className="col-span-4 md:col-span-3">{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}

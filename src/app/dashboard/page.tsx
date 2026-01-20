"use client";
import PageContainer from "@/components/layout/page-container";
import { useUserStore } from "@/context/stores/user.store";

export default function Page() {
  // const formattedDate = format(new Date(), "MMMM", { locale: ptBR });
  const { user } = useUserStore();

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between space-y-2 mb-10">
          <h2 className="text-2xl font-bold tracking-tight">
            Olá {user?.name}, bem-vindo de volta!
          </h2>
        </div>

        {/* <div className="flex items-center justify-between space-y-2 mt-10 mb-5">
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
        </div> */}
      </div>
    </PageContainer>
  );
}

import { Timeline, TimelineItem } from "@/components/timeline";
import { SolicitationHistoryDTO } from "../dto/solicitation.history.dto";
import { recordStatus, SolicitationStatus } from "../types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SolicitationHistoryTimelineProps {
  data?: SolicitationHistoryDTO[];
}

export default function SolicitationHistoryTimeline({
  data,
}: Readonly<SolicitationHistoryTimelineProps>) {
  const renderTitle = (item: SolicitationHistoryDTO) => {
    if (item.previousStatus !== null)
      return `Status modificado de ${recordStatus[item.previousStatus]} para ${
        recordStatus[item.newStatus]
      }`;
    else return `Status inicial definido como ${recordStatus[item.newStatus]}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between text-2xl font-bold ">
          <div className="flex justify-between">Histórico de status</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Timeline size={"sm"}>
          {data?.map((item) => (
            <TimelineItem
              key={item.id}
              solicitationStatus={item.newStatus as SolicitationStatus}
              date={new Date(item.changedAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
              title={renderTitle(item)}
              description={`Modificado por: ${item.changedBy?.name || ""}`}
            />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}

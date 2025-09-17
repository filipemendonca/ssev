import { Timeline, TimelineItem } from "@/components/timeline";
import { SolicitationHistoryDTO } from "../dto/solicitation.history.dto";
import { recordStatus } from "../types/types";
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
              date={new Date(item.changedAt).toLocaleDateString()}
              title={renderTitle(item)}
              description={`Modificado por: ${item.changedBy?.name || ""}`}
              // icon={<Check />}
              status="completed"
              iconColor="primary"
            />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}

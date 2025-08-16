import { Exams } from "../../exams/data-table/columns";
import { InfectiousAgents } from "../../infectious-agents/data-table/columns";
import { Sample } from "../../sample/data-table/columns";

export type SampleWithCheck = Sample & { checked: boolean };
export type ExamsWithCheck = Exams & { checked: boolean };
export type InfectiousAgentsWithCheck = InfectiousAgents & {
  checked: boolean;
};

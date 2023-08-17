import type { Moment } from "moment";

export interface PlanItemLocation {
  path: string;
  line: number;
}

export interface PlanItem {
  startTime: Moment;
  endTime: Moment;
  rawStartTime: string;
  rawEndTime: string;
  listTokens: string;
  text: string;
  durationMinutes: number;
  startMinutes: number;
  endMinutes: number;
  location?: PlanItemLocation;
}

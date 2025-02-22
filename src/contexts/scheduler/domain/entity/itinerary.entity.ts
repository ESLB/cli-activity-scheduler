export interface ItineraryActivityPrimitive {
  startTime: string;
  endtime: string;
  minutes: number;
  label: string;
  description?: string;
  id?: string;
}

export interface ActivityPartPrimitive {
  label: string;
  startTime: string;
  endTime: string;
  totalMinutes: number;
}

export interface ItineraryActivityPrimitive2 {
  activityName: string;
  description?: string;
  preparation: ActivityPartPrimitive;
  activity: ActivityPartPrimitive;
  rest: ActivityPartPrimitive;
  id: string;
}

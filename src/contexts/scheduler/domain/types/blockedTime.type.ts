export interface BlockedTime {
  name: string;
  startTimeMinutes: number; // Minutes from midnight (0-1439)
  endTimeMinutes: number; // Minutes from midnight (0-1439), can be < startTime if crosses midnight
}

export interface ParsedBlockedTimeLine {
  lineNumber: number;
  name: string;
  startTime: string; // HH:MM format (24h)
  endTime: string; // HH:MM format (24h)
}

export type BlockedTimeParseResult =
  | { success: true; blockedTimes: BlockedTime[] }
  | { success: false; errors: { lineNumber: number; message: string; rawLine: string }[] };

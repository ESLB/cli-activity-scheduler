export interface ParsedActivityLine {
  lineNumber: number;
  topic: string;
  title: string;
  durationMinutes: number;
  description?: string;
  energyLevel: number; // 1-10
  preparationTime?: number; // minutes
  restTime?: number; // minutes
}

export interface ValidationError {
  lineNumber: number;
  message: string;
  rawLine: string;
}

export type ParseResult =
  | { success: true; activities: ParsedActivityLine[] }
  | { success: false; errors: ValidationError[] };

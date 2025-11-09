import fs from 'fs';
import path from 'path';
import {
  BlockedTime,
  BlockedTimeParseResult,
} from '../../domain/types/blockedTime.type';

export class BlockedTimeParser {
  private readonly filePath: string;

  constructor(fileName: string = 'blocked-times.md') {
    this.filePath = path.join(process.cwd(), fileName);
  }

  parse(): BlockedTimeParseResult {
    try {
      // Check if file exists
      if (!fs.existsSync(this.filePath)) {
        // If file doesn't exist, return empty (not an error)
        return { success: true, blockedTimes: [] };
      }

      const content = fs.readFileSync(this.filePath, 'utf-8');
      const lines = content.split('\n');

      const errors: { lineNumber: number; message: string; rawLine: string }[] = [];
      const blockedTimes: BlockedTime[] = [];

      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();

        // Skip empty lines, comments, and markdown headers
        if (!trimmedLine || trimmedLine.startsWith('#')) {
          return;
        }

        // Expected format: - Name - HH:MM - HH:MM
        if (!trimmedLine.startsWith('-')) {
          return; // Skip non-list items
        }

        const parseResult = this.parseLine(trimmedLine, lineNumber);

        if (parseResult.success) {
          blockedTimes.push(parseResult.blockedTime);
        } else {
          errors.push(parseResult.error);
        }
      });

      if (errors.length > 0) {
        return { success: false, errors };
      }

      return { success: true, blockedTimes };
    } catch (error: any) {
      return {
        success: false,
        errors: [
          {
            lineNumber: 0,
            message: `Error reading file: ${error.message}`,
            rawLine: '',
          },
        ],
      };
    }
  }

  private parseLine(
    line: string,
    lineNumber: number,
  ):
    | { success: true; blockedTime: BlockedTime }
    | { success: false; error: { lineNumber: number; message: string; rawLine: string } } {
    try {
      // Remove leading dash and trim
      const withoutDash = line.replace(/^-\s*/, '');

      // Split by " - "
      const parts = withoutDash.split(' - ');

      if (parts.length !== 3) {
        return {
          success: false,
          error: {
            lineNumber,
            message: 'Invalid format. Expected: - Name - HH:MM - HH:MM',
            rawLine: line,
          },
        };
      }

      const name = parts[0].trim();
      const startTimeStr = parts[1].trim();
      const endTimeStr = parts[2].trim();

      if (!name) {
        return {
          success: false,
          error: {
            lineNumber,
            message: 'Name is required',
            rawLine: line,
          },
        };
      }

      // Parse start time
      const startTimeMinutes = this.parseTimeToMinutes(startTimeStr);
      if (startTimeMinutes === null) {
        return {
          success: false,
          error: {
            lineNumber,
            message: `Invalid start time: "${startTimeStr}". Expected HH:MM format (24h)`,
            rawLine: line,
          },
        };
      }

      // Parse end time
      const endTimeMinutes = this.parseTimeToMinutes(endTimeStr);
      if (endTimeMinutes === null) {
        return {
          success: false,
          error: {
            lineNumber,
            message: `Invalid end time: "${endTimeStr}". Expected HH:MM format (24h)`,
            rawLine: line,
          },
        };
      }

      return {
        success: true,
        blockedTime: {
          name,
          startTimeMinutes,
          endTimeMinutes,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          lineNumber,
          message: `Parse error: ${error.message}`,
          rawLine: line,
        },
      };
    }
  }

  private parseTimeToMinutes(timeStr: string): number | null {
    // Expected format: HH:MM (24-hour)
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) {
      return null;
    }

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return null;
    }

    return hours * 60 + minutes;
  }
}

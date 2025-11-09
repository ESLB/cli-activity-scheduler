import fs from 'fs';
import path from 'path';
import {
  ParsedActivityLine,
  ValidationError,
  ParseResult,
} from '../../domain/types/parsedActivity.type';

export class MarkdownActivityParser {
  private readonly filePath: string;

  constructor(fileName: string = 'activities.md') {
    this.filePath = path.join(process.cwd(), fileName);
  }

  parse(): ParseResult {
    try {
      // Read file
      if (!fs.existsSync(this.filePath)) {
        return {
          success: false,
          errors: [
            {
              lineNumber: 0,
              message: `File not found: ${this.filePath}`,
              rawLine: '',
            },
          ],
        };
      }

      const content = fs.readFileSync(this.filePath, 'utf-8');
      const lines = content.split('\n');

      const errors: ValidationError[] = [];
      const activities: ParsedActivityLine[] = [];

      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();

        // Skip empty lines and non-checkbox lines
        if (!trimmedLine.startsWith('- [ ]')) {
          return;
        }

        const parseResult = this.parseLine(trimmedLine, lineNumber);

        if (parseResult.success) {
          activities.push(parseResult.activity);
        } else {
          errors.push(parseResult.error);
        }
      });

      if (errors.length > 0) {
        return { success: false, errors };
      }

      return { success: true, activities };
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
    | { success: true; activity: ParsedActivityLine }
    | { success: false; error: ValidationError } {
    try {
      // Remove "- [ ] " prefix
      const withoutCheckbox = line.replace(/^- \[ \]\s*/, '');

      // Split by " - "
      const parts = withoutCheckbox.split(' - ');

      if (parts.length < 3) {
        return {
          success: false,
          error: {
            lineNumber,
            message:
              'Invalid format. Expected: - [ ] Topic: Title - Duration - E# - ...',
            rawLine: line,
          },
        };
      }

      // Parse Topic and Title (first part contains ":")
      const topicTitlePart = parts[0];
      const colonIndex = topicTitlePart.indexOf(':');

      if (colonIndex === -1) {
        return {
          success: false,
          error: {
            lineNumber,
            message: 'Missing ":" separator between Topic and Title',
            rawLine: line,
          },
        };
      }

      const topic = topicTitlePart.substring(0, colonIndex).trim();
      const title = topicTitlePart.substring(colonIndex + 1).trim();

      // Parse duration (second part)
      const durationStr = parts[1].trim();
      const durationMinutes = parseInt(durationStr, 10);

      if (isNaN(durationMinutes) || durationMinutes <= 0) {
        return {
          success: false,
          error: {
            lineNumber,
            message: `Invalid duration: "${durationStr}". Must be a positive number`,
            rawLine: line,
          },
        };
      }

      // Parse optional fields (remaining parts)
      const optionalFields = parts.slice(2);
      let description: string | undefined;
      let energyLevel: number | undefined;
      let preparationTime: number | undefined;
      let restTime: number | undefined;

      for (const field of optionalFields) {
        const trimmedField = field.trim();
        if (trimmedField.length === 0) continue;

        const prefix = trimmedField.charAt(0).toUpperCase();
        const value = trimmedField.substring(1).trim();

        switch (prefix) {
          case 'D':
            description = value;
            break;
          case 'E':
            const energy = parseInt(value, 10);
            if (isNaN(energy) || energy < 1 || energy > 10) {
              return {
                success: false,
                error: {
                  lineNumber,
                  message: `Invalid energy level: "${value}". Must be between 1 and 10`,
                  rawLine: line,
                },
              };
            }
            energyLevel = energy;
            break;
          case 'P':
            const prep = parseInt(value, 10);
            if (isNaN(prep) || prep < 0) {
              return {
                success: false,
                error: {
                  lineNumber,
                  message: `Invalid preparation time: "${value}". Must be a non-negative number`,
                  rawLine: line,
                },
              };
            }
            preparationTime = prep;
            break;
          case 'R':
            const rest = parseInt(value, 10);
            if (isNaN(rest) || rest < 0) {
              return {
                success: false,
                error: {
                  lineNumber,
                  message: `Invalid rest time: "${value}". Must be a non-negative number`,
                  rawLine: line,
                },
              };
            }
            restTime = rest;
            break;
          default:
            // Unknown prefix, ignore
            break;
        }
      }

      // Validate required fields
      if (!topic) {
        return {
          success: false,
          error: {
            lineNumber,
            message: 'Topic is required',
            rawLine: line,
          },
        };
      }

      if (!title) {
        return {
          success: false,
          error: {
            lineNumber,
            message: 'Title is required',
            rawLine: line,
          },
        };
      }

      if (energyLevel === undefined) {
        return {
          success: false,
          error: {
            lineNumber,
            message: 'Energy level (E#) is required',
            rawLine: line,
          },
        };
      }

      return {
        success: true,
        activity: {
          lineNumber,
          topic,
          title,
          durationMinutes,
          description,
          energyLevel,
          preparationTime,
          restTime,
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
}

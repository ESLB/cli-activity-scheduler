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
      if (!fs.existsSync(this.filePath)) {
        return { success: true, blockedTimes: [] };
      }

      const content = fs.readFileSync(this.filePath, 'utf-8');
      const lines = content.split('\n');

      const errors: { lineNumber: number; message: string; rawLine: string }[] = [];
      const blockedTimesWithLine: { blockedTime: BlockedTime; lineNumber: number }[] = [];

      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();

        if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('<!--')) {
          return;
        }

        if (!trimmedLine.startsWith('-')) {
          return;
        }

        const parseResult = this.parseLine(trimmedLine, lineNumber);

        if (parseResult.success) {
          blockedTimesWithLine.push({ blockedTime: parseResult.blockedTime, lineNumber });
        } else {
          errors.push(parseResult.error);
        }
      });

      if (errors.length > 0) {
        return { success: false, errors };
      }

      const blockedTimes = blockedTimesWithLine.map((b) => b.blockedTime);
      const overlapErrors = this.validateNoOverlaps(blockedTimesWithLine);

      if (overlapErrors.length > 0) {
        return { success: false, errors: overlapErrors };
      }

      return { success: true, blockedTimes };
    } catch (error: any) {
      return {
        success: false,
        errors: [{ lineNumber: 0, message: `Error reading file: ${error.message}`, rawLine: '' }],
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
      const withoutDash = line.replace(/^-\s*/, '');
      const parts = withoutDash.split(' - ');

      if (parts.length < 3 || parts.length > 4) {
        return {
          success: false,
          error: {
            lineNumber,
            message: 'Formato inválido. Esperado: - Nombre - HH:MM - HH:MM  o  - Nombre - HH:MM - HH:MM - P',
            rawLine: line,
          },
        };
      }

      const name = parts[0].trim();
      const startTimeStr = parts[1].trim();
      const endTimeStr = parts[2].trim();
      const flagStr = parts[3]?.trim().toUpperCase();

      if (!name) {
        return {
          success: false,
          error: { lineNumber, message: 'El nombre es requerido', rawLine: line },
        };
      }

      if (flagStr !== undefined && flagStr !== 'P') {
        return {
          success: false,
          error: {
            lineNumber,
            message: `Bandera desconocida: "${flagStr}". Únicamente se admite "P" (con tiempo de preparación)`,
            rawLine: line,
          },
        };
      }

      const startTimeMinutes = this.parseTimeToMinutes(startTimeStr);
      if (startTimeMinutes === null) {
        return {
          success: false,
          error: {
            lineNumber,
            message: `Hora de inicio inválida: "${startTimeStr}". Se esperaba formato HH:MM (24h)`,
            rawLine: line,
          },
        };
      }

      const endTimeMinutes = this.parseTimeToMinutes(endTimeStr);
      if (endTimeMinutes === null) {
        return {
          success: false,
          error: {
            lineNumber,
            message: `Hora de fin inválida: "${endTimeStr}". Se esperaba formato HH:MM (24h)`,
            rawLine: line,
          },
        };
      }

      if (startTimeMinutes === endTimeMinutes) {
        return {
          success: false,
          error: {
            lineNumber,
            message: 'La hora de inicio y la hora de fin no pueden ser iguales',
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
          hasBreaks: flagStr === 'P',
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: { lineNumber, message: `Error de parseo: ${error.message}`, rawLine: line },
      };
    }
  }

  private validateNoOverlaps(
    blockedTimesWithLine: { blockedTime: BlockedTime; lineNumber: number }[],
  ): { lineNumber: number; message: string; rawLine: string }[] {
    const errors: { lineNumber: number; message: string; rawLine: string }[] = [];

    const getIntervals = (block: BlockedTime): [number, number][] => {
      if (block.endTimeMinutes > block.startTimeMinutes) {
        return [[block.startTimeMinutes, block.endTimeMinutes]];
      }
      // Crosses midnight: split into two intervals
      return [[block.startTimeMinutes, 1440], [0, block.endTimeMinutes]];
    };

    const overlaps = (a: [number, number], b: [number, number]): boolean =>
      a[0] < b[1] && b[0] < a[1];

    for (let i = 0; i < blockedTimesWithLine.length; i++) {
      for (let j = i + 1; j < blockedTimesWithLine.length; j++) {
        const a = blockedTimesWithLine[i];
        const b = blockedTimesWithLine[j];
        const intervalsA = getIntervals(a.blockedTime);
        const intervalsB = getIntervals(b.blockedTime);

        const hasOverlap = intervalsA.some((ia) => intervalsB.some((ib) => overlaps(ia, ib)));

        if (hasOverlap) {
          errors.push({
            lineNumber: b.lineNumber,
            message: `Los bloques "${a.blockedTime.name}" y "${b.blockedTime.name}" se solapan`,
            rawLine: '',
          });
        }
      }
    }

    return errors;
  }

  private parseTimeToMinutes(timeStr: string): number | null {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

    return hours * 60 + minutes;
  }
}

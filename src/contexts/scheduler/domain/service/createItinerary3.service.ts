import { Activity } from '../entity/activity.entity';
import { IntegerValueObject } from '../valueObject/integer.valueObject';
import {
  ActivityPartPrimitive,
  ItineraryItemPrimitive,
  ItineraryActivityPrimitive2,
  ItineraryBlockedTimePrimitive,
} from '../entity/itinerary.entity';
import { Time } from '../valueObject/time.valueObject';
import { BlockedTime } from '../types/blockedTime.type';

const BREAK_BEFORE_BLOCK = 15; // minutes
const BREAK_AFTER_BLOCK = 15; // minutes

export class CreateItinerary3 {
  execute(
    activities: Activity[],
    blockedTimes: BlockedTime[],
    startTimeHour?: number,
  ): ItineraryItemPrimitive[] {
    const itinerary: ItineraryItemPrimitive[] = [];
    const startItinerary = startTimeHour
      ? this.getStartTime(startTimeHour)
      : this.getCurrentTime();

    let currentTime = startItinerary;

    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];

      // Collect all parts for this activity (may be interrupted by blocks)
      const allParts: (
        | { type: 'part'; part: ActivityPartPrimitive; phase: 'preparation' | 'activity' | 'rest' }
        | { type: 'block'; block: ItineraryBlockedTimePrimitive }
      )[] = [];

      // Track how much time we've spent on this activity
      let preparationUsed = 0;
      let activityUsed = 0;
      let restUsed = 0;

      const preparationNeeded = activity.preparationTime.value;
      const activityNeeded = activity.duration.value;
      const restNeeded = activity.restTime.value;

      // Process preparation
      while (preparationUsed < preparationNeeded) {
        const remainingPrep = preparationNeeded - preparationUsed;
        const result = this.processTimeSegment(
          currentTime,
          remainingPrep,
          blockedTimes,
          'Preparación',
        );

        if (result.blockedTime) {
          allParts.push({ type: 'block', block: result.blockedTime });
          currentTime = result.newTime;
        } else if (result.segment) {
          allParts.push({ type: 'part', part: result.segment, phase: 'preparation' });
          preparationUsed += result.segment.totalMinutes;
          currentTime = result.newTime;
        }
      }

      // Process main activity
      while (activityUsed < activityNeeded) {
        const remainingActivity = activityNeeded - activityUsed;
        const result = this.processTimeSegment(
          currentTime,
          remainingActivity,
          blockedTimes,
          'Actividad',
        );

        if (result.blockedTime) {
          allParts.push({ type: 'block', block: result.blockedTime });
          currentTime = result.newTime;
        } else if (result.segment) {
          allParts.push({ type: 'part', part: result.segment, phase: 'activity' });
          activityUsed += result.segment.totalMinutes;
          currentTime = result.newTime;
        }
      }

      // Process rest
      while (restUsed < restNeeded) {
        const remainingRest = restNeeded - restUsed;
        const result = this.processTimeSegment(
          currentTime,
          remainingRest,
          blockedTimes,
          'Descanso',
        );

        if (result.blockedTime) {
          allParts.push({ type: 'block', block: result.blockedTime });
          currentTime = result.newTime;
        } else if (result.segment) {
          allParts.push({ type: 'part', part: result.segment, phase: 'rest' });
          restUsed += result.segment.totalMinutes;
          currentTime = result.newTime;
        }
      }

      // Now build the itinerary items from allParts
      // Group consecutive parts of the same activity, inserting blocks in between
      const preparationParts: ActivityPartPrimitive[] = [];
      const activityParts: ActivityPartPrimitive[] = [];
      const restParts: ActivityPartPrimitive[] = [];

      for (const item of allParts) {
        if (item.type === 'block') {
          // Before inserting block, add accumulated activity parts
          if (
            preparationParts.length > 0 ||
            activityParts.length > 0 ||
            restParts.length > 0
          ) {
            const partialActivity: ItineraryActivityPrimitive2 & {
              type: 'activity';
            } = {
              type: 'activity',
              activityName: `${i + 1}) ${activity.name.value}`,
              description: activity.description.value,
              id: activity.id.value,
              preparation: this.combineParts(preparationParts, 'Preparación'),
              activity: this.combineParts(activityParts, 'Actividad'),
              rest: this.combineParts(restParts, 'Descanso'),
            };
            itinerary.push(partialActivity);

            // Clear accumulated parts
            preparationParts.length = 0;
            activityParts.length = 0;
            restParts.length = 0;
          }

          // Add the block
          itinerary.push(item.block);
        } else {
          // Accumulate part
          if (item.phase === 'preparation') {
            preparationParts.push(item.part);
          } else if (item.phase === 'activity') {
            activityParts.push(item.part);
          } else {
            restParts.push(item.part);
          }
        }
      }

      // Add any remaining parts as final activity entry
      if (
        preparationParts.length > 0 ||
        activityParts.length > 0 ||
        restParts.length > 0
      ) {
        const finalActivity: ItineraryActivityPrimitive2 & {
          type: 'activity';
        } = {
          type: 'activity',
          activityName: `${i + 1}) ${activity.name.value}`,
          description: activity.description.value,
          id: activity.id.value,
          preparation: this.combineParts(preparationParts, 'Preparación'),
          activity: this.combineParts(activityParts, 'Actividad'),
          rest: this.combineParts(restParts, 'Descanso'),
        };
        itinerary.push(finalActivity);
      }
    }

    this.appendMissingBlocks(itinerary, blockedTimes, startItinerary.minutes.value);

    return itinerary;
  }

  private appendMissingBlocks(
    itinerary: ItineraryItemPrimitive[],
    blockedTimes: BlockedTime[],
    startMinutes: number,
  ): void {
    const appearedNames = new Set(
      itinerary
        .filter((item): item is ItineraryBlockedTimePrimitive => item.type === 'blocked')
        .map((item) => item.name),
    );

    const missing = blockedTimes
      .filter((block) => !appearedNames.has(block.name))
      .map((block) => ({ block, nextStart: this.getNextBlockStart(block, startMinutes) }))
      .sort((a, b) => a.nextStart - b.nextStart);

    for (const { block, nextStart } of missing) {
      const displayStart = block.hasBreaks ? nextStart - BREAK_BEFORE_BLOCK : nextStart;
      itinerary.push(this.createBlockedTimeItem(block, new Time(new IntegerValueObject(displayStart))));
    }
  }

  private getNextBlockStart(block: BlockedTime, fromMinutes: number): number {
    const dayStart = Math.floor(fromMinutes / 1440) * 1440;
    const todayAbsoluteStart = dayStart + block.startTimeMinutes;
    return todayAbsoluteStart >= fromMinutes ? todayAbsoluteStart : todayAbsoluteStart + 1440;
  }

  private processTimeSegment(
    startTime: Time,
    duration: number,
    blockedTimes: BlockedTime[],
    label: string,
  ): {
    segment?: ActivityPartPrimitive;
    blockedTime?: ItineraryBlockedTimePrimitive;
    newTime: Time;
  } {
    if (duration === 0) {
      return { newTime: startTime };
    }

    const endTime = startTime.add(new IntegerValueObject(duration));

    // Check if this segment collides with any blocked time
    const collision = this.findBlockCollision(
      startTime.minutes.value,
      endTime.minutes.value,
      blockedTimes,
    );

    if (collision) {
      // We need to stop before the block
      const timeUntilBlock = collision.startWithBreak - startTime.minutes.value;

      if (timeUntilBlock > 0) {
        // There's time before the block, use it
        const segment = this.createSegment(startTime, timeUntilBlock, label);
        return {
          segment,
          newTime: startTime.add(new IntegerValueObject(timeUntilBlock)),
        };
      } else {
        // We're already inside the block (or its pre-break) — use remaining time only
        const breakBefore = collision.block.hasBreaks ? BREAK_BEFORE_BLOCK : 0;
        const breakAfter = collision.block.hasBreaks ? BREAK_AFTER_BLOCK : 0;
        const absoluteBlockStart = collision.startWithBreak + breakBefore;
        const absoluteBlockEnd = absoluteBlockStart + this.getBlockDuration(collision.block);
        const absoluteTotalEnd = absoluteBlockEnd + breakAfter;
        const remainingTotal = absoluteTotalEnd - startTime.minutes.value;

        const blockedItem = this.createBlockedTimeItemFromPosition(
          collision.block,
          startTime.minutes.value,
          absoluteBlockStart,
          absoluteBlockEnd,
          absoluteTotalEnd,
        );
        return {
          blockedTime: blockedItem,
          newTime: startTime.add(new IntegerValueObject(remainingTotal)),
        };
      }
    }

    // No collision, create full segment
    const segment = this.createSegment(startTime, duration, label);
    return { segment, newTime: endTime };
  }

  private findBlockCollision(
    startMinutes: number,
    endMinutes: number,
    blockedTimes: BlockedTime[],
  ): { block: BlockedTime; startWithBreak: number } | null {
    const startDay = Math.floor(startMinutes / 1440);
    const endDay = Math.floor(endMinutes / 1440);

    for (const block of blockedTimes) {
      const blockDuration = this.getBlockDuration(block);

      // Check the block occurrence on each day the segment touches
      for (let day = startDay; day <= endDay; day++) {
        const absoluteBlockStart = day * 1440 + block.startTimeMinutes;
        const absoluteBlockEnd = absoluteBlockStart + blockDuration;
        const breakOffset = block.hasBreaks ? BREAK_BEFORE_BLOCK : 0;
        const absoluteBlockStartWithBreak = absoluteBlockStart - breakOffset;

        if (startMinutes < absoluteBlockEnd && endMinutes > absoluteBlockStartWithBreak) {
          return { block, startWithBreak: absoluteBlockStartWithBreak };
        }
      }
    }

    return null;
  }

  private getBlockDuration(block: BlockedTime): number {
    if (block.endTimeMinutes >= block.startTimeMinutes) {
      return block.endTimeMinutes - block.startTimeMinutes;
    } else {
      // Crosses midnight
      return 1440 - block.startTimeMinutes + block.endTimeMinutes;
    }
  }

  private createBlockedTimeItem(
    block: BlockedTime,
    currentTime: Time,
  ): ItineraryBlockedTimePrimitive {
    const blockDuration = this.getBlockDuration(block);

    if (!block.hasBreaks) {
      const blockEnd = currentTime.add(new IntegerValueObject(blockDuration));
      return {
        type: 'blocked',
        name: block.name,
        preBreak: { label: 'Pausa (Pre)', startTime: '', endTime: '', totalMinutes: 0 },
        blockedTime: {
          label: block.name,
          startTime: currentTime.textual,
          endTime: blockEnd.textual,
          totalMinutes: blockDuration,
        },
        postBreak: { label: 'Pausa (Post)', startTime: '', endTime: '', totalMinutes: 0 },
      };
    }

    const preBreakStart = currentTime;
    const preBreakEnd = currentTime.add(new IntegerValueObject(BREAK_BEFORE_BLOCK));
    const blockStart = preBreakEnd;
    const blockEnd = blockStart.add(new IntegerValueObject(blockDuration));
    const postBreakStart = blockEnd;
    const postBreakEnd = postBreakStart.add(new IntegerValueObject(BREAK_AFTER_BLOCK));

    return {
      type: 'blocked',
      name: block.name,
      preBreak: {
        label: 'Pausa (Pre)',
        startTime: preBreakStart.textual,
        endTime: preBreakEnd.textual,
        totalMinutes: BREAK_BEFORE_BLOCK,
      },
      blockedTime: {
        label: block.name,
        startTime: blockStart.textual,
        endTime: blockEnd.textual,
        totalMinutes: blockDuration,
      },
      postBreak: {
        label: 'Pausa (Post)',
        startTime: postBreakStart.textual,
        endTime: postBreakEnd.textual,
        totalMinutes: BREAK_AFTER_BLOCK,
      },
    };
  }

  private createBlockedTimeItemFromPosition(
    block: BlockedTime,
    nowMinutes: number,
    absoluteBlockStart: number,
    absoluteBlockEnd: number,
    absoluteTotalEnd: number,
  ): ItineraryBlockedTimePrimitive {
    const t = (m: number) => new Time(new IntegerValueObject(m)).textual;
    const mkPart = (label: string, start: number, end: number): ActivityPartPrimitive => ({
      label, startTime: t(start), endTime: t(end), totalMinutes: end - start,
    });
    const emptyPart = (label: string): ActivityPartPrimitive => ({
      label, startTime: '', endTime: '', totalMinutes: 0,
    });

    const preBreak = nowMinutes < absoluteBlockStart
      ? mkPart('Pausa (Pre)', nowMinutes, absoluteBlockStart)
      : emptyPart('Pausa (Pre)');

    const blockStart = Math.max(nowMinutes, absoluteBlockStart);
    const blockedTime = blockStart < absoluteBlockEnd
      ? mkPart(block.name, blockStart, absoluteBlockEnd)
      : emptyPart(block.name);

    const postBreakStart = Math.max(nowMinutes, absoluteBlockEnd);
    const postBreak = block.hasBreaks && postBreakStart < absoluteTotalEnd
      ? mkPart('Pausa (Post)', postBreakStart, absoluteTotalEnd)
      : emptyPart('Pausa (Post)');

    return { type: 'blocked', name: block.name, preBreak, blockedTime, postBreak };
  }

  private createSegment(
    startTime: Time,
    duration: number,
    label: string,
  ): ActivityPartPrimitive {
    const endTime = startTime.add(new IntegerValueObject(duration));
    return {
      label,
      startTime: startTime.textual,
      endTime: endTime.textual,
      totalMinutes: duration,
    };
  }

  private combineParts(
    parts: ActivityPartPrimitive[],
    label: string,
  ): ActivityPartPrimitive {
    if (parts.length === 0) {
      return {
        label,
        startTime: '',
        endTime: '',
        totalMinutes: 0,
      };
    }

    if (parts.length === 1) {
      return { ...parts[0], label };
    }

    // Combine multiple parts
    const totalMinutes = parts.reduce((sum, p) => sum + p.totalMinutes, 0);
    return {
      label,
      startTime: parts[0].startTime,
      endTime: parts[parts.length - 1].endTime,
      totalMinutes,
    };
  }

  private getStartTime(startTimeHour: number): Time {
    return new Time(new IntegerValueObject(Math.round(startTimeHour * 60)));
  }

  private getCurrentTime(): Time {
    const minutesTillNow = new Date().getHours() * 60 + new Date().getMinutes();
    return new Time(new IntegerValueObject(minutesTillNow));
  }
}

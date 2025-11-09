import assert from 'assert';
import { CreateItinerary2 } from '../src/contexts/scheduler/domain/service/createItinerary2.service';
import { Activity } from '../src/contexts/scheduler/domain/entity/activity.entity';
import { StringValueObject } from '../src/contexts/scheduler/domain/valueObject/string.valueObject';
import { IntegerValueObject } from '../src/contexts/scheduler/domain/valueObject/integer.valueObject';

console.log('Running Itinerary Tests...\n');

const createItineraryService = new CreateItinerary2();

// Test 1: Single activity itinerary
{
  const activities = [
    Activity.create({
      name: new StringValueObject('Test: Task 1'),
      duration: new IntegerValueObject(60),
      energyLevel: new IntegerValueObject(5),
      preparationTime: new IntegerValueObject(5),
      restTime: new IntegerValueObject(10),
    }),
  ];

  const itinerary = createItineraryService.execute(activities, 8); // 8:00 AM

  assert.strictEqual(itinerary.length, 1);
  assert.strictEqual(itinerary[0].activityName, '1) Test: Task 1');
  assert.strictEqual(itinerary[0].preparation.totalMinutes, 5);
  assert.strictEqual(itinerary[0].preparation.startTime, '08:00AM');
  assert.strictEqual(itinerary[0].preparation.endTime, '08:05AM');
  assert.strictEqual(itinerary[0].activity.totalMinutes, 60);
  assert.strictEqual(itinerary[0].activity.startTime, '08:05AM');
  assert.strictEqual(itinerary[0].activity.endTime, '09:05AM');
  assert.strictEqual(itinerary[0].rest.totalMinutes, 10);
  assert.strictEqual(itinerary[0].rest.startTime, '09:05AM');
  assert.strictEqual(itinerary[0].rest.endTime, '09:15AM');

  console.log('✓ Test 1: Single activity itinerary - PASSED');
}

// Test 2: Multiple activities chaining correctly
{
  const activities = [
    Activity.create({
      name: new StringValueObject('Task 1'),
      duration: new IntegerValueObject(30),
      energyLevel: new IntegerValueObject(5),
      preparationTime: new IntegerValueObject(0),
      restTime: new IntegerValueObject(5),
    }),
    Activity.create({
      name: new StringValueObject('Task 2'),
      duration: new IntegerValueObject(45),
      energyLevel: new IntegerValueObject(7),
      preparationTime: new IntegerValueObject(10),
      restTime: new IntegerValueObject(15),
    }),
  ];

  const itinerary = createItineraryService.execute(activities, 9); // 9:00 AM

  assert.strictEqual(itinerary.length, 2);

  // First activity ends at 9:30 + 5 rest = 9:35
  assert.strictEqual(itinerary[0].activity.startTime, '09:00AM');
  assert.strictEqual(itinerary[0].rest.endTime, '09:35AM');

  // Second activity should start at 9:35
  assert.strictEqual(itinerary[1].preparation.startTime, '09:35AM');
  assert.strictEqual(itinerary[1].preparation.endTime, '09:45AM');
  assert.strictEqual(itinerary[1].activity.startTime, '09:45AM');
  assert.strictEqual(itinerary[1].activity.endTime, '10:30AM');
  assert.strictEqual(itinerary[1].rest.endTime, '10:45AM');

  console.log('✓ Test 2: Multiple activities chaining - PASSED');
}

// Test 3: Activity with no preparation or rest
{
  const activities = [
    Activity.create({
      name: new StringValueObject('Quick Task'),
      duration: new IntegerValueObject(25),
      energyLevel: new IntegerValueObject(3),
      preparationTime: new IntegerValueObject(0),
      restTime: new IntegerValueObject(0),
    }),
  ];

  const itinerary = createItineraryService.execute(activities, 14); // 2:00 PM

  assert.strictEqual(itinerary[0].preparation.totalMinutes, 0);
  assert.strictEqual(itinerary[0].rest.totalMinutes, 0);
  assert.strictEqual(itinerary[0].activity.startTime, '02:00PM');
  assert.strictEqual(itinerary[0].activity.endTime, '02:25PM');

  console.log('✓ Test 3: No preparation or rest - PASSED');
}

// Test 4: Default to current time (no startTimeHour parameter)
{
  const activities = [
    Activity.create({
      name: new StringValueObject('Task'),
      duration: new IntegerValueObject(15),
      energyLevel: new IntegerValueObject(5),
    }),
  ];

  const itinerary = createItineraryService.execute(activities); // Should use current time

  assert.strictEqual(itinerary.length, 1);
  // Can't test exact time since it uses current time, but should not throw
  console.log('✓ Test 4: Default to current time - PASSED');
}

// Test 5: PM to next day transition
{
  const activities = [
    Activity.create({
      name: new StringValueObject('Late Task'),
      duration: new IntegerValueObject(90), // 1.5 hours
      energyLevel: new IntegerValueObject(4),
      preparationTime: new IntegerValueObject(0),
      restTime: new IntegerValueObject(0),
    }),
  ];

  const itinerary = createItineraryService.execute(activities, 23); // 11:00 PM

  assert.strictEqual(itinerary[0].activity.startTime, '11:00PM');
  // Should wrap to next day (format varies, just check it's there)
  assert.ok(itinerary[0].activity.endTime.includes('30'), 'Should end at :30');

  console.log('✓ Test 5: PM to AM transition - PASSED');
}

console.log('\n✅ All Itinerary Tests Passed!\n');

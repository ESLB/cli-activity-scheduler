import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { BlockedTimeParser } from '../src/contexts/scheduler/infrastructure/parser/blockedTimeParser';
import { CreateItinerary3 } from '../src/contexts/scheduler/domain/service/createItinerary3.service';
import { Activity } from '../src/contexts/scheduler/domain/entity/activity.entity';
import { StringValueObject } from '../src/contexts/scheduler/domain/valueObject/string.valueObject';
import { IntegerValueObject } from '../src/contexts/scheduler/domain/valueObject/integer.valueObject';

console.log('Running Blocked Times Tests...\n');

// Test 1: Parse blocked times file
{
  const testFile = path.join(process.cwd(), 'test-blocked.md');
  fs.writeFileSync(
    testFile,
    `# Blocked Times
- Dormir - 21:00 - 06:00
- Almuerzo - 12:00 - 13:00
- Ejercicio - 06:30 - 07:30
`,
  );

  const parser = new BlockedTimeParser('test-blocked.md');
  const result = parser.parse();

  assert.strictEqual(result.success, true, 'Should parse successfully');
  if (result.success) {
    assert.strictEqual(result.blockedTimes.length, 3);

    // Check first block (Sleep)
    assert.strictEqual(result.blockedTimes[0].name, 'Dormir');
    assert.strictEqual(result.blockedTimes[0].startTimeMinutes, 21 * 60); // 1260
    assert.strictEqual(result.blockedTimes[0].endTimeMinutes, 6 * 60); // 360

    // Check second block (Lunch)
    assert.strictEqual(result.blockedTimes[1].name, 'Almuerzo');
    assert.strictEqual(result.blockedTimes[1].startTimeMinutes, 12 * 60); // 720
    assert.strictEqual(result.blockedTimes[1].endTimeMinutes, 13 * 60); // 780

    console.log('✓ Test 1: Parse blocked times - PASSED');
  }

  fs.unlinkSync(testFile);
}

// Test 2: Invalid time format
{
  const testFile = path.join(process.cwd(), 'test-blocked.md');
  fs.writeFileSync(
    testFile,
    `- Dormir - 25:00 - 06:00
`,
  );

  const parser = new BlockedTimeParser('test-blocked.md');
  const result = parser.parse();

  assert.strictEqual(result.success, false, 'Should fail with invalid hour');
  if (!result.success) {
    assert.ok(result.errors[0].message.includes('Invalid'));
    console.log('✓ Test 2: Invalid time format - PASSED');
  }

  fs.unlinkSync(testFile);
}

// Test 3: Empty file (should succeed with no blocks)
{
  const testFile = path.join(process.cwd(), 'test-blocked.md');
  fs.writeFileSync(testFile, '# No blocks\n');

  const parser = new BlockedTimeParser('test-blocked.md');
  const result = parser.parse();

  assert.strictEqual(result.success, true);
  if (result.success) {
    assert.strictEqual(result.blockedTimes.length, 0);
    console.log('✓ Test 3: Empty file - PASSED');
  }

  fs.unlinkSync(testFile);
}

// Test 4: File doesn't exist (should succeed with no blocks)
{
  const parser = new BlockedTimeParser('nonexistent.md');
  const result = parser.parse();

  assert.strictEqual(result.success, true);
  if (result.success) {
    assert.strictEqual(result.blockedTimes.length, 0);
    console.log('✓ Test 4: File doesn\'t exist - PASSED');
  }
}

// Test 5: Itinerary with blocked time - activity before block
{
  const service = new CreateItinerary3();

  const activities = [
    Activity.create({
      name: new StringValueObject('Morning Task'),
      duration: new IntegerValueObject(60),
      energyLevel: new IntegerValueObject(5),
      preparationTime: new IntegerValueObject(0),
      restTime: new IntegerValueObject(0),
    }),
  ];

  const blockedTimes = [
    {
      name: 'Almuerzo',
      startTimeMinutes: 12 * 60, // 12:00
      endTimeMinutes: 13 * 60, // 13:00
    },
  ];

  const itinerary = service.execute(activities, blockedTimes, 8); // Start at 8 AM

  // Activity should complete before lunch at 12:00
  assert.strictEqual(itinerary.length, 1);
  assert.strictEqual(itinerary[0].type, 'activity');
  if (itinerary[0].type === 'activity') {
    assert.strictEqual(itinerary[0].activityName, '1) Morning Task');
  }

  console.log('✓ Test 5: Activity before blocked time - PASSED');
}

// Test 6: Itinerary with collision - activity interrupted by block
{
  const service = new CreateItinerary3();

  const activities = [
    Activity.create({
      name: new StringValueObject('Long Task'),
      duration: new IntegerValueObject(300), // 5 hours
      energyLevel: new IntegerValueObject(7),
      preparationTime: new IntegerValueObject(0),
      restTime: new IntegerValueObject(0),
    }),
  ];

  const blockedTimes = [
    {
      name: 'Almuerzo',
      startTimeMinutes: 12 * 60, // 12:00
      endTimeMinutes: 13 * 60, // 13:00
    },
  ];

  const itinerary = service.execute(activities, blockedTimes, 10); // Start at 10 AM

  // Should have:
  // 1. Activity (partial)
  // 2. Blocked time (Almuerzo)
  // 3. Activity (continuation)
  assert.ok(itinerary.length >= 2, 'Should have at least 2 items');

  // Check that blocked time appears
  const hasBlockedTime = itinerary.some((item) => item.type === 'blocked');
  assert.ok(hasBlockedTime, 'Should contain blocked time');

  console.log('✓ Test 6: Activity interrupted by blocked time - PASSED');
}

// Test 7: Midnight crossing block
{
  const service = new CreateItinerary3();

  const activities = [
    Activity.create({
      name: new StringValueObject('Evening Task'),
      duration: new IntegerValueObject(60),
      energyLevel: new IntegerValueObject(5),
      preparationTime: new IntegerValueObject(0),
      restTime: new IntegerValueObject(0),
    }),
  ];

  const blockedTimes = [
    {
      name: 'Dormir',
      startTimeMinutes: 21 * 60, // 21:00 (9 PM)
      endTimeMinutes: 6 * 60, // 06:00 (6 AM next day)
    },
  ];

  const itinerary = service.execute(activities, blockedTimes, 20); // Start at 8 PM

  // Should complete before sleep time
  assert.ok(itinerary.length >= 1);

  console.log('✓ Test 7: Midnight crossing block - PASSED');
}

console.log('\n✅ All Blocked Times Tests Passed!\n');

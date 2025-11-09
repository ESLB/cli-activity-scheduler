import assert from 'assert';
import { Activity } from '../src/contexts/scheduler/domain/entity/activity.entity';
import { StringValueObject } from '../src/contexts/scheduler/domain/valueObject/string.valueObject';
import { IntegerValueObject } from '../src/contexts/scheduler/domain/valueObject/integer.valueObject';

console.log('Running Energy Calculation Tests...\n');

// Helper function (same as in command)
const calculateEnergyConsumption = (
  activities: { energyLevel: { value: number }; duration: { value: number } }[],
): number => {
  return activities.reduce((total, activity) => {
    const energySpent =
      activity.energyLevel.value * (activity.duration.value / 60);
    return total + energySpent;
  }, 0);
};

// Test 1: Single activity energy calculation
{
  const activities = [
    Activity.create({
      name: new StringValueObject('Test Task'),
      duration: new IntegerValueObject(60), // 1 hour
      energyLevel: new IntegerValueObject(5),
    }),
  ];

  const energySpent = calculateEnergyConsumption(activities);
  assert.strictEqual(energySpent, 5, 'E5 × 1 hour = 5 energy');

  console.log('✓ Test 1: Single activity energy - PASSED');
}

// Test 2: Multiple activities energy sum
{
  const activities = [
    Activity.create({
      name: new StringValueObject('Task 1'),
      duration: new IntegerValueObject(60), // 1 hour
      energyLevel: new IntegerValueObject(5),
    }),
    Activity.create({
      name: new StringValueObject('Task 2'),
      duration: new IntegerValueObject(30), // 0.5 hours
      energyLevel: new IntegerValueObject(8),
    }),
    Activity.create({
      name: new StringValueObject('Task 3'),
      duration: new IntegerValueObject(120), // 2 hours
      energyLevel: new IntegerValueObject(3),
    }),
  ];

  const energySpent = calculateEnergyConsumption(activities);
  // E5 × 1 + E8 × 0.5 + E3 × 2 = 5 + 4 + 6 = 15
  assert.strictEqual(energySpent, 15, 'Total energy should be 15');

  console.log('✓ Test 2: Multiple activities energy sum - PASSED');
}

// Test 3: Fractional hours
{
  const activities = [
    Activity.create({
      name: new StringValueObject('Task'),
      duration: new IntegerValueObject(45), // 0.75 hours
      energyLevel: new IntegerValueObject(4),
    }),
  ];

  const energySpent = calculateEnergyConsumption(activities);
  assert.strictEqual(energySpent, 3, 'E4 × 0.75 = 3');

  console.log('✓ Test 3: Fractional hours - PASSED');
}

// Test 4: Low energy task
{
  const activities = [
    Activity.create({
      name: new StringValueObject('Easy Task'),
      duration: new IntegerValueObject(120), // 2 hours
      energyLevel: new IntegerValueObject(1),
    }),
  ];

  const energySpent = calculateEnergyConsumption(activities);
  assert.strictEqual(energySpent, 2, 'E1 × 2 hours = 2 energy');

  console.log('✓ Test 4: Low energy task - PASSED');
}

// Test 5: High energy task
{
  const activities = [
    Activity.create({
      name: new StringValueObject('Intense Task'),
      duration: new IntegerValueObject(90), // 1.5 hours
      energyLevel: new IntegerValueObject(10),
    }),
  ];

  const energySpent = calculateEnergyConsumption(activities);
  assert.strictEqual(energySpent, 15, 'E10 × 1.5 hours = 15 energy');

  console.log('✓ Test 5: High energy task - PASSED');
}

// Test 6: Energy balance calculations
{
  const activities = [
    Activity.create({
      name: new StringValueObject('Task 1'),
      duration: new IntegerValueObject(60),
      energyLevel: new IntegerValueObject(7),
    }),
    Activity.create({
      name: new StringValueObject('Task 2'),
      duration: new IntegerValueObject(45),
      energyLevel: new IntegerValueObject(5),
    }),
  ];

  const energySpent = calculateEnergyConsumption(activities);
  // E7 × 1 + E5 × 0.75 = 7 + 3.75 = 10.75
  assert.strictEqual(energySpent, 10.75);

  const availableEnergy = 100;
  const balance = availableEnergy - energySpent;

  assert.strictEqual(balance, 89.25, 'Should have 89.25 energy remaining');
  assert.ok(balance > 0, 'Should have positive balance');

  console.log('✓ Test 6: Energy balance (surplus) - PASSED');
}

// Test 7: Insufficient energy scenario
{
  const activities = [
    Activity.create({
      name: new StringValueObject('Task 1'),
      duration: new IntegerValueObject(120), // 2 hours
      energyLevel: new IntegerValueObject(10),
    }),
    Activity.create({
      name: new StringValueObject('Task 2'),
      duration: new IntegerValueObject(180), // 3 hours
      energyLevel: new IntegerValueObject(8),
    }),
  ];

  const energySpent = calculateEnergyConsumption(activities);
  // E10 × 2 + E8 × 3 = 20 + 24 = 44
  assert.strictEqual(energySpent, 44);

  const availableEnergy = 30;
  const balance = availableEnergy - energySpent;

  assert.strictEqual(balance, -14, 'Should be 14 energy short');
  assert.ok(balance < 0, 'Should have negative balance');

  console.log('✓ Test 7: Energy balance (deficit) - PASSED');
}

// Test 8: Zero energy activity (edge case)
{
  const activities = [
    Activity.create({
      name: new StringValueObject('No Energy Task'),
      duration: new IntegerValueObject(60),
      energyLevel: new IntegerValueObject(1),
    }),
  ];

  const energySpent = calculateEnergyConsumption(activities);
  assert.strictEqual(energySpent, 1, 'Minimum energy level should still consume');

  console.log('✓ Test 8: Minimum energy level - PASSED');
}

console.log('\n✅ All Energy Calculation Tests Passed!\n');

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { MarkdownActivityParser } from '../src/contexts/scheduler/infrastructure/parser/markdownActivityParser';
import { CreateActivitiesFromMarkdownService } from '../src/contexts/scheduler/application/activity/createActivitiesFromMarkdown.service';
import { CreateItinerary2 } from '../src/contexts/scheduler/domain/service/createItinerary2.service';

console.log('Running Integration Tests...\n');

const parser = new MarkdownActivityParser('test-integration.md');
const createActivitiesService = new CreateActivitiesFromMarkdownService();
const createItineraryService = new CreateItinerary2();

// Test 1: Full workflow - Parse → Activities → Itinerary
{
  const testFile = path.join(process.cwd(), 'test-integration.md');
  fs.writeFileSync(
    testFile,
    `# Daily Schedule

- [ ] Morning: Planning - 30 - D Review daily goals - E3 - P5 - R5
- [ ] Work: Deep Work Session - 120 - D Focus on main project - E9 - P10 - R15
- [ ] Break: Lunch - 60 - D Eat and relax - E2 - R0
`,
  );

  // Step 1: Parse
  const parseResult = parser.parse();
  assert.strictEqual(parseResult.success, true, 'Parse should succeed');

  if (parseResult.success) {
    assert.strictEqual(parseResult.activities.length, 3);

    // Step 2: Convert to Activities
    const activities = createActivitiesService.execute(parseResult.activities);
    assert.strictEqual(activities.length, 3);

    // Verify activity names
    assert.strictEqual(activities[0].name.value, 'Morning: Planning');
    assert.strictEqual(activities[1].name.value, 'Work: Deep Work Session');
    assert.strictEqual(activities[2].name.value, 'Break: Lunch');

    // Verify energy levels
    assert.strictEqual(activities[0].energyLevel.value, 3);
    assert.strictEqual(activities[1].energyLevel.value, 9);
    assert.strictEqual(activities[2].energyLevel.value, 2);

    // Step 3: Generate Itinerary
    const itinerary = createItineraryService.execute(activities, 8); // 8 AM start

    assert.strictEqual(itinerary.length, 3);

    // Verify first activity schedule
    assert.strictEqual(itinerary[0].activityName, '1) Morning: Planning');
    assert.strictEqual(itinerary[0].preparation.startTime, '08:00AM');
    assert.strictEqual(itinerary[0].rest.endTime, '08:40AM');

    // Verify second activity starts after first
    assert.strictEqual(itinerary[1].preparation.startTime, '08:40AM');

    // Step 4: Calculate total energy
    const totalEnergy = activities.reduce(
      (sum, act) => sum + act.energyLevel.value * (act.duration.value / 60),
      0,
    );
    // E3*0.5 + E9*2 + E2*1 = 1.5 + 18 + 2 = 21.5
    assert.strictEqual(totalEnergy, 21.5);

    console.log('✓ Test 1: Full workflow - PASSED');
  }

  fs.unlinkSync(testFile);
}

// Test 2: Real-world scenario - Full day schedule
{
  const testFile = path.join(process.cwd(), 'test-integration.md');
  fs.writeFileSync(
    testFile,
    `# Productive Day

- [ ] Morning: Email & Planning - 20 - E4 - P0 - R5
- [ ] Work: Code Review - 45 - D Review team PRs - E7 - P5 - R10
- [ ] Work: Feature Development - 90 - D Implement new feature - E9 - P10 - R15
- [ ] Meeting: Standup - 15 - E5 - P0 - R0
- [ ] Personal: Exercise - 45 - D Gym workout - E8 - P10 - R20
`,
  );

  const parseResult = parser.parse();
  assert.strictEqual(parseResult.success, true);

  if (parseResult.success) {
    const activities = createActivitiesService.execute(parseResult.activities);
    const itinerary = createItineraryService.execute(activities, 9); // 9 AM

    assert.strictEqual(itinerary.length, 5);

    // Verify activities are numbered correctly
    assert.strictEqual(itinerary[0].activityName, '1) Morning: Email & Planning');
    assert.strictEqual(itinerary[4].activityName, '5) Personal: Exercise');

    // Calculate total time needed
    let totalMinutes = 0;
    activities.forEach((act) => {
      totalMinutes +=
        act.duration.value + act.preparationTime.value + act.restTime.value;
    });
    // 20+0+5 + 45+5+10 + 90+10+15 + 15+0+0 + 45+10+20 = 25+60+115+15+75 = 290 minutes
    assert.strictEqual(totalMinutes, 290);

    // Verify last activity ends at correct time
    const lastActivity = itinerary[4];
    // Start: 9:00, End after 290 minutes = 13:50 (1:50 PM)
    assert.strictEqual(lastActivity.rest.endTime, '01:50PM');

    console.log('✓ Test 2: Real-world full day - PASSED');
  }

  fs.unlinkSync(testFile);
}

// Test 3: Error handling in workflow
{
  const testFile = path.join(process.cwd(), 'test-integration.md');
  fs.writeFileSync(
    testFile,
    `# Bad Schedule

- [ ] Valid: Task - 30 - E5
- [ ] Invalid: Missing Energy - 60
- [ ] Another: Valid Task - 45 - E7
`,
  );

  const parseResult = parser.parse();
  assert.strictEqual(
    parseResult.success,
    false,
    'Should fail with invalid line',
  );

  if (!parseResult.success) {
    assert.strictEqual(parseResult.errors.length, 1);
    assert.strictEqual(parseResult.errors[0].lineNumber, 4);
    console.log('✓ Test 3: Error handling in workflow - PASSED');
  }

  fs.unlinkSync(testFile);
}

// Test 4: Empty file
{
  const testFile = path.join(process.cwd(), 'test-integration.md');
  fs.writeFileSync(testFile, '# Empty Schedule\n\nNo activities today!\n');

  const parseResult = parser.parse();
  assert.strictEqual(parseResult.success, true, 'Should parse empty file');

  if (parseResult.success) {
    assert.strictEqual(parseResult.activities.length, 0);
    const activities = createActivitiesService.execute(parseResult.activities);
    assert.strictEqual(activities.length, 0);
    console.log('✓ Test 4: Empty file - PASSED');
  }

  fs.unlinkSync(testFile);
}

// Test 5: Mixed valid and invalid format lines
{
  const testFile = path.join(process.cwd(), 'test-integration.md');
  fs.writeFileSync(
    testFile,
    `# Schedule

Some random text here

- [ ] Work: Task 1 - 30 - E5

More text

- [x] Completed: Task - 45 - E7

- [ ] Work: Task 2 - 60 - E8 - P5 - R10
`,
  );

  const parseResult = parser.parse();
  assert.strictEqual(parseResult.success, true);

  if (parseResult.success) {
    // Should only parse unchecked checkboxes
    assert.strictEqual(parseResult.activities.length, 2);
    assert.strictEqual(parseResult.activities[0].title, 'Task 1');
    assert.strictEqual(parseResult.activities[1].title, 'Task 2');
    console.log('✓ Test 5: Mixed format lines - PASSED');
  }

  fs.unlinkSync(testFile);
}

console.log('\n✅ All Integration Tests Passed!\n');

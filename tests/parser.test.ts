import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { MarkdownActivityParser } from '../src/contexts/scheduler/infrastructure/parser/markdownActivityParser';

console.log('Running Parser Tests...\n');

// Test 1: Valid activities
{
  const testFile = path.join(process.cwd(), 'test-valid.md');
  fs.writeFileSync(
    testFile,
    `# Test
- [ ] Trabajo: Revisar código - 60 - D Revisar PRs - E7 - P5 - R10
- [ ] Estudio: TypeScript - 45 - E5
- [ ] Personal: Ejercicio - 30 - D Cardio - E8 - R15
`,
  );

  const parser = new MarkdownActivityParser('test-valid.md');
  const result = parser.parse();

  assert.strictEqual(result.success, true, 'Should parse successfully');
  if (result.success) {
    assert.strictEqual(result.activities.length, 3, 'Should have 3 activities');

    // First activity
    assert.strictEqual(result.activities[0].topic, 'Trabajo');
    assert.strictEqual(result.activities[0].title, 'Revisar código');
    assert.strictEqual(result.activities[0].durationMinutes, 60);
    assert.strictEqual(result.activities[0].description, 'Revisar PRs');
    assert.strictEqual(result.activities[0].energyLevel, 7);
    assert.strictEqual(result.activities[0].preparationTime, 5);
    assert.strictEqual(result.activities[0].restTime, 10);

    // Second activity (no optional fields except E)
    assert.strictEqual(result.activities[1].topic, 'Estudio');
    assert.strictEqual(result.activities[1].title, 'TypeScript');
    assert.strictEqual(result.activities[1].durationMinutes, 45);
    assert.strictEqual(result.activities[1].energyLevel, 5);
    assert.strictEqual(result.activities[1].description, undefined);
    assert.strictEqual(result.activities[1].preparationTime, undefined);
    assert.strictEqual(result.activities[1].restTime, undefined);

    // Third activity (no P)
    assert.strictEqual(result.activities[2].topic, 'Personal');
    assert.strictEqual(result.activities[2].restTime, 15);

    console.log('✓ Test 1: Valid activities - PASSED');
  }

  fs.unlinkSync(testFile);
}

// Test 2: Missing energy level (should fail)
{
  const testFile = path.join(process.cwd(), 'test-no-energy.md');
  fs.writeFileSync(
    testFile,
    `- [ ] Trabajo: Task - 60 - D Description
`,
  );

  const parser = new MarkdownActivityParser('test-no-energy.md');
  const result = parser.parse();

  assert.strictEqual(result.success, false, 'Should fail without energy level');
  if (!result.success) {
    assert.strictEqual(result.errors.length, 1);
    assert.strictEqual(result.errors[0].lineNumber, 1);
    assert.ok(result.errors[0].message.includes('Energy level'), 'Error should mention energy level');
    console.log('✓ Test 2: Missing energy level - PASSED');
  }

  fs.unlinkSync(testFile);
}

// Test 3: Invalid duration (negative)
{
  const testFile = path.join(process.cwd(), 'test-invalid-duration.md');
  fs.writeFileSync(
    testFile,
    `- [ ] Trabajo: Task - -10 - E5
`,
  );

  const parser = new MarkdownActivityParser('test-invalid-duration.md');
  const result = parser.parse();

  assert.strictEqual(result.success, false, 'Should fail with invalid duration');
  if (!result.success) {
    assert.ok(result.errors[0].message.includes('duration'), 'Error should mention duration');
    console.log('✓ Test 3: Invalid duration - PASSED');
  }

  fs.unlinkSync(testFile);
}

// Test 4: Invalid energy level (out of range)
{
  const testFile = path.join(process.cwd(), 'test-invalid-energy.md');
  fs.writeFileSync(
    testFile,
    `- [ ] Trabajo: Task - 60 - E15
`,
  );

  const parser = new MarkdownActivityParser('test-invalid-energy.md');
  const result = parser.parse();

  assert.strictEqual(result.success, false, 'Should fail with energy > 10');
  if (!result.success) {
    assert.ok(
      result.errors[0].message.includes('energy level'),
      'Error should mention energy level',
    );
    console.log('✓ Test 4: Invalid energy level - PASSED');
  }

  fs.unlinkSync(testFile);
}

// Test 5: Missing topic separator (:)
{
  const testFile = path.join(process.cwd(), 'test-no-separator.md');
  fs.writeFileSync(
    testFile,
    `- [ ] Trabajo Task - 60 - E5
`,
  );

  const parser = new MarkdownActivityParser('test-no-separator.md');
  const result = parser.parse();

  assert.strictEqual(result.success, false, 'Should fail without topic separator');
  if (!result.success) {
    assert.ok(result.errors[0].message.includes(':'), 'Error should mention missing separator');
    console.log('✓ Test 5: Missing topic separator - PASSED');
  }

  fs.unlinkSync(testFile);
}

// Test 6: Empty lines and comments should be ignored
{
  const testFile = path.join(process.cwd(), 'test-ignore-lines.md');
  fs.writeFileSync(
    testFile,
    `# My Activities

Some text here

- [ ] Trabajo: Task 1 - 30 - E5

Another comment

- [ ] Personal: Task 2 - 45 - E7
`,
  );

  const parser = new MarkdownActivityParser('test-ignore-lines.md');
  const result = parser.parse();

  assert.strictEqual(result.success, true, 'Should parse successfully');
  if (result.success) {
    assert.strictEqual(result.activities.length, 2, 'Should only parse checkbox lines');
    console.log('✓ Test 6: Ignore non-checkbox lines - PASSED');
  }

  fs.unlinkSync(testFile);
}

// Test 7: Multiple errors in different lines
{
  const testFile = path.join(process.cwd(), 'test-multiple-errors.md');
  fs.writeFileSync(
    testFile,
    `- [ ] Trabajo: Valid Task - 30 - E5
- [ ] Invalid - 60
- [ ] Another: Bad - abc - E5
`,
  );

  const parser = new MarkdownActivityParser('test-multiple-errors.md');
  const result = parser.parse();

  assert.strictEqual(result.success, false, 'Should fail with multiple errors');
  if (!result.success) {
    assert.strictEqual(result.errors.length, 2, 'Should have 2 errors');
    assert.strictEqual(result.errors[0].lineNumber, 2);
    assert.strictEqual(result.errors[1].lineNumber, 3);
    console.log('✓ Test 7: Multiple errors - PASSED');
  }

  fs.unlinkSync(testFile);
}

// Test 8: Zero preparation and rest time (valid edge case)
{
  const testFile = path.join(process.cwd(), 'test-zero-times.md');
  fs.writeFileSync(
    testFile,
    `- [ ] Trabajo: Task - 60 - E5 - P0 - R0
`,
  );

  const parser = new MarkdownActivityParser('test-zero-times.md');
  const result = parser.parse();

  assert.strictEqual(result.success, true, 'Should accept zero times');
  if (result.success) {
    assert.strictEqual(result.activities[0].preparationTime, 0);
    assert.strictEqual(result.activities[0].restTime, 0);
    console.log('✓ Test 8: Zero preparation/rest time - PASSED');
  }

  fs.unlinkSync(testFile);
}

console.log('\n✅ All Parser Tests Passed!\n');

import { execSync } from 'child_process';

console.log('═══════════════════════════════════════════');
console.log('   Running All Test Suites');
console.log('═══════════════════════════════════════════\n');

const tests = [
  { name: 'Parser Tests', file: 'tests/parser.test.ts' },
  { name: 'Itinerary Tests', file: 'tests/itinerary.test.ts' },
  { name: 'Energy Tests', file: 'tests/energy.test.ts' },
  { name: 'Integration Tests', file: 'tests/integration.test.ts' },
  { name: 'Blocked Times Tests', file: 'tests/blockedTimes.test.ts' },
];

let passed = 0;
let failed = 0;

tests.forEach((test) => {
  try {
    console.log(`\n📋 ${test.name}\n${'─'.repeat(50)}`);
    execSync(`npx ts-node ${test.file}`, { stdio: 'inherit' });
    passed++;
  } catch (error) {
    console.error(`\n❌ ${test.name} FAILED\n`);
    failed++;
  }
});

console.log('\n═══════════════════════════════════════════');
console.log('   Test Summary');
console.log('═══════════════════════════════════════════');
console.log(`✅ Passed: ${passed}/${tests.length}`);
console.log(`❌ Failed: ${failed}/${tests.length}`);
console.log('═══════════════════════════════════════════\n');

if (failed > 0) {
  process.exit(1);
}

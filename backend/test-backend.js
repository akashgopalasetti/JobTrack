import Application, { STATUS_ENUM } from './models/Application.js';
import mongoose from 'mongoose';

console.log('🧪 Starting JobTrack Backend Unit Verification...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// 1. Verify STATUS_ENUM
assert(
  STATUS_ENUM.includes('Applied') &&
  STATUS_ENUM.includes('Interview') &&
  STATUS_ENUM.includes('Assessment') &&
  STATUS_ENUM.includes('Offer') &&
  STATUS_ENUM.includes('Rejected') &&
  STATUS_ENUM.includes('Saved'),
  'STATUS_ENUM contains all required 6 job statuses'
);

// 2. Validate Application model required fields
const emptyDoc = new Application({});
const validationErr = emptyDoc.validateSync();
assert(
  validationErr && validationErr.errors['companyName'],
  'Application model enforces required companyName'
);
assert(
  validationErr && validationErr.errors['jobTitle'],
  'Application model enforces required jobTitle'
);

// 3. Validate Invalid Status
const invalidStatusDoc = new Application({
  companyName: 'Acme Corp',
  jobTitle: 'Developer',
  status: 'InReview' // invalid enum
});
const statusErr = invalidStatusDoc.validateSync();
assert(
  statusErr && statusErr.errors['status'],
  'Application model rejects invalid status value'
);

// 4. Validate Valid URL and Email
const validDoc = new Application({
  companyName: 'Acme Corp',
  jobTitle: 'Developer',
  status: 'Interview',
  appliedEmail: 'jobs@acme.com',
  jobPostingUrl: 'https://acme.com/jobs/1',
  resumeLink: 'https://drive.google.com/resume.pdf'
});
const validErr = validDoc.validateSync();
assert(!validErr, 'Application model accepts valid data with URLs and Email');

// 4b. Validate default appliedDate
const defaultDateDoc = new Application({
  companyName: 'Default Date Inc',
  jobTitle: 'Engineer'
});
assert(
  defaultDateDoc.appliedDate instanceof Date && !isNaN(defaultDateDoc.appliedDate.getTime()),
  'Application model defaults appliedDate to current timestamp'
);

// 5. Validate Malformed URL
const badUrlDoc = new Application({
  companyName: 'Acme Corp',
  jobTitle: 'Developer',
  jobPostingUrl: 'not-a-valid-url'
});
const badUrlErr = badUrlDoc.validateSync();
assert(
  badUrlErr && badUrlErr.errors['jobPostingUrl'],
  'Application model catches malformed jobPostingUrl'
);

// 6. Validate Malformed Email
const badEmailDoc = new Application({
  companyName: 'Acme Corp',
  jobTitle: 'Developer',
  appliedEmail: 'notanemail'
});
const badEmailErr = badEmailDoc.validateSync();
assert(
  badEmailErr && badEmailErr.errors['appliedEmail'],
  'Application model catches malformed appliedEmail'
);

// 7. Test ObjectId validation logic
assert(
  mongoose.Types.ObjectId.isValid('671629fae158d928bc345678') === true,
  'Valid 24-char ObjectId is identified correctly'
);
assert(
  mongoose.Types.ObjectId.isValid('12345') === false,
  'Invalid short ID is rejected correctly'
);
assert(
  mongoose.Types.ObjectId.isValid('invalid-mongodb-id-string') === false,
  'Non-hex string ID is rejected correctly'
);

console.log(`\n🎉 Verification Finished: ${passedTests}/${totalTests} tests passed.\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}

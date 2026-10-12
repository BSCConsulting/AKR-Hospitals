// Run: npm run check  (Node 23.6+ strips types natively)
import assert from 'node:assert/strict';
import { campPhase, formatCampDate } from '../src/lib/dates.ts';
import { generateOpdReference, isValidIndianMobile, normalizeMobile } from '../src/lib/validation.ts';

const start = '2026-10-11T10:00:00+05:30';
const end = '2026-10-11T14:00:00+05:30';
const at = (iso: string) => Date.parse(iso);

assert.equal(campPhase(at('2026-10-10T23:00:00+05:30'), start, end), 'upcoming');
assert.equal(campPhase(at(start), start, end), 'live');
assert.equal(campPhase(at('2026-10-11T13:59:00+05:30'), start, end), 'live');
assert.equal(campPhase(at(end), start, end), 'ended');
assert.equal(campPhase(at('2026-10-12T09:00:00+05:30'), start, end), 'ended');
assert.equal(campPhase(at('2030-01-01T00:00:00+05:30'), start), 'live', 'no end date never expires');
assert.equal(campPhase(at('2026-01-01T00:00:00+05:30')), 'live', 'no dates = always on');
// 1 AM IST on Oct 11 is still Oct 10 in UTC — must format as the IST date.
assert.equal(formatCampDate('2026-10-11T01:00:00+05:30'), 'Sunday, 11 Oct 2026');

// Reference must satisfy the DB CHECK (^AKR-[A-Z0-9]{6}$) and avoid look-alike characters.
const refs = Array.from({ length: 2000 }, generateOpdReference);
for (const r of refs) assert.match(r, /^AKR-[2-9A-HJKMNP-Z]{6}$/);
assert.ok(new Set(refs).size > 1990, 'references should almost never collide');

// Same rule as the DB CHECK on appointment_requests.mobile.
assert.equal(isValidIndianMobile('98490 57185'), true);
assert.equal(normalizeMobile('+91 98490 57185'), '9849057185', 'pasted +91 prefix is dropped');
assert.equal(normalizeMobile('098490 57185'), '9849057185', 'trunk 0 is dropped');
assert.equal(normalizeMobile('9198490571'), '9198490571', 'a real 10-digit number starting 91 is kept');
assert.equal(isValidIndianMobile('5849057185'), false, 'must start 6–9');
assert.equal(normalizeMobile('98-49-0571-85xx'), '9849057185');

console.log('self-checks passed');

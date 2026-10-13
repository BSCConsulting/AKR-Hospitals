// Run: npm run check  (Node 23.6+ strips types natively)
import assert from 'node:assert/strict';
import { campPhase, formatCampDate, formatSession, nextSessions, sessionHours, toLocalDateString } from '../src/lib/dates.ts';
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

// OPD schedule: dates offered must match the weekly session; today only while a slot is still ahead.
const cardio = { days: [2], start: '16:00', end: '18:00' };
const daily = { days: [0, 1, 2, 3, 4, 5, 6], start: '11:00', end: '13:00' };
const days = (s: typeof cardio, now: Date, n = 2) => nextSessions(s, now, n).map((d) => toLocalDateString(d));
const tue = (h: number, m = 0) => new Date(2026, 9, 13, h, m); // Tuesday 13 Oct 2026, local time
assert.deepEqual(sessionHours(cardio), ['16:00', '17:00'], 'end hour is exclusive');
assert.deepEqual(days(cardio, tue(16, 30)), ['2026-10-13', '2026-10-20'], 'the 5 PM slot is still bookable');
assert.deepEqual(days(cardio, tue(17, 0)), ['2026-10-20', '2026-10-27'], 'last slot started: skip to next Tuesday');
assert.deepEqual(days(daily, tue(13, 0)), ['2026-10-14', '2026-10-15'], 'after the daily OPD, start tomorrow');
assert.deepEqual(days({ days: [0], start: '10:00', end: '14:00' }, new Date(2026, 9, 11, 9)), ['2026-10-11', '2026-10-18']);
assert.equal(formatSession(cardio), 'Tuesdays · 4 PM – 6 PM');
assert.equal(formatSession(daily), 'Daily · 11 AM – 1 PM');
assert.equal(formatSession({ days: [0, 1, 2, 3, 4, 5, 6], start: '00:00', end: '24:00' }), '24/7');

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

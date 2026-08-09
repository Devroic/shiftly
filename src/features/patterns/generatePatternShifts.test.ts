import { generatePatternShifts } from './generatePatternShifts';

describe('generatePatternShifts', () => {
  it('cycles through the sequence by day offset from startDate', () => {
    const result = generatePatternShifts(
      ['day', 'night', 'off', 'off'],
      new Date(2026, 0, 1),
      new Date(2026, 0, 8),
    );

    expect(result.map((r) => r.type)).toEqual([
      'day',
      'night',
      'off',
      'off',
      'day',
      'night',
      'off',
      'off',
    ]);
    expect(result[0].date).toBe('2026-01-01');
    expect(result.at(-1)?.date).toBe('2026-01-08');
  });

  it('returns a single entry for a single-day range', () => {
    const result = generatePatternShifts(['night'], new Date(2026, 5, 15), new Date(2026, 5, 15));
    expect(result).toEqual([{ date: '2026-06-15', type: 'night' }]);
  });

  it('produces one entry per calendar day across a multi-year range', () => {
    const start = new Date(2026, 0, 1);
    const end = new Date(2027, 0, 1);
    const result = generatePatternShifts(['day', 'off'], start, end);

    expect(result).toHaveLength(366);
    expect(result[0].date).toBe('2026-01-01');
    expect(result.at(-1)?.date).toBe('2027-01-01');
  });

  it('does not fully cycle when the sequence is longer than the range', () => {
    const result = generatePatternShifts(
      ['day', 'night', 'off', 'leave', 'day'],
      new Date(2026, 0, 1),
      new Date(2026, 0, 2),
    );
    expect(result.map((r) => r.type)).toEqual(['day', 'night']);
  });

  it('throws for an empty sequence', () => {
    expect(() => generatePatternShifts([], new Date(2026, 0, 1), new Date(2026, 0, 2))).toThrow();
  });

  it('throws when endDate is before startDate', () => {
    expect(() =>
      generatePatternShifts(['day'], new Date(2026, 0, 5), new Date(2026, 0, 1)),
    ).toThrow();
  });
});

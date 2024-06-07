import { DateTimePipe } from './date.pipe';

describe('DateTimePipe', () => {
  let pipe: DateTimePipe;

  beforeEach(() => {
    pipe = new DateTimePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms a Date object to relative time string for less than a minute', () => {
    const currentDate = new Date();
    const oneSecondAgo = new Date(currentDate.getTime() - 1000);
    expect(pipe.transform(oneSecondAgo, 'relative')).toBe('Just now');
  });

  it('transforms a Date object to relative time string for 1 minute ago', () => {
    const currentDate = new Date();
    const oneMinuteAgo = new Date(currentDate.getTime() - 60000);
    expect(pipe.transform(oneMinuteAgo, 'relative')).toBe('1 minute ago');
  });

  it('transforms a Date object to relative time string for multiple minutes ago', () => {
    const currentDate = new Date();
    const fiveMinutesAgo = new Date(currentDate.getTime() - 5 * 60000);
    expect(pipe.transform(fiveMinutesAgo, 'relative')).toBe('5 minutes ago');
  });

  it('transforms a Date object to relative time string for 1 hour ago', () => {
    const currentDate = new Date();
    const oneHourAgo = new Date(currentDate.getTime() - 60 * 60000);
    expect(pipe.transform(oneHourAgo, 'relative')).toBe('1 hour ago');
  });

  it('transforms a Date object to relative time string for multiple hours ago', () => {
    const currentDate = new Date();
    const threeHoursAgo = new Date(currentDate.getTime() - 3 * 60 * 60000);
    expect(pipe.transform(threeHoursAgo, 'relative')).toBe('3 hours ago');
  });

  it('transforms a Date object to relative time string for yesterday', () => {
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    expect(pipe.transform(yesterday, 'relative')).toBe('Yesterday');
  });

  it('transforms a Date object to relative time string for multiple days ago', () => {
    const fiveDaysAgo = new Date(
      new Date().getTime() - 5 * 24 * 60 * 60 * 1000,
    );
    expect(pipe.transform(fiveDaysAgo, 'relative')).toBe('5 days ago');
  });

  it('transforms a Date object to normal date string', () => {
    const currentDate = new Date();
    expect(pipe.transform(currentDate, 'normal')).toBe(
      currentDate.toLocaleDateString(),
    );
  });

  it('transforms a Date object to time string', () => {
    const currentDate = new Date();
    expect(pipe.transform(currentDate, 'time')).toBe(
      currentDate.toLocaleTimeString(),
    );
  });

  it('returns an empty string for invalid input', () => {
    expect(pipe.transform(null, 'relative')).toBe('');
  });

  it('calculates duration between two dates', () => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 3600000);
    expect(pipe.transform({ start: startTime, end: endTime }, 'huntTime')).toBe(
      '01:00:00',
    );
  });
});

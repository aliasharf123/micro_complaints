export function calculateReadableDifference(date1: Date): string {
  const date2: Date = new Date(); // Current date and time

  // Get the time values of both dates in milliseconds
  const time1: number = date1.getTime();
  const time2: number = date2.getTime();

  // Calculate the difference in time in milliseconds
  const differenceInMilliseconds: number = Math.abs(time2 - time1);

  // Constants for time calculations
  const millisecondsPerHour: number = 1000 * 60 * 60;
  const millisecondsPerDay: number = millisecondsPerHour * 24;
  const millisecondsPerWeek: number = millisecondsPerDay * 7;

  // Determine the difference in hours, days, or more than a week
  if (differenceInMilliseconds < millisecondsPerDay) {
    const differenceInHours: number =
      differenceInMilliseconds / millisecondsPerHour;
    return `${differenceInHours.toFixed(1)} hours`;
  } else if (differenceInMilliseconds < millisecondsPerWeek) {
    const differenceInDays: number =
      differenceInMilliseconds / millisecondsPerDay;
    return `${Math.floor(differenceInDays)} days`;
  } else {
    return date1.toDateString();
  }
}

export function convertHexToDate(hex: string): Date {
  const timestampInSeconds = parseInt(hex, 16);
  const timestampInMilliseconds = timestampInSeconds * 1000;
  const date = new Date(timestampInMilliseconds);

  return date;
}

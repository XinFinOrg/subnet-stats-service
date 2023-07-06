export function getUnixTime() {
  // unix time in second
  return Math.floor(Date.now() / 1000);
}

export const pollingPeriod = 5 * 1000;

const numberToPaddedString = (total: number): string =>
  total.toString(10).padStart(2, "0");

export function getFormattedTime(totalMilliseconds: number): string {
  const totalSeconds = totalMilliseconds / 1000;

  const [minutes, seconds, centis] = [
    Math.floor(totalSeconds / 60),
    Math.floor(totalSeconds % 60),
    Math.round((totalMilliseconds % 1000) / 10),
  ].map(numberToPaddedString);

  return `${minutes}:${seconds}.${centis}`;
}

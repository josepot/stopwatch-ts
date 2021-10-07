export enum LapsEvent {
  CreateLap,
  ResetLap,
}

export interface CreateLapEvent {
  type: LapsEvent.CreateLap;
  elapsedTime: number;
}

export interface ResetLap {
  type: LapsEvent.ResetLap;
}

export type LapEvent = CreateLapEvent | ResetLap;

export interface Laps {
  laps: Array<{ elapsedTime: number; diff: number }>;
  minIdx: number;
  maxIdx: number;
}

const MinOrMax = {
  MIN: "minIdx" as const,
  MAX: "maxIdx" as const,
};

function createLap(prevLaps: Laps, elapsedTime: number): Laps {
  const nextLaps = { ...prevLaps };
  const prevElapsedTime = prevLaps.laps.slice(-1)[0]?.elapsedTime ?? 0;
  const diff = elapsedTime - prevElapsedTime;

  nextLaps.laps = [...prevLaps.laps, { elapsedTime, diff }];

  if (nextLaps.laps.length === 1) {
    nextLaps.minIdx = 0;
    nextLaps.maxIdx = 0;
    return nextLaps;
  }

  const min = prevLaps.laps[prevLaps.minIdx]?.diff ?? Infinity;
  const max = prevLaps.laps[prevLaps.maxIdx]?.diff ?? -Infinity;

  // prettier-ignore
  const minMax =
    diff < min ? MinOrMax.MIN :
    diff > max ? MinOrMax.MAX : null

  if (minMax) {
    nextLaps[minMax] = nextLaps.laps.length - 1;
  }

  return nextLaps;
}

const initLaps: Laps = {
  laps: [],
  minIdx: -1,
  maxIdx: -1,
};

export function getLapsManager(): [() => Laps, (event: LapEvent) => void] {
  let laps: Laps = initLaps;

  const getState = () => laps;
  const dispatch = (event: LapEvent): void => {
    laps =
      event.type === LapsEvent.ResetLap
        ? initLaps
        : createLap(laps, event.elapsedTime);
  };

  return [getState, dispatch];
}

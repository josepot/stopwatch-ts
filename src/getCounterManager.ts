export enum CounterEvents {
  Start,
  Stop,
  Reset,
}

type CounterCallback = (elapsedTime: number) => void;

interface CounterState {
  isRunning: boolean;
  elapsedTime: number;
}

export function getCounterManager(
  cb: CounterCallback
): [() => CounterState, (event: CounterEvents) => void] {
  let token: number | undefined = undefined;
  let startTime = 0;

  const isRunning = () => token !== undefined;

  const getState = (): CounterState => ({
    isRunning: isRunning(),
    elapsedTime: (isRunning() ? Date.now() : 0) - startTime,
  });

  const refresh = () => {
    cb(Date.now() - startTime);
    token = requestAnimationFrame(refresh);
  };

  const events: Record<CounterEvents, () => void> = {
    [CounterEvents.Start]: () => {
      if (isRunning()) return;

      startTime += Date.now();
      refresh();
    },
    [CounterEvents.Stop]: () => {
      if (!isRunning()) return;

      startTime -= Date.now();
      cancelAnimationFrame(token!);
      token = undefined;
    },
    [CounterEvents.Reset]: () => {
      if (isRunning() || startTime === 0) return;

      startTime = 0;
      cb(0);
    },
  };

  function dispatch(event: CounterEvents) {
    events[event]();
  }

  return [getState, dispatch];
}

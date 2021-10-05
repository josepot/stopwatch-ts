import "./styles.css";

import { getFormattedTime } from "./getFormattedTime";
import { CounterEvents, getCounterManager } from "./getCounterManager";

const counterEl = document.getElementById("timer")!;
const mainButton = document.getElementById("mainButton")!;
const secondaryButton = document.getElementById("secondaryButton")!;
const lapTable = document.getElementById("lapTable")!;

function onTimeChange(elapsedTime: number) {
  const formattedTime = getFormattedTime(elapsedTime);
  counterEl.childNodes[0].replaceWith(formattedTime);
}
const [getCounterState, counterDipatch] = getCounterManager(onTimeChange);

mainButton.onclick = () => {
  if (getCounterState().isRunning) {
    counterDipatch(CounterEvents.Stop);
    mainButton.childNodes[0].replaceWith("Start");
    mainButton.className = "stopped";
    secondaryButton.className = "";
    secondaryButton.childNodes[0].replaceWith("Reset");
  } else {
    counterDipatch(CounterEvents.Start);
    mainButton.childNodes[0].replaceWith("Stop");
    mainButton.className = "started";
    secondaryButton.childNodes[0].replaceWith("Lap");
  }
};

secondaryButton.onclick = () => {
  if (!getCounterState().isRunning) {
    counterDipatch(CounterEvents.Reset);
    secondaryButton.className = "hidden";
  }
};

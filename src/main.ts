import "./styles.css";

import { getFormattedTime } from "./getFormattedTime";
import { CounterEvents, getCounterManager } from "./getCounterManager";
import { getLapsManager, LapsEvent } from "./getLapManager";

const counterEl = document.getElementById("timer")!;
const mainButton = document.getElementById("mainButton")!;
const secondaryButton = document.getElementById("secondaryButton")!;
const lapTable = document.getElementById("lapTable")!;

function onTimeChange(elapsedTime: number) {
  const formattedTime = getFormattedTime(elapsedTime);
  counterEl.childNodes[0].replaceWith(formattedTime);
}
const [getCounterState, counterDipatch] = getCounterManager(onTimeChange);
const [getLapsState, lapsDipatch] = getLapsManager();

const createRow = (diffTime: number) => {
  const nRows = lapTable.children.length;

  const indexCol = document.createElement("td");
  indexCol.appendChild(document.createTextNode(`Lap ${nRows + 1}`));

  const timeCol = document.createElement("td");
  timeCol.appendChild(document.createTextNode(getFormattedTime(diffTime)));

  const row = document.createElement("tr");
  row.appendChild(indexCol);
  row.appendChild(timeCol);
  lapTable.prepend(row);

  return row;
};

const getRowByLapIdx = (lapIdx: number) => {
  const nRows = lapTable.children.length;
  return lapTable.children[nRows - lapIdx - 1];
};

function createLap(elapsedTime: number) {
  const prevLaps = getLapsState();
  lapsDipatch({ type: LapsEvent.CreateLap, elapsedTime });
  const currentLaps = getLapsState();

  createRow(currentLaps.laps.slice(-1)[0].diff);

  const nLaps = currentLaps.laps.length;

  if (nLaps === 1) return;

  if (nLaps === 2) {
    getRowByLapIdx(currentLaps.minIdx).className = "min";
    getRowByLapIdx(currentLaps.maxIdx).className = "max";
    return;
  }

  if (prevLaps.maxIdx !== currentLaps.maxIdx) {
    getRowByLapIdx(prevLaps.maxIdx).className = "";
    getRowByLapIdx(currentLaps.maxIdx).className = "max";
    return;
  }

  if (prevLaps.minIdx !== currentLaps.minIdx) {
    getRowByLapIdx(prevLaps.minIdx).className = "";
    getRowByLapIdx(currentLaps.minIdx).className = "min";
  }
}

function reset() {
  counterDipatch(CounterEvents.Reset);
  lapsDipatch({ type: LapsEvent.ResetLap });
  secondaryButton.className = "hidden";
  lapTable.innerHTML = "";
}

mainButton.onclick = () => {
  if (getCounterState().isRunning) {
    counterDipatch(CounterEvents.Stop);
    mainButton.childNodes[0].replaceWith("Start");
    mainButton.className = "stopped";
    secondaryButton.childNodes[0].replaceWith("Reset");
  } else {
    secondaryButton.className = "";
    counterDipatch(CounterEvents.Start);
    mainButton.childNodes[0].replaceWith("Stop");
    mainButton.className = "started";
    secondaryButton.childNodes[0].replaceWith("Lap");
  }
};

secondaryButton.onclick = () => {
  if (!getCounterState().isRunning) {
    reset();
  } else {
    createLap(getCounterState().elapsedTime);
  }
};

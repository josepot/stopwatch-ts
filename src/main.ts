import "./styles.css";

const counterEl = document.getElementById("timer")!;
const mainButton = document.getElementById("mainButton")!;
const secondaryButton = document.getElementById("secondaryButton")!;
const lapTable = document.getElementById("lapTable")!;

mainButton.onclick = () => {
  // TODO: it work :-)
  mainButton.childNodes[0].replaceWith("Stop");
  mainButton.className = "started";
  secondaryButton.className = "";
  secondaryButton.childNodes[0].replaceWith("Lap");
};

secondaryButton.onclick = () => {
  // TODO: it work :-)
};

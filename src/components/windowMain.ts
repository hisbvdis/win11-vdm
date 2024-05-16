import { BrowserWindow } from "electron";
import path from "path";

export let windowMain:BrowserWindow;

export const createWindowMain = async () => {
  windowMain = new BrowserWindow({
    title: "Win11 Virtual Desktop Manager (VDM)",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  // windowMain.webContents.openDevTools();
  windowMain.on("minimize", () => windowMain.hide());
  windowMain.on("close", (e) => {e.preventDefault(); windowMain.hide()});

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    windowMain.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    windowMain.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
}
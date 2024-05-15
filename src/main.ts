import { app } from "electron";
import { createTray } from "./components/tray";
import { createWindowMain } from "./components/windowMain";

app.whenReady().then(async () => {
  await createWindowMain();
  createTray();
})
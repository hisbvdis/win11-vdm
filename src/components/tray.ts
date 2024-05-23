import { Menu, Tray, app, nativeImage } from "electron";
import path from "path";
import { imagesPath } from "../config/constants";
import { GetCurrentDesktopNumber } from "../services/virtualDesktopAccessor";
import { windowMain } from "./windowMain";

export let tray:Tray;

export const createTray = ():void => {
  tray = new Tray(nativeImage.createFromPath(path.join(imagesPath, `${GetCurrentDesktopNumber() + 1}.png`)));
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "Show", click: () => windowMain.show() },
    { label: "Exit", click: () => app.exit() },
  ]));
  tray.on("double-click", () => windowMain.show())
}
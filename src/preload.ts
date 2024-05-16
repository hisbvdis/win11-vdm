import { contextBridge, ipcRenderer } from "electron";
import { IShortcutObject } from "./config/types";

contextBridge.exposeInMainWorld("api", {
  addShortcut: (shortcutObject:IShortcutObject) => ipcRenderer.invoke("addShortcut", shortcutObject),
  cleanShortcut: (shortcutObject:IShortcutObject) => ipcRenderer.invoke("cleanShortcut", shortcutObject),
  readFromStore: () => ipcRenderer.invoke("readFromStore"),
})
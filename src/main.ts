import { app, globalShortcut, ipcMain } from "electron";
import { create } from "mutative";
import { createTray } from "./components/tray";
import { createWindowMain } from "./components/windowMain";
import { readFromStore, writeToStore } from "./config/store";
import { IShortcutObject } from "./config/types";
import { copyWindowToDesktop, goToDesktop, moveWindowToDesktop } from "./services/myMethods";

app.whenReady().then(async () => {
  await createWindowMain();
  createTray();

  const functions = {goToDesktop, moveWindowToDesktop, copyWindowToDesktop}

  ipcMain.handle("addShortcut", async (_, {actionType, index, shortcut}:IShortcutObject) => {
    if (shortcut.endsWith("+")) return;
    const currentStore = await readFromStore();
    if (shortcut && globalShortcut.isRegistered(shortcut)) {
      globalShortcut.unregister(shortcut);
    }
    writeToStore(create(currentStore, (draft) => {draft.shortcuts[actionType][index] = shortcut}));
    globalShortcut.register(shortcut, () => functions[actionType](Number(index)));
  })

  ipcMain.handle("cleanShortcut", async (_, {actionType, index, shortcut}:IShortcutObject) => {
    const currentStore = await readFromStore();
    writeToStore(create(currentStore, (draft) => {delete draft.shortcuts[actionType][index]}))
    if (shortcut && globalShortcut.isRegistered(shortcut)) {
      globalShortcut.unregister(shortcut);
    }
  });

  ipcMain.handle("readFromStore", async () => await readFromStore())
})
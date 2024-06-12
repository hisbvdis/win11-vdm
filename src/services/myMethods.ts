import { nativeImage } from "electron";
import path from "path";
import { tray } from "../components/tray";
import { desktopHWND, imagesPath } from "../config/constants";
import { EnumWindows, GetForegroundWindow, SetForegroundWindow, getOwnerWindow } from "./user32";
import { GetCurrentDesktopNumber, GetWindowDesktopNumber, GoToDesktopNumber, MoveWindowToDesktopNumber } from "./virtualDesktopAccessor";

const getAllWindowsFromDesktopNumber = (desktopNumber:number=GetCurrentDesktopNumber()) => {
  const hwndArray:number[] = [];
  const activeWinHNDW = GetForegroundWindow();
  EnumWindows((hwnd:number) => {
    if (GetWindowDesktopNumber(hwnd) !== desktopNumber) return true;
    if (hwnd === activeWinHNDW) {
      hwndArray.push(hwnd);
    } else {
      hwndArray.unshift(hwnd);
    }
    return true;
  }, 0)
  return hwndArray;
}

let desktopWindows:number[][] = [];

export const goToDesktop = (targetDesktopNumber:number) => {
  const currentDesktopNumber = GetCurrentDesktopNumber();
  desktopWindows[currentDesktopNumber] = getAllWindowsFromDesktopNumber(currentDesktopNumber);
  // desktopWindows[targetDesktopNumber] = getAllWindowsFromDesktopNumber(targetDesktopNumber);
  GoToDesktopNumber(targetDesktopNumber);
  // Move related windows to target desktop
  if (desktopWindows[targetDesktopNumber]?.length) {
    desktopWindows[targetDesktopNumber].forEach((hwnd) => MoveWindowToDesktopNumber(hwnd, targetDesktopNumber));
  }
  // Set focus on last window
  SetForegroundWindow(desktopWindows[targetDesktopNumber]?.at(-1) ?? desktopHWND);
  tray.setImage(nativeImage.createFromPath(path.join(imagesPath, `${targetDesktopNumber + 1}.png`)));
  console.log( "goto:", desktopWindows )
}

export const moveWindowToDesktop = (targetDesktopNumber:number, hwnd:number=GetForegroundWindow()) => {
  const movableWindowHWND = getOwnerWindow(hwnd) || hwnd;
  MoveWindowToDesktopNumber(movableWindowHWND, targetDesktopNumber);
  // Delete "windows HWND" from all desktops
  desktopWindows = desktopWindows.map((desktop) => desktop.filter((windowHWND) => windowHWND !== movableWindowHWND));
  // desktopWindows[targetDesktopNumber] = getAllWindowsFromDesktopNumber(targetDesktopNumber);
  desktopWindows[targetDesktopNumber] = (desktopWindows?.[targetDesktopNumber] ?? []).concat(hwnd);
  // Set focus on last window
  SetForegroundWindow(desktopWindows[GetCurrentDesktopNumber()]?.at(-1) ?? desktopHWND);
  console.log( "move:", desktopWindows )
}

export const copyWindowToDesktop = (targetDesktopNumber:number, hwnd:number=GetForegroundWindow()) => {
  const currentDesktopNumber = GetCurrentDesktopNumber();
  // Add "window HWND" to the end of the current and target desktop
  desktopWindows[currentDesktopNumber] = getAllWindowsFromDesktopNumber(currentDesktopNumber);
  console.log( desktopWindows )
  // desktopWindows[targetDesktopNumber] = getAllWindowsFromDesktopNumber(targetDesktopNumber);
  desktopWindows[targetDesktopNumber] = desktopWindows[targetDesktopNumber]?.filter((windowHWND) => windowHWND !== hwnd).concat(hwnd) ?? [hwnd];
  console.log( "copy:", desktopWindows )
}
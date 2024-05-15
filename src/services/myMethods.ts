import { nativeImage } from "electron";
import path from "path";
import { tray } from "../components/tray";
import { desktopHWND, imagesPath } from "../config/constants";
import { EnumWindows, GetForegroundWindow, SetForegroundWindow } from "./user32";
import { GetCurrentDesktopNumber, GetDesktopCount, GetWindowDesktopNumber, GoToDesktopNumber, MoveWindowToDesktopNumber } from "./virtualDesktopAccessor";

let desktopWindows:number[][] = new Array(9).fill([]).map((_, i) => getAllWindowsFromDesktopNumber(i));

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

export const goToDesktop = (targetDesktopNumber:number) => {
  if (GetDesktopCount() < targetDesktopNumber - 1) return;
  const currentDesktopNumber = GetCurrentDesktopNumber();
  desktopWindows[currentDesktopNumber] = getAllWindowsFromDesktopNumber(currentDesktopNumber);
  desktopWindows[targetDesktopNumber] = getAllWindowsFromDesktopNumber(targetDesktopNumber);
  GoToDesktopNumber(targetDesktopNumber);
  // Move related windows to target desktop
  if (desktopWindows[targetDesktopNumber].length) {
    desktopWindows[targetDesktopNumber].forEach((hwnd) => MoveWindowToDesktopNumber(hwnd, targetDesktopNumber));
  }
  // Set focus on last window
  SetForegroundWindow(desktopWindows[targetDesktopNumber].at(-1) ?? desktopHWND);
  tray.setImage(nativeImage.createFromPath(path.join(imagesPath, `${targetDesktopNumber + 1}.png`)));
}

export const moveWindowToDesktop = (targetDesktopNumber:number, hwnd:number=GetForegroundWindow()) => {
  if (GetDesktopCount() < targetDesktopNumber - 1) return;
  MoveWindowToDesktopNumber(hwnd, targetDesktopNumber);
  // Delete "windows HWND" from all desktops
  desktopWindows = desktopWindows.map((desktop) => desktop.filter((windowHWND) => windowHWND !== hwnd));
  desktopWindows[targetDesktopNumber] = getAllWindowsFromDesktopNumber(targetDesktopNumber);
  // Set focus on last window
  SetForegroundWindow(desktopWindows[GetCurrentDesktopNumber()].at(-1) ?? desktopHWND);
}

export const copyWindowToDesktop = (targetDesktopNumber:number, hwnd:number=GetForegroundWindow()) => {
  if (GetDesktopCount() < targetDesktopNumber - 1) return;
  const currentDesktopNumber = GetCurrentDesktopNumber();
  // Add "window HWND" to the end of the current desktop
  desktopWindows[currentDesktopNumber] = getAllWindowsFromDesktopNumber(currentDesktopNumber);
  desktopWindows[targetDesktopNumber] = getAllWindowsFromDesktopNumber(targetDesktopNumber);
  desktopWindows[targetDesktopNumber] = desktopWindows[targetDesktopNumber].filter((windowHWND) => windowHWND !== hwnd).concat(hwnd);
  console.log( desktopWindows[targetDesktopNumber] )
}
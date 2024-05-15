import koffi from "koffi";

const virtualDesktopAccessor = koffi.load("resources/VirtualDesktopAccessor.dll");
export const GetCurrentDesktopNumber: () => number = virtualDesktopAccessor.func("GetCurrentDesktopNumber", "int", []);
export const MoveWindowToDesktopNumber: (hwnd:number, desktopNumber:number) => void = virtualDesktopAccessor.func("MoveWindowToDesktopNumber", "int", ["int", "int"]);
export const GoToDesktopNumber: (desktopNumber:number) => number = virtualDesktopAccessor.func("GoToDesktopNumber", "int", ["int"]);
export const GetWindowDesktopNumber: (hwnd:number) => number = virtualDesktopAccessor.func("GetWindowDesktopNumber", "int", ["int"]);
export const IsWindowOnCurrentVirtualDesktop: (hwnd:number) => number = virtualDesktopAccessor.func("IsWindowOnCurrentVirtualDesktop", "int", ["int"]);
export const GetDesktopCount: () => number = virtualDesktopAccessor.func("GetDesktopCount", "int", []);
import koffi from "koffi";

const user32 = koffi.load("user32.dll");
export const GetForegroundWindow: () => number = user32.func("GetForegroundWindow", "int", [] );
export const SetForegroundWindow: (hwnd:number) => boolean = user32.func("SetForegroundWindow", "bool", ["int"] );
export const GetShellWindow: () => number = user32.func("GetShellWindow", "int", [] );
export const GetWindow: (hwnd:number, uCmd:number) => number = user32.func("GetWindow", "int", ["int", "int"] );

const EnumWindowsProc = koffi.proto("__stdcall", "EnumWindowsProc", "bool", ["int", "int"]);
export const EnumWindows = user32.func("__stdcall", "EnumWindows", "bool", [koffi.pointer(EnumWindowsProc), "int"]);

export const hasOwnerWindow: (hwnd:number) => boolean = (hwnd) => Boolean(GetWindow(hwnd, 4));
export const getOwnerWindow: (hwnd:number) => number = (hwnd) => GetWindow(hwnd, 4);
export const hasPopupWindow = (hwnd:number):boolean => Boolean(GetWindow(hwnd, 6));
export const getPopupWindow = (hwnd:number):number => GetWindow(hwnd, 6);
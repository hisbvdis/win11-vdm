import koffi from "koffi";

const user32 = koffi.load("user32.dll");
export const GetForegroundWindow: () => number = user32.func("GetForegroundWindow", "int", [] );
export const SetForegroundWindow: (hwnd:number) => boolean = user32.func("SetForegroundWindow", "bool", ["int"] );
export const GetShellWindow: () => number = user32.func("GetShellWindow", "int", [] );

const EnumWindowsProc = koffi.proto("__stdcall", "EnumWindowsProc", "bool", ["int", "int"]);
export const EnumWindows = user32.func("__stdcall", "EnumWindows", "bool", [koffi.pointer(EnumWindowsProc), "int"]);
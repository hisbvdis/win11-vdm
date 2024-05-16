export interface IShortcutObject {
  actionType: "goToDesktop" | "moveWindowToDesktop" | "copyWindowToDesktop";
  index: string;
  shortcut: string;
}
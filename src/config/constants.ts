import path from "path";
import { GetShellWindow } from "../services/user32";

export const resourcesPath = path.join("resources/");
export const imagesPath = path.join(resourcesPath, "images/");
export const storePath = path.join(resourcesPath, "store.json");
export const desktopHWND = GetShellWindow();
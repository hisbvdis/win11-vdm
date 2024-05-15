import path from "path";
import { GetShellWindow } from "../services/user32";

export const resourcesPath = path.join(__dirname, "../../resources/");
export const imagesPath = path.join(resourcesPath, "images/");
export const desktopHWND = GetShellWindow();
import { readFile, writeFile } from "node:fs/promises";
import { storePath } from "./constants";

export const readFromStore = async () => {
  const storeFile = await readFile(storePath, {encoding: "utf-8"});
  return JSON.parse(storeFile);
}

export const writeToStore = async (newData:object) => {
  writeFile(storePath, JSON.stringify(newData));
}
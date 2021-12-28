//import "@polvtypes/appdirs";
import { AppDirs } from "appdirs";
import { promises as fs } from 'fs';

export const getAppdir = async () => {
    const dir = new AppDirs("proto2pkg").userCacheDir();
    await fs.mkdir(dir, { recursive: true });
    return dir;
}
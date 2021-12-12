import {constants as fs_constants, promises as fs} from "fs";

export async function checkBinExists(bin: string, errors: Error[]) {
    try {
        await fs.access(bin, fs_constants.X_OK);
    } catch (e) {
        if (e instanceof Error) {
            errors.push(e);
        }
    }
}
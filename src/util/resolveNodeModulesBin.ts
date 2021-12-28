import {constants as fs_constants, promises as fs} from "fs";
import * as path from 'path';

export async function resolveNodeModulesBin(bin: string): Promise<string> {
    let errors: Error[] = [];
    let possibleDir = __dirname;
    do {
        //console.log('possibleDir', possibleDir);
        let possibleBinPath = path.join(possibleDir,`./node_modules/.bin/${bin}`);
        try {
            await fs.access(possibleBinPath, fs_constants.F_OK);
            await fs.access(possibleBinPath, fs_constants.X_OK);
            return possibleBinPath;
        } catch (e) {
            if (e instanceof Error) {
                errors.push(e);
            }
        }
        possibleDir = path.resolve(possibleDir, "..");
    } while(path.resolve(possibleDir, "..") !== possibleDir);
    console.log('errors', errors);
    throw new Error("Couldn't locate the binary for "+bin+", checked all node_modules starting at the dir: "+possibleDir);
}
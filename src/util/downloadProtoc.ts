import * as path from 'path';
import {constants as fs_constants, promises as fs} from 'fs';
import {getAppdir} from "./getAppdir";
import fetch from 'node-fetch';
import {execShellCommand} from "./execShellCommand";
import {BuildContext} from "../builders";
import {getEphemeralContext} from "./ephemeralContext";

const UNTAR_PATH = "protoc-bins";

export const downloadProtocAndGrpcPlugins = async (protocUrl: string) => {
    const appdir = await getAppdir();
    console.log('appdir', appdir);
    const tarPath = path.join(appdir, "protoc-bins.tar.gz");
    const untarPath = path.join(appdir, UNTAR_PATH);
    try {
        await fs.access(tarPath, fs_constants.F_OK)
    } catch(e) {
        // file doesn't exist, download it and untar it
        const file = await fetch(protocUrl);
        await fs.writeFile(tarPath, await file.buffer()); // suppress random ts error about ArrayBuffer not being an ArrayBufferView
        await fs.mkdir(untarPath, {recursive: true});
        await execShellCommand(getEphemeralContext("downloadProtocAndGrpcPlugins()"),"tar", ["-xvf", tarPath], untarPath);
    }
}

export const resolveGrpcToolsBin = async (binName: string): Promise<string> => {
    const appdir = await getAppdir();
    const binPath = path.join(appdir, "/", UNTAR_PATH, "/", binName);

    await fs.access(binPath, fs_constants.F_OK);
    await fs.access(binPath, fs_constants.X_OK);
    return binPath;
}
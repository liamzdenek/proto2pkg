//import * as child_process from "child_process";
import {execa} from 'execa';
// @ts-ignore
import split from 'split';
import {BuildContext} from "../builders";
import * as clc from "cli-color";

export const execShellCommand = async (ctx: BuildContext, cmd: string, args: string[], cwd: string): Promise<string> => {
    const pd = execa(cmd, args, {
        cwd,
    });
    console.log(`[${ctx.thisBuildContext.builderName}]`, clc.blue(`\$ ${cmd} ${args.join(" ")}`));
    if(pd.stdout) {
        pd.stdout.pipe(split()).on('data', function (line: string) {
            //each chunk now is a separate line!
            if(line.length === 0) { return; }
            console.log(`[${ctx.thisBuildContext.builderName}]`, line);
        })
    }
    const {stdout} = await pd;
    return stdout;
    /*return new Promise((resolve, reject) => {
        const ls = child_process.spawn(cmd, args, {
            cwd
        });

        let stdout = '';

        ls.stdout.on("data", data => {
            stdout += data;
            console.log(`stdout: ${data}`);
        });

        ls.stderr.on("data", data => {
            console.log(`stderr: ${data}`);
        });

        ls.on('error', (error) => {
            console.log(`error: ${error.message}`);
            reject(error);
        });

        ls.on("close", code => {
            console.log(`child process exited with code ${code}`);
            resolve(stdout);
        });
    });
     */
}
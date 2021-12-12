// 27^3 = 19683
import {run, subcommands} from "cmd-ts";
import {build} from "./cmd/build";

const proto2pkg = subcommands({
    name: 'proto2pkg',
    cmds: { build },
});

run(proto2pkg, process.argv.slice(2));
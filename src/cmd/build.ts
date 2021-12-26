import {command, option, optional, positional} from 'cmd-ts';
import {Directory} from 'cmd-ts/dist/cjs/batteries/fs';
import * as path from 'path';
import {promises as fs} from 'fs';
import {BuildContext, builders, PackageNameStyle, Proto2PkgJson} from '../builders';
import {camelToSnakeCase, normalizeToCamelCase} from "../util/string-case-normalization";
import { valid as semverValid } from 'semver';
import {execShellCommand} from "../util/execShellCommand";

export const build = command({
    name: 'build',
    description: 'Build a directory with a proto2pkg.json',
    args: {
        sourceDir: positional({
            type: Directory,
            displayName: "dir",
        }),
        distDir: option({
            type: optional(Directory),
            long: "distDir",
            description: "defaults to 'dist' subfolder inside the sourceDir",
        })
    },
    handler: async args => {
       console.log('build args', args);
       const ctx: BuildContext = {
           sourceDir: args.sourceDir,
           sharedDistDir: args.distDir ? args.distDir : path.join(args.sourceDir, "dist"),
           commitHash: await getCommitHash(args.sourceDir),
           buildTime: new Date(),
           thisBuildContext: {
               distDir: '',
               packageName: '',
               builderName: '',
           },
           proto2pkgJson: await loadProto2PkgJson(path.join(args.sourceDir, "/proto2pkg.json")),
       };
       console.log('context', ctx);
       const prereqs = await Promise.all(
           Object.entries(builders)
               .map(async entry => [entry[0], await entry[1].checkPrerequisites(ctx)])
       );
       for(let prereq of prereqs) {
           if(prereq[1].length == 0) {
               continue;
           }
           throw new Error("Error in prerequisites of '"+prereq[0]+"': "+JSON.stringify(prereq[1]))
       }

       for(let [builderName, builder] of Object.entries(builders)) {
           const packageDir = ctx.sourceDir.replace(/[\/]$/, "");
           const packageNameCamelCase = normalizeToCamelCase(packageDir.slice(packageDir.lastIndexOf("/")+1)) + builderName;
           const packageName = builder.packageNameStyle === PackageNameStyle.CamelCase ? packageNameCamelCase : camelToSnakeCase(packageNameCamelCase);
           ctx.thisBuildContext = {
               distDir: path.join(ctx.sharedDistDir, "/", packageName),
               packageName,
               builderName
           }
           await fs.mkdir(ctx.thisBuildContext.distDir,{ recursive: true });
           await builder.build(ctx);
       }
    },
});
const getCommitHash = async (dir: string) => {
    try {
        return (await execShellCommand({thisBuildContext: {builderName: "getCommitHash()"}} as BuildContext, "git", ["rev-parse", "HEAD"], dir)).replace("\n", "")
    } catch(e) {
        return null;
    }
};

async function loadProto2PkgJson(path: string) {
    const fd = await fs.readFile(path);
    const proto2pkg: any = JSON.parse(fd.toString());
    return validateProto2PkgJson(proto2pkg);
}

function validateProto2PkgJson(proto2pkg: any): Proto2PkgJson {
    if(typeof proto2pkg !== "object") {
        throw new Error("top level type must be an object");
    }
    if(typeof proto2pkg.name !== "string" || proto2pkg.name.length < 0) {
        throw new Error("proto2pkg.name must be a non-empty string in either camel or snake case");
    }
    if(typeof proto2pkg.version !== "string" || !semverValid(proto2pkg.version)) {
        throw new Error("proto2pkg.version must be defined and be a valid semantic version (eg, \"0.0.1\")");
    }
    if(typeof proto2pkg.link !== "string" || !proto2pkg.link.startsWith("http")) {
        throw new Error("proto2pkg.link must be defined and be a valid http(s) link");
    }
    return proto2pkg as Proto2PkgJson;
}
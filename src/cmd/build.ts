import {boolean, command, option, optional, positional, array, flag, string} from 'cmd-ts';
import {Directory} from 'cmd-ts/dist/cjs/batteries/fs';
import {Url} from 'cmd-ts/dist/cjs/batteries/url';
import { URL } from 'url';
import * as path from 'path';
import {constants as fs_constants, promises as fs} from 'fs';
import {BuildContext, builders, PackageNameStyle, Proto2PkgJson} from '../builders';
import {
    camelToSnakeCaseDashes,
    camelToSnakeCaseUnderscores,
    normalizeToCamelCase
} from "../util/string-case-normalization";
import { valid as semverValid } from 'semver';
import {execShellCommand} from "../util/execShellCommand";
import {downloadProtocAndGrpcPlugins} from "../util/downloadProtoc";
import {getEphemeralContext} from "../util/ephemeralContext";
import {generateEnumListType} from "../util/LanguageType";
import {getSupportedLanguages, Languages} from "../util/getSupportedLanguages";
import {load as protobufLoad, Root, util} from 'protobufjs';

const DEFAULT_PROTOC_URL = "https://packages.grpc.io/archive/2021/12/6ea821487923e63b3654990f4b30efe3a71c18ad-4b26a47a-d9db-4f9b-bc49-0926e6b85008/protoc/grpc-protoc_linux_x64-1.44.0-dev.tar.gz";

export const build = command({
    name: 'build',
    description: 'Build a directory with a proto2pkg.json',
    args: {
        sourceDir: positional({
            type: Directory,
            displayName: "sourceDir",
        }),
        distDir: option({
            type: optional(Directory),
            long: "distDir",
            description: "defaults to 'dist' subfolder inside the sourceDir",
        }),
        grpcBinUrl: option({
            type: Url,
            long: "grpcBinUrl",
            description: "where to download the grpc binaries. defaults to: '"+DEFAULT_PROTOC_URL+"'",
            defaultValue(): URL {
                return new URL(DEFAULT_PROTOC_URL);
            }
        }),
        noBuild: flag({
            long: "noBuild",
            type: boolean,
            description: "When this flag is present, proto2pkg will not execute the build.sh file in each package.",
            defaultValue(): boolean { return true; }
        }),
        languages: option({
            type: generateEnumListType(Languages),
            long: "languages",
            // default to all the languages
            defaultValue(): Set<typeof Languages> { return new Set(Object.values(Languages) as any); }
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
           protoRoot: await protobufLoad(path.join(args.sourceDir, "src/main.proto"))
       };

       // download the protoc and grpc plugins because they'll be used
       // by the various builders
       await downloadProtocAndGrpcPlugins(args.grpcBinUrl.toString());
       console.log('context', ctx);

       // validate the prerequisites contain no errors
       const prereqs = await Promise.all(
           Object.entries(builders)
               .map(async entry => [entry[0], await entry[1].checkPrerequisites(ctx)])
       );
       for(let prereq of prereqs) {
           if(prereq[1].length == 0) {
               continue;
           }
           throw new Error("Error in prerequisites of '"+prereq[0]+"': "+prereq[1].toString ? prereq[1].toString() : JSON.stringify(prereq[1]))
       }

       // clean any prior builds
        try {
            await fs.rm(ctx.sharedDistDir, {recursive: true});
        } catch(e) {}
       await fs.mkdir(ctx.sharedDistDir, { recursive: true });

       for(let [builderName, builder] of Object.entries(builders)) {
           if(
               // if the builder's languages are all not in the requested list of languages
               builder.languages.every(lang => !args.languages.has(lang as any)) // no clue why it's coming through as "Set<typeof Languages>" which is causing the required any
           ) {
                console.log("Skipping build for "+builderName+" because it's not in the requested list of languages");
                continue;
           }

           const packageDir = ctx.sourceDir.replace(/[\/]$/, "");
           const packageNameCamelCase = normalizeToCamelCase(packageDir.slice(packageDir.lastIndexOf("/")+1)) + builderName;
           const packageName = (() => { switch(builder.packageNameStyle) {
               case PackageNameStyle.CamelCase: return packageNameCamelCase;
               case PackageNameStyle.SnakeCaseDashes: return camelToSnakeCaseDashes(packageNameCamelCase);
               case PackageNameStyle.SnakeCaseUnderscores: return camelToSnakeCaseUnderscores(packageNameCamelCase);
               // no default case ! all PackageNameStyles should be handled
           }
           })();
           ctx.thisBuildContext = {
               distDir: path.join(ctx.sharedDistDir, "/", packageName),
               packageName,
               builderName
           }
           // generate the package
           await fs.mkdir(ctx.thisBuildContext.distDir,{ recursive: true });
           await builder.generatePackage(ctx);
           await execShellCommand(ctx, "chmod", ["+x", "./build.sh"], ctx.thisBuildContext.distDir);
           // and optionally build the package
           if(!args.noBuild) {
               await execShellCommand(ctx, "./build.sh", [], ctx.thisBuildContext.distDir);
           }
       }
    },
});
const getCommitHash = async (dir: string) => {
    try {
        return (await execShellCommand(getEphemeralContext("getCommitHash()"), "git", ["rev-parse", "HEAD"], dir)).replace("\n", "")
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
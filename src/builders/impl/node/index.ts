import {BuildContext, Builder, PackageNameStyle} from "../../Builder";
import {promises as fs} from 'fs';
import * as path from 'path';
import {execShellCommand} from "../../../util/execShellCommand";
import {resolveNodeModulesBin} from "../../../util/resolveNodeModulesBin";
import {
    readmeGeneratorBrowserClientGprcWeb,
    readmeGeneratorNodeClient,
    readmeGeneratorNodeServer
} from "./readmeGenerators";

import {PROTOC_BIN_PROMISE, TS_PROTO_PLUGIN_BIN_PROMISE} from "../common";
import {Languages} from "../../../util/getSupportedLanguages";

// ./node_modules/.bin/protoc --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin -I=src --ts_out=dist src/*.proto
// ./node_modules/.bin/protoc --plugin=node_modules/ts-proto/protoc-gen-ts_proto ./example/bank-service/src/*.proto -I ./example/bank-service --ts_proto_out=./example/bank-service/dist
export interface TsProtoBuilderConfig {
    args: string[],
    grpcWeb?: boolean,
    readmeGenerator: (ctx: BuildContext, cfg: TsProtoBuilderConfig) => string;
    extraPeerDeps?: ExtraDeps;
}

interface ExtraDeps { [k: string]: string }

const createTsProtoBuilder = (cfg: TsProtoBuilderConfig): Builder => {
    return {
        packageNameStyle: PackageNameStyle.SnakeCaseDashes,
        languages: [Languages.Typescript, Languages.Javascript, ...(cfg.grpcWeb ? [Languages.GrpcWeb] : [])],
        async checkPrerequisites(ctx) {
            let errors: Error[] = [];
            try {
                await PROTOC_BIN_PROMISE;
                await TS_PROTO_PLUGIN_BIN_PROMISE;
            } catch(newErrors: any) {
                errors.push(...newErrors);
            }
            return errors;
        },
        async generatePackage(ctx) {
            const protoFiles = path.join(ctx.sourceDir, "/src/main.proto");
            const PROTOC_BIN = await PROTOC_BIN_PROMISE;
            const TS_PROTO_PLUGIN_BIN = await TS_PROTO_PLUGIN_BIN_PROMISE;
            await execShellCommand(ctx, PROTOC_BIN, [
                `--plugin=${TS_PROTO_PLUGIN_BIN}`,
                protoFiles,
                `-I${ctx.sourceDir}`,
                `--ts_proto_out=${ctx.thisBuildContext.distDir}`,
                ...cfg.args
            ], ctx.sourceDir);
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "tsconfig.json"), generateTsconfig(ctx, cfg));
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "package.json"), generatePackageJson(ctx, cfg));
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, ".gitignore"), generateGitignore(ctx, cfg));
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, ".npmignore"), generateNpmignore(ctx, cfg));
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "README.md"), cfg.readmeGenerator(ctx,cfg));
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "build.sh"), generateBuildSh(ctx, cfg));
            return {
                errors: []
            };
        }
    };
}
const generateBuildSh = (ctx: BuildContext, cfg: TsProtoBuilderConfig) => (
`#!/usr/bin/env bash
npm install
npm run build
`);

export const NodeServer: Builder = createTsProtoBuilder({
    args: [`--ts_proto_opt=env=node,outputClientImpl=false,outputServerImpl=true,outputServices=generic-definitions,forceLong=long`],
    readmeGenerator: readmeGeneratorNodeServer,
    extraPeerDeps: {
        "nice-grpc": "^1.0.4",
    }
});
export const NodeClient: Builder = createTsProtoBuilder({
    args: [`--ts_proto_opt=env=node,outputClientImpl=true,outputServices=generic-definitions,outputServerImpl=false,returnObservable=true,forceLong=long`],
    readmeGenerator: readmeGeneratorNodeClient,
    extraPeerDeps: {
        "nice-grpc": "^1.0.4",
    }
});
export const BrowserClientGrpcWeb: Builder = createTsProtoBuilder({
    args: [`--ts_proto_opt=env=browser,outputServerImpl=false,outputClientImpl=grpc-web,forceLong=long`],
    grpcWeb: true,
    readmeGenerator: readmeGeneratorBrowserClientGprcWeb
});

const generateTsconfig = (ctx: BuildContext, cfg: TsProtoBuilderConfig): string => {
    return JSON.stringify({
        "compilerOptions": {
            "target": "es2018",
            "lib": ["es2018"],
            "module": "commonjs",
            "strict": true,
            "outDir": "dist",
            "skipLibCheck": true,
            "experimentalDecorators": true,
            "declaration": true
        },
        "include": ["./"]
    }, null, 2);
}

const generatePackageJson = (ctx: BuildContext, cfg: TsProtoBuilderConfig): string => {
    return JSON.stringify({
        "name": ctx.thisBuildContext.packageName,
        "version": "0.0.1",
        "description": "",
        "main": "dist/main.js",
        "types": "dist/main.d.ts",
        "scripts": {
            "build": "tsc"
        },
        "devDependencies": {
            "typescript": "^4.5.3",
        },
        "peerDependencies": {
            "protobufjs": "^6.11.2",
            "long": "^4.0.0",
            ...(!cfg.grpcWeb ? {} : {
                "@improbable-eng/grpc-web": "^0.15.0",
                "browser-headers": "^0.4.1"
            }),
            ...(cfg.extraPeerDeps ? cfg.extraPeerDeps : {})
        }
    }, null, 2);
}

const generateGitignore = (ctx: BuildContext, cfg: TsProtoBuilderConfig): string => (
`./dist/\n`
)

const generateNpmignore = (ctx: BuildContext, cfg: TsProtoBuilderConfig): string => (
`# this file is defined to override the default behavior of npm publish automatically including the gitignore. we don't want to npmignore ./dist`
)
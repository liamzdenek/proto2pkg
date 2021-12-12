import {BuildContext, Builder, PackageNameStyle} from "../Builder";
import {constants as fs_constants, promises as fs} from 'fs';
import * as path from 'path';
import {execShellCommand} from "../../util/execShellCommand";
import {checkBinExists} from "../../util/checkBinExists";
import {generateReadmeText} from "../../util/generateReadme";

const PROTOC_BIN = "./node_modules/.bin/protoc";
const TS_PROTO_PLUGIN_BIN = "./node_modules/ts-proto/protoc-gen-ts_proto"

// ./node_modules/.bin/protoc --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin -I=src --ts_out=dist src/*.proto
// ./node_modules/.bin/protoc --plugin=node_modules/ts-proto/protoc-gen-ts_proto ./example/bank-service/src/*.proto -I ./example/bank-service --ts_proto_out=./example/bank-service/dist
interface TsProtoBuilderConfig {
    args: string[],
    grpcWeb?: boolean,
    readmeGenerator: (ctx: BuildContext, cfg: TsProtoBuilderConfig) => string;
}

const createTsProtoBuilder = (cfg: TsProtoBuilderConfig): Builder => {
    return {
        packageNameStyle: PackageNameStyle.SnakeCase,
        async checkPrerequisites(ctx) {
            let errors: Error[] = [];
            await checkBinExists(PROTOC_BIN, errors);
            await checkBinExists(TS_PROTO_PLUGIN_BIN, errors);
            return errors;
        },
        async build(ctx) {
            console.log('dist dir', ctx.thisBuildContext.distDir);
            const protoFiles = path.join(ctx.sourceDir, "/src/main.proto");
            await execShellCommand(ctx, path.join(process.cwd(), PROTOC_BIN), [
                `--plugin=${path.join(process.cwd(), TS_PROTO_PLUGIN_BIN)}`,
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
            await execShellCommand(ctx, "npm", ["install"], ctx.thisBuildContext.distDir);
            await execShellCommand(ctx, "npm", ["run", "build"], ctx.thisBuildContext.distDir);
            return {
                errors: []
            };
        }
    };
}


const readmeGeneratorNodeServer = (ctx: BuildContext, cfg: TsProtoBuilderConfig) => generateReadmeText(ctx, (
`
(Relevant documentation for nice-grpc)[https://github.com/deeplay-io/nice-grpc/tree/master/packages/nice-grpc]. Note that
we are using ts-proto, not google-protobuf.

For each \`service\` definition in your proto files, there will be a corresponding \`[ServiceName]Definition\` object
within the compiled code. If you have a protoc definition like this, the below typescript is a valid server implementation.
\`\`\`proto
service ExampleService {
    rpc exampleUnaryMethod(ExampleRequest) returns (ExampleResponse) {}
}
\`\`\`
\`\`\`ts
import {ServiceImplementation} from 'nice-grpc';
import {
  ExampleServiceDefinition,
  ExampleRequest,
  ExampleResponse,
  DeepPartial,
} from '${ctx.thisBuildContext.packageName}';

const exampleServiceImpl: ServiceImplementation<
  typeof ExampleServiceDefinition
> = {
  async exampleUnaryMethod(
    request: ExampleRequest,
  ): Promise<DeepPartial<ExampleResponse>> {
    // ... method logic

    return response;
  },
};

// you may implement multiple services within the same process/port, depending on your application architecture
server.add(ExampleServiceDefinition, exampleServiceImpl);

await server.listen('0.0.0.0:8080');

process.on('SIGINT', async () => {
    await server.shutdown();
    process.exit();
});
\`\`\`
`))

const readmeGeneratorNodeClient = (ctx: BuildContext, cfg: TsProtoBuilderConfig) => generateReadmeText(ctx, (
`\`\`\`ts

\`\`\`
`))

const readmeGeneratorBrowserClientGprcWeb = (ctx: BuildContext, cfg: TsProtoBuilderConfig) => generateReadmeText(ctx, (
`\`\`\`ts

\`\`\`
`))

export const NodeServer: Builder = createTsProtoBuilder({
    args: [`--ts_proto_opt=env=node,outputClientImpl=false,outputServerImpl=true,outputServices=generic-definitions,forceLong=long`],
    readmeGenerator: readmeGeneratorNodeServer
});
export const NodeClient: Builder = createTsProtoBuilder({
    args: [`--ts_proto_opt=env=node,outputClientImpl=true,outputServerImpl=false,forceLong=long`],
    readmeGenerator: readmeGeneratorNodeClient
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
        "main": "dist/index.js",
        "types": "dist/index.d.ts",
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
            })
        }
    }, null, 2);
}

const generateGitignore = (ctx: BuildContext, cfg: TsProtoBuilderConfig): string => (
`./dist/\n`
)

const generateNpmignore = (ctx: BuildContext, cfg: TsProtoBuilderConfig): string => (
`# this file is defined to override the default behavior of npm publish automatically including the gitignore. we don't want to npmignore ./dist`
)
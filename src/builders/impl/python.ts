import {BuildContext, Builder, PackageNameStyle} from "../Builder";
import * as path from "path";
import {execShellCommand} from "../../util/execShellCommand";
import {promises as fs} from "fs";
import {PROTOC_BIN_PROMISE, GRPC_PYTHON_PLUGIN_BIN_PROMISE} from "./common";
import {generateReadmeText} from "../../util/generateReadme";

export interface PyProtoBuilderConfig {
    args: string[],
    readmeGenerator: (ctx: BuildContext, cfg: PyProtoBuilderConfig) => string;
}

interface ExtraDeps { [k: string]: string }

const createPythonProtoBuilder = (cfg: PyProtoBuilderConfig): Builder => {
    return {
        packageNameStyle: PackageNameStyle.SnakeCaseUnderscores,
        async checkPrerequisites(ctx) {
            let errors: Error[] = [];
            console.log('dirname', __dirname);
            try {
                await PROTOC_BIN_PROMISE;
                await GRPC_PYTHON_PLUGIN_BIN_PROMISE;
            } catch(newErrors: any) {
                errors.push(...newErrors);
            }
            return errors;
        },
        async generatePackage(ctx) {
            const protoFiles = path.join(ctx.sourceDir, "/src/main.proto");
            const PROTOC_BIN = await PROTOC_BIN_PROMISE;
            const GRPC_PYTHON_PLUGIN_BIN = await GRPC_PYTHON_PLUGIN_BIN_PROMISE;
            await execShellCommand(ctx, PROTOC_BIN, [
                `--plugin=protoc-gen-grpc_python=${GRPC_PYTHON_PLUGIN_BIN}`,
                protoFiles,
                `-I${ctx.sourceDir}`,
                `--python_out=${ctx.thisBuildContext.distDir}`,
                `--grpc_python_out=${ctx.thisBuildContext.distDir}`,
                ...cfg.args
            ], ctx.sourceDir);
            await fs.mkdir(path.join(ctx.thisBuildContext.distDir, "tests"), { recursive: true });
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "src/__init__.py"), ""); // required to make python recognize the dir as a module

            // move all the files into a correct subdir
            await fs.mkdir(path.join(ctx.thisBuildContext.distDir, "src/", ctx.thisBuildContext.packageName), { recursive: true});
            for(let file of await fs.readdir(path.join(ctx.thisBuildContext.distDir, "src"))) {
                if(file === ctx.thisBuildContext.packageName) {
                    continue;
                }
                await fs.rename(
                    path.join(ctx.thisBuildContext.distDir, "src", file),
                    path.join(ctx.thisBuildContext.distDir, "src/", ctx.thisBuildContext.packageName,"/",file)
                )
            }
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "README.md"), cfg.readmeGenerator(ctx,cfg));
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "pyproject.toml"), generatePyProjToml(ctx, cfg));
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "setup.cfg"), generateSetupCfg(ctx, cfg));
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "build.sh"), generateBuildSh(ctx, cfg));
            return {
                errors: []
            };
        }
    };
}

const pythonReadmeGenerator = (ctx: BuildContext) => generateReadmeText(ctx,
`#### Server Implementation

For each defined service, there will be a \`[serviceName]Servicer\` class which you should extend and override all members of.

The below example uses a service named ExampleService, like this:

\`\`\`proto
service ExampleService {
    rpc exampleUnaryMethod(ExampleRequest) returns (ExampleResponse) {}
}
\`\`\`
\`\`\`python3
import sys
import os
import grpc
from concurrent import futures

# you probably want to handle this import through a real package manager
sys.path.append(os.path.dirname(os.path.realpath(__file__))+"/src")
from ${ctx.thisBuildContext.packageName} import main_pb2 # protoc (does not include services, just the types)
from ${ctx.thisBuildContext.packageName} import main_pb2_grpc # grpc (includes the service definitions, depends upon above line)

class ExampleServiceServicer(main_pb2_grpc.ExampleServiceServicer):
    def exampleUnaryMethod(self, request, context):
        # request is of type ExampleRequest
        return main_pb2.ExampleResponse(echoField=request.echoField)
        
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    main_pb2_grpc.add_ExampleServiceServicer_to_server(
        ExampleServiceServicer(), server)
    server.add_insecure_port('[::]:9090')
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
\`\`\`

#### Client Implementation
`)

export const Python3Dual = createPythonProtoBuilder({
    args: [],
    readmeGenerator: pythonReadmeGenerator
})

const generateBuildSh = (ctx: BuildContext, cfg: PyProtoBuilderConfig) => (
`#!/usr/bin/env bash
python3 -m pip install --upgrade build
python3 -m build
`);

const generatePyProjToml = (ctx: BuildContext, cfg: PyProtoBuilderConfig) => (
`requires = [
    "setuptools>=42",
    "wheel"
]
build-backend = "setuptools.build_meta"
`);

const generateSetupCfg = (ctx: BuildContext, cfg: PyProtoBuilderConfig) => (
`[metadata]
name = ${ctx.thisBuildContext.packageName}
version = ${ctx.proto2pkgJson.version}
author = Example Author
author_email = author@example.com
description = Proto2pkg generated python package for ${ctx.proto2pkgJson.name}
long_description = file: README.md
long_description_content_type = text/markdown
url = ${ctx.proto2pkgJson.link}
classifiers =
    Programming Language :: Python :: 3
    Operating System :: OS Independent

[options]
package_dir =
    = src
packages = find:
python_requires = >=3.6

[options.packages.find]
where = src
`);
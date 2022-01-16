import {BuildContext, Builder, PackageNameStyle} from "../Builder";
import * as path from "path";
import {execShellCommand} from "../../util/execShellCommand";
import {constants as fs_constants, promises as fs} from "fs";
import {PROTOC_BIN_PROMISE} from "./common";
import {generateReadmeText} from "../../util/generateReadme";
import {Languages} from "../../util/getSupportedLanguages";

export interface GoProtoBuilderConfig {
    args: string[],
    readmeGenerator: (ctx: BuildContext, cfg: GoProtoBuilderConfig) => string;
}

interface ExtraDeps { [k: string]: string }

const getGoBinDir = () => process.env.GOBIN;

const getGoBin = async (binName: string) => {
    const goBin = getGoBinDir();
    if(!goBin) {
        throw new Error("Define environment variable GOBIN to be the directory where golang installs binaries");
    }
    try {
        const bin = path.join(goBin, binName);
        await fs.access(bin, fs_constants.F_OK);
        return bin;
    } catch(e) {
        throw new Error("Couldn't find binary '"+binName+"' in GOBIN="+goBin);
    }
}

const PROTOC_GEN_GO_PROMISE = getGoBin("protoc-gen-go");
const PROTOC_GEN_GO_GRPC_PROMISE = getGoBin("protoc-gen-go-grpc");
const GO_PACKAGE_REGEX = /^option go_package = "(.*?);pkg";$/m

const createGoProtoBuilder = (cfg: GoProtoBuilderConfig): Builder => {
    return {
        packageNameStyle: PackageNameStyle.SnakeCaseUnderscores,
        languages: [Languages.Golang],
        async checkPrerequisites(ctx) {
            let errors: Error[] = [];
            console.log('dirname', __dirname);
            try {
                await PROTOC_GEN_GO_PROMISE;
            } catch(newErrors: any) {
                errors.push(...newErrors, new Error("Try running `go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.26`"));
            }

            try {
                await PROTOC_GEN_GO_GRPC_PROMISE;
            } catch(newErrors: any) {
                errors.push(...newErrors, new Error("Try running `go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.1`"));
            }

            const content = (await fs.readFile(path.join(ctx.sourceDir, "/src/main.proto"))).toString();

            if(!content.match(GO_PACKAGE_REGEX)) {
                errors.push(new Error("Your main.proto MUST define go_package that matches this regex: "+GO_PACKAGE_REGEX.toString()+"; try adding `option go_package = \"example.com/module_name;pkg\";`"));
            }

            return errors;
        },
        async generatePackage(ctx) {
            const protoFiles = path.join(ctx.sourceDir, "/src/main.proto");
            const PROTOC_BIN = await PROTOC_BIN_PROMISE;
            const PROTOC_GEN_GO_GRPC = await PROTOC_GEN_GO_GRPC_PROMISE;
            const PROTOC_GEN_GO = await PROTOC_GEN_GO_PROMISE;

            await fs.mkdir(path.join(ctx.thisBuildContext.distDir, "pkg"), { recursive: true });
            await execShellCommand(ctx, PROTOC_BIN, [
                `--plugin=protoc-gen-go=${PROTOC_GEN_GO}`,
                `--plugin=protoc-gen-grpc_go=${PROTOC_GEN_GO_GRPC}`,
                protoFiles,
                `-I${path.join(ctx.sourceDir, "src")}`,
                /***/`--go_out=${path.join(ctx.thisBuildContext.distDir, 'pkg')}`,
                `--grpc_go_out=${path.join(ctx.thisBuildContext.distDir, 'pkg')}`,

                /***/`--go_opt=paths=source_relative`,
                `--grpc_go_opt=paths=source_relative`,

                ///***/`--go_opt=Msrc/main.proto=src/${ctx.thisBuildContext.packageName}`,
                //`--grpc_go_opt=Msrc/main.proto=src/${ctx.thisBuildContext.packageName}`,
                //`--go-grpc_opt=paths=source_relative`,
                ...cfg.args
            ], path.join(ctx.sourceDir, "src"));

            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "README.md"), cfg.readmeGenerator(ctx,cfg));
            //await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "pyproject.toml"), generatePyProjToml(ctx, cfg));
            //await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "setup.cfg"), generateSetupCfg(ctx, cfg));
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "build.sh"), generateBuildSh(ctx, cfg));
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "go.mod"), await generateGoMod(ctx, cfg));

            /*
            await fs.mkdir(path.join(ctx.thisBuildContext.distDir, "pkg"), { recursive: true });
            await execShellCommand(ctx, "sh", ["-c", "mv *.go pkg/"], ctx.thisBuildContext.distDir);
             */
            await execShellCommand(ctx, "go", ["mod", "tidy"], ctx.thisBuildContext.distDir);

            return {
                errors: []
            };
        }
    };
}

const goReadmeGenerator = (ctx: BuildContext) => generateReadmeText(ctx,
`#### Importing guide

If this package is published in a repository separately from the service that generated it (private or public), [follow
the pip VCS instructions](https://pip.pypa.io/en/stable/topics/vcs-support/).

If this package is published in the same repository that contains the proto2pkg.json (eg, by \`git add\`ing the \`dist\`
folder from executing proto2pkg, then follow the same instructions as above, [but you must specify the correct subdirectory
and egg](https://pip.pypa.io/en/stable/topics/vcs-support/#url-fragments), which should point to the directory containing
setup.cfg (this directory).

If you're using a build pipeline that publishes this package to, eg, artifactory or nexus, [follow the repository manager
instructions](https://docs.readthedocs.io/en/stable/guides/private-python-packages.html#from-a-repository-manager-other-than-pypi).

#### Server Implementation

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

For each defined service, there will be a \`[serviceName]Stub\` class which you should instantiate. This is your client
object. Why is it called stub? 🤷 ¯\\_(ツ)_/¯ It's a client.



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


channel = grpc.insecure_channel('localhost:9090')
stub = main_pb2_grpc.ExampleServiceStub(channel)

# synchronous call
response = stub.exampleUnaryMethod(main_pb2.ExampleRequest(echoField="bobby"))
print("Response")
print(response) # type = ExampleResponse

# or, asynchronous call
future = stub.exampleUnaryMethod.future(main_pb2.ExampleRequest(echoField="bobby2"))

response = future.result()
print("Response")
print(response) # type = ExampleResponse
\`\`\`
`)

export const GoDual = createGoProtoBuilder({
    args: [],
    readmeGenerator: goReadmeGenerator
})

const generateBuildSh = (ctx: BuildContext, cfg: GoProtoBuilderConfig) => (
`#!/usr/bin/env bash
go build ./...
`);
const generateGoMod = async (ctx: BuildContext, cfg: GoProtoBuilderConfig) => (
`module ${await getGoModuleName(ctx, cfg)}

go 1.17

require (
    google.golang.org/grpc v1.43.0
    google.golang.org/protobuf v1.25.0
)

require (
    github.com/golang/protobuf v1.4.3 // indirect
    golang.org/x/net v0.0.0-20200822124328-c89045814202 // indirect
    golang.org/x/sys v0.0.0-20200323222414-85ca7c5b95cd // indirect
    golang.org/x/text v0.3.0 // indirect
    google.golang.org/genproto v0.0.0-20200526211855-cb27e3aa2013 // indirect
)

`);

const getGoModuleName = async (ctx: BuildContext, cfg: GoProtoBuilderConfig) => {
    const content = (await fs.readFile(path.join(ctx.sourceDir, "/src/main.proto"))).toString();

    const matches = content.match(GO_PACKAGE_REGEX);
    if(!matches || matches.length !== 2) {
        throw new Error("Error pulling module name using this regex on main.proto: "+GO_PACKAGE_REGEX.toString());
    }
    console.log('matches', matches);
    return matches[1];
};
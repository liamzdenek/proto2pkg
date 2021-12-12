import {BuildContext, Builder, PackageNameStyle} from "../Builder";
import {promises as fs} from "fs";
import * as path from "path";
import {execShellCommand} from "../../util/execShellCommand";

export const GrpcWebProxy: Builder = {
    packageNameStyle: PackageNameStyle.SnakeCase,
    async checkPrerequisites(ctx) {
        return [];
    },
    async build(ctx) {
        await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "entrypoint.sh"), generateEntrypoint(ctx));
        await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "Dockerfile"), generateDockerfile(ctx));
        await execShellCommand(ctx,"docker", ["build", "."], ctx.thisBuildContext.distDir);
        return {
            errors: []
        };
    }
}

const generateDockerfile = (ctx: BuildContext): string => (
`FROM alpine:3.15
RUN apk update
RUN apk add ca-certificates wget unzip
RUN wget https://github.com/improbable-eng/grpc-web/releases/download/v0.15.0/grpcwebproxy-v0.15.0-linux-x86_64.zip -O grpcwebproxy.zip
RUN unzip grpcwebproxy.zip
RUN mv dist/grpcwebproxy-* /bin/grpcwebproxy
RUN apk --purge del apk-tools wget unzip
ADD entrypoint.sh /bin/

ENTRYPOINT /bin/entrypoint.sh
`
)

const generateEntrypoint = (ctx: BuildContext): string => (
`#/bin/sh
# $BACKEND_ADDR of the form "hostname:port" 
/bin/grpcwebproxy --backend_addr=$BACKEND_ADDR \\
    --run_tls_server=false
`
)
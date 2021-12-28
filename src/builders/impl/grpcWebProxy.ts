import {BuildContext, Builder, PackageNameStyle} from "../Builder";
import {promises as fs} from "fs";
import * as path from "path";
import {generateReadmeText} from "../../util/generateReadme";

export const GrpcWebProxy: Builder = {
    packageNameStyle: PackageNameStyle.SnakeCaseDashes,
    async checkPrerequisites(ctx) {
        return [];
    },
    async generatePackage(ctx) {
        await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "entrypoint.sh"), generateEntrypoint(ctx));
        await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "Dockerfile"), generateDockerfile(ctx));
        await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "README.md"), readmeGeneratorGrpcWebProxy(ctx));
        await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "build.sh"), generateBuildSh(ctx));
        return {
            errors: []
        };
    }
}

const generateBuildSh = (ctx: BuildContext) => (
`#!/usr/bin/env bash
docker build .
`);

const generateDockerfile = (ctx: BuildContext): string => (
`FROM alpine:3.15
RUN apk update
RUN apk add ca-certificates wget unzip
RUN wget https://github.com/improbable-eng/grpc-web/releases/download/v0.15.0/grpcwebproxy-v0.15.0-linux-x86_64.zip -O grpcwebproxy.zip
RUN unzip grpcwebproxy.zip
RUN mv dist/grpcwebproxy-* /bin/grpcwebproxy
RUN apk --purge del apk-tools wget unzip
ADD entrypoint.sh /bin/
RUN chmod +x /bin/entrypoint.sh

ENTRYPOINT /bin/entrypoint.sh
`
)

const generateEntrypoint = (ctx: BuildContext): string => (
`#/bin/sh
# $BACKEND_ADDR of the form "hostname:port" 
/bin/grpcwebproxy --backend_addr=$BACKEND_ADDR \\
    --run_tls_server=false \\
    --allowed_origins=$ALLOWED_ORIGINS
`
)

const readmeGeneratorGrpcWebProxy = (ctx: BuildContext) => generateReadmeText(ctx, (
`
First, create and launch a server implementation that uses binary grpc. For example, you could implement the
\`*-node-server\` package that was generated alongside this package. Assuming your binary grpc service is running
on localhost:9090, run the following command to launch the proxy.
\`\`\`sh
docker build -t example-service-grpc-web-proxy . && docker run --env BACKEND_ADDR=localhost:9090 -it --network host example-service-grpc-web-proxy
\`\`\`

You can validate that the proxy is working by using the \`-browser-client-grpc-web\` package, or by using the [BloomRPC
Client](https://github.com/bloomrpc/bloomrpc). Use the port 8080 (the default for grpcwebproxy) and ensure that BloomRPC
is sending "web" calls.

### Runtime env vars

var | example | desc
-|-|-
$BACKEND_ADDR | "localhost:9090" | the underlying binary grpc server to forward to
$ALLOWED_ORIGINS | "https://example.org,http://subdomain.example.org" | used for CORS. Note that your domains MUST NOT have a trailing slash or the header won't be properly recognized
`));
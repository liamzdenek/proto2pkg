import {BuildContext} from "../../Builder";
import {generateReadmeText} from "../../../util/generateReadme";
import {TsProtoBuilderConfig} from "./index";

export const readmeGeneratorNodeServer = (ctx: BuildContext, cfg: TsProtoBuilderConfig) => generateReadmeText(ctx, (
`
(Relevant documentation for nice-grpc)[https://github.com/deeplay-io/nice-grpc/tree/master/packages/nice-grpc]. Note that
we are using ts-proto, not google-protobuf.

This library is distributed in both JS and TS, so the below code sample should work with plain JS with the types stripped.

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

const server = createServer()/*.useMiddleware(middleware)*/;

// you may implement multiple services within the same process/port, depending on your application architecture
server.add(ExampleServiceDefinition, exampleServiceImpl);

await server.listen('0.0.0.0:8080');

process.on('SIGINT', async () => {
    await server.shutdown();
    process.exit();
});
\`\`\`
`))
export const readmeGeneratorNodeClient = (ctx: BuildContext, cfg: TsProtoBuilderConfig) => generateReadmeText(ctx, (
`
(Relevant documentation for nice-grpc)[https://github.com/deeplay-io/nice-grpc/tree/master/packages/nice-grpc]. Note that
we are using ts-proto, not google-protobuf.

This library is distributed in both JS and TS, so the below code sample should work with plain JS with the types stripped.

For each \`service\` definition in your proto files, there will be a corresponding \`[ServiceName]Definition\` object
within the compiled code. If you have a protoc definition like this, the below typescript is a valid client implementation.
\`\`\`proto
service ExampleService {
    rpc exampleUnaryMethod(ExampleRequest) returns (ExampleResponse) {}
}
\`\`\`
\`\`\`ts
import {createChannel, createClient, Client} from 'nice-grpc';
import {ExampleServiceDefinition} from './main';

const channel = createChannel('localhost:8080');

const client: Client<typeof ExampleServiceDefinition> = createClient(
    ExampleServiceDefinition,
    channel,
);

const response = await client.exampleUnaryMethod({ /* request type fields */ })
\`\`\`

`))
export const readmeGeneratorBrowserClientGprcWeb = (ctx: BuildContext, cfg: TsProtoBuilderConfig) => generateReadmeText(ctx, (
`\`\`\`ts

\`\`\`
`))
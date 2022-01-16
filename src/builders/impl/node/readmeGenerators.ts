import {BuildContext} from "../../Builder";
import {generateReadmeText} from "../../../util/generateReadme";
import {TsProtoBuilderConfig} from "./index";
import {getServerStub} from "./serverDocs";

export const readmeGeneratorNodeServer = (ctx: BuildContext, cfg: TsProtoBuilderConfig) => generateReadmeText(ctx, (
`
(Relevant documentation for nice-grpc)[https://github.com/deeplay-io/nice-grpc/tree/master/packages/nice-grpc]. Note that
we are using ts-proto, not google-protobuf.

This library is distributed in both JS and TS, so all code samples should work with plain JS with the types stripped.

### Server stub implementation

${getServerStub(ctx, cfg)}
`))
export const readmeGeneratorNodeClient = (ctx: BuildContext, cfg: TsProtoBuilderConfig) => generateReadmeText(ctx, (
`
[Relevant documentation for nice-grpc](https://github.com/deeplay-io/nice-grpc/tree/master/packages/nice-grpc). Note that
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
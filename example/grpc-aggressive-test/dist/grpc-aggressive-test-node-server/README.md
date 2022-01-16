# grpc-aggressive-test-node-server

| ⚠️⚠️ This folder and all of its contents (recursively) are autogenerated! Modifications will be overwritten! ⚠️⚠️ |
| --- |

1. This package was generated by executing `proto2pkg` on `bank-service`.
1. [`bank-service` can be found here.](https://github.com/liamzdenek/proto2pkg/example/bank-service)
1. At the time this package was generated:
    1. The `bank-service` version was: `0.0.1`
    1. The `bank-service` commit hash was: `64183c061235bbf6e75e33f608b64280844cf33d`
    1. The build occurred at: 2022-01-16T02:49:18.057Z
1. Below, you can find instructions regarding the generator for this package.

## NodeServer


(Relevant documentation for nice-grpc)[https://github.com/deeplay-io/nice-grpc/tree/master/packages/nice-grpc]. Note that
we are using ts-proto, not google-protobuf.

This library is distributed in both JS and TS, so all code samples should work with plain JS with the types stripped.

### Server stub implementation

```ts
import {ServiceImplementation} from 'nice-grpc';
import {
    TestServiceDefinition,
    UnimplementedServiceDefinition,
    ReconnectServiceDefinition,
    LoadBalancerStatsServiceDefinition,
    XdsUpdateHealthServiceDefinition,
    XdsUpdateClientConfigureServiceDefinition
} from "grpc-aggressive-test-node-server/main";
import {
    Empty
} from "grpc-aggressive-test-node-server/empty";
import {
    SimpleRequest,
    SimpleResponse,
    StreamingOutputCallRequest,
    StreamingOutputCallResponse,
    StreamingInputCallRequest,
    StreamingInputCallResponse,
    ReconnectParams,
    ReconnectInfo,
    LoadBalancerStatsRequest,
    LoadBalancerStatsResponse,
    LoadBalancerAccumulatedStatsRequest,
    LoadBalancerAccumulatedStatsResponse,
    ClientConfigureRequest,
    ClientConfigureResponse
} from "grpc-aggressive-test-node-server/messages";
import {
    DeepPartial,
} from 'grpc-aggressive-test-node-server/main';

const TestServiceImpl: ServiceImplementation<
    typeof TestServiceDefinition
> = {
    async EmptyCall(
        request: Empty,
    ): Promise<DeepPartial<Empty>> {
        // ... method logic
        const response = {
        }
        return response;
    },
    async UnaryCall(
        request: SimpleRequest,
    ): Promise<DeepPartial<SimpleRequest>> {
        // ... method logic
        const response = {
            "payload": {
                "type": PayloadType.COMPRESSABLE /* variants: COMPRESSABLE */,
                "body": new Buffer("") /* bytes */,
            },
            "username": "" /* string */,
            "oauthScope": "" /* string */,
            "serverId": "" /* string */,
            "grpclbRouteType": GrpclbRouteType.GRPCLB_ROUTE_TYPE_UNKNOWN /* variants: GRPCLB_ROUTE_TYPE_UNKNOWN, GRPCLB_ROUTE_TYPE_FALLBACK, GRPCLB_ROUTE_TYPE_BACKEND */,
            "hostname": "" /* string */,
        }
        return response;
    },
    async CacheableUnaryCall(
        request: SimpleRequest,
    ): Promise<DeepPartial<SimpleRequest>> {
        // ... method logic
        const response = {
            "payload": {
                "type": PayloadType.COMPRESSABLE /* variants: COMPRESSABLE */,
                "body": new Buffer("") /* bytes */,
            },
            "username": "" /* string */,
            "oauthScope": "" /* string */,
            "serverId": "" /* string */,
            "grpclbRouteType": GrpclbRouteType.GRPCLB_ROUTE_TYPE_UNKNOWN /* variants: GRPCLB_ROUTE_TYPE_UNKNOWN, GRPCLB_ROUTE_TYPE_FALLBACK, GRPCLB_ROUTE_TYPE_BACKEND */,
            "hostname": "" /* string */,
        }
        return response;
    },
    async *StreamingOutputCall(
        request: StreamingOutputCallRequest,
    ): AsyncIterable<DeepPartial<StreamingOutputCallRequest>> {
        // ... method logic
        const response = {
            "payload": {
                "type": PayloadType.COMPRESSABLE /* variants: COMPRESSABLE */,
                "body": new Buffer("") /* bytes */,
            },
        }
        yield response;
    },
    async StreamingInputCall(
        request: AsyncIterable<StreamingInputCallRequest>,
    ): Promise<DeepPartial<StreamingInputCallRequest>> {
        for await (const item of request) {
            // ... method logic
        }
        const response = {
            "aggregatedPayloadSize": 0 /* int32 */,
        }
        return response;
    },
    async *FullDuplexCall(
        request: AsyncIterable<StreamingOutputCallRequest>,
    ): AsyncIterable<DeepPartial<StreamingOutputCallRequest>> {
        for await (const item of request) {
            // ... method logic
        }
        const response = {
            "payload": {
                "type": PayloadType.COMPRESSABLE /* variants: COMPRESSABLE */,
                "body": new Buffer("") /* bytes */,
            },
        }
        yield response;
    },
    async *HalfDuplexCall(
        request: AsyncIterable<StreamingOutputCallRequest>,
    ): AsyncIterable<DeepPartial<StreamingOutputCallRequest>> {
        for await (const item of request) {
            // ... method logic
        }
        const response = {
            "payload": {
                "type": PayloadType.COMPRESSABLE /* variants: COMPRESSABLE */,
                "body": new Buffer("") /* bytes */,
            },
        }
        yield response;
    },
    async UnimplementedCall(
        request: Empty,
    ): Promise<DeepPartial<Empty>> {
        // ... method logic
        const response = {
        }
        return response;
    },

};

const UnimplementedServiceImpl: ServiceImplementation<
    typeof UnimplementedServiceDefinition
> = {
    async UnimplementedCall(
        request: Empty,
    ): Promise<DeepPartial<Empty>> {
        // ... method logic
        const response = {
        }
        return response;
    },

};

const ReconnectServiceImpl: ServiceImplementation<
    typeof ReconnectServiceDefinition
> = {
    async Start(
        request: ReconnectParams,
    ): Promise<DeepPartial<ReconnectParams>> {
        // ... method logic
        const response = {
        }
        return response;
    },
    async Stop(
        request: Empty,
    ): Promise<DeepPartial<Empty>> {
        // ... method logic
        const response = {
            "passed": false /* bool */,
            "backoffMs": 0 /* int32 */,
        }
        return response;
    },

};

const LoadBalancerStatsServiceImpl: ServiceImplementation<
    typeof LoadBalancerStatsServiceDefinition
> = {
    async GetClientStats(
        request: LoadBalancerStatsRequest,
    ): Promise<DeepPartial<LoadBalancerStatsRequest>> {
        // ... method logic
        const response = {
            "rpcsByPeer": 0 /* int32 */,
            "numFailures": 0 /* int32 */,
            "rpcsByMethod": {
                "rpcsByPeer": 0 /* int32 */,
            },
        }
        return response;
    },
    async GetClientAccumulatedStats(
        request: LoadBalancerAccumulatedStatsRequest,
    ): Promise<DeepPartial<LoadBalancerAccumulatedStatsRequest>> {
        // ... method logic
        const response = {
            "numRpcsStartedByMethod": 0 /* int32 */,
            "numRpcsSucceededByMethod": 0 /* int32 */,
            "numRpcsFailedByMethod": 0 /* int32 */,
            "statsPerMethod": {
                "rpcsStarted": 0 /* int32 */,
                "result": 0 /* int32 */,
            },
        }
        return response;
    },

};

const XdsUpdateHealthServiceImpl: ServiceImplementation<
    typeof XdsUpdateHealthServiceDefinition
> = {
    async SetServing(
        request: Empty,
    ): Promise<DeepPartial<Empty>> {
        // ... method logic
        const response = {
        }
        return response;
    },
    async SetNotServing(
        request: Empty,
    ): Promise<DeepPartial<Empty>> {
        // ... method logic
        const response = {
        }
        return response;
    },

};

const XdsUpdateClientConfigureServiceImpl: ServiceImplementation<
    typeof XdsUpdateClientConfigureServiceDefinition
> = {
    async Configure(
        request: ClientConfigureRequest,
    ): Promise<DeepPartial<ClientConfigureRequest>> {
        // ... method logic
        const response = {
        }
        return response;
    },

};



const server = createServer()/*.useMiddleware(middleware)*/;

// you may implement multiple services within the same process/port, depending on your application architecture
server.add(TestServiceDefinition, TestServiceImpl);
server.add(UnimplementedServiceDefinition, UnimplementedServiceImpl);
server.add(ReconnectServiceDefinition, ReconnectServiceImpl);
server.add(LoadBalancerStatsServiceDefinition, LoadBalancerStatsServiceImpl);
server.add(XdsUpdateHealthServiceDefinition, XdsUpdateHealthServiceImpl);
server.add(XdsUpdateClientConfigureServiceDefinition, XdsUpdateClientConfigureServiceImpl);

await server.listen('0.0.0.0:8080');

process.on('SIGINT', async () => {
    await server.shutdown();
    process.exit();
});

```


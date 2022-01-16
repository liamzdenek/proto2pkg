/* eslint-disable */
import { util, configure } from "protobufjs/minimal";
import * as Long from "long";
import { Empty } from "./empty";
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
  ClientConfigureResponse,
} from "./messages";

export const protobufPackage = "grpc.testing";

/**
 * A simple service to test the various types of RPCs and experiment with
 * performance with various types of payload.
 */
export const TestServiceDefinition = {
  name: "TestService",
  fullName: "grpc.testing.TestService",
  methods: {
    /** One empty request followed by one empty response. */
    emptyCall: {
      name: "EmptyCall",
      requestType: Empty,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
    /** One request followed by one response. */
    unaryCall: {
      name: "UnaryCall",
      requestType: SimpleRequest,
      requestStream: false,
      responseType: SimpleResponse,
      responseStream: false,
      options: {},
    },
    /**
     * One request followed by one response. Response has cache control
     * headers set such that a caching HTTP proxy (such as GFE) can
     * satisfy subsequent requests.
     */
    cacheableUnaryCall: {
      name: "CacheableUnaryCall",
      requestType: SimpleRequest,
      requestStream: false,
      responseType: SimpleResponse,
      responseStream: false,
      options: {},
    },
    /**
     * One request followed by a sequence of responses (streamed download).
     * The server returns the payload with client desired type and sizes.
     */
    streamingOutputCall: {
      name: "StreamingOutputCall",
      requestType: StreamingOutputCallRequest,
      requestStream: false,
      responseType: StreamingOutputCallResponse,
      responseStream: true,
      options: {},
    },
    /**
     * A sequence of requests followed by one response (streamed upload).
     * The server returns the aggregated size of client payload as the result.
     */
    streamingInputCall: {
      name: "StreamingInputCall",
      requestType: StreamingInputCallRequest,
      requestStream: true,
      responseType: StreamingInputCallResponse,
      responseStream: false,
      options: {},
    },
    /**
     * A sequence of requests with each request served by the server immediately.
     * As one request could lead to multiple responses, this interface
     * demonstrates the idea of full duplexing.
     */
    fullDuplexCall: {
      name: "FullDuplexCall",
      requestType: StreamingOutputCallRequest,
      requestStream: true,
      responseType: StreamingOutputCallResponse,
      responseStream: true,
      options: {},
    },
    /**
     * A sequence of requests followed by a sequence of responses.
     * The server buffers all the client requests and then serves them in order. A
     * stream of responses are returned to the client when the server starts with
     * first request.
     */
    halfDuplexCall: {
      name: "HalfDuplexCall",
      requestType: StreamingOutputCallRequest,
      requestStream: true,
      responseType: StreamingOutputCallResponse,
      responseStream: true,
      options: {},
    },
    /**
     * The test server will not implement this method. It will be used
     * to test the behavior when clients call unimplemented methods.
     */
    unimplementedCall: {
      name: "UnimplementedCall",
      requestType: Empty,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
  },
} as const;

/**
 * A simple service NOT implemented at servers so clients can test for
 * that case.
 */
export const UnimplementedServiceDefinition = {
  name: "UnimplementedService",
  fullName: "grpc.testing.UnimplementedService",
  methods: {
    /** A call that no server should implement */
    unimplementedCall: {
      name: "UnimplementedCall",
      requestType: Empty,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
  },
} as const;

/** A service used to control reconnect server. */
export const ReconnectServiceDefinition = {
  name: "ReconnectService",
  fullName: "grpc.testing.ReconnectService",
  methods: {
    start: {
      name: "Start",
      requestType: ReconnectParams,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
    stop: {
      name: "Stop",
      requestType: Empty,
      requestStream: false,
      responseType: ReconnectInfo,
      responseStream: false,
      options: {},
    },
  },
} as const;

/** A service used to obtain stats for verifying LB behavior. */
export const LoadBalancerStatsServiceDefinition = {
  name: "LoadBalancerStatsService",
  fullName: "grpc.testing.LoadBalancerStatsService",
  methods: {
    /** Gets the backend distribution for RPCs sent by a test client. */
    getClientStats: {
      name: "GetClientStats",
      requestType: LoadBalancerStatsRequest,
      requestStream: false,
      responseType: LoadBalancerStatsResponse,
      responseStream: false,
      options: {},
    },
    /** Gets the accumulated stats for RPCs sent by a test client. */
    getClientAccumulatedStats: {
      name: "GetClientAccumulatedStats",
      requestType: LoadBalancerAccumulatedStatsRequest,
      requestStream: false,
      responseType: LoadBalancerAccumulatedStatsResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

/** A service to remotely control health status of an xDS test server. */
export const XdsUpdateHealthServiceDefinition = {
  name: "XdsUpdateHealthService",
  fullName: "grpc.testing.XdsUpdateHealthService",
  methods: {
    setServing: {
      name: "SetServing",
      requestType: Empty,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
    setNotServing: {
      name: "SetNotServing",
      requestType: Empty,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
  },
} as const;

/** A service to dynamically update the configuration of an xDS test client. */
export const XdsUpdateClientConfigureServiceDefinition = {
  name: "XdsUpdateClientConfigureService",
  fullName: "grpc.testing.XdsUpdateClientConfigureService",
  methods: {
    /** Update the tes client's configuration. */
    configure: {
      name: "Configure",
      requestType: ClientConfigureRequest,
      requestStream: false,
      responseType: ClientConfigureResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}

/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";

export const protobufPackage = "grpc.testing";

/** The type of payload that should be returned. */
export enum PayloadType {
  /** COMPRESSABLE - Compressable text format. */
  COMPRESSABLE = 0,
  UNRECOGNIZED = -1,
}

export function payloadTypeFromJSON(object: any): PayloadType {
  switch (object) {
    case 0:
    case "COMPRESSABLE":
      return PayloadType.COMPRESSABLE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PayloadType.UNRECOGNIZED;
  }
}

export function payloadTypeToJSON(object: PayloadType): string {
  switch (object) {
    case PayloadType.COMPRESSABLE:
      return "COMPRESSABLE";
    default:
      return "UNKNOWN";
  }
}

/**
 * The type of route that a client took to reach a server w.r.t. gRPCLB.
 * The server must fill in "fallback" if it detects that the RPC reached
 * the server via the "gRPCLB fallback" path, and "backend" if it detects
 * that the RPC reached the server via "gRPCLB backend" path (i.e. if it got
 * the address of this server from the gRPCLB server BalanceLoad RPC). Exactly
 * how this detection is done is context and server dependent.
 */
export enum GrpclbRouteType {
  /** GRPCLB_ROUTE_TYPE_UNKNOWN - Server didn't detect the route that a client took to reach it. */
  GRPCLB_ROUTE_TYPE_UNKNOWN = 0,
  /** GRPCLB_ROUTE_TYPE_FALLBACK - Indicates that a client reached a server via gRPCLB fallback. */
  GRPCLB_ROUTE_TYPE_FALLBACK = 1,
  /** GRPCLB_ROUTE_TYPE_BACKEND - Indicates that a client reached a server as a gRPCLB-given backend. */
  GRPCLB_ROUTE_TYPE_BACKEND = 2,
  UNRECOGNIZED = -1,
}

export function grpclbRouteTypeFromJSON(object: any): GrpclbRouteType {
  switch (object) {
    case 0:
    case "GRPCLB_ROUTE_TYPE_UNKNOWN":
      return GrpclbRouteType.GRPCLB_ROUTE_TYPE_UNKNOWN;
    case 1:
    case "GRPCLB_ROUTE_TYPE_FALLBACK":
      return GrpclbRouteType.GRPCLB_ROUTE_TYPE_FALLBACK;
    case 2:
    case "GRPCLB_ROUTE_TYPE_BACKEND":
      return GrpclbRouteType.GRPCLB_ROUTE_TYPE_BACKEND;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GrpclbRouteType.UNRECOGNIZED;
  }
}

export function grpclbRouteTypeToJSON(object: GrpclbRouteType): string {
  switch (object) {
    case GrpclbRouteType.GRPCLB_ROUTE_TYPE_UNKNOWN:
      return "GRPCLB_ROUTE_TYPE_UNKNOWN";
    case GrpclbRouteType.GRPCLB_ROUTE_TYPE_FALLBACK:
      return "GRPCLB_ROUTE_TYPE_FALLBACK";
    case GrpclbRouteType.GRPCLB_ROUTE_TYPE_BACKEND:
      return "GRPCLB_ROUTE_TYPE_BACKEND";
    default:
      return "UNKNOWN";
  }
}

/**
 * TODO(dgq): Go back to using well-known types once
 * https://github.com/grpc/grpc/issues/6980 has been fixed.
 * import "google/protobuf/wrappers.proto";
 */
export interface BoolValue {
  /** The bool value. */
  value: boolean;
}

/** A block of data, to simply increase gRPC message size. */
export interface Payload {
  /** The type of data in body. */
  type: PayloadType;
  /** Primary contents of payload. */
  body: Uint8Array;
}

/**
 * A protobuf representation for grpc status. This is used by test
 * clients to specify a status that the server should attempt to return.
 */
export interface EchoStatus {
  code: number;
  message: string;
}

/** Unary request. */
export interface SimpleRequest {
  /**
   * Desired payload type in the response from the server.
   * If response_type is RANDOM, server randomly chooses one from other formats.
   */
  responseType: PayloadType;
  /** Desired payload size in the response from the server. */
  responseSize: number;
  /** Optional input payload sent along with the request. */
  payload: Payload | undefined;
  /** Whether SimpleResponse should include username. */
  fillUsername: boolean;
  /** Whether SimpleResponse should include OAuth scope. */
  fillOauthScope: boolean;
  /**
   * Whether to request the server to compress the response. This field is
   * "nullable" in order to interoperate seamlessly with clients not able to
   * implement the full compression tests by introspecting the call to verify
   * the response's compression status.
   */
  responseCompressed: BoolValue | undefined;
  /** Whether server should return a given status */
  responseStatus: EchoStatus | undefined;
  /** Whether the server should expect this request to be compressed. */
  expectCompressed: BoolValue | undefined;
  /** Whether SimpleResponse should include server_id. */
  fillServerId: boolean;
  /** Whether SimpleResponse should include grpclb_route_type. */
  fillGrpclbRouteType: boolean;
}

/** Unary response, as configured by the request. */
export interface SimpleResponse {
  /** Payload to increase message size. */
  payload: Payload | undefined;
  /**
   * The user the request came from, for verifying authentication was
   * successful when the client expected it.
   */
  username: string;
  /** OAuth scope. */
  oauthScope: string;
  /**
   * Server ID. This must be unique among different server instances,
   * but the same across all RPC's made to a particular server instance.
   */
  serverId: string;
  /** gRPCLB Path. */
  grpclbRouteType: GrpclbRouteType;
  /** Server hostname. */
  hostname: string;
}

/** Client-streaming request. */
export interface StreamingInputCallRequest {
  /** Optional input payload sent along with the request. */
  payload: Payload | undefined;
  /**
   * Whether the server should expect this request to be compressed. This field
   * is "nullable" in order to interoperate seamlessly with servers not able to
   * implement the full compression tests by introspecting the call to verify
   * the request's compression status.
   */
  expectCompressed: BoolValue | undefined;
}

/** Client-streaming response. */
export interface StreamingInputCallResponse {
  /** Aggregated size of payloads received from the client. */
  aggregatedPayloadSize: number;
}

/** Configuration for a particular response. */
export interface ResponseParameters {
  /** Desired payload sizes in responses from the server. */
  size: number;
  /**
   * Desired interval between consecutive responses in the response stream in
   * microseconds.
   */
  intervalUs: number;
  /**
   * Whether to request the server to compress the response. This field is
   * "nullable" in order to interoperate seamlessly with clients not able to
   * implement the full compression tests by introspecting the call to verify
   * the response's compression status.
   */
  compressed: BoolValue | undefined;
}

/** Server-streaming request. */
export interface StreamingOutputCallRequest {
  /**
   * Desired payload type in the response from the server.
   * If response_type is RANDOM, the payload from each response in the stream
   * might be of different types. This is to simulate a mixed type of payload
   * stream.
   */
  responseType: PayloadType;
  /** Configuration for each expected response message. */
  responseParameters: ResponseParameters[];
  /** Optional input payload sent along with the request. */
  payload: Payload | undefined;
  /** Whether server should return a given status */
  responseStatus: EchoStatus | undefined;
}

/** Server-streaming response, as configured by the request and parameters. */
export interface StreamingOutputCallResponse {
  /** Payload to increase response size. */
  payload: Payload | undefined;
}

/**
 * For reconnect interop test only.
 * Client tells server what reconnection parameters it used.
 */
export interface ReconnectParams {
  maxReconnectBackoffMs: number;
}

/**
 * For reconnect interop test only.
 * Server tells client whether its reconnects are following the spec and the
 * reconnect backoffs it saw.
 */
export interface ReconnectInfo {
  passed: boolean;
  backoffMs: number[];
}

export interface LoadBalancerStatsRequest {
  /** Request stats for the next num_rpcs sent by client. */
  numRpcs: number;
  /** If num_rpcs have not completed within timeout_sec, return partial results. */
  timeoutSec: number;
}

export interface LoadBalancerStatsResponse {
  /** The number of completed RPCs for each peer. */
  rpcsByPeer: { [key: string]: number };
  /** The number of RPCs that failed to record a remote peer. */
  numFailures: number;
  rpcsByMethod: { [key: string]: LoadBalancerStatsResponse_RpcsByPeer };
}

export interface LoadBalancerStatsResponse_RpcsByPeer {
  /** The number of completed RPCs for each peer. */
  rpcsByPeer: { [key: string]: number };
}

export interface LoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry {
  key: string;
  value: number;
}

export interface LoadBalancerStatsResponse_RpcsByPeerEntry {
  key: string;
  value: number;
}

export interface LoadBalancerStatsResponse_RpcsByMethodEntry {
  key: string;
  value: LoadBalancerStatsResponse_RpcsByPeer | undefined;
}

/** Request for retrieving a test client's accumulated stats. */
export interface LoadBalancerAccumulatedStatsRequest {}

/** Accumulated stats for RPCs sent by a test client. */
export interface LoadBalancerAccumulatedStatsResponse {
  /**
   * The total number of RPCs have ever issued for each type.
   * Deprecated: use stats_per_method.rpcs_started instead.
   *
   * @deprecated
   */
  numRpcsStartedByMethod: { [key: string]: number };
  /**
   * The total number of RPCs have ever completed successfully for each type.
   * Deprecated: use stats_per_method.result instead.
   *
   * @deprecated
   */
  numRpcsSucceededByMethod: { [key: string]: number };
  /**
   * The total number of RPCs have ever failed for each type.
   * Deprecated: use stats_per_method.result instead.
   *
   * @deprecated
   */
  numRpcsFailedByMethod: { [key: string]: number };
  /**
   * Per-method RPC statistics.  The key is the RpcType in string form; e.g.
   * 'EMPTY_CALL' or 'UNARY_CALL'
   */
  statsPerMethod: {
    [key: string]: LoadBalancerAccumulatedStatsResponse_MethodStats;
  };
}

export interface LoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry {
  key: string;
  value: number;
}

export interface LoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry {
  key: string;
  value: number;
}

export interface LoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry {
  key: string;
  value: number;
}

export interface LoadBalancerAccumulatedStatsResponse_MethodStats {
  /** The number of RPCs that were started for this method. */
  rpcsStarted: number;
  /**
   * The number of RPCs that completed with each status for this method.  The
   * key is the integral value of a google.rpc.Code; the value is the count.
   */
  result: { [key: number]: number };
}

export interface LoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry {
  key: number;
  value: number;
}

export interface LoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry {
  key: string;
  value: LoadBalancerAccumulatedStatsResponse_MethodStats | undefined;
}

/** Configurations for a test client. */
export interface ClientConfigureRequest {
  /** The types of RPCs the client sends. */
  types: ClientConfigureRequest_RpcType[];
  /** The collection of custom metadata to be attached to RPCs sent by the client. */
  metadata: ClientConfigureRequest_Metadata[];
  /**
   * The deadline to use, in seconds, for all RPCs.  If unset or zero, the
   * client will use the default from the command-line.
   */
  timeoutSec: number;
}

/** Type of RPCs to send. */
export enum ClientConfigureRequest_RpcType {
  EMPTY_CALL = 0,
  UNARY_CALL = 1,
  UNRECOGNIZED = -1,
}

export function clientConfigureRequest_RpcTypeFromJSON(
  object: any
): ClientConfigureRequest_RpcType {
  switch (object) {
    case 0:
    case "EMPTY_CALL":
      return ClientConfigureRequest_RpcType.EMPTY_CALL;
    case 1:
    case "UNARY_CALL":
      return ClientConfigureRequest_RpcType.UNARY_CALL;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ClientConfigureRequest_RpcType.UNRECOGNIZED;
  }
}

export function clientConfigureRequest_RpcTypeToJSON(
  object: ClientConfigureRequest_RpcType
): string {
  switch (object) {
    case ClientConfigureRequest_RpcType.EMPTY_CALL:
      return "EMPTY_CALL";
    case ClientConfigureRequest_RpcType.UNARY_CALL:
      return "UNARY_CALL";
    default:
      return "UNKNOWN";
  }
}

/** Metadata to be attached for the given type of RPCs. */
export interface ClientConfigureRequest_Metadata {
  type: ClientConfigureRequest_RpcType;
  key: string;
  value: string;
}

/** Response for updating a test client's configuration. */
export interface ClientConfigureResponse {}

const baseBoolValue: object = { value: false };

export const BoolValue = {
  encode(message: BoolValue, writer: Writer = Writer.create()): Writer {
    if (message.value === true) {
      writer.uint32(8).bool(message.value);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): BoolValue {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseBoolValue } as BoolValue;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.value = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BoolValue {
    const message = { ...baseBoolValue } as BoolValue;
    message.value =
      object.value !== undefined && object.value !== null
        ? Boolean(object.value)
        : false;
    return message;
  },

  toJSON(message: BoolValue): unknown {
    const obj: any = {};
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<BoolValue>): BoolValue {
    const message = { ...baseBoolValue } as BoolValue;
    message.value = object.value ?? false;
    return message;
  },
};

const basePayload: object = { type: 0 };

export const Payload = {
  encode(message: Payload, writer: Writer = Writer.create()): Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.body.length !== 0) {
      writer.uint32(18).bytes(message.body);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Payload {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePayload } as Payload;
    message.body = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.int32() as any;
          break;
        case 2:
          message.body = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Payload {
    const message = { ...basePayload } as Payload;
    message.type =
      object.type !== undefined && object.type !== null
        ? payloadTypeFromJSON(object.type)
        : 0;
    message.body =
      object.body !== undefined && object.body !== null
        ? bytesFromBase64(object.body)
        : new Uint8Array();
    return message;
  },

  toJSON(message: Payload): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = payloadTypeToJSON(message.type));
    message.body !== undefined &&
      (obj.body = base64FromBytes(
        message.body !== undefined ? message.body : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<Payload>): Payload {
    const message = { ...basePayload } as Payload;
    message.type = object.type ?? 0;
    message.body = object.body ?? new Uint8Array();
    return message;
  },
};

const baseEchoStatus: object = { code: 0, message: "" };

export const EchoStatus = {
  encode(message: EchoStatus, writer: Writer = Writer.create()): Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): EchoStatus {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEchoStatus } as EchoStatus;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.code = reader.int32();
          break;
        case 2:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EchoStatus {
    const message = { ...baseEchoStatus } as EchoStatus;
    message.code =
      object.code !== undefined && object.code !== null
        ? Number(object.code)
        : 0;
    message.message =
      object.message !== undefined && object.message !== null
        ? String(object.message)
        : "";
    return message;
  },

  toJSON(message: EchoStatus): unknown {
    const obj: any = {};
    message.code !== undefined && (obj.code = message.code);
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  fromPartial(object: DeepPartial<EchoStatus>): EchoStatus {
    const message = { ...baseEchoStatus } as EchoStatus;
    message.code = object.code ?? 0;
    message.message = object.message ?? "";
    return message;
  },
};

const baseSimpleRequest: object = {
  responseType: 0,
  responseSize: 0,
  fillUsername: false,
  fillOauthScope: false,
  fillServerId: false,
  fillGrpclbRouteType: false,
};

export const SimpleRequest = {
  encode(message: SimpleRequest, writer: Writer = Writer.create()): Writer {
    if (message.responseType !== 0) {
      writer.uint32(8).int32(message.responseType);
    }
    if (message.responseSize !== 0) {
      writer.uint32(16).int32(message.responseSize);
    }
    if (message.payload !== undefined) {
      Payload.encode(message.payload, writer.uint32(26).fork()).ldelim();
    }
    if (message.fillUsername === true) {
      writer.uint32(32).bool(message.fillUsername);
    }
    if (message.fillOauthScope === true) {
      writer.uint32(40).bool(message.fillOauthScope);
    }
    if (message.responseCompressed !== undefined) {
      BoolValue.encode(
        message.responseCompressed,
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.responseStatus !== undefined) {
      EchoStatus.encode(
        message.responseStatus,
        writer.uint32(58).fork()
      ).ldelim();
    }
    if (message.expectCompressed !== undefined) {
      BoolValue.encode(
        message.expectCompressed,
        writer.uint32(66).fork()
      ).ldelim();
    }
    if (message.fillServerId === true) {
      writer.uint32(72).bool(message.fillServerId);
    }
    if (message.fillGrpclbRouteType === true) {
      writer.uint32(80).bool(message.fillGrpclbRouteType);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): SimpleRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSimpleRequest } as SimpleRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.responseType = reader.int32() as any;
          break;
        case 2:
          message.responseSize = reader.int32();
          break;
        case 3:
          message.payload = Payload.decode(reader, reader.uint32());
          break;
        case 4:
          message.fillUsername = reader.bool();
          break;
        case 5:
          message.fillOauthScope = reader.bool();
          break;
        case 6:
          message.responseCompressed = BoolValue.decode(
            reader,
            reader.uint32()
          );
          break;
        case 7:
          message.responseStatus = EchoStatus.decode(reader, reader.uint32());
          break;
        case 8:
          message.expectCompressed = BoolValue.decode(reader, reader.uint32());
          break;
        case 9:
          message.fillServerId = reader.bool();
          break;
        case 10:
          message.fillGrpclbRouteType = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SimpleRequest {
    const message = { ...baseSimpleRequest } as SimpleRequest;
    message.responseType =
      object.responseType !== undefined && object.responseType !== null
        ? payloadTypeFromJSON(object.responseType)
        : 0;
    message.responseSize =
      object.responseSize !== undefined && object.responseSize !== null
        ? Number(object.responseSize)
        : 0;
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? Payload.fromJSON(object.payload)
        : undefined;
    message.fillUsername =
      object.fillUsername !== undefined && object.fillUsername !== null
        ? Boolean(object.fillUsername)
        : false;
    message.fillOauthScope =
      object.fillOauthScope !== undefined && object.fillOauthScope !== null
        ? Boolean(object.fillOauthScope)
        : false;
    message.responseCompressed =
      object.responseCompressed !== undefined &&
      object.responseCompressed !== null
        ? BoolValue.fromJSON(object.responseCompressed)
        : undefined;
    message.responseStatus =
      object.responseStatus !== undefined && object.responseStatus !== null
        ? EchoStatus.fromJSON(object.responseStatus)
        : undefined;
    message.expectCompressed =
      object.expectCompressed !== undefined && object.expectCompressed !== null
        ? BoolValue.fromJSON(object.expectCompressed)
        : undefined;
    message.fillServerId =
      object.fillServerId !== undefined && object.fillServerId !== null
        ? Boolean(object.fillServerId)
        : false;
    message.fillGrpclbRouteType =
      object.fillGrpclbRouteType !== undefined &&
      object.fillGrpclbRouteType !== null
        ? Boolean(object.fillGrpclbRouteType)
        : false;
    return message;
  },

  toJSON(message: SimpleRequest): unknown {
    const obj: any = {};
    message.responseType !== undefined &&
      (obj.responseType = payloadTypeToJSON(message.responseType));
    message.responseSize !== undefined &&
      (obj.responseSize = message.responseSize);
    message.payload !== undefined &&
      (obj.payload = message.payload
        ? Payload.toJSON(message.payload)
        : undefined);
    message.fillUsername !== undefined &&
      (obj.fillUsername = message.fillUsername);
    message.fillOauthScope !== undefined &&
      (obj.fillOauthScope = message.fillOauthScope);
    message.responseCompressed !== undefined &&
      (obj.responseCompressed = message.responseCompressed
        ? BoolValue.toJSON(message.responseCompressed)
        : undefined);
    message.responseStatus !== undefined &&
      (obj.responseStatus = message.responseStatus
        ? EchoStatus.toJSON(message.responseStatus)
        : undefined);
    message.expectCompressed !== undefined &&
      (obj.expectCompressed = message.expectCompressed
        ? BoolValue.toJSON(message.expectCompressed)
        : undefined);
    message.fillServerId !== undefined &&
      (obj.fillServerId = message.fillServerId);
    message.fillGrpclbRouteType !== undefined &&
      (obj.fillGrpclbRouteType = message.fillGrpclbRouteType);
    return obj;
  },

  fromPartial(object: DeepPartial<SimpleRequest>): SimpleRequest {
    const message = { ...baseSimpleRequest } as SimpleRequest;
    message.responseType = object.responseType ?? 0;
    message.responseSize = object.responseSize ?? 0;
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? Payload.fromPartial(object.payload)
        : undefined;
    message.fillUsername = object.fillUsername ?? false;
    message.fillOauthScope = object.fillOauthScope ?? false;
    message.responseCompressed =
      object.responseCompressed !== undefined &&
      object.responseCompressed !== null
        ? BoolValue.fromPartial(object.responseCompressed)
        : undefined;
    message.responseStatus =
      object.responseStatus !== undefined && object.responseStatus !== null
        ? EchoStatus.fromPartial(object.responseStatus)
        : undefined;
    message.expectCompressed =
      object.expectCompressed !== undefined && object.expectCompressed !== null
        ? BoolValue.fromPartial(object.expectCompressed)
        : undefined;
    message.fillServerId = object.fillServerId ?? false;
    message.fillGrpclbRouteType = object.fillGrpclbRouteType ?? false;
    return message;
  },
};

const baseSimpleResponse: object = {
  username: "",
  oauthScope: "",
  serverId: "",
  grpclbRouteType: 0,
  hostname: "",
};

export const SimpleResponse = {
  encode(message: SimpleResponse, writer: Writer = Writer.create()): Writer {
    if (message.payload !== undefined) {
      Payload.encode(message.payload, writer.uint32(10).fork()).ldelim();
    }
    if (message.username !== "") {
      writer.uint32(18).string(message.username);
    }
    if (message.oauthScope !== "") {
      writer.uint32(26).string(message.oauthScope);
    }
    if (message.serverId !== "") {
      writer.uint32(34).string(message.serverId);
    }
    if (message.grpclbRouteType !== 0) {
      writer.uint32(40).int32(message.grpclbRouteType);
    }
    if (message.hostname !== "") {
      writer.uint32(50).string(message.hostname);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): SimpleResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSimpleResponse } as SimpleResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.payload = Payload.decode(reader, reader.uint32());
          break;
        case 2:
          message.username = reader.string();
          break;
        case 3:
          message.oauthScope = reader.string();
          break;
        case 4:
          message.serverId = reader.string();
          break;
        case 5:
          message.grpclbRouteType = reader.int32() as any;
          break;
        case 6:
          message.hostname = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SimpleResponse {
    const message = { ...baseSimpleResponse } as SimpleResponse;
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? Payload.fromJSON(object.payload)
        : undefined;
    message.username =
      object.username !== undefined && object.username !== null
        ? String(object.username)
        : "";
    message.oauthScope =
      object.oauthScope !== undefined && object.oauthScope !== null
        ? String(object.oauthScope)
        : "";
    message.serverId =
      object.serverId !== undefined && object.serverId !== null
        ? String(object.serverId)
        : "";
    message.grpclbRouteType =
      object.grpclbRouteType !== undefined && object.grpclbRouteType !== null
        ? grpclbRouteTypeFromJSON(object.grpclbRouteType)
        : 0;
    message.hostname =
      object.hostname !== undefined && object.hostname !== null
        ? String(object.hostname)
        : "";
    return message;
  },

  toJSON(message: SimpleResponse): unknown {
    const obj: any = {};
    message.payload !== undefined &&
      (obj.payload = message.payload
        ? Payload.toJSON(message.payload)
        : undefined);
    message.username !== undefined && (obj.username = message.username);
    message.oauthScope !== undefined && (obj.oauthScope = message.oauthScope);
    message.serverId !== undefined && (obj.serverId = message.serverId);
    message.grpclbRouteType !== undefined &&
      (obj.grpclbRouteType = grpclbRouteTypeToJSON(message.grpclbRouteType));
    message.hostname !== undefined && (obj.hostname = message.hostname);
    return obj;
  },

  fromPartial(object: DeepPartial<SimpleResponse>): SimpleResponse {
    const message = { ...baseSimpleResponse } as SimpleResponse;
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? Payload.fromPartial(object.payload)
        : undefined;
    message.username = object.username ?? "";
    message.oauthScope = object.oauthScope ?? "";
    message.serverId = object.serverId ?? "";
    message.grpclbRouteType = object.grpclbRouteType ?? 0;
    message.hostname = object.hostname ?? "";
    return message;
  },
};

const baseStreamingInputCallRequest: object = {};

export const StreamingInputCallRequest = {
  encode(
    message: StreamingInputCallRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.payload !== undefined) {
      Payload.encode(message.payload, writer.uint32(10).fork()).ldelim();
    }
    if (message.expectCompressed !== undefined) {
      BoolValue.encode(
        message.expectCompressed,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): StreamingInputCallRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseStreamingInputCallRequest,
    } as StreamingInputCallRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.payload = Payload.decode(reader, reader.uint32());
          break;
        case 2:
          message.expectCompressed = BoolValue.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StreamingInputCallRequest {
    const message = {
      ...baseStreamingInputCallRequest,
    } as StreamingInputCallRequest;
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? Payload.fromJSON(object.payload)
        : undefined;
    message.expectCompressed =
      object.expectCompressed !== undefined && object.expectCompressed !== null
        ? BoolValue.fromJSON(object.expectCompressed)
        : undefined;
    return message;
  },

  toJSON(message: StreamingInputCallRequest): unknown {
    const obj: any = {};
    message.payload !== undefined &&
      (obj.payload = message.payload
        ? Payload.toJSON(message.payload)
        : undefined);
    message.expectCompressed !== undefined &&
      (obj.expectCompressed = message.expectCompressed
        ? BoolValue.toJSON(message.expectCompressed)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<StreamingInputCallRequest>
  ): StreamingInputCallRequest {
    const message = {
      ...baseStreamingInputCallRequest,
    } as StreamingInputCallRequest;
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? Payload.fromPartial(object.payload)
        : undefined;
    message.expectCompressed =
      object.expectCompressed !== undefined && object.expectCompressed !== null
        ? BoolValue.fromPartial(object.expectCompressed)
        : undefined;
    return message;
  },
};

const baseStreamingInputCallResponse: object = { aggregatedPayloadSize: 0 };

export const StreamingInputCallResponse = {
  encode(
    message: StreamingInputCallResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.aggregatedPayloadSize !== 0) {
      writer.uint32(8).int32(message.aggregatedPayloadSize);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): StreamingInputCallResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseStreamingInputCallResponse,
    } as StreamingInputCallResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.aggregatedPayloadSize = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StreamingInputCallResponse {
    const message = {
      ...baseStreamingInputCallResponse,
    } as StreamingInputCallResponse;
    message.aggregatedPayloadSize =
      object.aggregatedPayloadSize !== undefined &&
      object.aggregatedPayloadSize !== null
        ? Number(object.aggregatedPayloadSize)
        : 0;
    return message;
  },

  toJSON(message: StreamingInputCallResponse): unknown {
    const obj: any = {};
    message.aggregatedPayloadSize !== undefined &&
      (obj.aggregatedPayloadSize = message.aggregatedPayloadSize);
    return obj;
  },

  fromPartial(
    object: DeepPartial<StreamingInputCallResponse>
  ): StreamingInputCallResponse {
    const message = {
      ...baseStreamingInputCallResponse,
    } as StreamingInputCallResponse;
    message.aggregatedPayloadSize = object.aggregatedPayloadSize ?? 0;
    return message;
  },
};

const baseResponseParameters: object = { size: 0, intervalUs: 0 };

export const ResponseParameters = {
  encode(
    message: ResponseParameters,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.size !== 0) {
      writer.uint32(8).int32(message.size);
    }
    if (message.intervalUs !== 0) {
      writer.uint32(16).int32(message.intervalUs);
    }
    if (message.compressed !== undefined) {
      BoolValue.encode(message.compressed, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ResponseParameters {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseResponseParameters } as ResponseParameters;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.size = reader.int32();
          break;
        case 2:
          message.intervalUs = reader.int32();
          break;
        case 3:
          message.compressed = BoolValue.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ResponseParameters {
    const message = { ...baseResponseParameters } as ResponseParameters;
    message.size =
      object.size !== undefined && object.size !== null
        ? Number(object.size)
        : 0;
    message.intervalUs =
      object.intervalUs !== undefined && object.intervalUs !== null
        ? Number(object.intervalUs)
        : 0;
    message.compressed =
      object.compressed !== undefined && object.compressed !== null
        ? BoolValue.fromJSON(object.compressed)
        : undefined;
    return message;
  },

  toJSON(message: ResponseParameters): unknown {
    const obj: any = {};
    message.size !== undefined && (obj.size = message.size);
    message.intervalUs !== undefined && (obj.intervalUs = message.intervalUs);
    message.compressed !== undefined &&
      (obj.compressed = message.compressed
        ? BoolValue.toJSON(message.compressed)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ResponseParameters>): ResponseParameters {
    const message = { ...baseResponseParameters } as ResponseParameters;
    message.size = object.size ?? 0;
    message.intervalUs = object.intervalUs ?? 0;
    message.compressed =
      object.compressed !== undefined && object.compressed !== null
        ? BoolValue.fromPartial(object.compressed)
        : undefined;
    return message;
  },
};

const baseStreamingOutputCallRequest: object = { responseType: 0 };

export const StreamingOutputCallRequest = {
  encode(
    message: StreamingOutputCallRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.responseType !== 0) {
      writer.uint32(8).int32(message.responseType);
    }
    for (const v of message.responseParameters) {
      ResponseParameters.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.payload !== undefined) {
      Payload.encode(message.payload, writer.uint32(26).fork()).ldelim();
    }
    if (message.responseStatus !== undefined) {
      EchoStatus.encode(
        message.responseStatus,
        writer.uint32(58).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): StreamingOutputCallRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseStreamingOutputCallRequest,
    } as StreamingOutputCallRequest;
    message.responseParameters = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.responseType = reader.int32() as any;
          break;
        case 2:
          message.responseParameters.push(
            ResponseParameters.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.payload = Payload.decode(reader, reader.uint32());
          break;
        case 7:
          message.responseStatus = EchoStatus.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StreamingOutputCallRequest {
    const message = {
      ...baseStreamingOutputCallRequest,
    } as StreamingOutputCallRequest;
    message.responseType =
      object.responseType !== undefined && object.responseType !== null
        ? payloadTypeFromJSON(object.responseType)
        : 0;
    message.responseParameters = (object.responseParameters ?? []).map(
      (e: any) => ResponseParameters.fromJSON(e)
    );
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? Payload.fromJSON(object.payload)
        : undefined;
    message.responseStatus =
      object.responseStatus !== undefined && object.responseStatus !== null
        ? EchoStatus.fromJSON(object.responseStatus)
        : undefined;
    return message;
  },

  toJSON(message: StreamingOutputCallRequest): unknown {
    const obj: any = {};
    message.responseType !== undefined &&
      (obj.responseType = payloadTypeToJSON(message.responseType));
    if (message.responseParameters) {
      obj.responseParameters = message.responseParameters.map((e) =>
        e ? ResponseParameters.toJSON(e) : undefined
      );
    } else {
      obj.responseParameters = [];
    }
    message.payload !== undefined &&
      (obj.payload = message.payload
        ? Payload.toJSON(message.payload)
        : undefined);
    message.responseStatus !== undefined &&
      (obj.responseStatus = message.responseStatus
        ? EchoStatus.toJSON(message.responseStatus)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<StreamingOutputCallRequest>
  ): StreamingOutputCallRequest {
    const message = {
      ...baseStreamingOutputCallRequest,
    } as StreamingOutputCallRequest;
    message.responseType = object.responseType ?? 0;
    message.responseParameters = (object.responseParameters ?? []).map((e) =>
      ResponseParameters.fromPartial(e)
    );
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? Payload.fromPartial(object.payload)
        : undefined;
    message.responseStatus =
      object.responseStatus !== undefined && object.responseStatus !== null
        ? EchoStatus.fromPartial(object.responseStatus)
        : undefined;
    return message;
  },
};

const baseStreamingOutputCallResponse: object = {};

export const StreamingOutputCallResponse = {
  encode(
    message: StreamingOutputCallResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.payload !== undefined) {
      Payload.encode(message.payload, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): StreamingOutputCallResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseStreamingOutputCallResponse,
    } as StreamingOutputCallResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.payload = Payload.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StreamingOutputCallResponse {
    const message = {
      ...baseStreamingOutputCallResponse,
    } as StreamingOutputCallResponse;
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? Payload.fromJSON(object.payload)
        : undefined;
    return message;
  },

  toJSON(message: StreamingOutputCallResponse): unknown {
    const obj: any = {};
    message.payload !== undefined &&
      (obj.payload = message.payload
        ? Payload.toJSON(message.payload)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<StreamingOutputCallResponse>
  ): StreamingOutputCallResponse {
    const message = {
      ...baseStreamingOutputCallResponse,
    } as StreamingOutputCallResponse;
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? Payload.fromPartial(object.payload)
        : undefined;
    return message;
  },
};

const baseReconnectParams: object = { maxReconnectBackoffMs: 0 };

export const ReconnectParams = {
  encode(message: ReconnectParams, writer: Writer = Writer.create()): Writer {
    if (message.maxReconnectBackoffMs !== 0) {
      writer.uint32(8).int32(message.maxReconnectBackoffMs);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ReconnectParams {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseReconnectParams } as ReconnectParams;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.maxReconnectBackoffMs = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReconnectParams {
    const message = { ...baseReconnectParams } as ReconnectParams;
    message.maxReconnectBackoffMs =
      object.maxReconnectBackoffMs !== undefined &&
      object.maxReconnectBackoffMs !== null
        ? Number(object.maxReconnectBackoffMs)
        : 0;
    return message;
  },

  toJSON(message: ReconnectParams): unknown {
    const obj: any = {};
    message.maxReconnectBackoffMs !== undefined &&
      (obj.maxReconnectBackoffMs = message.maxReconnectBackoffMs);
    return obj;
  },

  fromPartial(object: DeepPartial<ReconnectParams>): ReconnectParams {
    const message = { ...baseReconnectParams } as ReconnectParams;
    message.maxReconnectBackoffMs = object.maxReconnectBackoffMs ?? 0;
    return message;
  },
};

const baseReconnectInfo: object = { passed: false, backoffMs: 0 };

export const ReconnectInfo = {
  encode(message: ReconnectInfo, writer: Writer = Writer.create()): Writer {
    if (message.passed === true) {
      writer.uint32(8).bool(message.passed);
    }
    writer.uint32(18).fork();
    for (const v of message.backoffMs) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ReconnectInfo {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseReconnectInfo } as ReconnectInfo;
    message.backoffMs = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.passed = reader.bool();
          break;
        case 2:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.backoffMs.push(reader.int32());
            }
          } else {
            message.backoffMs.push(reader.int32());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReconnectInfo {
    const message = { ...baseReconnectInfo } as ReconnectInfo;
    message.passed =
      object.passed !== undefined && object.passed !== null
        ? Boolean(object.passed)
        : false;
    message.backoffMs = (object.backoffMs ?? []).map((e: any) => Number(e));
    return message;
  },

  toJSON(message: ReconnectInfo): unknown {
    const obj: any = {};
    message.passed !== undefined && (obj.passed = message.passed);
    if (message.backoffMs) {
      obj.backoffMs = message.backoffMs.map((e) => e);
    } else {
      obj.backoffMs = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ReconnectInfo>): ReconnectInfo {
    const message = { ...baseReconnectInfo } as ReconnectInfo;
    message.passed = object.passed ?? false;
    message.backoffMs = (object.backoffMs ?? []).map((e) => e);
    return message;
  },
};

const baseLoadBalancerStatsRequest: object = { numRpcs: 0, timeoutSec: 0 };

export const LoadBalancerStatsRequest = {
  encode(
    message: LoadBalancerStatsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.numRpcs !== 0) {
      writer.uint32(8).int32(message.numRpcs);
    }
    if (message.timeoutSec !== 0) {
      writer.uint32(16).int32(message.timeoutSec);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): LoadBalancerStatsRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLoadBalancerStatsRequest,
    } as LoadBalancerStatsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.numRpcs = reader.int32();
          break;
        case 2:
          message.timeoutSec = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoadBalancerStatsRequest {
    const message = {
      ...baseLoadBalancerStatsRequest,
    } as LoadBalancerStatsRequest;
    message.numRpcs =
      object.numRpcs !== undefined && object.numRpcs !== null
        ? Number(object.numRpcs)
        : 0;
    message.timeoutSec =
      object.timeoutSec !== undefined && object.timeoutSec !== null
        ? Number(object.timeoutSec)
        : 0;
    return message;
  },

  toJSON(message: LoadBalancerStatsRequest): unknown {
    const obj: any = {};
    message.numRpcs !== undefined && (obj.numRpcs = message.numRpcs);
    message.timeoutSec !== undefined && (obj.timeoutSec = message.timeoutSec);
    return obj;
  },

  fromPartial(
    object: DeepPartial<LoadBalancerStatsRequest>
  ): LoadBalancerStatsRequest {
    const message = {
      ...baseLoadBalancerStatsRequest,
    } as LoadBalancerStatsRequest;
    message.numRpcs = object.numRpcs ?? 0;
    message.timeoutSec = object.timeoutSec ?? 0;
    return message;
  },
};

const baseLoadBalancerStatsResponse: object = { numFailures: 0 };

export const LoadBalancerStatsResponse = {
  encode(
    message: LoadBalancerStatsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    Object.entries(message.rpcsByPeer).forEach(([key, value]) => {
      LoadBalancerStatsResponse_RpcsByPeerEntry.encode(
        { key: key as any, value },
        writer.uint32(10).fork()
      ).ldelim();
    });
    if (message.numFailures !== 0) {
      writer.uint32(16).int32(message.numFailures);
    }
    Object.entries(message.rpcsByMethod).forEach(([key, value]) => {
      LoadBalancerStatsResponse_RpcsByMethodEntry.encode(
        { key: key as any, value },
        writer.uint32(26).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): LoadBalancerStatsResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLoadBalancerStatsResponse,
    } as LoadBalancerStatsResponse;
    message.rpcsByPeer = {};
    message.rpcsByMethod = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 = LoadBalancerStatsResponse_RpcsByPeerEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry1.value !== undefined) {
            message.rpcsByPeer[entry1.key] = entry1.value;
          }
          break;
        case 2:
          message.numFailures = reader.int32();
          break;
        case 3:
          const entry3 = LoadBalancerStatsResponse_RpcsByMethodEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry3.value !== undefined) {
            message.rpcsByMethod[entry3.key] = entry3.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoadBalancerStatsResponse {
    const message = {
      ...baseLoadBalancerStatsResponse,
    } as LoadBalancerStatsResponse;
    message.rpcsByPeer = Object.entries(object.rpcsByPeer ?? {}).reduce<{
      [key: string]: number;
    }>((acc, [key, value]) => {
      acc[key] = Number(value);
      return acc;
    }, {});
    message.numFailures =
      object.numFailures !== undefined && object.numFailures !== null
        ? Number(object.numFailures)
        : 0;
    message.rpcsByMethod = Object.entries(object.rpcsByMethod ?? {}).reduce<{
      [key: string]: LoadBalancerStatsResponse_RpcsByPeer;
    }>((acc, [key, value]) => {
      acc[key] = LoadBalancerStatsResponse_RpcsByPeer.fromJSON(value);
      return acc;
    }, {});
    return message;
  },

  toJSON(message: LoadBalancerStatsResponse): unknown {
    const obj: any = {};
    obj.rpcsByPeer = {};
    if (message.rpcsByPeer) {
      Object.entries(message.rpcsByPeer).forEach(([k, v]) => {
        obj.rpcsByPeer[k] = v;
      });
    }
    message.numFailures !== undefined &&
      (obj.numFailures = message.numFailures);
    obj.rpcsByMethod = {};
    if (message.rpcsByMethod) {
      Object.entries(message.rpcsByMethod).forEach(([k, v]) => {
        obj.rpcsByMethod[k] = LoadBalancerStatsResponse_RpcsByPeer.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<LoadBalancerStatsResponse>
  ): LoadBalancerStatsResponse {
    const message = {
      ...baseLoadBalancerStatsResponse,
    } as LoadBalancerStatsResponse;
    message.rpcsByPeer = Object.entries(object.rpcsByPeer ?? {}).reduce<{
      [key: string]: number;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Number(value);
      }
      return acc;
    }, {});
    message.numFailures = object.numFailures ?? 0;
    message.rpcsByMethod = Object.entries(object.rpcsByMethod ?? {}).reduce<{
      [key: string]: LoadBalancerStatsResponse_RpcsByPeer;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = LoadBalancerStatsResponse_RpcsByPeer.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

const baseLoadBalancerStatsResponse_RpcsByPeer: object = {};

export const LoadBalancerStatsResponse_RpcsByPeer = {
  encode(
    message: LoadBalancerStatsResponse_RpcsByPeer,
    writer: Writer = Writer.create()
  ): Writer {
    Object.entries(message.rpcsByPeer).forEach(([key, value]) => {
      LoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry.encode(
        { key: key as any, value },
        writer.uint32(10).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): LoadBalancerStatsResponse_RpcsByPeer {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLoadBalancerStatsResponse_RpcsByPeer,
    } as LoadBalancerStatsResponse_RpcsByPeer;
    message.rpcsByPeer = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 =
            LoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry.decode(
              reader,
              reader.uint32()
            );
          if (entry1.value !== undefined) {
            message.rpcsByPeer[entry1.key] = entry1.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoadBalancerStatsResponse_RpcsByPeer {
    const message = {
      ...baseLoadBalancerStatsResponse_RpcsByPeer,
    } as LoadBalancerStatsResponse_RpcsByPeer;
    message.rpcsByPeer = Object.entries(object.rpcsByPeer ?? {}).reduce<{
      [key: string]: number;
    }>((acc, [key, value]) => {
      acc[key] = Number(value);
      return acc;
    }, {});
    return message;
  },

  toJSON(message: LoadBalancerStatsResponse_RpcsByPeer): unknown {
    const obj: any = {};
    obj.rpcsByPeer = {};
    if (message.rpcsByPeer) {
      Object.entries(message.rpcsByPeer).forEach(([k, v]) => {
        obj.rpcsByPeer[k] = v;
      });
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<LoadBalancerStatsResponse_RpcsByPeer>
  ): LoadBalancerStatsResponse_RpcsByPeer {
    const message = {
      ...baseLoadBalancerStatsResponse_RpcsByPeer,
    } as LoadBalancerStatsResponse_RpcsByPeer;
    message.rpcsByPeer = Object.entries(object.rpcsByPeer ?? {}).reduce<{
      [key: string]: number;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Number(value);
      }
      return acc;
    }, {});
    return message;
  },
};

const baseLoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry: object = {
  key: "",
  value: 0,
};

export const LoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry = {
  encode(
    message: LoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(16).int32(message.value);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): LoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry,
    } as LoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry {
    const message = {
      ...baseLoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry,
    } as LoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry;
    message.key =
      object.key !== undefined && object.key !== null ? String(object.key) : "";
    message.value =
      object.value !== undefined && object.value !== null
        ? Number(object.value)
        : 0;
    return message;
  },

  toJSON(
    message: LoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry
  ): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<LoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry>
  ): LoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry {
    const message = {
      ...baseLoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry,
    } as LoadBalancerStatsResponse_RpcsByPeer_RpcsByPeerEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? 0;
    return message;
  },
};

const baseLoadBalancerStatsResponse_RpcsByPeerEntry: object = {
  key: "",
  value: 0,
};

export const LoadBalancerStatsResponse_RpcsByPeerEntry = {
  encode(
    message: LoadBalancerStatsResponse_RpcsByPeerEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(16).int32(message.value);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): LoadBalancerStatsResponse_RpcsByPeerEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLoadBalancerStatsResponse_RpcsByPeerEntry,
    } as LoadBalancerStatsResponse_RpcsByPeerEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoadBalancerStatsResponse_RpcsByPeerEntry {
    const message = {
      ...baseLoadBalancerStatsResponse_RpcsByPeerEntry,
    } as LoadBalancerStatsResponse_RpcsByPeerEntry;
    message.key =
      object.key !== undefined && object.key !== null ? String(object.key) : "";
    message.value =
      object.value !== undefined && object.value !== null
        ? Number(object.value)
        : 0;
    return message;
  },

  toJSON(message: LoadBalancerStatsResponse_RpcsByPeerEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<LoadBalancerStatsResponse_RpcsByPeerEntry>
  ): LoadBalancerStatsResponse_RpcsByPeerEntry {
    const message = {
      ...baseLoadBalancerStatsResponse_RpcsByPeerEntry,
    } as LoadBalancerStatsResponse_RpcsByPeerEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? 0;
    return message;
  },
};

const baseLoadBalancerStatsResponse_RpcsByMethodEntry: object = { key: "" };

export const LoadBalancerStatsResponse_RpcsByMethodEntry = {
  encode(
    message: LoadBalancerStatsResponse_RpcsByMethodEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      LoadBalancerStatsResponse_RpcsByPeer.encode(
        message.value,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): LoadBalancerStatsResponse_RpcsByMethodEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLoadBalancerStatsResponse_RpcsByMethodEntry,
    } as LoadBalancerStatsResponse_RpcsByMethodEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = LoadBalancerStatsResponse_RpcsByPeer.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoadBalancerStatsResponse_RpcsByMethodEntry {
    const message = {
      ...baseLoadBalancerStatsResponse_RpcsByMethodEntry,
    } as LoadBalancerStatsResponse_RpcsByMethodEntry;
    message.key =
      object.key !== undefined && object.key !== null ? String(object.key) : "";
    message.value =
      object.value !== undefined && object.value !== null
        ? LoadBalancerStatsResponse_RpcsByPeer.fromJSON(object.value)
        : undefined;
    return message;
  },

  toJSON(message: LoadBalancerStatsResponse_RpcsByMethodEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value
        ? LoadBalancerStatsResponse_RpcsByPeer.toJSON(message.value)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<LoadBalancerStatsResponse_RpcsByMethodEntry>
  ): LoadBalancerStatsResponse_RpcsByMethodEntry {
    const message = {
      ...baseLoadBalancerStatsResponse_RpcsByMethodEntry,
    } as LoadBalancerStatsResponse_RpcsByMethodEntry;
    message.key = object.key ?? "";
    message.value =
      object.value !== undefined && object.value !== null
        ? LoadBalancerStatsResponse_RpcsByPeer.fromPartial(object.value)
        : undefined;
    return message;
  },
};

const baseLoadBalancerAccumulatedStatsRequest: object = {};

export const LoadBalancerAccumulatedStatsRequest = {
  encode(
    _: LoadBalancerAccumulatedStatsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): LoadBalancerAccumulatedStatsRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLoadBalancerAccumulatedStatsRequest,
    } as LoadBalancerAccumulatedStatsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): LoadBalancerAccumulatedStatsRequest {
    const message = {
      ...baseLoadBalancerAccumulatedStatsRequest,
    } as LoadBalancerAccumulatedStatsRequest;
    return message;
  },

  toJSON(_: LoadBalancerAccumulatedStatsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<LoadBalancerAccumulatedStatsRequest>
  ): LoadBalancerAccumulatedStatsRequest {
    const message = {
      ...baseLoadBalancerAccumulatedStatsRequest,
    } as LoadBalancerAccumulatedStatsRequest;
    return message;
  },
};

const baseLoadBalancerAccumulatedStatsResponse: object = {};

export const LoadBalancerAccumulatedStatsResponse = {
  encode(
    message: LoadBalancerAccumulatedStatsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    Object.entries(message.numRpcsStartedByMethod).forEach(([key, value]) => {
      LoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry.encode(
        { key: key as any, value },
        writer.uint32(10).fork()
      ).ldelim();
    });
    Object.entries(message.numRpcsSucceededByMethod).forEach(([key, value]) => {
      LoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry.encode(
        { key: key as any, value },
        writer.uint32(18).fork()
      ).ldelim();
    });
    Object.entries(message.numRpcsFailedByMethod).forEach(([key, value]) => {
      LoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry.encode(
        { key: key as any, value },
        writer.uint32(26).fork()
      ).ldelim();
    });
    Object.entries(message.statsPerMethod).forEach(([key, value]) => {
      LoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry.encode(
        { key: key as any, value },
        writer.uint32(34).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): LoadBalancerAccumulatedStatsResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLoadBalancerAccumulatedStatsResponse,
    } as LoadBalancerAccumulatedStatsResponse;
    message.numRpcsStartedByMethod = {};
    message.numRpcsSucceededByMethod = {};
    message.numRpcsFailedByMethod = {};
    message.statsPerMethod = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 =
            LoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry.decode(
              reader,
              reader.uint32()
            );
          if (entry1.value !== undefined) {
            message.numRpcsStartedByMethod[entry1.key] = entry1.value;
          }
          break;
        case 2:
          const entry2 =
            LoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry.decode(
              reader,
              reader.uint32()
            );
          if (entry2.value !== undefined) {
            message.numRpcsSucceededByMethod[entry2.key] = entry2.value;
          }
          break;
        case 3:
          const entry3 =
            LoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry.decode(
              reader,
              reader.uint32()
            );
          if (entry3.value !== undefined) {
            message.numRpcsFailedByMethod[entry3.key] = entry3.value;
          }
          break;
        case 4:
          const entry4 =
            LoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry.decode(
              reader,
              reader.uint32()
            );
          if (entry4.value !== undefined) {
            message.statsPerMethod[entry4.key] = entry4.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoadBalancerAccumulatedStatsResponse {
    const message = {
      ...baseLoadBalancerAccumulatedStatsResponse,
    } as LoadBalancerAccumulatedStatsResponse;
    message.numRpcsStartedByMethod = Object.entries(
      object.numRpcsStartedByMethod ?? {}
    ).reduce<{ [key: string]: number }>((acc, [key, value]) => {
      acc[key] = Number(value);
      return acc;
    }, {});
    message.numRpcsSucceededByMethod = Object.entries(
      object.numRpcsSucceededByMethod ?? {}
    ).reduce<{ [key: string]: number }>((acc, [key, value]) => {
      acc[key] = Number(value);
      return acc;
    }, {});
    message.numRpcsFailedByMethod = Object.entries(
      object.numRpcsFailedByMethod ?? {}
    ).reduce<{ [key: string]: number }>((acc, [key, value]) => {
      acc[key] = Number(value);
      return acc;
    }, {});
    message.statsPerMethod = Object.entries(
      object.statsPerMethod ?? {}
    ).reduce<{
      [key: string]: LoadBalancerAccumulatedStatsResponse_MethodStats;
    }>((acc, [key, value]) => {
      acc[key] =
        LoadBalancerAccumulatedStatsResponse_MethodStats.fromJSON(value);
      return acc;
    }, {});
    return message;
  },

  toJSON(message: LoadBalancerAccumulatedStatsResponse): unknown {
    const obj: any = {};
    obj.numRpcsStartedByMethod = {};
    if (message.numRpcsStartedByMethod) {
      Object.entries(message.numRpcsStartedByMethod).forEach(([k, v]) => {
        obj.numRpcsStartedByMethod[k] = v;
      });
    }
    obj.numRpcsSucceededByMethod = {};
    if (message.numRpcsSucceededByMethod) {
      Object.entries(message.numRpcsSucceededByMethod).forEach(([k, v]) => {
        obj.numRpcsSucceededByMethod[k] = v;
      });
    }
    obj.numRpcsFailedByMethod = {};
    if (message.numRpcsFailedByMethod) {
      Object.entries(message.numRpcsFailedByMethod).forEach(([k, v]) => {
        obj.numRpcsFailedByMethod[k] = v;
      });
    }
    obj.statsPerMethod = {};
    if (message.statsPerMethod) {
      Object.entries(message.statsPerMethod).forEach(([k, v]) => {
        obj.statsPerMethod[k] =
          LoadBalancerAccumulatedStatsResponse_MethodStats.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<LoadBalancerAccumulatedStatsResponse>
  ): LoadBalancerAccumulatedStatsResponse {
    const message = {
      ...baseLoadBalancerAccumulatedStatsResponse,
    } as LoadBalancerAccumulatedStatsResponse;
    message.numRpcsStartedByMethod = Object.entries(
      object.numRpcsStartedByMethod ?? {}
    ).reduce<{ [key: string]: number }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Number(value);
      }
      return acc;
    }, {});
    message.numRpcsSucceededByMethod = Object.entries(
      object.numRpcsSucceededByMethod ?? {}
    ).reduce<{ [key: string]: number }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Number(value);
      }
      return acc;
    }, {});
    message.numRpcsFailedByMethod = Object.entries(
      object.numRpcsFailedByMethod ?? {}
    ).reduce<{ [key: string]: number }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Number(value);
      }
      return acc;
    }, {});
    message.statsPerMethod = Object.entries(
      object.statsPerMethod ?? {}
    ).reduce<{
      [key: string]: LoadBalancerAccumulatedStatsResponse_MethodStats;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] =
          LoadBalancerAccumulatedStatsResponse_MethodStats.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

const baseLoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry: object =
  { key: "", value: 0 };

export const LoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry =
  {
    encode(
      message: LoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry,
      writer: Writer = Writer.create()
    ): Writer {
      if (message.key !== "") {
        writer.uint32(10).string(message.key);
      }
      if (message.value !== 0) {
        writer.uint32(16).int32(message.value);
      }
      return writer;
    },

    decode(
      input: Reader | Uint8Array,
      length?: number
    ): LoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry {
      const reader = input instanceof Reader ? input : new Reader(input);
      let end = length === undefined ? reader.len : reader.pos + length;
      const message = {
        ...baseLoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry,
      } as LoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry;
      while (reader.pos < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.key = reader.string();
            break;
          case 2:
            message.value = reader.int32();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    },

    fromJSON(
      object: any
    ): LoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry {
      const message = {
        ...baseLoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry,
      } as LoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry;
      message.key =
        object.key !== undefined && object.key !== null
          ? String(object.key)
          : "";
      message.value =
        object.value !== undefined && object.value !== null
          ? Number(object.value)
          : 0;
      return message;
    },

    toJSON(
      message: LoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry
    ): unknown {
      const obj: any = {};
      message.key !== undefined && (obj.key = message.key);
      message.value !== undefined && (obj.value = message.value);
      return obj;
    },

    fromPartial(
      object: DeepPartial<LoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry>
    ): LoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry {
      const message = {
        ...baseLoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry,
      } as LoadBalancerAccumulatedStatsResponse_NumRpcsStartedByMethodEntry;
      message.key = object.key ?? "";
      message.value = object.value ?? 0;
      return message;
    },
  };

const baseLoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry: object =
  { key: "", value: 0 };

export const LoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry =
  {
    encode(
      message: LoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry,
      writer: Writer = Writer.create()
    ): Writer {
      if (message.key !== "") {
        writer.uint32(10).string(message.key);
      }
      if (message.value !== 0) {
        writer.uint32(16).int32(message.value);
      }
      return writer;
    },

    decode(
      input: Reader | Uint8Array,
      length?: number
    ): LoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry {
      const reader = input instanceof Reader ? input : new Reader(input);
      let end = length === undefined ? reader.len : reader.pos + length;
      const message = {
        ...baseLoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry,
      } as LoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry;
      while (reader.pos < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.key = reader.string();
            break;
          case 2:
            message.value = reader.int32();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    },

    fromJSON(
      object: any
    ): LoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry {
      const message = {
        ...baseLoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry,
      } as LoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry;
      message.key =
        object.key !== undefined && object.key !== null
          ? String(object.key)
          : "";
      message.value =
        object.value !== undefined && object.value !== null
          ? Number(object.value)
          : 0;
      return message;
    },

    toJSON(
      message: LoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry
    ): unknown {
      const obj: any = {};
      message.key !== undefined && (obj.key = message.key);
      message.value !== undefined && (obj.value = message.value);
      return obj;
    },

    fromPartial(
      object: DeepPartial<LoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry>
    ): LoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry {
      const message = {
        ...baseLoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry,
      } as LoadBalancerAccumulatedStatsResponse_NumRpcsSucceededByMethodEntry;
      message.key = object.key ?? "";
      message.value = object.value ?? 0;
      return message;
    },
  };

const baseLoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry: object =
  { key: "", value: 0 };

export const LoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry = {
  encode(
    message: LoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(16).int32(message.value);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): LoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry,
    } as LoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(
    object: any
  ): LoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry {
    const message = {
      ...baseLoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry,
    } as LoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry;
    message.key =
      object.key !== undefined && object.key !== null ? String(object.key) : "";
    message.value =
      object.value !== undefined && object.value !== null
        ? Number(object.value)
        : 0;
    return message;
  },

  toJSON(
    message: LoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry
  ): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<LoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry>
  ): LoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry {
    const message = {
      ...baseLoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry,
    } as LoadBalancerAccumulatedStatsResponse_NumRpcsFailedByMethodEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? 0;
    return message;
  },
};

const baseLoadBalancerAccumulatedStatsResponse_MethodStats: object = {
  rpcsStarted: 0,
};

export const LoadBalancerAccumulatedStatsResponse_MethodStats = {
  encode(
    message: LoadBalancerAccumulatedStatsResponse_MethodStats,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.rpcsStarted !== 0) {
      writer.uint32(8).int32(message.rpcsStarted);
    }
    Object.entries(message.result).forEach(([key, value]) => {
      LoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry.encode(
        { key: key as any, value },
        writer.uint32(18).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): LoadBalancerAccumulatedStatsResponse_MethodStats {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLoadBalancerAccumulatedStatsResponse_MethodStats,
    } as LoadBalancerAccumulatedStatsResponse_MethodStats;
    message.result = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rpcsStarted = reader.int32();
          break;
        case 2:
          const entry2 =
            LoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry.decode(
              reader,
              reader.uint32()
            );
          if (entry2.value !== undefined) {
            message.result[entry2.key] = entry2.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoadBalancerAccumulatedStatsResponse_MethodStats {
    const message = {
      ...baseLoadBalancerAccumulatedStatsResponse_MethodStats,
    } as LoadBalancerAccumulatedStatsResponse_MethodStats;
    message.rpcsStarted =
      object.rpcsStarted !== undefined && object.rpcsStarted !== null
        ? Number(object.rpcsStarted)
        : 0;
    message.result = Object.entries(object.result ?? {}).reduce<{
      [key: number]: number;
    }>((acc, [key, value]) => {
      acc[Number(key)] = Number(value);
      return acc;
    }, {});
    return message;
  },

  toJSON(message: LoadBalancerAccumulatedStatsResponse_MethodStats): unknown {
    const obj: any = {};
    message.rpcsStarted !== undefined &&
      (obj.rpcsStarted = message.rpcsStarted);
    obj.result = {};
    if (message.result) {
      Object.entries(message.result).forEach(([k, v]) => {
        obj.result[k] = v;
      });
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<LoadBalancerAccumulatedStatsResponse_MethodStats>
  ): LoadBalancerAccumulatedStatsResponse_MethodStats {
    const message = {
      ...baseLoadBalancerAccumulatedStatsResponse_MethodStats,
    } as LoadBalancerAccumulatedStatsResponse_MethodStats;
    message.rpcsStarted = object.rpcsStarted ?? 0;
    message.result = Object.entries(object.result ?? {}).reduce<{
      [key: number]: number;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[Number(key)] = Number(value);
      }
      return acc;
    }, {});
    return message;
  },
};

const baseLoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry: object =
  { key: 0, value: 0 };

export const LoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry = {
  encode(
    message: LoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== 0) {
      writer.uint32(8).int32(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(16).int32(message.value);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): LoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry,
    } as LoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.int32();
          break;
        case 2:
          message.value = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(
    object: any
  ): LoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry {
    const message = {
      ...baseLoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry,
    } as LoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry;
    message.key =
      object.key !== undefined && object.key !== null ? Number(object.key) : 0;
    message.value =
      object.value !== undefined && object.value !== null
        ? Number(object.value)
        : 0;
    return message;
  },

  toJSON(
    message: LoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry
  ): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<LoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry>
  ): LoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry {
    const message = {
      ...baseLoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry,
    } as LoadBalancerAccumulatedStatsResponse_MethodStats_ResultEntry;
    message.key = object.key ?? 0;
    message.value = object.value ?? 0;
    return message;
  },
};

const baseLoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry: object = {
  key: "",
};

export const LoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry = {
  encode(
    message: LoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      LoadBalancerAccumulatedStatsResponse_MethodStats.encode(
        message.value,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): LoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseLoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry,
    } as LoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value =
            LoadBalancerAccumulatedStatsResponse_MethodStats.decode(
              reader,
              reader.uint32()
            );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(
    object: any
  ): LoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry {
    const message = {
      ...baseLoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry,
    } as LoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry;
    message.key =
      object.key !== undefined && object.key !== null ? String(object.key) : "";
    message.value =
      object.value !== undefined && object.value !== null
        ? LoadBalancerAccumulatedStatsResponse_MethodStats.fromJSON(
            object.value
          )
        : undefined;
    return message;
  },

  toJSON(
    message: LoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry
  ): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value
        ? LoadBalancerAccumulatedStatsResponse_MethodStats.toJSON(message.value)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<LoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry>
  ): LoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry {
    const message = {
      ...baseLoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry,
    } as LoadBalancerAccumulatedStatsResponse_StatsPerMethodEntry;
    message.key = object.key ?? "";
    message.value =
      object.value !== undefined && object.value !== null
        ? LoadBalancerAccumulatedStatsResponse_MethodStats.fromPartial(
            object.value
          )
        : undefined;
    return message;
  },
};

const baseClientConfigureRequest: object = { types: 0, timeoutSec: 0 };

export const ClientConfigureRequest = {
  encode(
    message: ClientConfigureRequest,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(10).fork();
    for (const v of message.types) {
      writer.int32(v);
    }
    writer.ldelim();
    for (const v of message.metadata) {
      ClientConfigureRequest_Metadata.encode(
        v!,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.timeoutSec !== 0) {
      writer.uint32(24).int32(message.timeoutSec);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ClientConfigureRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseClientConfigureRequest } as ClientConfigureRequest;
    message.types = [];
    message.metadata = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.types.push(reader.int32() as any);
            }
          } else {
            message.types.push(reader.int32() as any);
          }
          break;
        case 2:
          message.metadata.push(
            ClientConfigureRequest_Metadata.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.timeoutSec = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ClientConfigureRequest {
    const message = { ...baseClientConfigureRequest } as ClientConfigureRequest;
    message.types = (object.types ?? []).map((e: any) =>
      clientConfigureRequest_RpcTypeFromJSON(e)
    );
    message.metadata = (object.metadata ?? []).map((e: any) =>
      ClientConfigureRequest_Metadata.fromJSON(e)
    );
    message.timeoutSec =
      object.timeoutSec !== undefined && object.timeoutSec !== null
        ? Number(object.timeoutSec)
        : 0;
    return message;
  },

  toJSON(message: ClientConfigureRequest): unknown {
    const obj: any = {};
    if (message.types) {
      obj.types = message.types.map((e) =>
        clientConfigureRequest_RpcTypeToJSON(e)
      );
    } else {
      obj.types = [];
    }
    if (message.metadata) {
      obj.metadata = message.metadata.map((e) =>
        e ? ClientConfigureRequest_Metadata.toJSON(e) : undefined
      );
    } else {
      obj.metadata = [];
    }
    message.timeoutSec !== undefined && (obj.timeoutSec = message.timeoutSec);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ClientConfigureRequest>
  ): ClientConfigureRequest {
    const message = { ...baseClientConfigureRequest } as ClientConfigureRequest;
    message.types = (object.types ?? []).map((e) => e);
    message.metadata = (object.metadata ?? []).map((e) =>
      ClientConfigureRequest_Metadata.fromPartial(e)
    );
    message.timeoutSec = object.timeoutSec ?? 0;
    return message;
  },
};

const baseClientConfigureRequest_Metadata: object = {
  type: 0,
  key: "",
  value: "",
};

export const ClientConfigureRequest_Metadata = {
  encode(
    message: ClientConfigureRequest_Metadata,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.key !== "") {
      writer.uint32(18).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(26).string(message.value);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ClientConfigureRequest_Metadata {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseClientConfigureRequest_Metadata,
    } as ClientConfigureRequest_Metadata;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.int32() as any;
          break;
        case 2:
          message.key = reader.string();
          break;
        case 3:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ClientConfigureRequest_Metadata {
    const message = {
      ...baseClientConfigureRequest_Metadata,
    } as ClientConfigureRequest_Metadata;
    message.type =
      object.type !== undefined && object.type !== null
        ? clientConfigureRequest_RpcTypeFromJSON(object.type)
        : 0;
    message.key =
      object.key !== undefined && object.key !== null ? String(object.key) : "";
    message.value =
      object.value !== undefined && object.value !== null
        ? String(object.value)
        : "";
    return message;
  },

  toJSON(message: ClientConfigureRequest_Metadata): unknown {
    const obj: any = {};
    message.type !== undefined &&
      (obj.type = clientConfigureRequest_RpcTypeToJSON(message.type));
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ClientConfigureRequest_Metadata>
  ): ClientConfigureRequest_Metadata {
    const message = {
      ...baseClientConfigureRequest_Metadata,
    } as ClientConfigureRequest_Metadata;
    message.type = object.type ?? 0;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

const baseClientConfigureResponse: object = {};

export const ClientConfigureResponse = {
  encode(_: ClientConfigureResponse, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ClientConfigureResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseClientConfigureResponse,
    } as ClientConfigureResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): ClientConfigureResponse {
    const message = {
      ...baseClientConfigureResponse,
    } as ClientConfigureResponse;
    return message;
  },

  toJSON(_: ClientConfigureResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<ClientConfigureResponse>
  ): ClientConfigureResponse {
    const message = {
      ...baseClientConfigureResponse,
    } as ClientConfigureResponse;
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte));
  }
  return btoa(bin.join(""));
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Long
  ? string | number | Long
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}

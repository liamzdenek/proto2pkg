/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";

export const protobufPackage = "";

export interface GetBalanceRequest {
  accountId: string;
}

export interface GetBalanceResponse {
  accountId: string;
  balance: Long;
}

const baseGetBalanceRequest: object = { accountId: "" };

export const GetBalanceRequest = {
  encode(message: GetBalanceRequest, writer: Writer = Writer.create()): Writer {
    if (message.accountId !== "") {
      writer.uint32(10).string(message.accountId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GetBalanceRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGetBalanceRequest } as GetBalanceRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accountId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetBalanceRequest {
    const message = { ...baseGetBalanceRequest } as GetBalanceRequest;
    message.accountId =
      object.accountId !== undefined && object.accountId !== null
        ? String(object.accountId)
        : "";
    return message;
  },

  toJSON(message: GetBalanceRequest): unknown {
    const obj: any = {};
    message.accountId !== undefined && (obj.accountId = message.accountId);
    return obj;
  },

  fromPartial(object: DeepPartial<GetBalanceRequest>): GetBalanceRequest {
    const message = { ...baseGetBalanceRequest } as GetBalanceRequest;
    message.accountId = object.accountId ?? "";
    return message;
  },
};

const baseGetBalanceResponse: object = { accountId: "", balance: Long.ZERO };

export const GetBalanceResponse = {
  encode(
    message: GetBalanceResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.accountId !== "") {
      writer.uint32(10).string(message.accountId);
    }
    if (!message.balance.isZero()) {
      writer.uint32(16).sint64(message.balance);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GetBalanceResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGetBalanceResponse } as GetBalanceResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accountId = reader.string();
          break;
        case 2:
          message.balance = reader.sint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetBalanceResponse {
    const message = { ...baseGetBalanceResponse } as GetBalanceResponse;
    message.accountId =
      object.accountId !== undefined && object.accountId !== null
        ? String(object.accountId)
        : "";
    message.balance =
      object.balance !== undefined && object.balance !== null
        ? Long.fromString(object.balance)
        : Long.ZERO;
    return message;
  },

  toJSON(message: GetBalanceResponse): unknown {
    const obj: any = {};
    message.accountId !== undefined && (obj.accountId = message.accountId);
    message.balance !== undefined &&
      (obj.balance = (message.balance || Long.ZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<GetBalanceResponse>): GetBalanceResponse {
    const message = { ...baseGetBalanceResponse } as GetBalanceResponse;
    message.accountId = object.accountId ?? "";
    message.balance =
      object.balance !== undefined && object.balance !== null
        ? Long.fromValue(object.balance)
        : Long.ZERO;
    return message;
  },
};

export interface BankService {
  GetBalance(
    request: DeepPartial<GetBalanceRequest>,
    metadata?: grpc.Metadata
  ): Promise<GetBalanceResponse>;
}

export class BankServiceClientImpl implements BankService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.GetBalance = this.GetBalance.bind(this);
  }

  GetBalance(
    request: DeepPartial<GetBalanceRequest>,
    metadata?: grpc.Metadata
  ): Promise<GetBalanceResponse> {
    return this.rpc.unary(
      BankServiceGetBalanceDesc,
      GetBalanceRequest.fromPartial(request),
      metadata
    );
  }
}

export const BankServiceDesc = {
  serviceName: "BankService",
};

export const BankServiceGetBalanceDesc: UnaryMethodDefinitionish = {
  methodName: "GetBalance",
  service: BankServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetBalanceRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...GetBalanceResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

interface UnaryMethodDefinitionishR
  extends grpc.UnaryMethodDefinition<any, any> {
  requestStream: any;
  responseStream: any;
}

type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;

interface Rpc {
  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    request: any,
    metadata: grpc.Metadata | undefined
  ): Promise<any>;
}

export class GrpcWebImpl {
  private host: string;
  private options: {
    transport?: grpc.TransportFactory;

    debug?: boolean;
    metadata?: grpc.Metadata;
  };

  constructor(
    host: string,
    options: {
      transport?: grpc.TransportFactory;

      debug?: boolean;
      metadata?: grpc.Metadata;
    }
  ) {
    this.host = host;
    this.options = options;
  }

  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined
  ): Promise<any> {
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata =
      metadata && this.options.metadata
        ? new BrowserHeaders({
            ...this.options?.metadata.headersMap,
            ...metadata?.headersMap,
          })
        : metadata || this.options.metadata;
    return new Promise((resolve, reject) => {
      grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: maybeCombinedMetadata,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function (response) {
          if (response.status === grpc.Code.OK) {
            resolve(response.message);
          } else {
            const err = new Error(response.statusMessage) as any;
            err.code = response.status;
            err.metadata = response.trailers;
            reject(err);
          }
        },
      });
    });
  }
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

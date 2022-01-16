/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";

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

export const BankServiceDefinition = {
  name: "BankService",
  fullName: "BankService",
  methods: {
    getBalance: {
      name: "GetBalance",
      requestType: GetBalanceRequest,
      requestStream: false,
      responseType: GetBalanceResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

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

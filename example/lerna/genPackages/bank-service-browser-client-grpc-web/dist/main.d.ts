import { Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";
import { grpc } from "@improbable-eng/grpc-web";
export declare const protobufPackage = "";
export interface GetBalanceRequest {
    accountId: string;
}
export interface GetBalanceResponse {
    accountId: string;
    balance: Long;
}
export declare const GetBalanceRequest: {
    encode(message: GetBalanceRequest, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number | undefined): GetBalanceRequest;
    fromJSON(object: any): GetBalanceRequest;
    toJSON(message: GetBalanceRequest): unknown;
    fromPartial(object: DeepPartial<GetBalanceRequest>): GetBalanceRequest;
};
export declare const GetBalanceResponse: {
    encode(message: GetBalanceResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number | undefined): GetBalanceResponse;
    fromJSON(object: any): GetBalanceResponse;
    toJSON(message: GetBalanceResponse): unknown;
    fromPartial(object: DeepPartial<GetBalanceResponse>): GetBalanceResponse;
};
export interface BankService {
    GetBalance(request: DeepPartial<GetBalanceRequest>, metadata?: grpc.Metadata): Promise<GetBalanceResponse>;
}
export declare class BankServiceClientImpl implements BankService {
    private readonly rpc;
    constructor(rpc: Rpc);
    GetBalance(request: DeepPartial<GetBalanceRequest>, metadata?: grpc.Metadata): Promise<GetBalanceResponse>;
}
export declare const BankServiceDesc: {
    serviceName: string;
};
export declare const BankServiceGetBalanceDesc: UnaryMethodDefinitionish;
interface UnaryMethodDefinitionishR extends grpc.UnaryMethodDefinition<any, any> {
    requestStream: any;
    responseStream: any;
}
declare type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;
interface Rpc {
    unary<T extends UnaryMethodDefinitionish>(methodDesc: T, request: any, metadata: grpc.Metadata | undefined): Promise<any>;
}
export declare class GrpcWebImpl {
    private host;
    private options;
    constructor(host: string, options: {
        transport?: grpc.TransportFactory;
        debug?: boolean;
        metadata?: grpc.Metadata;
    });
    unary<T extends UnaryMethodDefinitionish>(methodDesc: T, _request: any, metadata: grpc.Metadata | undefined): Promise<any>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Long ? string | number | Long : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};

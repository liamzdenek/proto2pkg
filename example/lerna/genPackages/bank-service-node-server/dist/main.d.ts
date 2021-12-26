import { Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";
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
export declare const BankServiceDefinition: {
    readonly name: "BankService";
    readonly fullName: "BankService";
    readonly methods: {
        readonly getBalance: {
            readonly name: "GetBalance";
            readonly requestType: {
                encode(message: GetBalanceRequest, writer?: Writer): Writer;
                decode(input: Reader | Uint8Array, length?: number | undefined): GetBalanceRequest;
                fromJSON(object: any): GetBalanceRequest;
                toJSON(message: GetBalanceRequest): unknown;
                fromPartial(object: DeepPartial<GetBalanceRequest>): GetBalanceRequest;
            };
            readonly requestStream: false;
            readonly responseType: {
                encode(message: GetBalanceResponse, writer?: Writer): Writer;
                decode(input: Reader | Uint8Array, length?: number | undefined): GetBalanceResponse;
                fromJSON(object: any): GetBalanceResponse;
                toJSON(message: GetBalanceResponse): unknown;
                fromPartial(object: DeepPartial<GetBalanceResponse>): GetBalanceResponse;
            };
            readonly responseStream: false;
            readonly options: {};
        };
    };
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Long ? string | number | Long : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};

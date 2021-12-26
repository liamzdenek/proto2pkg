"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankServiceDefinition = exports.GetBalanceResponse = exports.GetBalanceRequest = exports.protobufPackage = void 0;
/* eslint-disable */
const minimal_1 = require("protobufjs/minimal");
const Long = require("long");
exports.protobufPackage = "";
const baseGetBalanceRequest = { accountId: "" };
exports.GetBalanceRequest = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.accountId !== "") {
            writer.uint32(10).string(message.accountId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.Reader ? input : new minimal_1.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseGetBalanceRequest };
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
    fromJSON(object) {
        const message = { ...baseGetBalanceRequest };
        message.accountId =
            object.accountId !== undefined && object.accountId !== null
                ? String(object.accountId)
                : "";
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.accountId !== undefined && (obj.accountId = message.accountId);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = { ...baseGetBalanceRequest };
        message.accountId = (_a = object.accountId) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
const baseGetBalanceResponse = { accountId: "", balance: Long.ZERO };
exports.GetBalanceResponse = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.accountId !== "") {
            writer.uint32(10).string(message.accountId);
        }
        if (!message.balance.isZero()) {
            writer.uint32(16).sint64(message.balance);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.Reader ? input : new minimal_1.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseGetBalanceResponse };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.accountId = reader.string();
                    break;
                case 2:
                    message.balance = reader.sint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseGetBalanceResponse };
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
    toJSON(message) {
        const obj = {};
        message.accountId !== undefined && (obj.accountId = message.accountId);
        message.balance !== undefined &&
            (obj.balance = (message.balance || Long.ZERO).toString());
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = { ...baseGetBalanceResponse };
        message.accountId = (_a = object.accountId) !== null && _a !== void 0 ? _a : "";
        message.balance =
            object.balance !== undefined && object.balance !== null
                ? Long.fromValue(object.balance)
                : Long.ZERO;
        return message;
    },
};
exports.BankServiceDefinition = {
    name: "BankService",
    fullName: "BankService",
    methods: {
        getBalance: {
            name: "GetBalance",
            requestType: exports.GetBalanceRequest,
            requestStream: false,
            responseType: exports.GetBalanceResponse,
            responseStream: false,
            options: {},
        },
    },
};
// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (minimal_1.util.Long !== Long) {
    minimal_1.util.Long = Long;
    (0, minimal_1.configure)();
}

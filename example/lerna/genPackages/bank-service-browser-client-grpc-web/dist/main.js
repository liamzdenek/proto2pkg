"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcWebImpl = exports.BankServiceGetBalanceDesc = exports.BankServiceDesc = exports.BankServiceClientImpl = exports.GetBalanceResponse = exports.GetBalanceRequest = exports.protobufPackage = void 0;
/* eslint-disable */
const minimal_1 = require("protobufjs/minimal");
const Long = require("long");
const grpc_web_1 = require("@improbable-eng/grpc-web");
const browser_headers_1 = require("browser-headers");
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
class BankServiceClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.GetBalance = this.GetBalance.bind(this);
    }
    GetBalance(request, metadata) {
        return this.rpc.unary(exports.BankServiceGetBalanceDesc, exports.GetBalanceRequest.fromPartial(request), metadata);
    }
}
exports.BankServiceClientImpl = BankServiceClientImpl;
exports.BankServiceDesc = {
    serviceName: "BankService",
};
exports.BankServiceGetBalanceDesc = {
    methodName: "GetBalance",
    service: exports.BankServiceDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.GetBalanceRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            return {
                ...exports.GetBalanceResponse.decode(data),
                toObject() {
                    return this;
                },
            };
        },
    },
};
class GrpcWebImpl {
    constructor(host, options) {
        this.host = host;
        this.options = options;
    }
    unary(methodDesc, _request, metadata) {
        var _a;
        const request = { ..._request, ...methodDesc.requestType };
        const maybeCombinedMetadata = metadata && this.options.metadata
            ? new browser_headers_1.BrowserHeaders({
                ...(_a = this.options) === null || _a === void 0 ? void 0 : _a.metadata.headersMap,
                ...metadata === null || metadata === void 0 ? void 0 : metadata.headersMap,
            })
            : metadata || this.options.metadata;
        return new Promise((resolve, reject) => {
            grpc_web_1.grpc.unary(methodDesc, {
                request,
                host: this.host,
                metadata: maybeCombinedMetadata,
                transport: this.options.transport,
                debug: this.options.debug,
                onEnd: function (response) {
                    if (response.status === grpc_web_1.grpc.Code.OK) {
                        resolve(response.message);
                    }
                    else {
                        const err = new Error(response.statusMessage);
                        err.code = response.status;
                        err.metadata = response.trailers;
                        reject(err);
                    }
                },
            });
        });
    }
}
exports.GrpcWebImpl = GrpcWebImpl;
// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (minimal_1.util.Long !== Long) {
    minimal_1.util.Long = Long;
    (0, minimal_1.configure)();
}

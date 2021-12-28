import {resolveNodeModulesBin} from "../../util/resolveNodeModulesBin";
import {resolveGrpcToolsBin} from "../../util/downloadProtoc";

export const PROTOC_BIN_PROMISE = resolveGrpcToolsBin("protoc");
export const TS_PROTO_PLUGIN_BIN_PROMISE = resolveNodeModulesBin("protoc-gen-ts_proto");
export const GRPC_PYTHON_PLUGIN_BIN_PROMISE = resolveGrpcToolsBin("grpc_python_plugin");
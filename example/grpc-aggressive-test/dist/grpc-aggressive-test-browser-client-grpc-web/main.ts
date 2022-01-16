/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { grpc } from '@improbable-eng/grpc-web';
import { Observable } from 'rxjs';
import { Empty } from './empty';
import { SimpleRequest, StreamingOutputCallRequest, SimpleResponse, StreamingOutputCallResponse, StreamingInputCallResponse, ReconnectParams, ReconnectInfo, LoadBalancerStatsRequest, LoadBalancerAccumulatedStatsRequest, LoadBalancerStatsResponse, LoadBalancerAccumulatedStatsResponse, ClientConfigureRequest, ClientConfigureResponse, StreamingInputCallRequest } from './messages';
import { BrowserHeaders } from 'browser-headers';
import { share } from 'rxjs/operators';

export const protobufPackage = 'grpc.testing';

/**
 * A simple service to test the various types of RPCs and experiment with
 * performance with various types of payload.
 */
export interface TestService {
/** One empty request followed by one empty response. */
EmptyCall(request: DeepPartial<Empty>,metadata?: grpc.Metadata): Promise<Empty>;
/** One request followed by one response. */
UnaryCall(request: DeepPartial<SimpleRequest>,metadata?: grpc.Metadata): Promise<SimpleResponse>;
/**
 * One request followed by one response. Response has cache control
 * headers set such that a caching HTTP proxy (such as GFE) can
 * satisfy subsequent requests.
 */
CacheableUnaryCall(request: DeepPartial<SimpleRequest>,metadata?: grpc.Metadata): Promise<SimpleResponse>;
/**
 * One request followed by a sequence of responses (streamed download).
 * The server returns the payload with client desired type and sizes.
 */
StreamingOutputCall(request: DeepPartial<StreamingOutputCallRequest>,metadata?: grpc.Metadata): Observable<StreamingOutputCallResponse>;
/**
 * A sequence of requests followed by one response (streamed upload).
 * The server returns the aggregated size of client payload as the result.
 */
StreamingInputCall(request: DeepPartial<Observable<StreamingInputCallRequest>>,metadata?: grpc.Metadata): Promise<StreamingInputCallResponse>;
/**
 * A sequence of requests with each request served by the server immediately.
 * As one request could lead to multiple responses, this interface
 * demonstrates the idea of full duplexing.
 */
FullDuplexCall(request: DeepPartial<Observable<StreamingOutputCallRequest>>,metadata?: grpc.Metadata): Observable<StreamingOutputCallResponse>;
/**
 * A sequence of requests followed by a sequence of responses.
 * The server buffers all the client requests and then serves them in order. A
 * stream of responses are returned to the client when the server starts with
 * first request.
 */
HalfDuplexCall(request: DeepPartial<Observable<StreamingOutputCallRequest>>,metadata?: grpc.Metadata): Observable<StreamingOutputCallResponse>;
/**
 * The test server will not implement this method. It will be used
 * to test the behavior when clients call unimplemented methods.
 */
UnimplementedCall(request: DeepPartial<Empty>,metadata?: grpc.Metadata): Promise<Empty>;
}

export class TestServiceClientImpl implements TestService {
  
    private readonly rpc: Rpc;
    
    constructor(rpc: Rpc) {
  this.rpc = rpc;this.EmptyCall = this.EmptyCall.bind(this);this.UnaryCall = this.UnaryCall.bind(this);this.CacheableUnaryCall = this.CacheableUnaryCall.bind(this);this.StreamingOutputCall = this.StreamingOutputCall.bind(this);this.StreamingInputCall = this.StreamingInputCall.bind(this);this.FullDuplexCall = this.FullDuplexCall.bind(this);this.HalfDuplexCall = this.HalfDuplexCall.bind(this);this.UnimplementedCall = this.UnimplementedCall.bind(this);}

    EmptyCall(
      request: DeepPartial<Empty>,
      metadata?: grpc.Metadata,
    ): Promise<Empty> {
      return this.rpc.unary(
        TestServiceEmptyCallDesc,
        Empty.fromPartial(request),
        metadata,
      );
    }
  
    UnaryCall(
      request: DeepPartial<SimpleRequest>,
      metadata?: grpc.Metadata,
    ): Promise<SimpleResponse> {
      return this.rpc.unary(
        TestServiceUnaryCallDesc,
        SimpleRequest.fromPartial(request),
        metadata,
      );
    }
  
    CacheableUnaryCall(
      request: DeepPartial<SimpleRequest>,
      metadata?: grpc.Metadata,
    ): Promise<SimpleResponse> {
      return this.rpc.unary(
        TestServiceCacheableUnaryCallDesc,
        SimpleRequest.fromPartial(request),
        metadata,
      );
    }
  
    StreamingOutputCall(
      request: DeepPartial<StreamingOutputCallRequest>,
      metadata?: grpc.Metadata,
    ): Observable<StreamingOutputCallResponse> {
      return this.rpc.invoke(
        TestServiceStreamingOutputCallDesc,
        StreamingOutputCallRequest.fromPartial(request),
        metadata,
      );
    }
  
    StreamingInputCall(
      request: DeepPartial<Observable<StreamingInputCallRequest>>,
      metadata?: grpc.Metadata,
    ): Promise<StreamingInputCallResponse> {
      return this.rpc.unary(
        TestServiceStreamingInputCallDesc,
        Observable<StreamingInputCallRequest>.fromPartial(request),
        metadata,
      );
    }
  
    FullDuplexCall(
      request: DeepPartial<Observable<StreamingOutputCallRequest>>,
      metadata?: grpc.Metadata,
    ): Observable<StreamingOutputCallResponse> {
      return this.rpc.invoke(
        TestServiceFullDuplexCallDesc,
        Observable<StreamingOutputCallRequest>.fromPartial(request),
        metadata,
      );
    }
  
    HalfDuplexCall(
      request: DeepPartial<Observable<StreamingOutputCallRequest>>,
      metadata?: grpc.Metadata,
    ): Observable<StreamingOutputCallResponse> {
      return this.rpc.invoke(
        TestServiceHalfDuplexCallDesc,
        Observable<StreamingOutputCallRequest>.fromPartial(request),
        metadata,
      );
    }
  
    UnimplementedCall(
      request: DeepPartial<Empty>,
      metadata?: grpc.Metadata,
    ): Promise<Empty> {
      return this.rpc.unary(
        TestServiceUnimplementedCallDesc,
        Empty.fromPartial(request),
        metadata,
      );
    }
  }

export const TestServiceDesc = {
      serviceName: "grpc.testing.TestService",
    };

export const TestServiceEmptyCallDesc: UnaryMethodDefinitionish = {
      methodName: "EmptyCall",
      service: TestServiceDesc,
      requestStream: false,
      responseStream: false,
      requestType: {
    serializeBinary() {
      return Empty.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...Empty.decode(data), toObject() { return this; } };
    }
  } as any,
    };

export const TestServiceUnaryCallDesc: UnaryMethodDefinitionish = {
      methodName: "UnaryCall",
      service: TestServiceDesc,
      requestStream: false,
      responseStream: false,
      requestType: {
    serializeBinary() {
      return SimpleRequest.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...SimpleResponse.decode(data), toObject() { return this; } };
    }
  } as any,
    };

export const TestServiceCacheableUnaryCallDesc: UnaryMethodDefinitionish = {
      methodName: "CacheableUnaryCall",
      service: TestServiceDesc,
      requestStream: false,
      responseStream: false,
      requestType: {
    serializeBinary() {
      return SimpleRequest.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...SimpleResponse.decode(data), toObject() { return this; } };
    }
  } as any,
    };

export const TestServiceStreamingOutputCallDesc: UnaryMethodDefinitionish = {
      methodName: "StreamingOutputCall",
      service: TestServiceDesc,
      requestStream: false,
      responseStream: true,
      requestType: {
    serializeBinary() {
      return StreamingOutputCallRequest.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...StreamingOutputCallResponse.decode(data), toObject() { return this; } };
    }
  } as any,
    };

export const TestServiceStreamingInputCallDesc: UnaryMethodDefinitionish = {
      methodName: "StreamingInputCall",
      service: TestServiceDesc,
      requestStream: false,
      responseStream: false,
      requestType: {
    serializeBinary() {
      return Observable<StreamingInputCallRequest>.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...StreamingInputCallResponse.decode(data), toObject() { return this; } };
    }
  } as any,
    };

export const TestServiceFullDuplexCallDesc: UnaryMethodDefinitionish = {
      methodName: "FullDuplexCall",
      service: TestServiceDesc,
      requestStream: false,
      responseStream: true,
      requestType: {
    serializeBinary() {
      return Observable<StreamingOutputCallRequest>.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...StreamingOutputCallResponse.decode(data), toObject() { return this; } };
    }
  } as any,
    };

export const TestServiceHalfDuplexCallDesc: UnaryMethodDefinitionish = {
      methodName: "HalfDuplexCall",
      service: TestServiceDesc,
      requestStream: false,
      responseStream: true,
      requestType: {
    serializeBinary() {
      return Observable<StreamingOutputCallRequest>.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...StreamingOutputCallResponse.decode(data), toObject() { return this; } };
    }
  } as any,
    };

export const TestServiceUnimplementedCallDesc: UnaryMethodDefinitionish = {
      methodName: "UnimplementedCall",
      service: TestServiceDesc,
      requestStream: false,
      responseStream: false,
      requestType: {
    serializeBinary() {
      return Empty.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...Empty.decode(data), toObject() { return this; } };
    }
  } as any,
    };

/**
 * A simple service NOT implemented at servers so clients can test for
 * that case.
 */
export interface UnimplementedService {
/** A call that no server should implement */
UnimplementedCall(request: DeepPartial<Empty>,metadata?: grpc.Metadata): Promise<Empty>;
}

export class UnimplementedServiceClientImpl implements UnimplementedService {
  
    private readonly rpc: Rpc;
    
    constructor(rpc: Rpc) {
  this.rpc = rpc;this.UnimplementedCall = this.UnimplementedCall.bind(this);}

    UnimplementedCall(
      request: DeepPartial<Empty>,
      metadata?: grpc.Metadata,
    ): Promise<Empty> {
      return this.rpc.unary(
        UnimplementedServiceUnimplementedCallDesc,
        Empty.fromPartial(request),
        metadata,
      );
    }
  }

export const UnimplementedServiceDesc = {
      serviceName: "grpc.testing.UnimplementedService",
    };

export const UnimplementedServiceUnimplementedCallDesc: UnaryMethodDefinitionish = {
      methodName: "UnimplementedCall",
      service: UnimplementedServiceDesc,
      requestStream: false,
      responseStream: false,
      requestType: {
    serializeBinary() {
      return Empty.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...Empty.decode(data), toObject() { return this; } };
    }
  } as any,
    };

/** A service used to control reconnect server. */
export interface ReconnectService {
Start(request: DeepPartial<ReconnectParams>,metadata?: grpc.Metadata): Promise<Empty>;
Stop(request: DeepPartial<Empty>,metadata?: grpc.Metadata): Promise<ReconnectInfo>;
}

export class ReconnectServiceClientImpl implements ReconnectService {
  
    private readonly rpc: Rpc;
    
    constructor(rpc: Rpc) {
  this.rpc = rpc;this.Start = this.Start.bind(this);this.Stop = this.Stop.bind(this);}

    Start(
      request: DeepPartial<ReconnectParams>,
      metadata?: grpc.Metadata,
    ): Promise<Empty> {
      return this.rpc.unary(
        ReconnectServiceStartDesc,
        ReconnectParams.fromPartial(request),
        metadata,
      );
    }
  
    Stop(
      request: DeepPartial<Empty>,
      metadata?: grpc.Metadata,
    ): Promise<ReconnectInfo> {
      return this.rpc.unary(
        ReconnectServiceStopDesc,
        Empty.fromPartial(request),
        metadata,
      );
    }
  }

export const ReconnectServiceDesc = {
      serviceName: "grpc.testing.ReconnectService",
    };

export const ReconnectServiceStartDesc: UnaryMethodDefinitionish = {
      methodName: "Start",
      service: ReconnectServiceDesc,
      requestStream: false,
      responseStream: false,
      requestType: {
    serializeBinary() {
      return ReconnectParams.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...Empty.decode(data), toObject() { return this; } };
    }
  } as any,
    };

export const ReconnectServiceStopDesc: UnaryMethodDefinitionish = {
      methodName: "Stop",
      service: ReconnectServiceDesc,
      requestStream: false,
      responseStream: false,
      requestType: {
    serializeBinary() {
      return Empty.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...ReconnectInfo.decode(data), toObject() { return this; } };
    }
  } as any,
    };

/** A service used to obtain stats for verifying LB behavior. */
export interface LoadBalancerStatsService {
/** Gets the backend distribution for RPCs sent by a test client. */
GetClientStats(request: DeepPartial<LoadBalancerStatsRequest>,metadata?: grpc.Metadata): Promise<LoadBalancerStatsResponse>;
/** Gets the accumulated stats for RPCs sent by a test client. */
GetClientAccumulatedStats(request: DeepPartial<LoadBalancerAccumulatedStatsRequest>,metadata?: grpc.Metadata): Promise<LoadBalancerAccumulatedStatsResponse>;
}

export class LoadBalancerStatsServiceClientImpl implements LoadBalancerStatsService {
  
    private readonly rpc: Rpc;
    
    constructor(rpc: Rpc) {
  this.rpc = rpc;this.GetClientStats = this.GetClientStats.bind(this);this.GetClientAccumulatedStats = this.GetClientAccumulatedStats.bind(this);}

    GetClientStats(
      request: DeepPartial<LoadBalancerStatsRequest>,
      metadata?: grpc.Metadata,
    ): Promise<LoadBalancerStatsResponse> {
      return this.rpc.unary(
        LoadBalancerStatsServiceGetClientStatsDesc,
        LoadBalancerStatsRequest.fromPartial(request),
        metadata,
      );
    }
  
    GetClientAccumulatedStats(
      request: DeepPartial<LoadBalancerAccumulatedStatsRequest>,
      metadata?: grpc.Metadata,
    ): Promise<LoadBalancerAccumulatedStatsResponse> {
      return this.rpc.unary(
        LoadBalancerStatsServiceGetClientAccumulatedStatsDesc,
        LoadBalancerAccumulatedStatsRequest.fromPartial(request),
        metadata,
      );
    }
  }

export const LoadBalancerStatsServiceDesc = {
      serviceName: "grpc.testing.LoadBalancerStatsService",
    };

export const LoadBalancerStatsServiceGetClientStatsDesc: UnaryMethodDefinitionish = {
      methodName: "GetClientStats",
      service: LoadBalancerStatsServiceDesc,
      requestStream: false,
      responseStream: false,
      requestType: {
    serializeBinary() {
      return LoadBalancerStatsRequest.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...LoadBalancerStatsResponse.decode(data), toObject() { return this; } };
    }
  } as any,
    };

export const LoadBalancerStatsServiceGetClientAccumulatedStatsDesc: UnaryMethodDefinitionish = {
      methodName: "GetClientAccumulatedStats",
      service: LoadBalancerStatsServiceDesc,
      requestStream: false,
      responseStream: false,
      requestType: {
    serializeBinary() {
      return LoadBalancerAccumulatedStatsRequest.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...LoadBalancerAccumulatedStatsResponse.decode(data), toObject() { return this; } };
    }
  } as any,
    };

/** A service to remotely control health status of an xDS test server. */
export interface XdsUpdateHealthService {
SetServing(request: DeepPartial<Empty>,metadata?: grpc.Metadata): Promise<Empty>;
SetNotServing(request: DeepPartial<Empty>,metadata?: grpc.Metadata): Promise<Empty>;
}

export class XdsUpdateHealthServiceClientImpl implements XdsUpdateHealthService {
  
    private readonly rpc: Rpc;
    
    constructor(rpc: Rpc) {
  this.rpc = rpc;this.SetServing = this.SetServing.bind(this);this.SetNotServing = this.SetNotServing.bind(this);}

    SetServing(
      request: DeepPartial<Empty>,
      metadata?: grpc.Metadata,
    ): Promise<Empty> {
      return this.rpc.unary(
        XdsUpdateHealthServiceSetServingDesc,
        Empty.fromPartial(request),
        metadata,
      );
    }
  
    SetNotServing(
      request: DeepPartial<Empty>,
      metadata?: grpc.Metadata,
    ): Promise<Empty> {
      return this.rpc.unary(
        XdsUpdateHealthServiceSetNotServingDesc,
        Empty.fromPartial(request),
        metadata,
      );
    }
  }

export const XdsUpdateHealthServiceDesc = {
      serviceName: "grpc.testing.XdsUpdateHealthService",
    };

export const XdsUpdateHealthServiceSetServingDesc: UnaryMethodDefinitionish = {
      methodName: "SetServing",
      service: XdsUpdateHealthServiceDesc,
      requestStream: false,
      responseStream: false,
      requestType: {
    serializeBinary() {
      return Empty.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...Empty.decode(data), toObject() { return this; } };
    }
  } as any,
    };

export const XdsUpdateHealthServiceSetNotServingDesc: UnaryMethodDefinitionish = {
      methodName: "SetNotServing",
      service: XdsUpdateHealthServiceDesc,
      requestStream: false,
      responseStream: false,
      requestType: {
    serializeBinary() {
      return Empty.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...Empty.decode(data), toObject() { return this; } };
    }
  } as any,
    };

/** A service to dynamically update the configuration of an xDS test client. */
export interface XdsUpdateClientConfigureService {
/** Update the tes client's configuration. */
Configure(request: DeepPartial<ClientConfigureRequest>,metadata?: grpc.Metadata): Promise<ClientConfigureResponse>;
}

export class XdsUpdateClientConfigureServiceClientImpl implements XdsUpdateClientConfigureService {
  
    private readonly rpc: Rpc;
    
    constructor(rpc: Rpc) {
  this.rpc = rpc;this.Configure = this.Configure.bind(this);}

    Configure(
      request: DeepPartial<ClientConfigureRequest>,
      metadata?: grpc.Metadata,
    ): Promise<ClientConfigureResponse> {
      return this.rpc.unary(
        XdsUpdateClientConfigureServiceConfigureDesc,
        ClientConfigureRequest.fromPartial(request),
        metadata,
      );
    }
  }

export const XdsUpdateClientConfigureServiceDesc = {
      serviceName: "grpc.testing.XdsUpdateClientConfigureService",
    };

export const XdsUpdateClientConfigureServiceConfigureDesc: UnaryMethodDefinitionish = {
      methodName: "Configure",
      service: XdsUpdateClientConfigureServiceDesc,
      requestStream: false,
      responseStream: false,
      requestType: {
    serializeBinary() {
      return ClientConfigureRequest.encode(this).finish();
    },
  } as any,
      responseType: {
    deserializeBinary(data: Uint8Array) {
      return { ...ClientConfigureResponse.decode(data), toObject() { return this; } };
    }
  } as any,
    };

interface UnaryMethodDefinitionishR extends grpc.UnaryMethodDefinition<any, any> { requestStream: any; responseStream: any; }

type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;

interface Rpc {
unary<T extends UnaryMethodDefinitionish>(
      methodDesc: T,
      request: any,
      metadata: grpc.Metadata | undefined,
    ): Promise<any>;
invoke<T extends UnaryMethodDefinitionish>(
        methodDesc: T,
        request: any,
        metadata: grpc.Metadata | undefined,
      ): Observable<any>;
}

export class GrpcWebImpl {
      private host: string;
      private options: 
    {
      transport?: grpc.TransportFactory,
      streamingTransport?: grpc.TransportFactory,
      debug?: boolean,
      metadata?: grpc.Metadata,
    }
  ;
      
      constructor(host: string, options: 
    {
      transport?: grpc.TransportFactory,
      streamingTransport?: grpc.TransportFactory,
      debug?: boolean,
      metadata?: grpc.Metadata,
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
          ? new BrowserHeaders({ ...this.options?.metadata.headersMap, ...metadata?.headersMap })
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
  
    invoke<T extends UnaryMethodDefinitionish>(
      methodDesc: T,
      _request: any,
      metadata: grpc.Metadata | undefined
    ): Observable<any> {
      // Status Response Codes (https://developers.google.com/maps-booking/reference/grpc-api/status_codes)
      const upStreamCodes = [2, 4, 8, 9, 10, 13, 14, 15]; 
      const DEFAULT_TIMEOUT_TIME: number = 3_000;
      const request = { ..._request, ...methodDesc.requestType };
      const maybeCombinedMetadata =
      metadata && this.options.metadata
        ? new BrowserHeaders({ ...this.options?.metadata.headersMap, ...metadata?.headersMap })
        : metadata || this.options.metadata;
      return new Observable(observer => {
        const upStream = (() => {
          const client = grpc.invoke(methodDesc, {
            host: this.host,
            request,
            transport: this.options.streamingTransport || this.options.transport,
            metadata: maybeCombinedMetadata,
            debug: this.options.debug,
            onMessage: (next) => observer.next(next),
            onEnd: (code: grpc.Code, message: string) => {
              if (code === 0) {
                observer.complete();
              } else if (upStreamCodes.includes(code)) {
                setTimeout(upStream, DEFAULT_TIMEOUT_TIME);
              } else {
                observer.error(new Error(`Error ${code} ${message}`));
              }
            },
          });
          observer.add(() => client.close());
        });
        upStream();
      }).pipe(share());
    }
  }







type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
      export type DeepPartial<T> =  T extends Builtin
        ? T
         : T extends Long ? string | number | Long 
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


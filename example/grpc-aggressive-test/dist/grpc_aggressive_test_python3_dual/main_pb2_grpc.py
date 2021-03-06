# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

import empty_pb2 as empty__pb2
import messages_pb2 as messages__pb2


class TestServiceStub(object):
    """A simple service to test the various types of RPCs and experiment with
    performance with various types of payload.
    """

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.EmptyCall = channel.unary_unary(
                '/grpc.testing.TestService/EmptyCall',
                request_serializer=empty__pb2.Empty.SerializeToString,
                response_deserializer=empty__pb2.Empty.FromString,
                )
        self.UnaryCall = channel.unary_unary(
                '/grpc.testing.TestService/UnaryCall',
                request_serializer=messages__pb2.SimpleRequest.SerializeToString,
                response_deserializer=messages__pb2.SimpleResponse.FromString,
                )
        self.CacheableUnaryCall = channel.unary_unary(
                '/grpc.testing.TestService/CacheableUnaryCall',
                request_serializer=messages__pb2.SimpleRequest.SerializeToString,
                response_deserializer=messages__pb2.SimpleResponse.FromString,
                )
        self.StreamingOutputCall = channel.unary_stream(
                '/grpc.testing.TestService/StreamingOutputCall',
                request_serializer=messages__pb2.StreamingOutputCallRequest.SerializeToString,
                response_deserializer=messages__pb2.StreamingOutputCallResponse.FromString,
                )
        self.StreamingInputCall = channel.stream_unary(
                '/grpc.testing.TestService/StreamingInputCall',
                request_serializer=messages__pb2.StreamingInputCallRequest.SerializeToString,
                response_deserializer=messages__pb2.StreamingInputCallResponse.FromString,
                )
        self.FullDuplexCall = channel.stream_stream(
                '/grpc.testing.TestService/FullDuplexCall',
                request_serializer=messages__pb2.StreamingOutputCallRequest.SerializeToString,
                response_deserializer=messages__pb2.StreamingOutputCallResponse.FromString,
                )
        self.HalfDuplexCall = channel.stream_stream(
                '/grpc.testing.TestService/HalfDuplexCall',
                request_serializer=messages__pb2.StreamingOutputCallRequest.SerializeToString,
                response_deserializer=messages__pb2.StreamingOutputCallResponse.FromString,
                )
        self.UnimplementedCall = channel.unary_unary(
                '/grpc.testing.TestService/UnimplementedCall',
                request_serializer=empty__pb2.Empty.SerializeToString,
                response_deserializer=empty__pb2.Empty.FromString,
                )


class TestServiceServicer(object):
    """A simple service to test the various types of RPCs and experiment with
    performance with various types of payload.
    """

    def EmptyCall(self, request, context):
        """One empty request followed by one empty response.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def UnaryCall(self, request, context):
        """One request followed by one response.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def CacheableUnaryCall(self, request, context):
        """One request followed by one response. Response has cache control
        headers set such that a caching HTTP proxy (such as GFE) can
        satisfy subsequent requests.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def StreamingOutputCall(self, request, context):
        """One request followed by a sequence of responses (streamed download).
        The server returns the payload with client desired type and sizes.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def StreamingInputCall(self, request_iterator, context):
        """A sequence of requests followed by one response (streamed upload).
        The server returns the aggregated size of client payload as the result.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def FullDuplexCall(self, request_iterator, context):
        """A sequence of requests with each request served by the server immediately.
        As one request could lead to multiple responses, this interface
        demonstrates the idea of full duplexing.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def HalfDuplexCall(self, request_iterator, context):
        """A sequence of requests followed by a sequence of responses.
        The server buffers all the client requests and then serves them in order. A
        stream of responses are returned to the client when the server starts with
        first request.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def UnimplementedCall(self, request, context):
        """The test server will not implement this method. It will be used
        to test the behavior when clients call unimplemented methods.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_TestServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'EmptyCall': grpc.unary_unary_rpc_method_handler(
                    servicer.EmptyCall,
                    request_deserializer=empty__pb2.Empty.FromString,
                    response_serializer=empty__pb2.Empty.SerializeToString,
            ),
            'UnaryCall': grpc.unary_unary_rpc_method_handler(
                    servicer.UnaryCall,
                    request_deserializer=messages__pb2.SimpleRequest.FromString,
                    response_serializer=messages__pb2.SimpleResponse.SerializeToString,
            ),
            'CacheableUnaryCall': grpc.unary_unary_rpc_method_handler(
                    servicer.CacheableUnaryCall,
                    request_deserializer=messages__pb2.SimpleRequest.FromString,
                    response_serializer=messages__pb2.SimpleResponse.SerializeToString,
            ),
            'StreamingOutputCall': grpc.unary_stream_rpc_method_handler(
                    servicer.StreamingOutputCall,
                    request_deserializer=messages__pb2.StreamingOutputCallRequest.FromString,
                    response_serializer=messages__pb2.StreamingOutputCallResponse.SerializeToString,
            ),
            'StreamingInputCall': grpc.stream_unary_rpc_method_handler(
                    servicer.StreamingInputCall,
                    request_deserializer=messages__pb2.StreamingInputCallRequest.FromString,
                    response_serializer=messages__pb2.StreamingInputCallResponse.SerializeToString,
            ),
            'FullDuplexCall': grpc.stream_stream_rpc_method_handler(
                    servicer.FullDuplexCall,
                    request_deserializer=messages__pb2.StreamingOutputCallRequest.FromString,
                    response_serializer=messages__pb2.StreamingOutputCallResponse.SerializeToString,
            ),
            'HalfDuplexCall': grpc.stream_stream_rpc_method_handler(
                    servicer.HalfDuplexCall,
                    request_deserializer=messages__pb2.StreamingOutputCallRequest.FromString,
                    response_serializer=messages__pb2.StreamingOutputCallResponse.SerializeToString,
            ),
            'UnimplementedCall': grpc.unary_unary_rpc_method_handler(
                    servicer.UnimplementedCall,
                    request_deserializer=empty__pb2.Empty.FromString,
                    response_serializer=empty__pb2.Empty.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'grpc.testing.TestService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class TestService(object):
    """A simple service to test the various types of RPCs and experiment with
    performance with various types of payload.
    """

    @staticmethod
    def EmptyCall(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/grpc.testing.TestService/EmptyCall',
            empty__pb2.Empty.SerializeToString,
            empty__pb2.Empty.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def UnaryCall(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/grpc.testing.TestService/UnaryCall',
            messages__pb2.SimpleRequest.SerializeToString,
            messages__pb2.SimpleResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def CacheableUnaryCall(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/grpc.testing.TestService/CacheableUnaryCall',
            messages__pb2.SimpleRequest.SerializeToString,
            messages__pb2.SimpleResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def StreamingOutputCall(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_stream(request, target, '/grpc.testing.TestService/StreamingOutputCall',
            messages__pb2.StreamingOutputCallRequest.SerializeToString,
            messages__pb2.StreamingOutputCallResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def StreamingInputCall(request_iterator,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.stream_unary(request_iterator, target, '/grpc.testing.TestService/StreamingInputCall',
            messages__pb2.StreamingInputCallRequest.SerializeToString,
            messages__pb2.StreamingInputCallResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def FullDuplexCall(request_iterator,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.stream_stream(request_iterator, target, '/grpc.testing.TestService/FullDuplexCall',
            messages__pb2.StreamingOutputCallRequest.SerializeToString,
            messages__pb2.StreamingOutputCallResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def HalfDuplexCall(request_iterator,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.stream_stream(request_iterator, target, '/grpc.testing.TestService/HalfDuplexCall',
            messages__pb2.StreamingOutputCallRequest.SerializeToString,
            messages__pb2.StreamingOutputCallResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def UnimplementedCall(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/grpc.testing.TestService/UnimplementedCall',
            empty__pb2.Empty.SerializeToString,
            empty__pb2.Empty.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)


class UnimplementedServiceStub(object):
    """A simple service NOT implemented at servers so clients can test for
    that case.
    """

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.UnimplementedCall = channel.unary_unary(
                '/grpc.testing.UnimplementedService/UnimplementedCall',
                request_serializer=empty__pb2.Empty.SerializeToString,
                response_deserializer=empty__pb2.Empty.FromString,
                )


class UnimplementedServiceServicer(object):
    """A simple service NOT implemented at servers so clients can test for
    that case.
    """

    def UnimplementedCall(self, request, context):
        """A call that no server should implement
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_UnimplementedServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'UnimplementedCall': grpc.unary_unary_rpc_method_handler(
                    servicer.UnimplementedCall,
                    request_deserializer=empty__pb2.Empty.FromString,
                    response_serializer=empty__pb2.Empty.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'grpc.testing.UnimplementedService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class UnimplementedService(object):
    """A simple service NOT implemented at servers so clients can test for
    that case.
    """

    @staticmethod
    def UnimplementedCall(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/grpc.testing.UnimplementedService/UnimplementedCall',
            empty__pb2.Empty.SerializeToString,
            empty__pb2.Empty.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)


class ReconnectServiceStub(object):
    """A service used to control reconnect server.
    """

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.Start = channel.unary_unary(
                '/grpc.testing.ReconnectService/Start',
                request_serializer=messages__pb2.ReconnectParams.SerializeToString,
                response_deserializer=empty__pb2.Empty.FromString,
                )
        self.Stop = channel.unary_unary(
                '/grpc.testing.ReconnectService/Stop',
                request_serializer=empty__pb2.Empty.SerializeToString,
                response_deserializer=messages__pb2.ReconnectInfo.FromString,
                )


class ReconnectServiceServicer(object):
    """A service used to control reconnect server.
    """

    def Start(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def Stop(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_ReconnectServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'Start': grpc.unary_unary_rpc_method_handler(
                    servicer.Start,
                    request_deserializer=messages__pb2.ReconnectParams.FromString,
                    response_serializer=empty__pb2.Empty.SerializeToString,
            ),
            'Stop': grpc.unary_unary_rpc_method_handler(
                    servicer.Stop,
                    request_deserializer=empty__pb2.Empty.FromString,
                    response_serializer=messages__pb2.ReconnectInfo.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'grpc.testing.ReconnectService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class ReconnectService(object):
    """A service used to control reconnect server.
    """

    @staticmethod
    def Start(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/grpc.testing.ReconnectService/Start',
            messages__pb2.ReconnectParams.SerializeToString,
            empty__pb2.Empty.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def Stop(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/grpc.testing.ReconnectService/Stop',
            empty__pb2.Empty.SerializeToString,
            messages__pb2.ReconnectInfo.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)


class LoadBalancerStatsServiceStub(object):
    """A service used to obtain stats for verifying LB behavior.
    """

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.GetClientStats = channel.unary_unary(
                '/grpc.testing.LoadBalancerStatsService/GetClientStats',
                request_serializer=messages__pb2.LoadBalancerStatsRequest.SerializeToString,
                response_deserializer=messages__pb2.LoadBalancerStatsResponse.FromString,
                )
        self.GetClientAccumulatedStats = channel.unary_unary(
                '/grpc.testing.LoadBalancerStatsService/GetClientAccumulatedStats',
                request_serializer=messages__pb2.LoadBalancerAccumulatedStatsRequest.SerializeToString,
                response_deserializer=messages__pb2.LoadBalancerAccumulatedStatsResponse.FromString,
                )


class LoadBalancerStatsServiceServicer(object):
    """A service used to obtain stats for verifying LB behavior.
    """

    def GetClientStats(self, request, context):
        """Gets the backend distribution for RPCs sent by a test client.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetClientAccumulatedStats(self, request, context):
        """Gets the accumulated stats for RPCs sent by a test client.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_LoadBalancerStatsServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'GetClientStats': grpc.unary_unary_rpc_method_handler(
                    servicer.GetClientStats,
                    request_deserializer=messages__pb2.LoadBalancerStatsRequest.FromString,
                    response_serializer=messages__pb2.LoadBalancerStatsResponse.SerializeToString,
            ),
            'GetClientAccumulatedStats': grpc.unary_unary_rpc_method_handler(
                    servicer.GetClientAccumulatedStats,
                    request_deserializer=messages__pb2.LoadBalancerAccumulatedStatsRequest.FromString,
                    response_serializer=messages__pb2.LoadBalancerAccumulatedStatsResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'grpc.testing.LoadBalancerStatsService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class LoadBalancerStatsService(object):
    """A service used to obtain stats for verifying LB behavior.
    """

    @staticmethod
    def GetClientStats(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/grpc.testing.LoadBalancerStatsService/GetClientStats',
            messages__pb2.LoadBalancerStatsRequest.SerializeToString,
            messages__pb2.LoadBalancerStatsResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def GetClientAccumulatedStats(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/grpc.testing.LoadBalancerStatsService/GetClientAccumulatedStats',
            messages__pb2.LoadBalancerAccumulatedStatsRequest.SerializeToString,
            messages__pb2.LoadBalancerAccumulatedStatsResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)


class XdsUpdateHealthServiceStub(object):
    """A service to remotely control health status of an xDS test server.
    """

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.SetServing = channel.unary_unary(
                '/grpc.testing.XdsUpdateHealthService/SetServing',
                request_serializer=empty__pb2.Empty.SerializeToString,
                response_deserializer=empty__pb2.Empty.FromString,
                )
        self.SetNotServing = channel.unary_unary(
                '/grpc.testing.XdsUpdateHealthService/SetNotServing',
                request_serializer=empty__pb2.Empty.SerializeToString,
                response_deserializer=empty__pb2.Empty.FromString,
                )


class XdsUpdateHealthServiceServicer(object):
    """A service to remotely control health status of an xDS test server.
    """

    def SetServing(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def SetNotServing(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_XdsUpdateHealthServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'SetServing': grpc.unary_unary_rpc_method_handler(
                    servicer.SetServing,
                    request_deserializer=empty__pb2.Empty.FromString,
                    response_serializer=empty__pb2.Empty.SerializeToString,
            ),
            'SetNotServing': grpc.unary_unary_rpc_method_handler(
                    servicer.SetNotServing,
                    request_deserializer=empty__pb2.Empty.FromString,
                    response_serializer=empty__pb2.Empty.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'grpc.testing.XdsUpdateHealthService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class XdsUpdateHealthService(object):
    """A service to remotely control health status of an xDS test server.
    """

    @staticmethod
    def SetServing(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/grpc.testing.XdsUpdateHealthService/SetServing',
            empty__pb2.Empty.SerializeToString,
            empty__pb2.Empty.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def SetNotServing(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/grpc.testing.XdsUpdateHealthService/SetNotServing',
            empty__pb2.Empty.SerializeToString,
            empty__pb2.Empty.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)


class XdsUpdateClientConfigureServiceStub(object):
    """A service to dynamically update the configuration of an xDS test client.
    """

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.Configure = channel.unary_unary(
                '/grpc.testing.XdsUpdateClientConfigureService/Configure',
                request_serializer=messages__pb2.ClientConfigureRequest.SerializeToString,
                response_deserializer=messages__pb2.ClientConfigureResponse.FromString,
                )


class XdsUpdateClientConfigureServiceServicer(object):
    """A service to dynamically update the configuration of an xDS test client.
    """

    def Configure(self, request, context):
        """Update the tes client's configuration.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_XdsUpdateClientConfigureServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'Configure': grpc.unary_unary_rpc_method_handler(
                    servicer.Configure,
                    request_deserializer=messages__pb2.ClientConfigureRequest.FromString,
                    response_serializer=messages__pb2.ClientConfigureResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'grpc.testing.XdsUpdateClientConfigureService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class XdsUpdateClientConfigureService(object):
    """A service to dynamically update the configuration of an xDS test client.
    """

    @staticmethod
    def Configure(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/grpc.testing.XdsUpdateClientConfigureService/Configure',
            messages__pb2.ClientConfigureRequest.SerializeToString,
            messages__pb2.ClientConfigureResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

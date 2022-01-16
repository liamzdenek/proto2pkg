import sys
import os
import grpc
from concurrent import futures
print(os.path.dirname(os.path.realpath(__file__)))
sys.path.append(os.path.dirname(os.path.realpath(__file__))+"/example/bank-service/dist/bank_service_python3_dual/src")
#sys.path.append("/home/liam/WebstormProjects/proto2pkg/example/bank-service/dist/bank_service_python3_dual/src")
from bank_service_python3_dual import main_pb2 # protoc (does not include services, just the types)
from bank_service_python3_dual import main_pb2_grpc # grpc (includes the service definitions, depends upon above line)

#class BankServiceServicer(main_pb2_grpc.BankServiceServicer):
#    def GetBalance(self, request, context):
#        # request is of type ExampleRequest
#        return main_pb2.GetBalanceResponse(accountId=request.accountId, balance=43)
#
#def serve():
#    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
#    main_pb2_grpc.add_BankServiceServicer_to_server(
#        BankServiceServicer(), server)
#    server.add_insecure_port('[::]:9090')
#    server.start()
#    server.wait_for_termination()
#
#if __name__ == '__main__':
#    serve()

channel = grpc.insecure_channel('localhost:9090')
stub = main_pb2_grpc.BankServiceStub(channel)

# synchronous call
response = stub.GetBalance(main_pb2.GetBalanceRequest(accountId="bobby"))
print("Response")
print(response)

# asynchronous call
future = stub.GetBalance.future(main_pb2.GetBalanceRequest(accountId="bobby2"))

response = future.result()
print("Response")
print(response)

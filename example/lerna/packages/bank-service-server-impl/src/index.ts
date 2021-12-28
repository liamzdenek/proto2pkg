import {createServer, ServiceImplementation} from 'nice-grpc';
import {
    BankServiceDefinition,
    GetBalanceRequest,
    GetBalanceResponse,
    DeepPartial,
} from 'bank-service-node-server';

const exampleServiceImpl: ServiceImplementation<
    typeof BankServiceDefinition
    > = {
    async getBalance(
        request: GetBalanceRequest,
    ): Promise<DeepPartial<GetBalanceResponse>> {
        return {
            accountId: request.accountId,
            balance: 44,
        };
    },
};

const server = createServer()/*.useMiddleware(middleware)*/;

// you may implement multiple services within the same process/port, depending on your application architecture
server.add(BankServiceDefinition, exampleServiceImpl);

(async () => {
    console.log('server running');
    await server.listen('0.0.0.0:9090');
})()

process.on('SIGINT', async () => {
    await server.shutdown();
    process.exit();
});
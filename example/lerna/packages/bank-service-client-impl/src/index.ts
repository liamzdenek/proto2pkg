import {createChannel, createClient, Client} from 'nice-grpc';
import {
    BankServiceDefinition
} from 'bank-service-node-client';

const channel = createChannel('localhost:9090');

const client: Client<typeof BankServiceDefinition> = createClient(
    BankServiceDefinition,
    channel,
);

(async () => {
    const response = await client.getBalance({ accountId: "bob" });
    console.log('got response', response);
})()
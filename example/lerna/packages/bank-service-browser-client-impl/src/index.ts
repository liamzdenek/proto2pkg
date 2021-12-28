import {GrpcWebImpl, BankServiceClientImpl, BankService} from 'bank-service-browser-client-grpc-web';

const channel = new GrpcWebImpl("http://localhost:8080", {})

const client: BankService = new BankServiceClientImpl(channel);

console.log("hello world");

// i know this isn't clean/modern but this is an example so... it's concise and standalone
document.body.innerHTML =
`<div id="root">
    <button id="button" onclick="window.buttonClick()">Send Request</button>
    <pre id="result"></pre>
</div>`;

(window as any).buttonClick = async () => {
    let result = await client.GetBalance({accountId: "jeff"});
    let node = document.querySelector("#result");
    if(!node) { return; }
    node.innerHTML = JSON.stringify(result, null, 2);
};

# bank-service-grpc-web-proxy

| ⚠️⚠️ This folder and all of its contents (recursively) are autogenerated! Modifications will be overwritten! ⚠️⚠️ |
| --- |

1. This package was generated by executing `proto2pkg` on `bank-service`.
1. [`bank-service` can be found here.](https://github.com/liamzdenek/proto2pkg/example/bank-service)
1. At the time this package was generated:
    1. The `bank-service` version was: `0.0.1`
    1. The `bank-service` commit hash was: `64183c061235bbf6e75e33f608b64280844cf33d`
    1. The build occurred at: 2022-01-16T02:48:44.074Z
1. Below, you can find instructions regarding the generator for this package.

## GrpcWebProxy


First, create and launch a server implementation that uses binary grpc. For example, you could implement the
`*-node-server` package that was generated alongside this package. Assuming your binary grpc service is running
on localhost:9090, run the following command to launch the proxy.
```sh
docker build -t example-service-grpc-web-proxy . && docker run --env BACKEND_ADDR=localhost:9090 -it --network host example-service-grpc-web-proxy
```

You can validate that the proxy is working by using the `-browser-client-grpc-web` package, or by using the [BloomRPC
Client](https://github.com/bloomrpc/bloomrpc). Use the port 8080 (the default for grpcwebproxy) and ensure that BloomRPC
is sending "web" calls.

### Runtime env vars

var | example | desc
-|-|-
$BACKEND_ADDR | "localhost:9090" | the underlying binary grpc server to forward to
$ALLOWED_ORIGINS | "https://example.org,http://subdomain.example.org" | used for CORS. Note that your domains MUST NOT have a trailing slash or the header won't be properly recognized

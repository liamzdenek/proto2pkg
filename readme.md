# Proto2pkg

> The missing tool to actually adopt GRPC for organizations and projects.

Easily convert source protoc files into many complete, publishable client and server packages.

## Example:

Step 1: Prepare a directory like this, where `main.proto` is a protobuf that defines `message`es, and grpc `service`s.
```text
├── proto2pkg.json
└── src
    └── main.proto
```

Step 2: Run `proto2pkg build`.

Step 3: Retire early:

```text
├── dist
│   ├── bank-service-browser-client-grpc-web
│   │   ├── build.sh
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── src
│   │   │   └── main.ts
│   │   └── tsconfig.json
│   ├── bank_service_go_dual
│   │   ├── build.sh
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── pkg
│   │   │   ├── main_grpc.pb.go
│   │   │   └── main.pb.go
│   │   └── README.md
│   ├── bank-service-grpc-web-proxy
│   │   ├── build.sh
│   │   ├── Dockerfile
│   │   ├── entrypoint.sh
│   │   └── README.md
│   ├── bank-service-node-client
│   │   ├── build.sh
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── src
│   │   │   └── main.ts
│   │   └── tsconfig.json
│   ├── bank-service-node-server
│   │   ├── build.sh
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── src
│   │   │   └── main.ts
│   │   └── tsconfig.json
│   └── bank_service_python3_dual
│       ├── build.sh
│       ├── pyproject.toml
│       ├── README.md
│       ├── setup.cfg
│       ├── src
│       │   └── bank_service_python3_dual
│       │       ├── __init__.py
│       │       ├── main_pb2_grpc.py
│       │       └── main_pb2.py
│       └── tests
├── proto2pkg.json
└── src
    └── main.proto
```

## Why?

### Why use protoc + GRPC at all?

Ever written a HTTP client library for a service? Some other team wrote Service A, and you now need to make some calls
to receive or send data to Service A. So:
1. you need to work with the team that owns Service A for some level of use case approval
1. you need to get a copy of their method contracts 
1. you need to define all the input and output types within your code base, 
1. you need to be able to serialize/deserialize those types,
1. you need to define a http client object that the rest of your application can use.

Protoc + GRPC enables you to define all of those types in a common format (the .proto file), and then automatically
generate code for the integration. It's fantastic, and this tool wouldn't be possible without it.

### What does this tool do that protoc + GRPC can't directly provide?

If protoc generates the code, then what does proto2pkg do? Simply, it packages the generated code into each
languages standardized package. What developers should do at that point is a bit open ended. You can commit the built
packages back to a monorepo, or create a repo to each package. Some languages support importing directly from git urls.
You can publish the packages to each languages' registry, either public or a corporate internal registry.

1. Standardization of integration. The packages generated by proto2pkg use the same architecture across projects.
    1. This improves organizational developer mobility, and reduces friction when teams onboard a new service, because
       services will always present the exact same pattern for each language.
1. The service owner controls the integration.
    1. If you provide the protoc files to each customer, they have to figure out how to use protoc + GRPC (which can be
       a bit of a configuration headache), generate something that works for their use case, and integrate that into
       their build. The customer may also not promptly update, which strips necessary control from the service owner.
    1. With proto2pkg, the service owner creates and proactively publishes packages. The tooling to handle this can be
       standardized per organization, as the proto2pkg output structure is stable across projects.
    1. The customer may need to modify the protoc files for their specific generation use case. This change should be mainlined,
       and it can quite easily with proto2pkg.
1. Documentation. Each Proto2pkg package generator produces a Readme with guidance on how to import the package, and how to
   set up a minimal server or client.
1. Organizations can track which services are used by which other programs using simple dependency checks.
    1. This also includes version information, since version updates to proto2pkg.yml are propagated to each generated package.


## Language Support

|Generator Name|Languages|Server|Client|Grpc-Web?|Generated Docs|
|---|---|---|---|---|---|
|NodeClient|TS+JS|❌|✅|❌|[1](example/bank-service/dist/bank-service-node-client/README.md) [2](example/grpc-aggressive-test/dist/grpc-aggressive-test-node-client/README.md)|
|NodeServer|TS+JS|✅|❌|❌|[1](example/bank-service/dist/bank-service-node-server/README.md) [2](example/grpc-aggressive-test/dist/grpc-aggressive-test-node-server/README.md)|
|BrowserClientGrpcWeb|TS+JS|❌|✅|✅|[1](example/bank-service/dist/bank-service-browser-client-grpc-web/README.md) [2](example/grpc-aggressive-test/dist/grpc-aggressive-test-browser-client-grpc-web/README.md)|
|GrpcWebProxy|Docker|✅|❌|✅|[1](example/bank-service/dist/bank-service-grpc-web-proxy/README.md) [2](example/grpc-aggressive-test/dist/grpc-aggressive-test-grpc-web-proxy/README.md)|
|GoDual|Golang|✅|✅|❌|[1](example/bank-service/dist/bank_service_go_dual/README.md) [2](example/grpc-aggressive-test/dist/grpc_aggressive_test_go_dual/README.md)|
|Python3Dual|Python3|✅|✅|❌|[1](example/bank-service/dist/bank_service_python3_dual/README.md) [2](example/grpc-aggressive-test/dist/grpc_aggressive_test_python3_dual/README.md)|

## Lerna Monorepo Integration

[If you're using TS/JS with a lerna monorepo, read these docs](./docs/lerna.md), as seen in ./example/lerna


## CLI options

An up-to-date help can always be found by running: `proto2pkg --help` and `proto2pkg [subcommand] --help`

### 'build' subcommand

`proto2pkg build [sourceDir] [optional flags]`

1. `sourceDir`: the directory containing `proto2pkg.json`.

Optional flags:

|flag|desc|
|---|---|
|`--distDir=[dir]`|The location to put the compiled packages. Defaults to [sourceDir]/dist|
|`--protocUrl=[url]`|The location to download the grpc binaries from|
|`--languages=[lang1,lang2]`|Which languages to generate packages for. Defaults to all|
|`--noBuild`|When this flag is present, proto2pkg will not execute the build.sh file in each package|

### 'languages' subcommand

`proto2pkg languages`

Outputs a list of all the supported language strings for use with `proto2pkg build --languages=...`.

## Language Support Wishlist

From the StackOverflow language survey. Most used languages, followed by most loved languages.

Useful List
1. ✅ javascript
1. ✅ python
1. ✅ typescript
1. ✅ node
1. java
1. c#
1. php
1. C++
1. C
1. ✅ Go
1. Kotlin
1. Ruby
1. Rust
1. Dart
1. Swift

Love list
1. Rust
1. Clojure
1. ✅ Typescript
1. Elixir
1. Julia
1. ✅ Python
1. Dart
1. Swift
1. ✅ Node
1. ✅ Go
1. F#
1. C#
1. Kotlin
1. done Javascript
1. Erlang
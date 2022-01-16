FROM alpine:3.15
RUN apk update
RUN apk add ca-certificates wget unzip
RUN wget https://github.com/improbable-eng/grpc-web/releases/download/v0.15.0/grpcwebproxy-v0.15.0-linux-x86_64.zip -O grpcwebproxy.zip
RUN unzip grpcwebproxy.zip
RUN mv dist/grpcwebproxy-* /bin/grpcwebproxy
RUN apk --purge del apk-tools wget unzip
ADD entrypoint.sh /bin/
RUN chmod +x /bin/entrypoint.sh

ENTRYPOINT /bin/entrypoint.sh

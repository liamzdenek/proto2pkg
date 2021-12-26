#/bin/sh
# $BACKEND_ADDR of the form "hostname:port" 
/bin/grpcwebproxy --backend_addr=$BACKEND_ADDR \
    --run_tls_server=false

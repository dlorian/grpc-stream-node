const PROTO_PATH = __dirname + '/sample.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// Suggested options for similarity to existing grpc.load behavior
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// The protoDescriptor object has the full package hierarchy
const sampleservices = protoDescriptor.sampleservices;

const echo = (call, callback) => {
    console.log(`Receceived from client '${call.request.text}'`);
    callback(null, { text: `You said ${call.request.text}`});
};

const createServer = () => {
    var server = new grpc.Server();
    server.addService(sampleservices.EchoService.service, { echo });
    return server;
};

const server = createServer();
server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();



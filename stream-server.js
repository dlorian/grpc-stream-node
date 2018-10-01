const PROTO_PATH = __dirname + '/sample.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const supervillains = require('supervillains');
const _ = require('lodash');

const { Readable } = require('stream')
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

const stream = async (call) => {
    console.log(`You asked me to create ${call.request.number} supervillians'`);

    const fn = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                call.write({
                    text: supervillains.random()
                });
                resolve();
            }, _.random(500, 1500));
        });
    }

    let i = 0;
    while (true) {
        await fn();
        if (i < call.request.number) {
            i++;
        } else {
            break;
        }
    }
    console.log('Im done');
    call.end();
};

const createServer = () => {
    var server = new grpc.Server();
    server.addService(sampleservices.StreamService.service, { stream });
    return server;
};

const server = createServer();
server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();



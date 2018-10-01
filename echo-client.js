const PROTO_PATH = __dirname + '/sample.proto';

const readline = require('readline');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const sampleservices = grpc.loadPackageDefinition(packageDefinition).sampleservices;

const client = new sampleservices.EchoService('localhost:50051', grpc.credentials.createInsecure());

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', function (line) {
    const response = client.echo({ text: line }, (err, response) => console.log(response.text));
})
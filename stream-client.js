const PROTO_PATH = __dirname + '/sample.proto';

const grpc = require('grpc');
const readline = require('readline');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const sampleservices = grpc.loadPackageDefinition(packageDefinition).sampleservices;

const client = new sampleservices.StreamService('localhost:50051', grpc.credentials.createInsecure());

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

console.log('Please type in an Integer in order to create some amount of supervillians :-)')

rl.on('line', function (line) {
    const stream = client.stream({ number: parseInt(line) });
    stream.on('data', (streamResponse) => console.log(streamResponse.text));
    stream.on('end', () => console.log('\nThis is it!'));
})
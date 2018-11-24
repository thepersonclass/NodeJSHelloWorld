/*
* This is the first homework assignment for the NodeJS master class. It is a simple hello world REST Api
*/

const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// Create the http server
var httpServer = http.createServer(function(request, response){

    unifiedServer(request, response);
});

httpServer.listen(config.httpPort, function(){
    console.log("We are spinning up the http server "+config.httpPort);
});

// All server logic for both http createServer
var unifiedServer = function(request, response){

    // Get Url and parse it
    var parsedUrl = url.parse(request.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get query string as an object
    var queryStringObject = parsedUrl.query;

    // Get Http Method
    var method = request.method.toLocaleLowerCase();

    // Get headers as object
    var headers = request.headers;

    // Get payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    request.on('data', function(data){
        buffer += decoder.write(data);
    });
    request.on('end', function(){
        buffer += decoder.end();

        // Choose the handler this request should go to, if none is found go to not found handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct data object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'method' : method,
            'headers' : headers,
            'queryStringObject' : queryStringObject,
            'payload' : buffer
        };

        // Route request to specified handler
        chosenHandler(data, function(statusCode, payload){

            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or use an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // Convert the payload to a string to send back to the user
            var payloadString = JSON.stringify(payload);

            // Send the response
            response.setHeader('Content-Type', 'application/json');
            response.writeHead(statusCode);
            response.end(payloadString);

            // Log the request path
            console.log('Returning this response: ', statusCode, payloadString);
        });
    });
};

// Define handlers
var handlers = {};

// Hello router
handlers.hello = function(data, callback){
    callback(200, { 'message' : 'Welcome to the thunderdome!'});
};

// Not found handler
handlers.notFound = function(data, callback){
    callback(404);
};

// Define a request router
var router = {
    'hello': handlers.hello
};
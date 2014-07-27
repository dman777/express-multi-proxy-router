var Promise = require("bluebird");

function HttpError(message, statusCode, headers, body) {
    this.name = "HttpError";
    this.message = message || "An unknown HTTP error occured";
    this.statusCode = statusCode || 0;
    this.headers = headers || {};
    this.body = body || '';
    Error.captureStackTrace(this, HttpError);
}
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;

//credit goes to esailija(bluebird) for writing this awesome 
//script below. Oringially written for general http requests using
//bluebird and restler.

var methods = ["get",
    "patch",
    "post",
    "put",
    "del",
    "head",
    "json",
    "postJson",
    "putJson"
];
var rest = require("restler");
var promisified = {};
methods.forEach(function(method) {
    promisified[method] = function() {
        var args = [].slice.call(arguments);
        var self = this;
        return new Promise(function(resolve, reject) {
            var ret = rest[method].apply(self, args);
 
            ret.on("success", function(data, response) {
                resolve(data);
            });
            //Express.js app.send() can not handle response object
            //because of `Converting circular structure to JSON`
            //so on any error or failure, return data instead
            //of response and hope for the best in life - Darin
            ret.on("fail", function(data, response) {
                err = new HttpError(response.message, response.statusCode,
                                    response.headers, data);
                console.log(response.headers);
                reject(err);
            });
 
            ret.on("error", function(err) {
                console.log(err);
                err = new HttpError(err.message, err.statusCode,
                                    err.headers);
                reject(err);
            });
 
            ret.on("abort", function() {
                reject(new Promise.CancellationError());
            });
 
            ret.on("timeout", function() {
                reject(new Promise.TimeoutError());
            });
        });
    };
});
 
module.exports = promisified;

#!/usr/bin/env node
var fs = require('fs');
var ini = require('ini');
var rest = require("./promisified_restler");
var path = require('path');
var iniFile = path.join(path.dirname(fs.realpathSync(__filename)), '../');
iniFile = iniFile + "proxies_config.ini"
var config = ini.parse(fs.readFileSync(iniFile, 'utf-8'));


function shallowCopy(o) {
    var prop;
    var copy = Object.create(o);
    for (prop in o) {
        if (o.hasOwnProperty(prop)) {
            copy[prop] = o[prop];
        }
    }
    return copy;
}

// read config and get proxies
proxyList = config.proxies;
var arrayProxies = Object.keys(proxyList);

//note, because of race conditions with recursive loops, 
//iterating through objects is less ideal...use arrays instead
var url = arrayProxies.map(function(proxieDirective) {
    return proxyList[proxieDirective];
});

function proxyUrl() {
    return function(req, res, next) {
        proxyFound = url.some(function (element) {
            if (req.url == element) {
                method = req.method.toLowerCase();
                body = req.body;
                //get host to prozy to
                var host; 
                arrayProxies.some(function (hostName) {
                    if (proxyList[hostName] == element) {
                        host = hostName;
                        return true;
                    } 
                });
                //Make Call...do proxy
                uri = 'https://'+host;
                if (method == "post") { 
                    method = "postJson"; }
                else if (method == "put") {
                    method = "putJson" 
                }

                rest[method](uri, body).then(
                    function(response) {
                        res.send(response);
                    }, function(error) {
                        res.send(error.statusCode, error);
                    });

            }
            return true;
        });
        if (!proxyFound) next();

    }
};


module.exports = proxyUrl;



![alt text](https://raw.githubusercontent.com/dman777/icons/master/express.jpg)        ![alt text](https://raw.githubusercontent.com/dman777/icons/master/node.jpg)        ![alt text](https://raw.githubusercontent.com/dman777/icons/master/npm.jpg)
##express-multi-proxy-router
=====================

#####Multiple proxies/routes based on URL(s) for Express.js
#####Version 1.0 Stable
######Todo: Nothing at the moment

**Typical scenerio:**

Suppose you are developing a web application that makes API requests from the client browser. Most likely, you will your browser will not allow you to because you will be breaking the pesky 'Same-origin policy'. To over come this, instead your express.js web server must send out http request and deliever the response back to the web client. Thus, this is known as proxying the http request(your api call out) from your browser client -> to the express.js web server -> to the new host. This module will allow you to do this. In addition, you can use as many proxies/routes as you would like.

**Installation instuctions:**

*Assumeing you already have a express.js or some kind of generator project already established:*

1. In the directory of your project, where you see `package.json` and `npm_modules`,
   simply type `npm install express-multi-proxy-router`

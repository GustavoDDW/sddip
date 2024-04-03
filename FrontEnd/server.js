"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var next_1 = require("next");
var express_ip_access_control_1 = require("express-ip-access-control");
var dev = process.env.NODE_ENV !== 'production';
var app = (0, next_1.default)({ dev: dev });
var handle = app.getRequestHandler();
app.prepare().then(function () {
    var server = (0, express_1.default)();
    // Defina aqui o IP que deseja permitir o acesso
    var allowedIP = '192.168.0.1';
    // Middleware para controlar o acesso por IP
    server.use((0, express_ip_access_control_1.default)({ mode: 'allow', allow: [allowedIP] }));
    server.all('*', function (req, res) {
        return handle(req, res);
    });
    server.listen(3000, function (err) {
        if (err)
            throw err;
        console.log('> Ready on http://localhost:3000');
    });
});

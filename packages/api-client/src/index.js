"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hcWithType = void 0;
var client_1 = require("hono/client");
var client = (0, client_1.hc)("");
var hcWithType = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return client_1.hc.apply(void 0, args);
};
exports.hcWithType = hcWithType;

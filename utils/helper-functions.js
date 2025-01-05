"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSessionId = exports.validateSessionId = void 0;
var validateSessionId = function (sessionId) {
    if (sessionId.length === 5) {
        var code = void 0, i = void 0, len = void 0;
        for (i = 0, len = sessionId.length; i < len; i++) {
            code = sessionId.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123) // lower alpha (a-z)
            ) {
                return false;
            }
        }
        return true;
    }
    return false;
};
exports.validateSessionId = validateSessionId;
var generateSessionId = function () {
    var mask = "";
    mask += "abcdefghijklmnopqrstuvwxyz";
    mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    mask += "0123456789";
    var result = "";
    for (var i = length; i > 0; --i)
        result += mask[Math.round(Math.random() * (mask.length - 1))];
    return result;
};
exports.generateSessionId = generateSessionId;

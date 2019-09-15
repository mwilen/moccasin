"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mock_1 = require("./mock");
var Mocker = (function () {
    function Mocker(options) {
        if (options === void 0) { options = { port: 3000 }; }
        var _this = this;
        this.mocks = [];
        var app = express();
        var port = options.port;
        app.get('*', function (req, res) {
            var mock = _this.getMockByPath(req.path);
            var failed = false;
            if (mock.options && mock.options.failRate) {
                if (mock.options.failRate >= Math.random()) {
                    failed = true;
                }
            }
            if (!mock || failed) {
                return res.sendStatus(404);
            }
            else {
                res.send(_this.toResponse(mock.data));
            }
        });
        app.listen(port, function () { return console.log("Example app listening on port " + port + "!"); });
    }
    Mocker.prototype.api = function (path, response, options) {
        this.mocks.forEach(function (mock) {
            if (mock.path === path) {
                throw new Error('A mocked API endpoint with that path already exists.');
            }
        });
        this.mocks.push(new mock_1.Mock(path, response, options));
    };
    Mocker.prototype.getMockByPath = function (path) {
        var mock = this.mocks.find(function (mock) { return path === mock.path; });
        if (!mock) {
            throw new Error('Could not find any mocked API with path: ' + path);
        }
        return mock;
    };
    Mocker.prototype.get = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var mock;
            var _this = this;
            return __generator(this, function (_a) {
                mock = this.getMockByPath(path);
                return [2, new Promise(function (resolve, reject) {
                        return _this.apiResponse(resolve, reject, mock);
                    })];
            });
        });
    };
    Mocker.prototype.post = function (path, data) {
        return __awaiter(this, void 0, void 0, function () {
            var mock;
            var _this = this;
            return __generator(this, function (_a) {
                mock = this.getMockByPath(path);
                if (Array.isArray(mock.data)) {
                    mock.data.push(__assign({}, data));
                }
                else {
                    mock.data = __assign({}, data);
                }
                return [2, new Promise(function (resolve, reject) {
                        return _this.apiResponse(resolve, reject, mock);
                    })];
            });
        });
    };
    Mocker.prototype.toResponse = function (data, error) {
        if (error) {
            return {
                status: HttpStatusCode.ERROR,
                message: 'An error has occurred.'
            };
        }
        return { status: HttpStatusCode.OK, data: data };
    };
    Mocker.prototype.apiResponse = function (resolve, reject, mock) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, sleep(mock.options && mock.options.delay)];
                    case 1:
                        _a.sent();
                        if (mock.options && mock.options.failRate) {
                            if (mock.options.failRate >= Math.random()) {
                                reject(this.toResponse(mock.data, true));
                            }
                        }
                        resolve(this.toResponse(mock.data));
                        return [2];
                }
            });
        });
    };
    return Mocker;
}());
exports.Mocker = Mocker;
function sleep(time) {
    if (time === void 0) { time = 500; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve) { return setTimeout(resolve, time); })];
        });
    });
}
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
    HttpStatusCode[HttpStatusCode["ERROR"] = 400] = "ERROR";
    HttpStatusCode[HttpStatusCode["SERVER_ERROR"] = 500] = "SERVER_ERROR";
})(HttpStatusCode || (HttpStatusCode = {}));
